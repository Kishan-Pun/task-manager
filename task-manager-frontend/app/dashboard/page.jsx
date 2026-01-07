"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // NEW
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    api.get("/auth/profile").then((res) => setUser(res.data));
    fetchTasks();
  }, []);

  // Fetch tasks with search + filter
  const fetchTasks = async () => {
    const res = await api.get("/tasks", {
      params: {
        search: search || undefined,
        status: status || undefined,
      },
    });
    setTasks(res.data);
  };

  // Re-fetch when search or status changes
  useEffect(() => {
    fetchTasks();
  }, [search, status]);

  // CREATE
  const createTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await api.post("/tasks", { title });
    setTitle("");
    fetchTasks();
  };

  // UPDATE
  const toggleStatus = async (task) => {
    await api.put(`/tasks/${task._id}`, {
      status: task.status === "pending" ? "completed" : "pending",
    });
    fetchTasks();
  };

  // DELETE
  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          {user && (
            <p className="text-sm text-gray-600">
              {user.name} · {user.email}
            </p>
          )}
        </div>
        <button
          onClick={logout}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-2 mb-4">
        <input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 flex-1 rounded"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Create Task */}
      <form onSubmit={createTask} className="flex gap-2 mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task title"
          className="border p-2 flex-1 rounded"
        />
        <button className="bg-black text-white px-4 rounded">Add</button>
      </form>

      {/* Task List */}
      <ul>
        {tasks.map((task) => (
          <li
            key={task._id}
            className="border p-3 mb-2 rounded flex justify-between items-center"
          >
            <div
              onClick={() => toggleStatus(task)}
              className="cursor-pointer flex flex-col"
            >
              <span
                className={
                  task.status === "completed"
                    ? "line-through text-gray-500"
                    : ""
                }
              >
                {task.title}
              </span>

              <span
                className={`text-xs mt-1 inline-block w-fit px-2 py-0.5 rounded ${
                  task.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {task.status}
              </span>
            </div>
            <button
              onClick={() => deleteTask(task._id)}
              className="text-red-500 text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
