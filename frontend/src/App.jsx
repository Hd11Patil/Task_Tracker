import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from "./pages/Register";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateTask from './pages/CreateTask';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/create-task" element={<CreateTask />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;