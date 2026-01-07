"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="w-96 p-6 border rounded">
        <h2 className="text-xl mb-4">Login</h2>
        <input className="input" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" className="input mt-2" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button className="btn mt-4 w-full">Login</button>
      </form>
    </div>
  );
}
