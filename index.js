const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const randomNum = uuid.v4();

const PORT = process.env.PORT || 3000;


function generateRandomNumber() {
    const newNoteId = randomNum.slice(0,4);
  
    return newNoteId;
  }

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});


app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, notesData) => {
    if (err) {
      return res.status(500).json({ msg: "error reading db" });
    } else {
      const dataArr = JSON.parse(notesData);
      return res.json(dataArr);
    }
  });
});


app.post("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ msg: "error reading db" });
    } else {
      const dataArr = JSON.parse(data);
      const newNote = {
        id: generateRandomNumber(),
        title: req.body.title,
        text: req.body.text,
      };
      console.log(newNote);
      dataArr.push(newNote);
      fs.writeFile("./db/db.json", JSON.stringify(dataArr, null, 4), (err) => {
        if (err) {
          return res.status(500).json({ msg: "error writing db" });
        } else {
          return res.json(newNote);
        }
      });
    }
  });
});



app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));