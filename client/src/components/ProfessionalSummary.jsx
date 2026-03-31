import { Sparkles } from "lucide-react";
import React from "react";

const ProfessionalSummary = ({ data, onChange, setResumeData }) => {
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              Professional Summary
            </h3>
            <p className="text-sm text-gray-500">
              Briefly summarize your professional background.
            </p>
          </div>
          <button className="flex items-center gap-1 text-sm text-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 ring-purple-300 hover:ring transition-all px-3 py-2 rounded-lg whitespace-nowrap">
            <Sparkles size={16} />
            <span>AI Enhance</span>
          </button>
        </div>
        <div className="mt-6">
          <textarea
            name=""
            id=""
            value={data || ""}
            onChange={(e) => onChange(e.target.value)}
            rows={7}
            className="w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
            placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
          />
          <p className="text-xs text-gray-500 max-w-4/5 mx-auto text-center">
            Tip: Keep it concise and focused on your most relevant skills and
            experiences.
          </p>
        </div>
      </div>
    </>
  );
};

export default ProfessionalSummary;
