const express = require("express");
require("dotenv").config();
const fs = require("fs");

const app = express();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/video", (req, res) => {
  const range = req.headers.range;
  if (!range) {
    res.status(406).send("Requires Range Header");
  }
  const videoPath = "Chris-Do.mp4";
  const videoSize = fs.statSync("Chris-Do.mp4").size;

  const CHUNK_SIZE = 10 ** 6; // 1Mb
  const start = Number(range.replace(/\D/g, "")); // regex for remove every occurence that is not a number
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };
  res.writeHead(206, headers);
  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
});

const PORT = process.env.PORT || 5001;

app.listen(5000, () => {
  console.log(`Server is running in ${process.env.MODE} on PORT ${PORT}`);
});
