# README.md

# 🔥 On-Chain Calorie Tracker

## **Contract Address**
**0xA5DE11F3d940A09cD42ba0af6a8D301AE6Ca08C3**  
Explorer Link:  
https://coston2-explorer.flare.network/address/0xA5DE11F3d940A09cD42ba0af6a8D301AE6Ca08C3

---

## **📌 Project Description**
The **On-Chain Calorie Tracker** is a decentralized application (dApp) designed to log users’ daily calorie consumption directly on the blockchain. Built on the **Flare Coston2 Testnet**, this project demonstrates how personal health data can be stored immutably, transparently, and securely on-chain.

With every calorie entry recorded as an immutable transaction, users benefit from guaranteed data integrity and the ability to reference a verifiable history of their calorie logs at any time. The application integrates seamlessly with Wagmi and Viem for contract interactions and provides a simple, user-friendly interface for adding entries and viewing aggregated totals.

---

## **✨ Features**

### **Smart Contract Features**
- **addEntry(uint256 calories)**  
  Adds a new calorie entry and stores the timestamp.

- **getEntry(uint256 index)**  
  Fetches both calories and timestamp for a specific entry.

- **getEntryCount()**  
  Returns the number of calorie entries recorded.

- **getTotalCalories()**  
  Returns the sum of all calories logged on-chain.

---

### **Frontend Features**
- **Wallet Gating** — Users must connect their wallet to use the app.  
- **Add Calorie Entry** — Submit calorie values directly to the smart contract.  
- **Total Calories Display** — Aggregated on-chain total.  
- **Entry Count Display** — Shows how many logs have been recorded.  
- **Real Transaction Feedback**  
  - Pending  
  - Confirming  
  - Confirmed  
- **Error Handling** — Displays readable error messages when transactions fail.

---

## **🧩 How It Solves the Problem**
Traditional calorie tracking apps store sensitive health information in centralized databases, posing risks such as:
- Data loss  
- App shutdowns  
- Privacy concerns  
- No permanent or verifiable ownership of data  

The **On-Chain Calorie Tracker** solves these issues by:
- Storing calorie logs on a **public, tamper-proof blockchain**  
- Ensuring **data permanence**  
- Providing **verifiable and transparent logs**  
- Empowering users to maintain full ownership of their health data  

---

## **🚀 Use Cases**
- Personal fitness tracking  
- Immutable health records  
- Web3 learning and experimentation  
- Demonstrating real-world decentralized storage  
- Projects related to digital identity & data sovereignty  

---

## **🎯 Summary**
This project showcases a clean, minimal, yet powerful Web3 application that brings together:
- Smart contract development  
- Decentralized data storage  
- Frontend–blockchain integration  
- Real-time transaction state handling  

It demonstrates how blockchain technology can be used beyond finance — applying immutability and transparency to everyday personal-use applications like calorie tracking.

---