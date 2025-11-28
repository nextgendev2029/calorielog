// components/sample.tsx
"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useCalorieContract } from "@/hooks/useContract"

const SampleIntregation = () => {
  const { isConnected } = useAccount()
  const [calories, setCalories] = useState("")
  const { data, actions, state } = useCalorieContract()

  const handleAdd = async () => {
    if (!calories) return
    try {
      await actions.addEntry(calories)
      setCalories("")
    } catch (err) {
      console.error("Error:", err)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold text-foreground mb-3">Calorie Tracker</h2>
          <p className="text-muted-foreground">Connect your wallet to interact.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Calorie Logger</h1>
          <p className="text-muted-foreground text-sm mt-1">Track daily calorie entries</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-xs uppercase mb-2">Total Calories</p>
            <p className="text-2xl font-semibold">{data.totalCalories}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-xs uppercase mb-2">Total Entries</p>
            <p className="text-2xl font-semibold">{data.entryCount}</p>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">Enter Calories</label>
            <input
              type="number"
              placeholder="e.g. 500"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="w-full px-4 py-2 bg-card border-border border rounded-lg"
            />
          </div>

          <button
            onClick={handleAdd}
            disabled={!calories || state.isLoading}
            className="w-full px-6 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            {state.isLoading ? "Adding..." : "Add Entry"}
          </button>
        </div>

        {/* Transaction / Status */}
        {state.hash && (
          <div className="mt-6 p-4 bg-card border border-border rounded-lg">
            <p className="text-xs text-muted-foreground uppercase mb-2">Transaction Hash</p>
            <p className="text-sm font-mono break-all mb-3">{state.hash}</p>
            {state.isConfirming && <p className="text-primary text-sm">Waiting for confirmation...</p>}
            {state.isConfirmed && <p className="text-green-500 text-sm">Transaction confirmed!</p>}
          </div>
        )}

        {state.error && (
          <div className="mt-6 p-4 bg-card border border-destructive rounded-lg">
            <p className="text-sm text-destructive-foreground">Error: {state.error.message}</p>
          </div>
        )}

        {/* Entries List */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Entry History</h2>
          {data.entries.length === 0 ? (
            <p className="text-muted-foreground">No entries yet.</p>
          ) : (
            <div className="space-y-3">
              {data.entries.map((e, idx) => (
                <div key={idx} className="bg-card border border-border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Calories</p>
                    <p className="text-lg font-medium">{e.calories}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Logged at</p>
                    <p className="text-sm">
                      {e.timestamp
                        ? new Date(e.timestamp * 1000).toLocaleString()
                        : "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SampleIntregation