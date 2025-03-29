"use client"

import { useState, useEffect } from "react"
import { Code, Copy, X } from "lucide-react"

const SqlQueryModal = ({ isOpen, onClose, query, title }) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(query)
    setCopied(true)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 animate-fadeIn" onClick={onClose}>
      <div
        className="bg-white w-[90%] max-w-3xl max-h-[90vh] rounded-lg overflow-hidden flex flex-col shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 bg-coffee-dark text-white border-b border-coffee-cream">
          <h3 className="m-0 text-lg flex items-center gap-2">
            <Code className="text-coffee-cream" size={18} />
            {title || "SQL Query"}
          </h3>
          <div className="flex gap-2">
            <button
              className="bg-white/20 border-none text-white cursor-pointer flex items-center justify-center p-1 px-2 rounded transition-colors hover:bg-white/30"
              onClick={copyToClipboard}
              title="Copy to clipboard"
            >
              {copied ? "Copied!" : <Copy size={16} />}
            </button>
            <button
              className="bg-transparent border-none text-white cursor-pointer flex items-center justify-center p-1 rounded transition-colors hover:bg-white/20"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="p-5 overflow-y-auto flex-1 bg-gray-50">
          <pre className="m-0 whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-800 bg-white p-4 rounded border border-gray-200 overflow-x-auto">
            {query}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default SqlQueryModal

