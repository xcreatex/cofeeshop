"use client"

import { useState, useEffect } from "react"
import Modal from "./Modal"
import SqlQueryButton from "./dashboard/SqlQueryButton"

const ResultDisplay = ({ selectedQuery, naturalLanguageQuery }) => {
  const [result, setResult] = useState([])
  const [imageUrl, setImageUrl] = useState(null)
  const [tableError, setTableError] = useState(null)
  const [imageError, setImageError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [descLoading, setDescLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [queryDescription, setQueryDescription] = useState("")
  const [sqlQuery, setSqlQuery] = useState("")

  useEffect(() => {
    const fetchDescription = async (tableData) => {
      setDescLoading(true)
      setImageError(null)
      try {
        const response = await fetch("http://localhost:5000/api/describe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tableData }),
        })

        if (!response.ok) {
          throw new Error("Failed to generate image.")
        }

        const imageBlob = await response.blob()
        const imageUrl = URL.createObjectURL(imageBlob)
        setImageUrl(imageUrl)
      } catch (err) {
        console.error("Image fetch error:", err)
        setImageError("Failed to generate image.")
      } finally {
        setDescLoading(false)
      }
    }

    const fetchResults = async (url, options) => {
      setLoading(true)
      setTableError(null)
      setImageUrl(null)

      try {
        const response = await fetch(url, options)

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        console.log(data)

        if (!data.success) {
          setTableError("Failed to fetch results.")
        } else if (!data.sqlResult || data.sqlResult.length === 0) {
          setTableError("No results found.")
          setResult([])
        } else {
          setResult(data.sqlResult)
          setQueryDescription(data.description || "Query results visualization")
          setSqlQuery(data.sqlQuery || "-- SQL query not available")
          fetchDescription(data.sqlResult)
        }
      } catch (err) {
        console.error("Fetch error:", err)
        setTableError("Error fetching data.")
      } finally {
        setLoading(false)
      }
    }

    if (selectedQuery) {
      fetchResults(`http://localhost:5000/api/query?key=${encodeURIComponent(selectedQuery)}`)
    } else if (naturalLanguageQuery) {
      fetchResults(`http://localhost:5000/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: naturalLanguageQuery }),
      })
    }
  }, [naturalLanguageQuery, selectedQuery])

  return (
    <div className="flex justify-center items-start w-full p-5">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 w-full max-w-7xl bg-white/95 p-6 md:p-8 rounded-xl shadow-xl">
        {/* Table Section */}
        <div className="flex-1 max-h-[75vh] overflow-y-auto pr-5 w-full lg:w-2/3">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-coffee-dark mb-5 pb-2 border-b-2 border-coffee-cream">
              Query Results
            </h2>
            {result.length > 0 && <SqlQueryButton query={sqlQuery} title="Executed SQL Query" />}
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center min-h-[200px] w-full gap-4">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-coffee-medium rounded-full animate-spin"></div>
              <p className="text-gray-600 italic text-base">Fetching data...</p>
            </div>
          ) : tableError ? (
            <div className="flex flex-col justify-center items-center min-h-[200px] w-full">
              <p className="text-red-600 font-bold text-base py-4 px-5 bg-red-50 rounded-lg border-l-4 border-red-600 w-full text-center">
                {tableError}
              </p>
            </div>
          ) : result.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left bg-white rounded-lg overflow-hidden shadow-md">
                <thead>
                  <tr>
                    {Object.keys(result[0]).map((col, index) => (
                      <th
                        key={index}
                        className="py-4 px-5 bg-gradient-to-r from-coffee-dark to-coffee-medium text-white font-semibold uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.map((row, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-coffee-light/10" : "bg-white"}>
                      {Object.values(row).map((val, colIndex) => (
                        <td key={colIndex} className="py-3 px-5 border border-gray-100">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center min-h-[200px] w-full">
              <p className="text-gray-600 text-base">Select a query or ask a question to see results</p>
            </div>
          )}
        </div>

        {/* Image Section */}
        <div className="bg-white p-6 rounded-xl shadow-md text-center w-full lg:w-1/3 max-h-[75vh] overflow-y-auto">
          <h2 className="text-xl font-semibold text-coffee-dark mb-5 pb-2 border-b-2 border-coffee-cream">
            {queryDescription || "Visualization"}
          </h2>
          {descLoading ? (
            <div className="flex flex-col justify-center items-center min-h-[200px] gap-4">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-coffee-medium rounded-full animate-spin"></div>
              <p className="text-gray-600 italic text-base">Generating visualization...</p>
            </div>
          ) : imageError ? (
            <div className="flex flex-col justify-center items-center min-h-[200px]">
              <p className="text-red-600 font-bold text-base py-4 px-5 bg-red-50 rounded-lg border-l-4 border-red-600">
                {imageError}
              </p>
            </div>
          ) : imageUrl ? (
            <div className="flex flex-col items-center gap-2">
              <img
                className="max-w-full h-auto rounded-lg shadow-lg transition-transform hover:scale-105 cursor-pointer"
                src={imageUrl || "/placeholder.svg"}
                alt="Generated Chart"
                onClick={() => setIsModalOpen(true)}
              />
              <p className="text-gray-500 text-sm italic mt-2">Click on the image to enlarge</p>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center min-h-[200px]">
              <p className="text-gray-600">No visualization available</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Image */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <img src={imageUrl || "/placeholder.svg"} alt="Generated Chart" className="max-w-full h-auto" />
      </Modal>
    </div>
  )
}

export default ResultDisplay

