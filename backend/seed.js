// backend/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Assignment from "./models/Assignment.js";
import User from "./models/User.js"; // ← YE ADD KIYA HAI

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    // Pehle admin/teacher ko dhundho ya banao
    let teacher = await User.findOne({ role: "teacher" });

    if (!teacher) {
      teacher = await User.create({
        name: "Default Teacher",
        email: "teacher@englishapp.com",
        password: await require("bcryptjs").hash("Teacher123", 10),
        role: "teacher",
        isActive: true
      });
      console.log("Default Teacher Created");
    }

    // Purane assignments delete karo
    await Assignment.deleteMany({});

    // Naye assignments daalo — ab teacher field bhi hai!
    await Assignment.insertMany([
      {
        title: "Grammar Basics",
        description: "This assignment will test your knowledge of basic grammar rules.",
        deadline: new Date("2025-12-20"),
        teacher: teacher._id,           // YE LINE ADD KI HAI
        description: "Write a detailed note on Noun."
      },
      {
        title: "Vocabulary Quiz",
        description: "A quiz to evaluate your vocabulary knowledge.",
        deadline: new Date("2025-12-25"),
        teacher: teacher._id,           // YE LINE ADD KI HAI
        description: "Write 10 sentences using new words."
      },
      {
        title: "Reading Comprehension",
        description: "Read the passage and answer the questions.",
        deadline: new Date("2025-12-30"),
        teacher: teacher._id,           // YE LINE ADD KI HAI
        description: "Read the story and write summary in your own words."
      }
    ]);

    console.log("Assignments Seeded Successfully");
    process.exit();
  })
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });