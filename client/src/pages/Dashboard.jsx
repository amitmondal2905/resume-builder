import {
  FilePenIcon,
  Pencil,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloud,
  UploadCloudIcon,
  X,
  XIcon,
} from "lucide-react";
import React, { useEffect } from "react";
// import { dummyResumeData } from "../assets/assets";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"];

  const [allResumes, setAllResumes] = React.useState([]);
  const [showCreateResume, setShowCreateResume] = React.useState(false);
  const [showUploadResume, setShowUploadResume] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [resume, setResume] = React.useState(null);
  const [editResumeId, setEditResumeId] = React.useState("");

  const navigate = useNavigate();

  const loadAllResumes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/resumes");
      const data = await response.json();

      setAllResumes(data);
    } catch (error) {
      console.error("Failed to load resumes from the backend", error);
    }
  };
  const createResume = async (e) => {
    e.preventDefault();
    setShowCreateResume(false);
    navigate("/app/builder/res123");
  };

  const uploadResume = async (e) => {
    e.preventDefault();
    setShowUploadResume(false);
    navigate("/app/builder/res123");
  };

  const editTitle = async (e) => {
    e.preventDefault();
    if (editResumeId) {
      setAllResumes((prev) =>
        prev.map((r) => (r._id === editResumeId ? { ...r, title } : r)),
      );
      setEditResumeId("");
      setTitle("");
    }
  };

  const deleteResume = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this resume?",
    );
    if (confirm) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/resumes/${id}`,
          { method: "DELETE" },
        );
        if(response.ok){
           setAllResumes((prev) => prev.filter((r) => r._id !== id));
        }
       
      } catch (error) {
        console.error("Error message: ", error.message);
      }
    }
  };

  useEffect(() => {
    loadAllResumes();
  }, []);
  return (
    <>
      <div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
            Welcome, Amit Mondal
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setShowCreateResume(true)}
              className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-r from-indigo-300 to-indigo-500 text-white rounded-full" />
              <p className="text-sm group-hover:text-indigo-600 transition-all duration-300">
                Create Resume
              </p>
            </button>
            <button
              onClick={() => setShowUploadResume(true)}
              className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <UploadCloud className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-r from-purple-300 to-purple-500 text-white rounded-full" />
              <p className="text-sm group-hover:text-purple-600 transition-all duration-300">
                Upload Existing
              </p>
            </button>
          </div>
          <hr className="border-slate-300 my-6 sm:w-[305px]" />
          <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
            {allResumes.map((resume, index) => {
              const baseColor = colors[index % colors.length];
              return (
                <button
                  key={index}
                  onClick={() => navigate(`/app/builder/${resume._id}`)}
                  className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, rgba(147,51,234,0.05) 0%, transparent 100%)`,
                    borderColor: "#9333ea40",
                  }}
                >
                  <FilePenIcon
                    className="size-7 group-hover:scale-105 transition-all"
                    style={{ color: baseColor }}
                  />
                  <p
                    className="text-sm group-hover:scale-105 transition-all px-2 text-center"
                    style={{ color: baseColor }}
                  >
                    {resume.title}
                  </p>
                  <p
                    className="absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center"
                    style={{ color: baseColor + "90" }}
                  >
                    Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-1 right-1 group-hover:flex items-center hidden"
                  >
                    <TrashIcon
                      onClick={() => deleteResume(resume._id)}
                      className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                    />
                    <PencilIcon
                      onClick={() => {
                        setEditResumeId(resume._id);
                        setTitle(resume.title);
                      }}
                      className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                    />
                  </div>
                </button>
              );
            })}
          </div>
          <div>
            {showCreateResume && (
              <form
                onSubmit={createResume}
                onClick={() => setShowCreateResume(false)}
                className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
                >
                  <h2 className="text-xl font-bold mb-4">Create a Resume</h2>
                  <input
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    type="text"
                    placeholder="Enter resume title"
                    className="w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600"
                    required
                  />
                  <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                    Create Resume
                  </button>
                  <XIcon
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                    onClick={() => {
                      setShowCreateResume(false);
                      setTitle("");
                    }}
                  />
                </div>
              </form>
            )}

            {showUploadResume && (
              <form
                onSubmit={uploadResume}
                onClick={() => setShowUploadResume(false)}
                className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
                >
                  <h2 className="text-xl font-bold mb-4">Upload Resume</h2>
                  <input
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    type="text"
                    placeholder="Enter resume title"
                    className="w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600"
                    required
                  />
                  <div>
                    <label
                      htmlFor="resume-input"
                      className="block text-sm text-slate-700"
                    >
                      Select Resume File
                      <div className="flex flex-col items-center justify-center gap-2 border group text-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-500 hover:text-green-700 cursor-pointer transition-colors">
                        {resume ? (
                          <p className="text-green-700">{resume.name}</p>
                        ) : (
                          <>
                            <UploadCloudIcon className="size-14 stroke-1" />
                            <p>Upload resume</p>
                          </>
                        )}
                      </div>
                    </label>
                    <input
                      type="file"
                      id="resume-input"
                      accept=".pdf,.doc,.docx"
                      hidden
                      onChange={(e) => setResume(e.target.files[0])}
                    />
                  </div>
                  <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                    Upload Resume
                  </button>
                  <XIcon
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                    onClick={() => {
                      setShowUploadResume(false);
                      setTitle("");
                    }}
                  />
                </div>
              </form>
            )}

            {editResumeId && (
              <form
                onSubmit={editTitle}
                onClick={() => setEditResumeId("")}
                className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
                >
                  <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>
                  <input
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    type="text"
                    placeholder="Enter resume title"
                    className="w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600"
                    required
                  />
                  <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                    Update
                  </button>
                  <XIcon
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                    onClick={() => {
                      setEditResumeId("");
                      setTitle("");
                    }}
                  />
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
