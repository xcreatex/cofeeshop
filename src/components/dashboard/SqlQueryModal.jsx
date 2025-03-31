"use client";

import { useState, useEffect } from "react";
import { Code, Copy, X } from "lucide-react";

const SqlQueryModal = ({ isOpen, onClose, query, title }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50" onClick={onClose}>
      <div
        className="bg-white w-[90%] max-w-3xl max-h-[90vh] rounded-lg overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 bg-gray-800 text-white border-b">
          <h3 className="text-lg flex items-center gap-2">
            <Code size={18} />
            {title || "SQL Query"}
          </h3>
          <button onClick={onClose} className="text-white hover:bg-gray-700 p-1 rounded">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          <pre className="text-sm bg-gray-100 p-4 rounded">{query}</pre>
        </div>
      </div>
    </div>
  );
};

export default SqlQueryModal;
