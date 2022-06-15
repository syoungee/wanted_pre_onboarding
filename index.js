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

  const sql_insert = `INSERT INTO job_opening (job_id, company_id, position, compensation, job_description, tech) VALUES
  (1, 1, '백엔드 주니어 개발자',  1000000, '원티드랩에서 백엔드 주니어 개발자를 채용합니다. 조건은..', 'Python'),
  (2, 2, '프론트엔드 주니어 개발자',  9000000, '원티드랩에서 프론트엔드 주니어 개발자를 채용합니다. 조건은..', 'JavaScript'),
  (3, 3, '데브옵스 시니어 개발자',  9000000, '원티드랩에서 데브옵스 시니어 개발자를 채용합니다. 조건은..', 'Docker');`;

  db.run(sql_insert, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Successful created 3 Job Descriptions!");
  });

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

// JOB OPENING PAGE
app.get("/jobs", (req, res) => {
  const sql = `
  SELECT *
  FROM job_opening, company
  WHERE job_opening.company_id = company.company_id`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("jobs", { model: rows });
  });
});

// EDIT JOB OPENING
app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM JOB_OPENING WHERE JOB_ID=?";
  db.get(sql, id, (err, row) => {
    if (err) {
      console.error(err.message);
    }
    res.render("edit", { model: row });
  });
});

app.post("/edit/:id", (req, res) => {
  const job_id = req.params.id;
  const jobs = [req.body.position, req.body.compensation, req.body.jd, req.body.tech, job_id];
  const sql = "UPDATE job_opening SET position=?, compensation=?, job_description=?, tech=? WHERE job_id=?";
  db.run(sql, jobs, (err) => {
    if (err) {
      console.error(err.message);
    }
    res.redirect("/jobs");
  });
});

// CREATE
app.get("/create", (req, res) => {
  res.render("create", { model: {} });
});

app.post("/create", (req, res) => {
  const jobs = [req.body.company_id, req.body.position, req.body.compensation, req.body.job_description, req.body.tech];
  const sql = "INSERT INTO job_opening (company_id, position, compensation, job_description, tech) VALUES (?, ?, ?, ?, ?)";
  db.run(sql, jobs, (err) => {
    if (err) {
      console.error(err.message);
    }
    res.redirect("/jobs");
  });
});


// DELETE 
app.get("/delete/:id", (req, res) => {
  const job_id = req.params.id;
  const sql = "SELECT * FROM job_opening WHERE job_id=?";
  db.get(sql, job_id, (err, row) => {
    if (err) {
      console.error(err.message);
    }
    res.render("delete", { model: row });
  });
});

app.post("/delete/:id", (req, res) => {
  const job_id = req.params.id;
  const sql = "DELETE FROM job_opening WHERE job_id=?";
  db.run(sql, job_id, (err) => {
    if (err) {
      console.error(err.message);
    }
    res.redirect("/jobs");
  });
});
