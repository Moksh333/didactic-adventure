"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function MemberView({ projectId }: { projectId: string }) {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch(`/api/tasks?projectId=${projectId}`)
      .then(r => r.json())
      .then(setTasks);
  }, []);

  async function toggle(task: any) {
    if (task.assignedToEmail !== session?.user?.email) return;

    await fetch(`/api/tasks/${task.id}`, { method: "PUT" });
    fetch(`/api/tasks?projectId=${projectId}`)
      .then(r => r.json())
      .then(setTasks);
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>

      <div className="space-y-2">
        {tasks.map((t: any) => {
          const mine = t.assignedToEmail === session?.user?.email;

          return (
            <div key={t.id} className="p-2 border rounded flex items-center gap-2">
              <input
                type="checkbox"
                checked={t.completed}
                disabled={!mine}
                onChange={() => mine && toggle(t)}
              />
              <span className={t.completed ? "line-through text-gray-400" : ""}>
                {t.text}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
