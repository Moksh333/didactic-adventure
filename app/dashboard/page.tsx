"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Project {
  id: string;
  name: string;
  description?: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // 🔥 NEW — Control dialog open/close
  const [open, setOpen] = useState(false);

  async function loadProjects() {
    try {
      const res = await fetch(`/api/projects`);
      if (!res.ok) return setProjects([]);

      const data = await res.json();

      const managed = data.managedProjects || [];
      const member = data.memberProjects || [];

      const combined = Array.from(
        new Map([...managed, ...member].map((p) => [p.id, p])).values()
      );

      setProjects(combined);
    } catch (err) {
      console.error("Error loading projects:", err);
      setProjects([]);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function handleCreateProject() {
    if (!name.trim()) return;

    const res = await fetch(`/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    if (res.ok) {
      setName("");
      setDescription("");
      await loadProjects();

      // 🔥 CLOSE THE DIALOG HERE
      setOpen(false);
    }
  }

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Your Projects</h1>

        {/* Create Project Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => setOpen(true)}
            >
              + New Project
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Project Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description"
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleCreateProject}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 && (
        <p className="text-gray-500">No projects found. Create one to begin!</p>
      )}

      <div className="space-y-4 mt-4">
        {projects.map((p) => (
          <Link
            href={`/dashboard/${p.id}`}
            key={p.id}
            className="block p-4 bg-white shadow rounded hover:bg-gray-50 transition"
          >
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="text-gray-500">{p.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
