import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "/api/users";

function authHeaders() {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
    
    
    
}, []);

  async function fetchUsers() {
    try {
      const { data } = await axios.get(`${API_URL}/getall`, authHeaders());
      setUsers(data);
    } catch (err) {
  if (err.response?.status === 401) {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
    return;
  }
  setError("Failed to load users.");
}
  }

  function toggleSelectAll(e) {
    setSelected(e.target.checked ? users.map(u => u.id) : []);
  }

  function toggleSelect(id) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }
  function getCurrentUser() {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]; 
  } catch {
    return null;
  }
    }

  async function handleAction(action) {
  if (selected.length === 0) return;
  setMessage("");
  setError("");
  try {
    if (action === "block")
      await axios.post(`${API_URL}/block`, selected, authHeaders());
    else if (action === "unblock")
      await axios.post(`${API_URL}/unblock`, selected, authHeaders());
    else if (action === "delete")
      await axios.delete(`${API_URL}/delete`, { ...authHeaders(), data: selected });
    else if (action === "deleteUnverified")
      await axios.delete(`${API_URL}/deleteunverified`, { ...authHeaders(), data: selected });

    setMessage("Action completed successfully.");
    setSelected([]);

    // ← ADD THIS: if current user was deleted, log out immediately
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentUserId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    if (selected.includes(currentUserId) || selected.includes(Number(currentUserId))) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      navigate("/login");
      return;
    }

    fetchUsers();
  } catch (err) {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      navigate("/login");
      return;
    }
    setError("Action failed.");
  }
}

  function handleLogout() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
}
  function formatDate(dateStr) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); 

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
   }

  function statusBadge(status) {
    const map = {
      1: ["Active", "success"],
      2: ["Blocked", "danger"],
      3: ["Unverified", "secondary"],
    };
    const [label, color] = map[status] ?? ["Unknown", "secondary"];
    return <span className={`badge bg-${color}`}>{label}</span>;
  }

  const allSelected = users.length > 0 && selected.length === users.length;

  return (
    <div className="min-vh-100 bg-light">
      
      <nav className="navbar navbar-dark bg-dark px-3">
  <span className="navbar-brand mb-0 fs-6 fw-bold">User Management</span>
  <div className="d-flex align-items-center gap-3">
    <span className="text-white-50 small d-none d-sm-inline">
      <i className="bi bi-person-circle me-1"></i>
      {getCurrentUser()}
    </span>
    <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
      <i className="bi bi-box-arrow-right me-1"></i>
      <span className="d-none d-sm-inline">Logout</span>
    </button>
  </div>
</nav>

      <div className="container-fluid p-3">
        {message && <div className="alert alert-success py-2 small alert-dismissible">
          {message}
          <button type="button" className="btn-close btn-sm" onClick={() => setMessage("")}></button>
        </div>}
        {error && <div className="alert alert-danger py-2 small alert-dismissible">
          {error}
          <button type="button" className="btn-close btn-sm" onClick={() => setError("")}></button>
        </div>}

        
        <div className="d-flex flex-wrap gap-2 mb-3">
          <button className="btn btn-warning btn-sm" onClick={() => handleAction("block")}
            disabled={selected.length === 0} title="Block selected">
            <i className="bi bi-slash-circle me-1"></i>
            <span>Block</span>
          </button>
          <button className="btn btn-outline-success btn-sm" onClick={() => handleAction("unblock")}
            disabled={selected.length === 0} title="Unblock selected">
            <i className="bi bi-unlock-fill"></i>
          </button>
          <button className="btn btn-outline-danger btn-sm" onClick={() => handleAction("delete")}
            disabled={selected.length === 0} title="Delete selected">
            <i className="bi bi-trash-fill"></i>
          </button>
          <button className="btn btn-outline-secondary btn-sm" onClick={() => handleAction("deleteUnverified")}
            disabled={selected.length === 0} title="Delete unverified">
            <i className="bi bi-person-x-fill"></i>
          </button>
          {selected.length > 0 && (
            <span className="badge bg-primary align-self-center">
              {selected.length} selected
            </span>
          )}
        </div>

        
        <div className="card shadow-sm">
          <div className="card-body p-0 table-responsive">
            <table className="table table-hover table-bordered mb-0">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: "40px" }}>
                    <input type="checkbox" className="form-check-input"
                      checked={allSelected} onChange={toggleSelectAll} />
                  </th>
                  <th>Name</th>
                  <th className="d-none d-md-table-cell">Email</th>
                  <th className="d-none d-lg-table-cell">Last Seen</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}
                    className={`${selected.includes(user.id) ? "table-active" : ""} ${user.status === 2 ? "text-muted" : ""}`}
                    style={user.status === 2 ? { background: "#fff5f5" } : {}}>
                    <td>
                      <input type="checkbox" className="form-check-input"
                        checked={selected.includes(user.id)}
                        onChange={() => toggleSelect(user.id)} />
                    </td>
                    <td>
                      <span className={user.status === 2 ? "text-decoration-line-through" : ""}>
                        {user.firstName} {user.lastName}
                      </span>
                      
                      <div className="d-md-none">
                        <small className="text-muted">{user.email}</small>
                      </div>
                      <div>
                        <small className="text-muted fst-italic">{user.occupation ?? "N/A"}</small>
                      </div>
                    </td>
                    <td className="d-none d-md-table-cell">{user.email}</td>
                    <td className="d-none d-lg-table-cell">{formatDate(user.lastSeenTime)}</td>
                    <td>{statusBadge(user.status)}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-4">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}