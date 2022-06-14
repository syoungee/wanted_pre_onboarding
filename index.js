const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const db_name = path.join(__dirname, "data", "recruitment.db");
const db = new sqlite3.Database(db_name, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful connected to recruitment DB'");
});

const sql_create = `CREATE TABLE IF NOT EXISTS job_opening (
  company_id INTEGER PRIMARY KEY AUTOINCREMENT,
  recruitment_position TEXT,
  compensation INTEGER NOT NULL,
  tech TEXT
);`;

db.run(sql_create, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful created job_opening table!");
});

/*
  const sql_insert = `INSERT INTO job_opening (job_id, company_id, position, compensation, job_description, tech) VALUES
  (1, 1, '백엔드 주니어 개발자',  1000000, '원티드랩에서 백엔드 주니어 개발자를 채용합니다. 조건은..', 'Python'),
  (2, 1, '프론트엔드 주니어 개발자',  9000000, '원티드랩에서 프론트엔드 주니어 개발자를 채용합니다. 조건은..', 'JavaScript');`;

  db.run(sql_insert, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Successful created 2 Job Descriptions!");
  }); 
*/

var app = express(); // Express server의 시작
var port = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false })); // middleware configuration

app.listen(port, function () {
  console.log("Server started (http://localhost:8080/) !");
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/jobs", (req, res) => {
  const sql = "SELECT * FROM job_opening ORDER BY company_id";

  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("jobs", { model: rows });
  });
});
