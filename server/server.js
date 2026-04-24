require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Resume = require("./models/Resume");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("./middleware/auth")
const multer = require("multer");
const path = require("path");
const { GoogleGenerativeAI} = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
app.post("/api/ai/enhance", auth, async (req, res) => {
  const { text, type } = req.body; // type could be "summary" or "experience"
  if (!text) return res.status(400).json({ error: "No text provided" });
  try {
    const prompt = `You are a professional resume writer. Enhance the following ${type} to be more professional, impactful, and concise. Use active verbs and industry standard keywords. Return ONLY the enhanced text, no conversational filler.
    
    Text to enhance: ${text}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const enhancedText = response.text();
    res.json({ enhancedText });
  } catch (error) {
    console.error("AI Error:", error.message);
    
    // Fallback Mock Response if API limits are reached
    const mockResponse = type === "summary" 
      ? "Results-driven professional with a proven track record of delivering high-quality solutions. Adept at leveraging analytical skills to optimize processes and exceed organizational goals."
      : "Spearheaded key initiatives that resulted in a 20% increase in operational efficiency. Collaborated with cross-functional teams to deliver projects ahead of schedule.";

    res.json({ 
      enhancedText: mockResponse, 
      note: "This is a fallback message because the AI API limit was reached." 
    });
  }
});



mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Successfully connected to mongodb"))
  .catch((error) => console.error("Mongodb connection error: ", error));

app.get("/", (req, res) => {
  res.send("Backend is working");
});

const PORT = 5000;
app.post("/api/auth/register", async (req, res) => {
  try {
    const {name, email, password} = req.body;
    
    let user = await User.findOne({email});
    if(user){
      return res.status(400).json({error: "User already exists"})
    }

    user = new User({name, email, password})
    await user.save()

    res.status(201).json({message: "User registered successfully"})
  } catch (error) {
     res.status(500).json({ error: error.message });
  }
})


// 1. Tell Express to make the 'uploads' folder public
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 2. Configure where and how to save images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename it to avoid duplicates
  },
});

const upload = multer({ storage });


app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "24h" }
    );

    res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post("/api/resumes", auth, async (req, res) => {
  try {
    const newResume = new Resume({...req.body, userId: req.user});
    const savedResume = await newResume.save();
    res.status(201).json(savedResume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/resumes", auth, async (req, res) => {
  try{
    const allResumes = await Resume.find({userId: req.user});

    res.status(200).json(allResumes);
  }catch(error){
    res.status(500).json({error: error.message })

  }
})


app.get('/api/resumes/:id', async (req, res) => {
  try{
    const resumeId = req.params.id;
    const singleResume = await Resume.findById(resumeId);

    if(!singleResume){
      return res.status(404).json({error: "Resume not found"})
    }

    if (singleResume.public) {
      return res.status(200).json(singleResume);
    }

    const authHeader = req.header("Authorization");
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({ error: "Access denied. Resume is private."})
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.userId !== singleResume.userId.toString()) {
           return res.status(403).json({ error: "Not authorized to view this resume."})
        }
    } catch (err) {
        return res.status(401).json({ error: "Invalid token."})
    }

    res.status(200).json(singleResume);

  }catch(error){
    res.status(500).json({error: error.message});
  }
})

app.delete("/api/resumes/:id", auth, async (req, res) => {
  try{
    const resumeId = req.params.id;
    const singleResume = await Resume.findOneAndDelete({_id: resumeId, userId: req.user});

    if(!singleResume){
      return res.status(404).json({error: "Resume not found"});
    }
    res.status(200).json(singleResume);
  }catch(error){
     res.status(500).json({error: "Resume not found"});
  }
})

app.put("/api/resumes/:id", auth, async (req, res)=>{
  try{
    const resumeId = req.params.id;
    const singleResume = await Resume.findOneAndUpdate({_id: resumeId, userId: req.user}, req.body, {new: true});

    if(!singleResume){
      return res.status(404).json({error: "Resume not found"});
    }
    res.status(200).json(singleResume);

  }catch(error){
    res.status(500).json({error: "Resume not found"});
  }
})

app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  // Return the URL of the uploaded image
  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});


app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
