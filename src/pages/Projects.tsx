import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FolderOpen, 
  Plus, 
  Search, 
  MoreVertical, 
  Eye, 
  Download,
  Trash2,
  Calendar
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Project {
  id: string;
  name: string;
  thumbnail: string;
  originalImage: string;
  stagedImage: string;
  dateCreated: string;
  dateModified: string;
  status: "draft" | "completed";
  tags: string[];
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Modern Living Room",
      thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=225&fit=crop",
      originalImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop", 
      stagedImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      dateCreated: "2024-01-15",
      dateModified: "2024-01-16",
      status: "completed",
      tags: ["living room", "modern", "gray sofa"]
    },
    {
      id: "2",
      name: "Cozy Bedroom Design",
      thumbnail: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=225&fit=crop",
      originalImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      stagedImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop", 
      dateCreated: "2024-01-10",
      dateModified: "2024-01-12",
      status: "draft",
      tags: ["bedroom", "cozy", "warm tones"]
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "completed">("all");

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  const handleCreateNew = () => {
    // Navigate to staging studio or show create dialog
    console.log("Create new project");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              My Projects
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your staging projects and before/after comparisons
            </p>
          </div>
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects by name or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "draft" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("draft")}
            >
              Drafts
            </Button>
            <Button
              variant={statusFilter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("completed")}
            >
              Completed
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Project Thumbnail */}
                <div className="aspect-video bg-muted rounded-t-lg relative overflow-hidden">
                  <img 
                    src={project.thumbnail} 
                    alt={project.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 items-center justify-center hidden">
                    <FolderOpen className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge variant={project.status === "completed" ? "default" : "secondary"}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8 bg-background/80">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-2 truncate">
                    {project.name}
                  </h3>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{project.dateModified}</span>
                    </div>
                    <span>Modified</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No projects found
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filters"
                : "Create your first staging project to get started"
              }
            </p>
            {(!searchTerm && statusFilter === "all") && (
              <Button onClick={handleCreateNew} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Project
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;