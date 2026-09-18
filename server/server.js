import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "ApiLens API Inspector Server Running",
  });
});

app.post("/api/request", async (req, res) => {
  try {
    const { method, url, headers, body } = req.body;

    const startTime = Date.now();

    const response = await axios({
      method,
      url,
      headers: headers || {},
      data: body || undefined,
      validateStatus: () => true,
    });

    const responseTime = Date.now() - startTime;

    res.json({
      status: response.status,
      statusText: response.statusText,
      responseTime,
      headers: response.headers,
      data: response.data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Request failed",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ApiLens server running on port ${PORT}`);
});
