import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
  //res.json({ message: "its working i guess" });
  //res.json("its working i guess");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`The Server is running on http://localhost:${PORT}`);
});
