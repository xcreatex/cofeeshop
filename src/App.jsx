"use client"

import { useState } from "react"
import Navbar from "./components/Navbar"
import Dashboard from "./components/Dashboard"
import "./App.css"

const App = () => {
  const [selectedQuery, setSelectedQuery] = useState("")
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState("")

  // Handler for when a predefined query is selected
  const handleQuerySelect = (queryKey) => {
    setSelectedQuery(queryKey)
    setNaturalLanguageQuery("") // Clear natural language query when a predefined query is selected
  }

  // Handler for when a natural language query is submitted
  const handleQuerySubmit = (userQuery) => {
    setNaturalLanguageQuery(userQuery)
    setSelectedQuery("") // Clear selected query when a natural language query is submitted
  }

  return (
    <div className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-[url('./assets/background.png')] flex flex-col">
      <h1 className="text-center text-2xl md:text-3xl font-bold text-white py-4 my-0 bg-coffee-dark/80 w-full border-b-3 border-coffee-light shadow-lg">
        COFFEE SHOP DASHBOARD
      </h1>
      <Navbar onQuerySelect={handleQuerySelect} onQuerySubmit={handleQuerySubmit} />
      <Dashboard selectedQuery={selectedQuery} naturalLanguageQuery={naturalLanguageQuery} />
    </div>
  )
}

export default App

