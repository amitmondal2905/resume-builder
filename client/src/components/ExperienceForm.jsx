import { Briefcase, Plus, Sparkles, Trash2 } from "lucide-react";
import React from "react";

const ExperienceForm = ({ data, onChange }) => {
  const [enhancingIndex, setEnhancingIndex] = React.useState(null);

  const handleAIEnhance = async (index) => {
    const text = data[index].description;
    if (!text) return alert("Please write a description first!");

    setEnhancingIndex(index);
    const token = localStorage.getItem("resume-token");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/enhance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ text, type: "job description" })
      });

      const result = await response.json();

      if (response.ok) {
        updateExperience(index, "description", result.enhancedText);
      } else {
        alert(result.error || "AI Enhancement failed");
      }
    } catch (error) {
      console.error("AI Error:", error);
      alert("Failed to connect to AI service");
    } finally {
      setEnhancingIndex(null);
    }
  };

  const addExperience = () => {
    const newExperience = {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false,
    };
    onChange([...(data || []), newExperience]);
  };

  const removeExperience = (index) => {
    const updatedExperiences = data.filter((_, i) => i !== index);
    onChange(updatedExperiences);
  };

  const updateExperience = (index, field, value) => {
    const updatedExperiences = [...data];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value,
    };
    onChange(updatedExperiences);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              Professional Experience
            </h3>
            <p className="text-sm text-gray-500">
              Add your professional experience details.
            </p>
          </div>
          <button
            onClick={addExperience}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
          >
            <Plus size={16} />
            Add Experience
          </button>
        </div>
        {data?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No work experience added yet.</p>
            <p className="text-sm">Click "Add Experience" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data?.map((experience, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg space-y-3"
              >
                <div className="flex justify-between items-start">
                  <h4>Experience #{index + 1}</h4>
                  <button
                    onClick={() => removeExperience(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    value={experience.company || ""}
                    onChange={(e) =>
                      updateExperience(index, "company", e.target.value)
                    }
                    type="text"
                    placeholder="Company Name"
                    className="px-3 py-2 text-sm rounded-lg"
                  />

                  <input
                    value={experience.position || ""}
                    onChange={(e) =>
                      updateExperience(index, "position", e.target.value)
                    }
                    type="text"
                    placeholder="Job Title"
                    className="px-3 py-2 text-sm rounded-lg"
                  />

                  <input
                    value={experience.start_date || ""}
                    onChange={(e) =>
                      updateExperience(index, "start_date", e.target.value)
                    }
                    type="month"
                    className="px-3 py-2 text-sm rounded-lg"
                  />

                  <input
                    value={experience.end_date || ""}
                    onChange={(e) =>
                      updateExperience(index, "end_date", e.target.value)
                    }
                    type="month"
                    disabled={experience.is_current}
                    className="px-3 py-2 text-sm rounded-lg disabled:bg-gray-100"
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={experience.is_current || false}
                    onChange={(e) => {
                      updateExperience(
                        index,
                        "is_current",
                        e.target.checked ? true : false
                      );
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Currently working here
                  </span>
                </label>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Job Description
                    </label>
                    <button 
                      onClick={() => handleAIEnhance(index)}
                      disabled={enhancingIndex === index}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                    >
                      <Sparkles className={`w-3 h-3 ${enhancingIndex === index ? "animate-spin" : ""}`} />
                      {enhancingIndex === index ? "Enhancing..." : "Enhance with AI"}
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={experience.description || ""}
                    onChange={(e) =>
                      updateExperience(index, "description", e.target.value)
                    }
                    className="w-full text-sm px-3 py-2 rounded-lg resize-none"
                    placeholder="Describe your key responsibilities and achievements..."
                  ></textarea>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ExperienceForm;
