"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/auth/register", form);
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="w-96 p-6 border rounded">
        <h2 className="text-xl mb-4">Register</h2>
        <input
          placeholder="Name"
          className="input"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          className="input mt-2"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="input mt-2"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn mt-4 w-full">Register</button>
      </form>
    </div>
  );
}
