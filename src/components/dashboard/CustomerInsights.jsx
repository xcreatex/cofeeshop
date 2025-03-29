import { Users, Clock } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import SqlQueryButton from "./SqlQueryButton"

const CustomerInsights = ({ data }) => {
  // Calculate percentage of repeat customers
  const repeatPercentage = Math.round((data.repeatCustomers / data.totalCustomers) * 100)

  // SQL queries for each statistic
  const sqlQueries = {
    totalCustomers: `SELECT 
    COUNT(DISTINCT customer_id) as total_customers
FROM 
    orders
WHERE 
    DATE(order_date) = CURRENT_DATE;`,

    repeatCustomers: `SELECT 
    COUNT(*) as repeat_customers
FROM (
    SELECT 
        customer_id,
        COUNT(*) as visit_count
    FROM 
        orders
    WHERE 
        order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
    GROUP BY 
        customer_id
    HAVING 
        COUNT(*) > 1
) as repeat_visitors
WHERE 
    repeat_visitors.customer_id IN (
        SELECT DISTINCT customer_id 
        FROM orders 
        WHERE DATE(order_date) = CURRENT_DATE
    );`,

    peakHours: `SELECT 
    CONCAT(
        HOUR(order_date), 
        'AM', 
        '-', 
        HOUR(order_date) + 1,
        'AM'
    ) as hour,
    COUNT(DISTINCT customer_id) as customers
FROM 
    orders
WHERE 
    DATE(order_date) = CURRENT_DATE
GROUP BY 
    HOUR(order_date)
ORDER BY 
    customers DESC
LIMIT 3;`,
  }

  return (
    <div className="fade-in">
      <h2 className="section-title">
        <Users size={24} />
        Customer Insights
      </h2>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">{data.totalCustomers}</div>
          <div className="stat-label">Total Customers Today</div>
          <SqlQueryButton query={sqlQueries.totalCustomers} title="Total Customers Query" />
        </div>

        <div className="stat-card">
          <div className="stat-value">{repeatPercentage}%</div>
          <div className="stat-label">Repeat Customers</div>
          <SqlQueryButton query={sqlQueries.repeatCustomers} title="Repeat Customers Query" />
        </div>
      </div>

      <div className="card mt-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-semibold text-coffee-dark flex items-center">
            <Clock size={18} className="mr-1" />
            Peak Sales Hours
          </h3>
          <SqlQueryButton query={sqlQueries.peakHours} title="Peak Hours Query" />
        </div>

        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.peakHours}>
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
                formatter={(value) => [`${value} customers`, "Customers"]}
              />
              <Bar dataKey="customers" fill="#9c7a54" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card mt-4 flex justify-center items-center flex-col">
        <div
          className="w-24 h-24 rounded-full relative flex justify-center items-center mb-2"
          style={{ background: `conic-gradient(#8c5e2a ${repeatPercentage}%, #e6ccb2 0)` }}
        >
          <div className="w-16 h-16 rounded-full bg-white flex justify-center items-center font-bold text-coffee-dark">
            {repeatPercentage}%
          </div>
        </div>
        <div className="text-sm font-medium text-coffee-dark">Repeat Customer Rate</div>
      </div>
    </div>
  )
}

export default CustomerInsights

