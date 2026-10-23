var skills = ["Python", "SQL", "Java", "HTML", "CSS", "Machine Learning", "Git", "Communication"];

// STUDENT table (each student has a list of skill names)
var students = [
  { id: 1, name: "Rahul Sharma", email: "rahul@gmail.com", phone: "9876543210", cgpa: 8.5, skills: ["Python", "SQL", "Git"] },
  { id: 2, name: "Priya Patel",  email: "priya@gmail.com", phone: "9876543211", cgpa: 9.1, skills: ["Python", "Machine Learning", "SQL"] },
  { id: 3, name: "Amit Jain",    email: "amit@gmail.com",  phone: "9876543212", cgpa: 7.8, skills: ["Java", "HTML", "CSS"] }
];

// COMPANY table
var companies = [
  { id: 1, name: "Tech Solutions", status: "Verified" },
  { id: 2, name: "DataWorks",      status: "Pending" }
];

// JOB table
var jobs = [
  { title: "Python Developer Intern", companyId: 1, minCgpa: 7.5, skills: ["Python", "SQL"], deadline: "2030-12-31" }
];


// ---------------- SHOW / HIDE SECTIONS ----------------

function showSection(name) {
  document.getElementById("student").classList.add("hidden");
  document.getElementById("employer").classList.add("hidden");
  document.getElementById("post").classList.add("hidden");

  document.getElementById(name).classList.remove("hidden");

  if (name == "employer") {
    showStudents();
    showJobs();
  }
}


// ---------------- CREATE CHECKBOXES AND DROPDOWN ----------------

function setupForms() {
  var studentBox = document.getElementById("studentSkills");
  var jobBox = document.getElementById("jobSkills");

  for (var i = 0; i < skills.length; i++) {
    var html = '<input type="checkbox" value="' + skills[i] + '"> ' + skills[i] + '<br>';
    studentBox.innerHTML += html;
    jobBox.innerHTML += html;
  }

  var dropdown = document.getElementById("jCompany");
  for (var j = 0; j < companies.length; j++) {
    dropdown.innerHTML += '<option value="' + companies[j].id + '">' +
      companies[j].name + ' (' + companies[j].status + ')</option>';
  }
}

// Returns the names of all ticked checkboxes inside a box
function getTickedSkills(boxId) {
  var ticked = [];
  var boxes = document.getElementById(boxId).getElementsByTagName("input");
  for (var i = 0; i < boxes.length; i++) {
    if (boxes[i].checked) {
      ticked.push(boxes[i].value);
    }
  }
  return ticked;
}


// ---------------- STUDENT: ADD PROFILE ----------------

function addStudent() {
  var name = document.getElementById("sName").value;
  var email = document.getElementById("sEmail").value;
  var phone = document.getElementById("sPhone").value;
  var cgpa = Number(document.getElementById("sCgpa").value);
  var msg = document.getElementById("studentMsg");

  if (name == "" || email == "" || phone == "") {
    msg.className = "bad";
    msg.innerHTML = "Please fill all fields.";
    return;
  }

  if (cgpa < 0 || cgpa > 10) {
    msg.className = "bad";
    msg.innerHTML = "CGPA must be between 0 and 10.";
    return;
  }

  // email must be unique (like UNIQUE in SQL)
  for (var i = 0; i < students.length; i++) {
    if (students[i].email == email) {
      msg.className = "bad";
      msg.innerHTML = "This email is already registered.";
      return;
    }
  }

  var newStudent = {
    id: students.length + 1,
    name: name,
    email: email,
    phone: phone,
    cgpa: cgpa,
    skills: getTickedSkills("studentSkills")
  };

  students.push(newStudent);   // this is the INSERT

  msg.className = "good";
  msg.innerHTML = "Profile created! Your Student ID is " + newStudent.id;
}


// ---------------- EMPLOYER: POST JOB ----------------

function addJob() {
  var companyId = Number(document.getElementById("jCompany").value);
  var title = document.getElementById("jTitle").value;
  var minCgpa = Number(document.getElementById("jCgpa").value);
  var deadline = document.getElementById("jDeadline").value;
  var msg = document.getElementById("jobMsg");

  // find the chosen company
  var company;
  for (var i = 0; i < companies.length; i++) {
    if (companies[i].id == companyId) {
      company = companies[i];
    }
  }

  // same rule as the SQL trigger
  if (company.status != "Verified") {
    msg.className = "bad";
    msg.innerHTML = "Cannot post job. Company is not verified.";
    return;
  }

  if (title == "" || deadline == "") {
    msg.className = "bad";
    msg.innerHTML = "Please enter job title and deadline.";
    return;
  }

  var newJob = {
    title: title,
    companyId: companyId,
    minCgpa: minCgpa,
    skills: getTickedSkills("jobSkills"),
    deadline: deadline
  };

  jobs.push(newJob);   // this is the INSERT

  msg.className = "good";
  msg.innerHTML = "Job posted successfully!";
}


// ---------------- EMPLOYER: SHOW TABLES ----------------

function showStudents() {
  var rows = "";
  for (var i = 0; i < students.length; i++) {
    var s = students[i];
    rows += "<tr>" +
      "<td>" + s.id + "</td>" +
      "<td>" + s.name + "</td>" +
      "<td>" + s.email + "</td>" +
      "<td>" + s.phone + "</td>" +
      "<td>" + s.cgpa + "</td>" +
      "<td>" + s.skills.join(", ") + "</td>" +
      "</tr>";
  }
  document.getElementById("studentTable").innerHTML = rows;
}

function showJobs() {
  var rows = "";
  for (var i = 0; i < jobs.length; i++) {
    var j = jobs[i];

    // company name
    var companyName = "";
    for (var c = 0; c < companies.length; c++) {
      if (companies[c].id == j.companyId) {
        companyName = companies[c].name;
      }
    }

    // count students who have enough CGPA and ALL needed skills
    var eligible = 0;
    for (var k = 0; k < students.length; k++) {
      var hasAll = true;
      for (var m = 0; m < j.skills.length; m++) {
        if (students[k].skills.indexOf(j.skills[m]) == -1) {
          hasAll = false;
        }
      }
      if (students[k].cgpa >= j.minCgpa && hasAll) {
        eligible++;
      }
    }

    rows += "<tr>" +
      "<td>" + j.title + "</td>" +
      "<td>" + companyName + "</td>" +
      "<td>" + j.minCgpa + "</td>" +
      "<td>" + j.skills.join(", ") + "</td>" +
      "<td>" + j.deadline + "</td>" +
      "<td>" + eligible + "</td>" +
      "</tr>";
  }
  document.getElementById("jobTable").innerHTML = rows;
}


// ---------------- START ----------------
setupForms();