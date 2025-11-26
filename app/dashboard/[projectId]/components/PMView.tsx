"use client";

import { useEffect, useState } from "react";

export default function PMView({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const tRes = await fetch(`/api/tasks?projectId=${projectId}`);
      const mRes = await fetch(`/api/projects/${projectId}/members`);

      // If API fails → fallback to empty
      const t = tRes.ok ? await tRes.json() : [];
      const m = mRes.ok ? await mRes.json() : [];

      // Validate arrays (in case API returns weird things)
      setTasks(Array.isArray(t) ? t : []);
      setMembers(Array.isArray(m) ? m : []);
    } catch (err) {
      console.error("PMView load error:", err);
      setTasks([]);
      setMembers([]);
    }
  }

  async function inviteMember() {
    try {
      await fetch(`/api/projects/${projectId}/invites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
    } catch (err) {
      console.error("Invite error:", err);
    }

    setEmail("");
    load();
  }

  async function addTask() {
    try {
      await fetch(`/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, text })
      });
    } catch (err) {
      console.error("Add task error:", err);
    }

    setText("");
    load();
  }

  async function toggle(id: string) {
    try {
      await fetch(`/api/tasks/${id}`, { method: "PUT" });
    } catch (err) {
      console.error("Toggle task error:", err);
    }

    load();
  }

  return (
    <div className="space-y-10">

      {/* Members */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Team Members</h2>

        <div className="flex gap-2 mb-4">
          <input
            className="border p-2 rounded"
            placeholder="Invite via email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={inviteMember}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Invite
          </button>
        </div>

        {members.length === 0 && (
          <p className="text-gray-400">No members yet.</p>
        )}

        {members.map((m: any) => (
          <p key={m.userId ?? m.email} className="text-gray-600">
            {m.user?.email ?? m.email} — {m.role}
          </p>
        ))}
      </section>

      {/* Tasks */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Tasks</h2>

        <div className="flex gap-2 mb-4">
          <input
            className="border p-2 rounded"
            placeholder="New task"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={addTask}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Task
          </button>
        </div>

        {tasks.length === 0 && (
          <p className="text-gray-400">No tasks yet.</p>
        )}

        <div className="space-y-2">
          {tasks.map((t: any) => (
            <div key={t.id} className="p-2 border rounded flex items-center gap-2">
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => toggle(t.id)}
              />
              <span className={t.completed ? "line-through text-gray-400" : ""}>
                {t.text}
              </span>
              <span className="ml-auto text-sm text-gray-400">
                Assigned to {t.assignedTo?.email ?? t.assignedToEmail ?? "Unassigned"}
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
