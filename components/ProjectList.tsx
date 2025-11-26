import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  name: string;
  description: string | null;
  _count?: {
    tasks: number;
    members: number;
  };
}

interface ProjectListProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (projectId: string) => void;
}

export function ProjectList({ projects, selectedProjectId, onSelectProject }: ProjectListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card 
          key={project.id} 
          className={`cursor-pointer transition-colors hover:bg-gray-50 ${
            selectedProjectId === project.id ? "border-primary ring-2 ring-primary" : ""
          }`}
          onClick={() => onSelectProject(project.id)}
        >
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{project.name}</span>
              {selectedProjectId === project.id && (
                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                  Selected
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">
              {project.description || "No description"}
            </p>
            <div className="flex gap-4 text-xs text-gray-400">
              <span>{project._count?.tasks ?? 0} Tasks</span>
              <span>{project._count?.members ?? 0} Members</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
