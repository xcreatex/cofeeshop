"use client";

import { useState, useEffect, useMemo } from "react";
import SqlQueryButton from "./dashboard/SqlQueryButton";

const ResultDisplay = ({ selectedQuery, naturalLanguageQuery, onQueryButtonClick }) => {
  const [result, setResult] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [tableError, setTableError] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [descLoading, setDescLoading] = useState(false);
  const [queryDescription, setQueryDescription] = useState("");
  const [sqlQuery, setSqlQuery] = useState("");

  useEffect(() => {
    const fetchDescription = async (tableData) => {
      setDescLoading(true);
      setImageError(null);
      try {
        const response = await fetch("http://localhost:5000/api/describe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tableData }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate image.");
        }

        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        setImageUrl(imageUrl);
      } catch (err) {
        console.error("Image fetch error:", err);
        setImageError("Failed to generate image.");
      } finally {
        setDescLoading(false);
      }
    };

    const fetchResults = async (url, options) => {
      setLoading(true);
      setTableError(null);
      setImageUrl(null);

      try {
        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        if (!data.success) {
          setTableError("Failed to fetch results.");
        } else if (!data.sqlResult || data.sqlResult.length === 0) {
          setTableError("No results found.");
          setResult([]);
        } else {
          setResult(data.sqlResult);
          setQueryDescription(data.description || "Query results visualization");
          setSqlQuery(data.sqlQuery || "-- SQL query not available");
          fetchDescription(data.sqlResult);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setTableError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    if (selectedQuery) {
      fetchResults(`http://localhost:5000/api/query?key=${encodeURIComponent(selectedQuery)}`);
    } else if (naturalLanguageQuery) {
      fetchResults(`http://localhost:5000/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: naturalLanguageQuery }),
      });
    }
  }, [naturalLanguageQuery, selectedQuery]);

  return (
    <div className="flex justify-center items-start w-full p-5">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 w-full max-w-7xl bg-white/95 p-6 md:p-8 rounded-xl shadow-xl">
        {/* Table Section */}
        <div className="flex-1 max-h-[75vh] overflow-y-auto pr-5 w-full lg:w-2/3">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-coffee-dark mb-5 pb-2 border-b-2 border-coffee-cream">
              Query Results
            </h2>
            {result.length > 0 && (
              <SqlQueryButton
                query={sqlQuery}
                title="Executed SQL Query"
                onClick={() => onQueryButtonClick(sqlQuery)}
              />
            )}
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : tableError ? (
            <p className="text-red-500">{tableError}</p>
          ) : result.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr>
                  {Object.keys(result[0]).map((col, index) => (
                    <th key={index} className="px-4 py-2 bg-gray-200">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    {Object.values(row).map((val, colIndex) => (
                      <td key={colIndex} className="px-4 py-2 border">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No data</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
