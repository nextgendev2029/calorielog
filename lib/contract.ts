// lib/contract.ts
export const contractAddress = "0xA5DE11F3d940A09cD42ba0af6a8D301AE6Ca08C3";

// Export only the ABI array expected by viem/wagmi
export const contractABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_calories",
        "type": "uint256"
      }
    ],
    "name": "addEntry",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getEntry",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "calories",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getEntryCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalCalories",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "total",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;