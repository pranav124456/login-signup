import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function Todo({ email, setEmail }) {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const load = useCallback(async () => {
    if (!email) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/tasks/${email}`);
      setTasks(await res.json());
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  }, [email]);

  useEffect(() => { load(); }, [load]);

  const add = async () => {
    if (!title.trim() || !email) return;
    try {
      await fetch("http://127.0.0.1:8000/tasks", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({title, completed:false, user_email:email})
      });
      setTitle("");
      load();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggle = async (id, completed) => {
    try {
      await fetch(`http://127.0.0.1:8000/tasks/${id}?completed=${!completed}`, {method:"PUT"});
      load();
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const del = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/tasks/${id}`, {method:"DELETE"});
      load();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const startEdit = (id, currentTitle) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) {
      cancelEdit();
      return;
    }
    try {
      const res = await fetch(`http://127.0.0.1:8000/tasks/${id}?title=${encodeURIComponent(editTitle)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: `HTTP ${res.status}: ${res.statusText}` }));
        console.error("Error updating task:", errorData);
        alert(`Failed to update task: ${errorData.detail || "Unknown error"}`);
        return;
      }
      
      setEditingId(null);
      setEditTitle("");
      load();
    } catch (error) {
      console.error("Error updating task:", error);
      alert(`Failed to update task: ${error.message}`);
    }
  };

  const handleKeyPress = (e, id) => {
    if (e.key === "Enter") {
      saveEdit(id);
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const handleLogout = () => {
    setEmail("");
    navigate("/login");
  };

  return (
    <>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2>Todo</h2>
          <button onClick={handleLogout} style={{ padding: "8px 16px", cursor: "pointer" }}>Logout</button>
        </div>
        <input onChange={e=>setTitle(e.target.value)} />
        <button onClick={add}>Add</button>
      {tasks.map(t=>(
        <div key={t.id} style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "8px" }}>
          <span onClick={()=>toggle(t.id,t.completed)} style={{ cursor: "pointer", marginRight: "5px" }}>
            {t.completed ? "✅" : "⬜"}
          </span>
          {editingId === t.id ? (
            <>
              <input 
                type="text" 
                value={editTitle} 
                onChange={e=>setEditTitle(e.target.value)}
                onKeyDown={e=>handleKeyPress(e, t.id)}
                autoFocus
                style={{ flex: 1, padding: "4px 8px", marginRight: "5px" }}
              />
              <button onClick={()=>saveEdit(t.id)} style={{ width: "28px", height: "28px", padding: "0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", marginRight: "3px" }}>💾</button>
              <button onClick={cancelEdit} style={{ width: "28px", height: "28px", padding: "0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>❌</button>
            </>
          ) : (
            <>
              <span style={{ flex: 1, textDecoration: t.completed ? "line-through" : "none", marginRight: "5px" }}>
                {t.title}
              </span>
              <button onClick={()=>startEdit(t.id, t.title)} style={{ width: "28px", height: "28px", padding: "0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", marginRight: "3px" }}>✏️</button>
              <button onClick={()=>del(t.id)} style={{ width: "28px", height: "28px", padding: "0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>❌</button>
            </>
          )}
        </div>
      ))}
      </div>
    </>
  );
}
