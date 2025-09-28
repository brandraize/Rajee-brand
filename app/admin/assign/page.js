"use client";

import { useState } from "react";

export default function AssignAdminPage() {
  const [message, setMessage] = useState("");

  const handleAssignAdmin = async () => {
    const res = await fetch("/api/assign-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: "TpbtCEe9kxbYJa3BtWFbg4W2Nez1" }), // replace with admin UID
    });
    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <div className="p-4">
      <h1>Assign Admin Role</h1>
      <button
        onClick={handleAssignAdmin}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Make User Admin
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}