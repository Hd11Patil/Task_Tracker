import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  // get tasks
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching task:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update task Status
  const updateTaskStatus = async (taskId, status) => {
    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/tasks/${taskId}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchTasks();
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Fail to update status");
    }
  };

  // Filter task
  const filteredTasks =
    statusFilter === "All"
      ? tasks
      : tasks.filter((task) => task.status === statusFilter);

  // logout --
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // priority badge --
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-600";
      case "Medium":
        return "bg-orange-100 text-orange-600";
      case "Low":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100";
    }
  };

  // status Badge 
  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Done":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* navbar */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Task Tracker</h1>

          <div className="flex items-center gap-4">
            <span>{user?.name}</span>

            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
              {user?.role}
            </span>

            {user?.role === "manager" && (
              <button
                onClick={() => navigate("/create-task")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Create Task
              </button>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Dashboard</h2>

          <p className="text-gray-500">Manage your tasks efficiently</p>
        </div>

        {/* filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {["All", "Pending", "In Progress", "Done"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg transition ${
                statusFilter === status
                  ? "bg-blue-600 text-white"
                  : "bg-white shadow"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* tasks */}
        {loading ? (
          <div className="bg-white p-6 rounded-xl shadow">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow">No tasks found</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTasks.map((task) => (
              <div key={task.id} className="bg-white rounded-xl shadow p-5">
                <h3 className="text-xl font-semibold mb-4">{task.title}</h3>

                <div className="mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusClass(
                      task.status,
                    )}`}
                  >
                    {task.status}
                  </span>
                </div>

                <div className="mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getPriorityClass(
                      task.priority,
                    )}`}
                  >
                    {task.priority}
                  </span>
                </div>

                <p className="mb-4 text-gray-600">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>

                {/* employee can update status */}
                {user?.role === "employee" && (
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                    className="w-full border rounded-lg p-2"
                  >
                    <option value="Pending">Pending</option>

                    <option value="In Progress">In Progress</option>

                    <option value="Done">Done</option>
                  </select>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
