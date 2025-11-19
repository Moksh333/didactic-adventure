"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AuthButtons from "@/components/ui/AuthButtons";

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [text, setText] = useState("");

  // Fetch all tasks
  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  // Add a task
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

  // Toggle task completion
  const toggleTask = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: "PUT" });
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-50 p-8">
      <h1 className="text-6xl font-bold mb-8 text-center text-yellow-600">
        🧠 Autonomous Task Manager
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
            {/* {
              tasks.map((t)=> (
                <div>{t.id}</div>
              ))
            } */}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <AuthButtons />
      </div>
    </main>
  );
}
