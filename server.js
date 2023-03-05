
const express = require('express')
const bodyParser = require("body-parser");
const fs = require("fs");
const _ = require('lodash')

const app = express();
app.use(express.json())

let Students = require("./students.json");


app.get("/students", (req, res) => {
  fs.readFile("./students.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }
    try {
      const students = JSON.parse(jsonString);
      res.json(students);
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
});

app.get("/students/:name", (req, res) => {
  const findStudent = Students.find((state) => state.nom === req.params.name);
  res.json(findStudent);
});

app.get("/students/min-max/:name", (req, res) => {
  const findStudent = Students.find((state) => state.nom === req.params.name);
  const min = _.minBy(findStudent?.modules, 'note').note;
  const max = _.maxBy(findStudent?.modules, 'note').note;
  res.json({
    status: "success",
    minMoy: min,
    maxMoy: max,
  });
});

app.get("/students/list/Moyenne", (req, res) => {
  let moy = []
  Students.map((m) => {
    console.log("sss", m)
    moy.push({ nom: m.nom, moyenne: m.moyenne })
  })

  res.json({
    status: "success",
    result: moy,
  });
});

app.post("/students", (req, res) => {

  var data = fs.readFileSync("students.json");
  var myObject = JSON.parse(data);

  let newData = req.body

  myObject.push(newData);

  var newData2 = JSON.stringify(myObject);
  fs.writeFile("students.json", newData2, (err) => {
    // Error checking
    if (err) throw err;
    res.json({
      status: "success",
      stateInfo: req.body,
    });
  });

})

app.put("/students/Module/:name", bodyParser.json(), (req, res) => {
  var data = fs.readFileSync("students.json");
  var myObject = JSON.parse(data);

  const findStudent = myObject.find((state) => state.nom === req.params.name);
  let module = req.body

  findStudent?.modules?.push(module);
  let Newmoyennee = 0

  findStudent?.modules.map((m) => {
    Newmoyennee = Newmoyennee + m.note
  })

  Newmoyennee = (Newmoyennee / findStudent?.modules.length).toFixed(2)

  upd_obj = myObject.findIndex((obj => obj.nom === req.params.name));
  myObject[upd_obj].moyenne = Newmoyennee

  var newData2 = JSON.stringify(myObject);
  fs.writeFile("students.json", newData2, (err) => {
    // Error checking
    if (err) throw err;
    res.json({
      status: "success",
      stateInfo: req.body,
    });
  });
});

app.delete("/students/:name", (req, res) => {
  var data = fs.readFileSync("students.json");
  var myObject = JSON.parse(data);

  const myObject2 = myObject.filter(state => state.nom !== req.params.name);
  console.log(myObject2)

  var newData2 = JSON.stringify(myObject2);
  console.log(newData2)

  fs.writeFile("students.json", newData2, (err) => {
    // Error checking
    if (err) throw err;
    res.json({
      status: "success",
      stateInfo: null,
    });
  });
});

app.listen(5000,
  console.log(`Server running in on port 5000 `)
);