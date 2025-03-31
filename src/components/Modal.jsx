"use client"

import { useEffect, useCallback } from "react"
import { X } from "lucide-react"

const Modal = ({ isOpen, onClose, children }) => {
  // Close modal on Escape key press (memoized function)
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
      aria-hidden={!isOpen}
    >
      <div
        className="bg-white p-5 rounded-lg max-w-[90%] max-h-[90%] overflow-auto relative shadow-2xl transition-transform duration-300 ease-in-out"
      >
        <button
          className="absolute top-2 right-2 bg-red-600 text-white border-none text-base cursor-pointer p-1 rounded flex items-center justify-center hover:bg-red-700 transition-colors"
          onClick={onClose}
        >
          <span className="mr-1 text-sm">Close</span>
          <X size={16} />
        </button>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}

export default Modal
