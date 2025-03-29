import { Package, AlertTriangle, BarChart2 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import SqlQueryButton from "./SqlQueryButton"

const InventoryOverview = ({ data }) => {
  // SQL queries for each statistic
  const sqlQueries = {
    totalItems: `SELECT COUNT(*) as total_items 
FROM ingredients 
WHERE quantity > 0;`,

    lowStock: `SELECT 
    name, 
    quantity, 
    unit, 
    min_threshold as threshold
FROM 
    ingredients
WHERE 
    quantity <= min_threshold
ORDER BY 
    (quantity / min_threshold) ASC;`,

    stockUsage: `SELECT 
    i.name, 
    SUM(iu.quantity_used) as usage
FROM 
    ingredient_usage iu
JOIN 
    ingredients i ON iu.ingredient_id = i.id
WHERE 
    iu.usage_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
GROUP BY 
    i.name
ORDER BY 
    usage DESC
LIMIT 5;`,
  }

  return (
    <div className="fade-in">
      <h2 className="section-title">
        <Package size={24} />
        Inventory Overview
      </h2>

      <div className="stat-card mb-4">
        <div className="stat-label">Total Ingredients Available</div>
        <div className="stat-value">{data.totalItems}</div>
        <div className="stat-label">items in stock</div>
        <SqlQueryButton query={sqlQueries.totalItems} title="Total Ingredients Query" />
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-semibold text-coffee-dark flex items-center">
            <AlertTriangle size={18} className="text-red-500 mr-1" />
            Low Stock Alerts
          </h3>
          <SqlQueryButton query={sqlQueries.lowStock} title="Low Stock Alerts Query" />
        </div>

        <div className="max-h-[150px] overflow-y-auto">
          {data.lowStock.map((item, index) => (
            <div key={index} className={`alert-item ${item.quantity < item.threshold / 2 ? "alert-critical" : ""}`}>
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-gray-600">
                  Threshold: {item.threshold} {item.unit}
                </div>
              </div>
              <div className={`font-bold ${item.quantity < item.threshold / 2 ? "text-red-500" : "text-amber-500"}`}>
                {item.quantity} {item.unit}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-semibold text-coffee-dark flex items-center">
            <BarChart2 size={18} className="mr-1" />
            Stock Usage Chart
          </h3>
          <SqlQueryButton query={sqlQueries.stockUsage} title="Stock Usage Chart Query" />
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.stockUsage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "5px",
                  border: "none",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
                labelStyle={{ fontWeight: "bold", color: "#654321" }}
              />
              <Bar dataKey="usage" fill="#8c5e2a" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default InventoryOverview

