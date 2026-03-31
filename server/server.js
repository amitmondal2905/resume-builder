require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Resume = require("./models/Resume");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Successfully connected to mongodb"))
  .catch((error) => console.error("Mongodb connection error: ", error));

app.get("/", (req, res) => {
  res.send("Backend is working");
});

const PORT = 5000;

app.post("/api/resumes", async (req, res) => {
  try {
    const newResume = new Resume(req.body);
    const savedResume = await newResume.save();
    res.status(201).json(savedResume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/resumes", async (req, res) => {
  try{
    const allResumes = await Resume.find({});

    res.status(200).json(allResumes);
  }catch(error){
    console.error("Error fetching", error);
    res.status(500).json({error: error.message })

  }
})


app.get('/api/resumes/:id', async (req, res) => {
  try{
    const resumeId = req.params.id;
    const singleResume = await Resume.findById(resumeId)

    if(!singleResume){
      return res.status(404).json({error: "Resume not found"})
    }
    res.status(200).json(singleResume);

  }catch(error){
    res.status(500).json({error: error.message});
  }
})

app.delete("/api/resumes/:id", async (req, res) => {
  try{
    const resumeId = req.params.id;
    const singleResume = await Resume.findByIdAndDelete(resumeId);

    if(!singleResume){
      return res.status(404).json({error: "Resume not found"});
    }
    res.status(200).json(singleResume);
  }catch(error){
     res.status(500).json({error: "Resume not found"});
  }
})

app.put("/api/resumes/:id", async (req, res)=>{
  try{
    const resumeId = req.params.id;
    const singleResume = await Resume.findByIdAndUpdate(resumeId, req.body, {new: true});

    if(!singleResume){
      return res.status(404).json({error: "Resume not found"});
    }
    res.status(200).json(singleResume);

  }catch(error){
    res.status(500).json({error: "Resume not found"});
  }
})

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
