"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [text, setText] = useState("");

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    if(data.error){
        setTasks([]);
    } else {
        setTasks(data);
    }
  };

  const addTask = async () => {
    if (!text.trim()) return;
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    setText("");
    fetchTasks();
  };

  const toggleTask = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: "PUT" });
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Your Dashboard
      </h1>

      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Enter a new task..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button onClick={addTask}>Add</Button>
          </div>

          <div className="space-y-2">
            {tasks.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-2 p-2 border rounded"
              >
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleTask(t.id)}
                />
                <span className={t.completed ? "line-through" : ""}>
                  {t.text}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
