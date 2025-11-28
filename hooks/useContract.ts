"use client";

import { useState, useEffect, useCallback } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from "wagmi";
import { contractABI, contractAddress } from "@/lib/contract";
import type { Address } from "viem";

export interface Entry {
  calories: number;
  timestamp: number;
}

export interface ContractData {
  totalCalories: number;
  entryCount: number;
  entries: Entry[];
}

export interface ContractState {
  isLoading: boolean;
  isPending: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  hash: `0x${string}` | undefined;
  error: Error | null;
}

export interface ContractActions {
  addEntry: (calories: string) => Promise<void>;
  refetchAll: () => Promise<void>;
}

export const useCalorieContract = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ============ READ CONTRACT CALLS ============

  const { data: totalCaloriesRaw, refetch: refetchTotal } = useReadContract({
    address: contractAddress as Address,
    abi: contractABI,
    functionName: "getTotalCalories",
    account: address, // 🔥 IMPORTANT FIX
  });

  const { data: entryCountRaw, refetch: refetchCount } = useReadContract({
    address: contractAddress as Address,
    abi: contractABI,
    functionName: "getEntryCount",
    account: address, // 🔥 IMPORTANT FIX
  });

  // ============ WRITE ============

  const {
    writeContractAsync,
    data: writeData,
    error,
    isPending,
  } = useWriteContract();

  const txHash =
    (writeData as any)?.hash !== undefined
      ? (writeData as any).hash
      : (writeData as `0x${string}` | undefined);

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  // ============ FETCH ALL ENTRIES ============

  const fetchEntries = useCallback(
    async (count: number) => {
      const arr: Entry[] = [];

      for (let i = 0; i < count; i++) {
        try {
          const res = await publicClient.readContract({
            address: contractAddress as Address,
            abi: contractABI,
            functionName: "getEntry",
            args: [BigInt(i)],
            account: address, // 🔥 IMPORTANT FIX
          });

          const caloriesRaw = Array.isArray(res)
            ? res[0]
            : (res as any).calories;
          const timeRaw = Array.isArray(res) ? res[1] : (res as any).timestamp;

          arr.push({
            calories: Number(caloriesRaw),
            timestamp: Number(timeRaw),
          });
        } catch (err) {
          console.error("Error fetching entry", i, err);
        }
      }

      setEntries(arr.reverse());
    }, 
    [publicClient, address]
  );

  // ============ REFECTH ALL DATA ============

  const refetchAll = useCallback(async () => {
    try {
      const [tot, cnt] = await Promise.all([refetchTotal(), refetchCount()]);

      const count = cnt?.data !== undefined ? Number(cnt.data as bigint) : 0;

      if (count > 0) {
        await fetchEntries(count);
      } else {
        setEntries([]);
      }
    } catch (err) {
      console.error("refetchAll error:", err);
    }
  }, [refetchTotal, refetchCount, fetchEntries]);

  // Re-fetch after tx confirmed
  useEffect(() => {
    if (isConfirmed) {
      refetchAll();
    }
  }, [isConfirmed, refetchAll]);

  // ============ ADD ENTRY ============

  const addEntry = async (calories: string): Promise<void> => {
    if (!calories) return;

    try {
      setIsLoading(true);

      await writeContractAsync({
        address: contractAddress as Address,
        abi: contractABI,
        functionName: "addEntry",
        args: [BigInt(calories)],
      });
    } catch (err) {
      console.error("Error adding entry:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ============ FINAL DATA OBJECTS ============

  const data: ContractData = {
    totalCalories: totalCaloriesRaw ? Number(totalCaloriesRaw as bigint) : 0,
    entryCount: entryCountRaw ? Number(entryCountRaw as bigint) : 0,
    entries,
  };

  const actions: ContractActions = {
    addEntry,
    refetchAll,
  };

  const state: ContractState = {
    isLoading: isLoading || isPending || isConfirming,
    isPending,
    isConfirming,
    isConfirmed,
    hash: txHash,
    error,
  };

  return { data, actions, state };
};
