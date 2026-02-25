let students = [];
let editingIndex = -1;
let currentMarkIndex = -1;

document.getElementById("studentForm").addEventListener("submit", function(e) {
    e.preventDefault();
    let id = document.getElementById("id").value.trim();
    let name = document.getElementById("name").value.trim();
    let age = document.getElementById("age").value.trim();
    let gender = document.getElementById("gender").value;
    let form = document.getElementById("form").value;

    // VALIDATION
    if (!id || !name || !age || !gender || !form) {
        alert("All fields required");
        return;
    }
    // UNIQUE ID CHECK
    let exists = students.find(s => s.id === id);
    if (exists) {
        alert("ID already exists");
        return;
    }

    let student = {
        id: id,
        name: name,
        age: parseInt(age, 10),
        gender: gender,
        form: parseInt(form, 10),
        marks: {}
    };

    students.push(student);
    displaystudents();
    this.reset();
});

//STUDENT LIST DISPLAY
function displaystudents() {
    let table = document.getElementById("studentTable");
    table.innerHTML = "";
    students.forEach((s, index) => {
        let marksDisplay = formatMarksDisplay(s);
        let avg = calculateAverage(s);
        table.innerHTML += `
        <tr>
            <td>${s.id}</td>
            <td>${s.name}</td>
            <td>${s.form}</td>
            <td>${marksDisplay}</td>
            <td>${avg}</td>
            <td>
                <button onclick="openMarksForm(${index})">Add Marks</button>
                <button onclick="promotestudent(${index})">Promote</button>
                <button onclick="editStudent(${index})">Edit</button>
                <button onclick="deletestudent(${index})">Delete</button>
            </td>
        </tr>
        `;
    });
}

function formatMarksDisplay(s) {
    if (!s.marks || Object.keys(s.marks).length === 0) {
        return "No marks";
    }
    let marksArr = Object.entries(s.marks).map(([subject, mark]) => `${subject}: ${mark}`);
    return marksArr.join(" | ");
}

function editStudent(index) {
    const s = students[index];
    document.getElementById("id").value = s.id;
    document.getElementById("name").value = s.name;
    document.getElementById("age").value = s.age;
    document.getElementById("gender").value = s.gender;
    document.getElementById("form").value = s.form;
    editingIndex = index;
    window.scrollTo(0, 0);
}

function deletestudent(index) {
    if (!confirm('Delete this student?')) return;
    students.splice(index, 1);
    displaystudents();
}

function openMarksForm(index) {
    currentMarkIndex = index;
    document.getElementById("marksStudentName").textContent = students[index].name;
    document.getElementById("subject").value = "";
    document.getElementById("marks").value = "";
    document.getElementById("marksForm").style.display = "block";
    window.scrollTo(0, 0);
}

function saveMarks() {
    const subject = document.getElementById("subject").value.trim();
    const marks = document.getElementById("marks").value.trim();
    
    if (!subject || marks === "") {
        alert("Please select subject and enter marks");
        return;
    }
    
    const markValue = parseFloat(marks);
    if (isNaN(markValue) || markValue < 0 || markValue > 100) {
        alert("Marks must be between 0 and 100");
        return;
    }
    
    students[currentMarkIndex].marks[subject] = markValue;
    cancelMarks();
    displaystudents();
}

function cancelMarks() {
    document.getElementById("marksForm").style.display = "none";
    currentMarkIndex = -1;
}

function promotestudent(index) {
    const s = students[index];
    if (s.form >= 4) {
        alert('Student already in highest form');
        return;
    }
    s.form = s.form + 1;
    displaystudents();
}

function addperformance(index) {
    const input = prompt('Enter comma-separated marks (e.g. 80,90,75)');
    if (!input) return;
    const marks = input.split(',').map(v => parseFloat(v.trim())).filter(n => !isNaN(n));
    if (marks.length === 0) return;
    students[index].performance = students[index].performance.concat(marks);
    displaystudents();
}

function calculateAverage(s) {
    if (!s.marks || Object.keys(s.marks).length === 0) return 0;
    const markValues = Object.values(s.marks);
    const sum = markValues.reduce((a, b) => a + b, 0);
    return (sum / markValues.length).toFixed(2);
}