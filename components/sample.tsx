// components/sample.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import { useAccount } from "wagmi"
import { useCalorieContract } from "@/hooks/useContract"
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { ClipboardIcon, SparklesIcon, PlusIcon, SunIcon, MoonIcon, Bars3Icon } from "@heroicons/react/24/solid"

const formatTime = (ts?: number) => {
  if (!ts) return "—"
  return new Date(ts * 1000).toLocaleString()
}

const useTheme = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])
  return { theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }
}

const StatCard: React.FC<{ title: string; value: string | number; subtitle?: string }> = ({ title, value, subtitle }) => {
  return (
    <div className="transform transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.01] will-change-transform">
      <div className="backdrop-blur-lg bg-white/6 dark:bg-black/30 border border-white/6 dark:border-white/10 rounded-2xl p-5 shadow-md">
        <p className="text-xs text-gray-300 dark:text-gray-200 uppercase tracking-wider">{title}</p>
        <div className="mt-3 flex items-baseline gap-3">
          <h3 className="text-3xl md:text-4xl font-extrabold text-white dark:text-white">{value}</h3>
          {subtitle && <span className="text-sm text-gray-300">{subtitle}</span>}
        </div>
      </div>
    </div>
  )
}

export default function SampleIntregation() {
  const { isConnected, address } = useAccount()
  const { data, actions, state } = useCalorieContract()
  const [calories, setCalories] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFloatingOpen, setIsFloatingOpen] = useState(false)
  const { theme, toggle } = useTheme()

  // Prepare chart data (sorted ascending by timestamp)
  const chartData = useMemo(() => {
    const arr = (data.entries || [])
      .map((e) => ({ calories: e.calories, time: e.timestamp ? new Date(e.timestamp * 1000).toLocaleString() : "" , ts: e.timestamp ?? 0 }))
      .sort((a, b) => a.ts - b.ts)
    // For line chart we can show last 20 points
    return arr.slice(-20)
  }, [data.entries])

  useEffect(() => {
    // auto-close floating small panel after action
    if (isFloatingOpen) {
      const t = setTimeout(() => setIsFloatingOpen(false), 3500)
      return () => clearTimeout(t)
    }
  }, [isFloatingOpen])

  const handleAdd = async () => {
    if (!calories) return
    try {
      await actions.addEntry(calories)
      setCalories("")
      setIsModalOpen(false)
      setIsFloatingOpen(true)
    } catch (err) {
      console.error(err)
    }
  }

  const copyAddress = async () => {
    if (!address) return
    await navigator.clipboard.writeText(address)
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]" : "bg-gradient-to-br from-sky-100 via-indigo-100 to-rose-100"} transition-colors duration-300`}>
      <div className="max-w-[1200px] mx-auto flex h-full">
        {/* SIDEBAR */}
        <aside className={`w-72 p-5 transition-all duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-72"} sticky top-4 self-start`}>
          <div className="backdrop-blur-md bg-white/6 dark:bg-black/30 border border-white/6 dark:border-white/10 p-4 rounded-2xl shadow-lg">
            {/* Top: Hamburger + Theme toggle */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setIsSidebarOpen((s) => !s)} aria-label="menu" className="p-2 rounded-lg hover:bg-white/5">
                <Bars3Icon className="h-6 w-6 text-white/90" />
              </button>
              <button onClick={toggle} aria-label="theme" className="p-2 rounded-lg hover:bg-white/5">
                {theme === "dark" ? <SunIcon className="h-5 w-5 text-yellow-300" /> : <MoonIcon className="h-5 w-5 text-gray-700" />}
              </button>
            </div>

            {/* Avatar & Wallet Box */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-400 to-violet-400 flex items-center justify-center text-white font-bold shadow-md">
                {address ? address.slice(2, 4).toUpperCase() : "U"}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-200/90 break-words">{address ? `${address.slice(0,6)}...${address.slice(-4)}` : "Not connected"}</p>
                <p className="text-xs text-gray-400 mt-1">Coston2 Testnet</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button className="flex items-center gap-2 p-3 rounded-lg bg-white/3 hover:bg-white/5 transition">
                <SparklesIcon className="h-5 w-5 text-white/90" />
                <span className="text-sm text-white">Dashboard</span>
              </button>

              <button className="flex items-center gap-2 p-3 rounded-lg bg-white/2 hover:bg-white/5 transition" onClick={() => { setIsModalOpen(true) }}>
                <PlusIcon className="h-5 w-5 text-white/90" />
                <span className="text-sm text-white">Add Entry</span>
              </button>

              <button className="flex items-center gap-2 p-3 rounded-lg hover:bg-white/5 transition" onClick={copyAddress}>
                <ClipboardIcon className="h-5 w-5 text-white/90" />
                <span className="text-sm text-white">Copy Address</span>
              </button>
            </div>

            <div className="mt-6 text-xs text-gray-400">
              <p>Tip: Use the floating button to quickly add small entries</p>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-6">
          <header className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-white">Calorie Logger</h1>
              <p className="text-sm text-gray-300 mt-1">Animated UI • Live charts • Glassmorphism</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-300 text-right">
                <div>{address ? `${address.slice(0,6)}...${address.slice(-4)}` : "Not connected"}</div>
                <div className="text-xs text-gray-400">Coston2 Testnet</div>
              </div>
            </div>
          </header>

          {/* STATS + CHARTS */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard title="Total Calories" value={data.totalCalories} subtitle="FLR units" />
                <StatCard title="Total Entries" value={data.entryCount} subtitle="records" />
              </div>

              {/* Charts Card */}
              <div className="backdrop-blur-lg bg-white/6 dark:bg-black/30 border border-white/6 dark:border-white/10 rounded-2xl p-5 shadow-lg">
                <h3 className="text-lg text-white font-semibold mb-3">Calories Over Time</h3>
                <div style={{ width: "100%", height: 240 }}>
                  <ResponsiveContainer>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="time" tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }} />
                      <YAxis tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }} />
                      <Tooltip wrapperStyle={{ background: theme === "dark" ? "#0b1220" : "#fff" }} />
                      <Line type="monotone" dataKey="calories" stroke="#60a5fa" strokeWidth={3} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar chart */}
              <div className="backdrop-blur-lg bg-white/6 dark:bg-black/30 border border-white/6 dark:border-white/10 rounded-2xl p-5 shadow-lg">
                <h3 className="text-lg text-white font-semibold mb-3">Recent Entries (Bar)</h3>
                <div style={{ width: "100%", height: 200 }}>
                  <ResponsiveContainer>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="time" tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }} />
                      <YAxis tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }} />
                      <Tooltip wrapperStyle={{ background: theme === "dark" ? "#0b1220" : "#fff" }} />
                      <Bar dataKey="calories" fill="#7c3aed" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right column: Input + History */}
            <aside className="space-y-6">
              <div className="backdrop-blur-lg bg-white/6 dark:bg-black/30 border border-white/6 dark:border-white/10 rounded-2xl p-5 shadow-lg">
                <h3 className="text-lg text-white font-semibold mb-3">Quick Add</h3>
                <div className="space-y-3">
                  <input
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    type="number"
                    placeholder="e.g. 500"
                    className="w-full px-4 py-3 rounded-xl bg-white/6 border border-white/8 text-white placeholder-gray-300 focus:ring-2 focus:ring-indigo-400"
                  />
                  <button onClick={handleAdd} disabled={!calories || state.isLoading} className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold hover:scale-[0.99] transition">
                    {state.isLoading ? "Adding..." : "Add Entry"}
                  </button>
                </div>
              </div>

              <div className="backdrop-blur-lg bg-white/6 dark:bg-black/30 border border-white/6 dark:border-white/10 rounded-2xl p-5 shadow-lg">
                <h3 className="text-lg text-white font-semibold mb-3">Entry History</h3>
                <div className="space-y-3 max-h-96 overflow-auto">
                  {data.entries.length === 0 ? (
                    <p className="text-gray-300">No entries yet.</p>
                  ) : (
                    data.entries.map((e, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:scale-[1.01] transition bg-white/3">
                        <div>
                          <p className="text-sm text-gray-200">Calories</p>
                          <p className="text-lg text-white font-medium">{e.calories}</p>
                        </div>
                        <div className="text-right text-xs text-gray-300">
                          {formatTime(e.timestamp)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </aside>
          </section>
        </main>
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-4 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 text-white shadow-2xl hover:scale-95 active:scale-90 transition transform"
          aria-label="Add entry"
        >
          <PlusIcon className="h-6 w-6" />
        </button>

        {/* small floating feedback */}
        {isFloatingOpen && (
          <div className="mt-3 -mr-2 p-3 rounded-xl bg-black/60 text-white text-sm shadow-lg">
            Entry sent — syncing...
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white/5 dark:bg-black/40 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl text-white font-semibold mb-3">Add Calorie Entry</h3>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="500"
              className="w-full px-4 py-3 rounded-xl bg-white/6 border border-white/8 text-white placeholder-gray-300 mb-4"
            />
            <div className="flex gap-3">
              <button onClick={handleAdd} disabled={!calories || state.isLoading} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold">
                {state.isLoading ? "Adding..." : "Add"}
              </button>
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-3 rounded-xl bg-white/6 text-white">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}