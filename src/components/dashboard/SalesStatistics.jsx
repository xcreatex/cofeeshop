import { DollarSign, ShoppingBag, TrendingUp, Coffee } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import SqlQueryButton from "./SqlQueryButton"

const SalesStatistics = ({ data }) => {
  // SQL queries for each statistic
  const sqlQueries = {
    todaySales: `SELECT 
    SUM(total_amount) as today_sales 
FROM 
    orders 
WHERE 
    DATE(order_date) = CURRENT_DATE;`,

    ordersCompleted: `SELECT 
    COUNT(*) as orders_completed 
FROM 
    orders 
WHERE 
    DATE(order_date) = CURRENT_DATE 
    AND status = 'completed';`,

    bestSeller: `SELECT 
    p.name as product_name,
    COUNT(*) as order_count
FROM 
    order_items oi
JOIN 
    products p ON oi.product_id = p.id
JOIN 
    orders o ON oi.order_id = o.id
WHERE 
    DATE(o.order_date) = CURRENT_DATE
    AND p.category = 'coffee'
GROUP BY 
    p.id
ORDER BY 
    order_count DESC
LIMIT 1;`,

    averageOrderValue: `SELECT 
    AVG(total_amount) as average_order_value 
FROM 
    orders 
WHERE 
    DATE(order_date) = CURRENT_DATE;`,

    dailySales: `SELECT 
    HOUR(order_date) as hour,
    COUNT(*) as sales
FROM 
    orders
WHERE 
    DATE(order_date) = CURRENT_DATE
GROUP BY 
    HOUR(order_date)
ORDER BY 
    hour;`,
  }

  return (
    <div className="fade-in">
      <h2 className="section-title">
        <DollarSign size={24} />
        Sales & Revenue Statistics
      </h2>

      <div className="stat-grid">
        <div className="stat-card">
          <DollarSign size={20} className="text-green-500" />
          <div className="stat-value">${data.todaySales.toFixed(2)}</div>
          <div className="stat-label">Total Sales Today</div>
          <SqlQueryButton query={sqlQueries.todaySales} title="Total Sales Query" />
        </div>

        <div className="stat-card">
          <ShoppingBag size={20} className="text-blue-500" />
          <div className="stat-value">{data.ordersCompleted}</div>
          <div className="stat-label">Orders Completed</div>
          <SqlQueryButton query={sqlQueries.ordersCompleted} title="Orders Completed Query" />
        </div>

        <div className="stat-card">
          <Coffee size={20} className="text-coffee-dark" />
          <div className="stat-value text-lg">{data.bestSeller}</div>
          <div className="stat-label">Best-Selling Coffee</div>
          <SqlQueryButton query={sqlQueries.bestSeller} title="Best-Selling Coffee Query" />
        </div>

        <div className="stat-card">
          <TrendingUp size={20} className="text-purple-600" />
          <div className="stat-value">${data.averageOrderValue.toFixed(2)}</div>
          <div className="stat-label">Average Order Value</div>
          <SqlQueryButton query={sqlQueries.averageOrderValue} title="Average Order Value Query" />
        </div>
      </div>

      <div className="card mt-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-semibold text-coffee-dark">Daily Sales Graph</h3>
          <SqlQueryButton query={sqlQueries.dailySales} title="Daily Sales Graph Query" />
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.dailySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "5px",
                  border: "none",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
                labelStyle={{ fontWeight: "bold", color: "#654321" }}
                formatter={(value) => [`${value} orders`, "Sales"]}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#c49a6c"
                strokeWidth={2}
                dot={{ r: 4, fill: "#c49a6c", strokeWidth: 1, stroke: "#8c5e2a" }}
                activeDot={{ r: 6, fill: "#8c5e2a" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default SalesStatistics

