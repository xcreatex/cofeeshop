"use client"

import { useState } from "react"
import { Code } from "lucide-react"
import SqlQueryModal from "./SqlQueryModal"

const SqlQueryButton = ({ query, title }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        className="bg-coffee-cream/30 border border-coffee-light text-coffee-dark text-xs py-1 px-2 rounded flex items-center gap-1 hover:bg-coffee-cream transition-colors mt-1"
        onClick={() => setIsModalOpen(true)}
        title="Show SQL Query"
      >
        <Code size={14} />
        <span>SQL Query</span>
      </button>

      <SqlQueryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} query={query} title={title} />
    </>
  )
}

export default SqlQueryButton

