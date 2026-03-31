import { Plus, Trash2 } from "lucide-react";
import React from "react";

const ProjectForm = ({ data, onChange }) => {
  const addProject = () => {
    const newProject = {
      name: "",
      type: "",
      description: "",
    };
    onChange([...(data || []), newProject]);
  };

  const removeProject = (index) => {
    const updatedProjects = data.filter((_, i) => i !== index);
    onChange(updatedProjects);
  };

  const updateProject = (index, field, value) => {
    const updatedProjects = [...data];
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value,
    };
    onChange(updatedProjects);
  };
  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              Projects
            </h3>
            <p className="text-sm text-gray-500">Add your projects details.</p>
          </div>
          <button
            onClick={addProject}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
          >
            <Plus size={16} />
            Add Project
          </button>
        </div>

        <div className="space-y-4 mt-6">
          {data?.map((project, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-start">
                <h4>project #{index + 1}</h4>
                <button
                  onClick={() => removeProject(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid gap-3">
                <input
                  value={project.name || ""}
                  onChange={(e) => updateProject(index, "name", e.target.value)}
                  type="text"
                  placeholder="Project Name"
                  className="px-3 py-2 text-sm rounded-lg"
                />

                <input
                  value={project.type || ""}
                  onChange={(e) => updateProject(index, "type", e.target.value)}
                  type="text"
                  placeholder="Project Type"
                  className="px-3 py-2 text-sm rounded-lg"
                />

                <textarea
                  rows={4}
                  value={project.description || ""}
                  onChange={(e) =>
                    updateProject(index, "description", e.target.value)
                  }
                  type="text"
                  placeholder="Describe your project..."
                  className=" w-full px-3 py-2 text-sm rounded-lg resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProjectForm;
