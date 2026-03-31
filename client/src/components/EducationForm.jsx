import { GraduationCap, Plus, Trash2 } from "lucide-react";

const EducationForm = ({ data, onChange }) => {
  const addEducation = () => {
    const newEducation = {
      institution: "",
      degree: "",
      field: "",
      graduation_date: "",
      gpa: "",
    };
    onChange([...(data || []), newEducation]);
  };

  const removeEducation = (index) => {
    const updatedEducations = data.filter((_, i) => i !== index);
    onChange(updatedEducations);
  };

  const updateEducation = (index, field, value) => {
    const updatedEducations = [...data];
    updatedEducations[index] = {
      ...updatedEducations[index],
      [field]: value,
    };
    onChange(updatedEducations);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              Education
            </h3>
            <p className="text-sm text-gray-500">Add your education details.</p>
          </div>
          <button
            onClick={addEducation}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
          >
            <Plus size={16} />
            Add Education
          </button>
        </div>

        {data?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No work education added yet.</p>
            <p className="text-sm">Click "Add Education" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((education, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg space-y-3"
              >
                <div className="flex justify-between items-start">
                  <h4>Education #{index + 1}</h4>
                  <button
                    onClick={() => removeEducation(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    value={education.institution || ""}
                    onChange={(e) =>
                      updateEducation(index, "institution", e.target.value)
                    }
                    type="text"
                    placeholder="Institution Name"
                    className="px-3 py-2 text-sm rounded-lg"
                  />

                  <input
                    value={education.degree || ""}
                    onChange={(e) =>
                      updateEducation(index, "degree", e.target.value)
                    }
                    type="text"
                    placeholder="Degree"
                    className="px-3 py-2 text-sm rounded-lg"
                  />

                  <input
                    value={education.field || ""}
                    onChange={(e) =>
                      updateEducation(index, "field", e.target.value)
                    }
                    type="text"
                    className="px-3 py-2 text-sm rounded-lg"
                    placeholder="Field of study"
                  />

                  <input
                    value={education.graduation_date || ""}
                    onChange={(e) =>
                      updateEducation(index, "graduation_date", e.target.value)
                    }
                    type="month"
                    className="px-3 py-2 text-sm"
                  />
                </div>

                <input
                  value={education.gpa || ""}
                  onChange={(e) =>
                    updateEducation(index, "gpa", e.target.value)
                  }
                  type="number"
                  className="px-3 py-2 text-sm rounded-lg"
                  placeholder="GPA (optional)"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default EducationForm;
