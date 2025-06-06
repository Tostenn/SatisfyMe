import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Register from "./components/Auth/";
import Login from "./components/Auth/Login";
import Dashboard from "./components/Admin/Dashboard";
import ResponseForm from "./components/Public/ResponseForm";
import ResponsesList from './components/Admin/ResponsesList';
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* <Route path="/register" element={<Register />} /> */}
          <Route path="/" element={<ResponseForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/responses" element={<ResponsesList />} />
          {/* Redirection par défaut */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
