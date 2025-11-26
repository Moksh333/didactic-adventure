"use client";

import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import PMView from "./components/PMView";
import MemberView from "./components/MemberView";

interface Project {
  id: string;
  name: string;
  description?: string;
  managerId: string;
}

export default function ProjectDashboard({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  // ⬅️ unwrap the params Promise using React.use()
  const { projectId } = use(params);

  const { data: session } = useSession();

  const [project, setProject] = useState<Project | null>(null);
  const [role, setRole] = useState<"pm" | "member" | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        console.log(res);
        
        const data = await res.json();

        setProject(data.project || null);
        setRole(data.role || null);
      } catch (error) {
        console.error("Failed to load project:", error);
      }
    }

    load();
  }, [projectId]);

  if (!project) return <p>Loading...</p>;

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold mb-6">{project.name}</h1>

      {role === "pm" ? (
        <PMView projectId={projectId} />
      ) : (
        <MemberView projectId={projectId} />
      )}
    </main>
  );
}
