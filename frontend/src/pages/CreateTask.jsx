import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function CreateTask() {
  const navigate = useNavigate();

  // form data
  const [formData, setFormData] = useState({
    title: '',
    dueDate: '',
    assignedTo: '',
  });

  // employees list
  const [employees, setEmployees] = useState([]);

  // ui states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // load employees when page opens
  useEffect(() => {
    fetchEmployees();
  }, []);

  // get all employees
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await api.get(
        '/users/employees',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // create task
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');

      await api.post(
        '/tasks',
        {
          title: formData.title,
          dueDate: formData.dueDate,
          assignedTo: Number(formData.assignedTo),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert('Task Created Successfully');

      navigate('/');
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          'Failed to create task',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* top bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">
            Task Tracker
          </h1>

          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* form card */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold mb-2">
            Create Task
          </h2>

          <p className="text-gray-500 mb-8">
            Assign a new task to an employee
          </p>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* title */}
            <div>
              <label className="block mb-2 font-medium">
                Task Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* employee dropdown */}
            <div>
              <label className="block mb-2 font-medium">
                Assign Employee
              </label>

              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">
                  Select Employee
                </option>

                {employees.map((employee) => (
                  <option
                    key={employee.id}
                    value={employee.id}
                  >
                    {employee.email}
                  </option>
                ))}
              </select>
            </div>

            {/* due date */}
            <div>
              <label className="block mb-2 font-medium">
                Due Date
              </label>

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 py-3 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {loading
                  ? 'Creating...'
                  : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateTask;