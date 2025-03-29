"use client"

import { useState } from "react"

const Navbar = ({ onQuerySelect, onQuerySubmit }) => {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [inputQuery, setInputQuery] = useState("")

  const entities = [
    {
      name: "Ingredients",
      queries: [
        { key: "name", text: "Name the student with id 3" },
        { key: "cs", text: "Name the student who is in CS" },
        { key: "query1C", text: "Query 1C" },
        { key: "query1D", text: "Query 1D" },
        { key: "query1E", text: "Query 1E" },
      ],
    },
    {
      name: "Sales",
      queries: [
        { key: "query2A", text: "Query 2A" },
        { key: "query2B", text: "Query 2B" },
        { key: "query2C", text: "Query 2C" },
        { key: "query2D", text: "Query 2D" },
        { key: "query2E", text: "Query 2E" },
      ],
    },
    {
      name: "Employees",
      queries: [
        { key: "query3A", text: "Query 3A" },
        { key: "query3B", text: "Query 3B" },
        { key: "query3C", text: "Query 3C" },
        { key: "query3D", text: "Query 3D" },
        { key: "query3E", text: "Query 3E" },
      ],
    },
    {
      name: "Inventory",
      queries: [
        { key: "query4A", text: "Query 4A" },
        { key: "query4B", text: "Query 4B" },
        { key: "query4C", text: "Query 4C" },
        { key: "query4D", text: "Query 4D" },
        { key: "query4E", text: "Query 4E" },
      ],
    },
    {
      name: "Others",
      queries: [
        { key: "query5A", text: "Query 5A" },
        { key: "query5B", text: "Query 5B" },
        { key: "query5C", text: "Query 5C" },
        { key: "query5D", text: "Query 5D" },
        { key: "query5E", text: "Query 5E" },
      ],
    },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputQuery.trim()) {
      onQuerySubmit(inputQuery)
      setInputQuery("")
    }
  }

  return (
    <nav className="flex items-center justify-between bg-gradient-to-r from-coffee-dark to-coffee-medium py-4 px-6 md:px-8 text-white shadow-lg relative z-10">
      <div className="flex-1 max-w-xl mr-5">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Ask a question..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="w-full py-3 px-4 rounded-full border-none outline-none text-base bg-white/90 text-gray-800 transition-all focus:bg-white focus:shadow-md"
          />
          <button
            type="submit"
            className="bg-coffee-light text-coffee-dark py-3 px-5 rounded-full text-base font-semibold cursor-pointer transition-all hover:bg-coffee-medium hover:text-white hover:-translate-y-0.5 hover:shadow-md"
          >
            Submit
          </button>
        </form>
      </div>

      <div className="flex">
        {entities.map((entity, index) => (
          <div
            key={entity.name}
            className="relative text-lg font-semibold cursor-pointer py-2 px-3 md:px-4 rounded-lg transition-all hover:bg-white/20"
            onMouseEnter={() => setActiveDropdown(index)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <span className="flex items-center gap-1">{entity.name}</span>
            {activeDropdown === index && (
              <div className="absolute top-full left-0 bg-white text-gray-800 rounded-lg shadow-lg w-max min-w-56 py-1 mt-1 z-20 animate-fadeIn">
                {entity.queries.map((query) => (
                  <div
                    key={query.key}
                    className="py-3 px-4 cursor-pointer text-base transition-all hover:bg-coffee-light/20 hover:text-coffee-dark"
                    onClick={() => onQuerySelect(query.key)}
                  >
                    {query.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}

export default Navbar

