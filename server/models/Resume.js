const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: {
     type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  public: {
    type: Boolean,
    default: false,
  },
  template: {
    type: String,
    default: "classic",
  },
  accent_color: {
    type: String,
    default: "#3B82F6",
  },
  personal_info: {
    full_name: String,
    profession: String,
    email: String,
    phone: String,
    location: String,
    website: String,
    linkedin: String,
    image: String,
  },
  professional_summary: String,

  experiences: [
    {
      company: String,
      position: String,
      start_date: String,
      end_date: String,
      description: String,
      is_current: Boolean,
    },
  ],
  education: [
    {
      institution: String,
      degree: String,
      field: String,
      graduation_date: String,
      gpa: String,
    },
  ],
  projects: [
    {
      name: String,
      type: String,
      description: String,
    },
  ],
  skills: [String]
}, {timestamps: true});

const Resume = mongoose.model("Resume", resumeSchema);

module.exports= Resume;
