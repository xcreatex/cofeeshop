
import { Users, Clock, BarChart } from "lucide-react"
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import SqlQueryButton from "./SqlQueryButton"

const StaffManagement = ({ data }) => {
  // SQL queries for each statistic
  const sqlQueries = {
    currentShift: `SELECT 
    e.name, 
    p.title as position,
    s.hours
FROM 
    employees e
JOIN 
    positions p ON e.position_id = p.id
JOIN 
    shifts s ON e.id = s.employee_id
WHERE 
    DATE(s.shift_date) = CURRENT_DATE
    AND TIME(NOW()) BETWEEN s.start_time AND s.end_time;`,

    upcomingShifts: `SELECT 
    e.name, 
    p.title as position,
    CONCAT(
        TIME_FORMAT(s.start_time, '%h:%i %p'), 
        ' - ', 
        TIME_FORMAT(s.end_time, '%h:%i %p')
    ) as time
FROM 
    employees e
JOIN 
    positions p ON e.position_id = p.id
JOIN 
    shifts s ON e.id = s.employee_id
WHERE 
    DATE(s.shift_date) = CURRENT_DATE
    AND s.start_time > NOW()
ORDER BY 
    s.start_time
LIMIT 5;`,

    workHours: `SELECT 
    e.name,
    SUM(TIMESTAMPDIFF(HOUR, s.start_time, s.end_time)) as hours
FROM 
    employees e
JOIN 
    shifts s ON e.id = s.employee_id
WHERE 
    s.shift_date BETWEEN DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY) AND CURRENT_DATE
GROUP BY 
    e.id
ORDER BY 
    hours DESC;`,
  }

  return (
    <div className="fade-in">
      <h2 className="section-title">
        <Users size={24} />
        Staff Management
      </h2>

      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-semibold text-coffee-dark flex items-center">
            <Users size={18} className="mr-1" />
            Current Staff on Shift
          </h3>
          <SqlQueryButton query={sqlQueries.currentShift} title="Current Staff Query" />
        </div>

        <div className="max-h-[150px] overflow-y-auto">
          {data.currentShift.map((staff, index) => (
            <div
              key={index}
              className={`flex justify-between p-2 ${index % 2 === 0 ? "bg-coffee-cream/10" : "bg-white"} rounded mb-1`}
            >
              <div>
                <div className="font-medium">{staff.name}</div>
                <div className="text-xs text-gray-600">{staff.position}</div>
              </div>
              <div className="font-semibold text-coffee-dark flex items-center gap-1">
                <Clock size={14} />
                {staff.hours} hrs
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-semibold text-coffee-dark flex items-center">
            <Clock size={18} className="mr-1" />
            Upcoming Shift Schedule
          </h3>
          <SqlQueryButton query={sqlQueries.upcomingShifts} title="Upcoming Shifts Query" />
        </div>

        <div className="max-h-[100px] overflow-y-auto">
          {data.upcomingShifts.map((shift, index) => (
            <div key={index} className="flex justify-between p-2 bg-coffee-cream/10 rounded mb-1">
              <div>
                <div className="font-medium">{shift.name}</div>
                <div className="text-xs text-gray-600">{shift.position}</div>
              </div>
              <div className="font-semibold text-coffee-medium">{shift.time}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-semibold text-coffee-dark flex items-center">
            <BarChart size={18} className="mr-1" />
            Staff Work Hours
          </h3>
          <SqlQueryButton query={sqlQueries.workHours} title="Staff Work Hours Query" />
        </div>

        <div className="h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={data.workHours} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "5px",
                  border: "none",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
                labelStyle={{ fontWeight: "bold", color: "#654321" }}
                formatter={(value) => [`${value} hours`, "Hours Worked"]}
              />
              <Bar dataKey="hours" fill="#e6ccb2" radius={[0, 5, 5, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default StaffManagement

