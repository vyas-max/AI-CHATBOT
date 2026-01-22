import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  console.log("user said:", message);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();
    console.log("openai response:", data);

    if (!data.choices) {
      return res.json({ reply: "openai error" });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.log("server error:", error);
    res.json({ reply: "Something went wrong!" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
