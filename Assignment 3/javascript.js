const resultForm = document.getElementById("resultForm");
const studentTableBody = document.getElementById("studentTableBody");
const topperDetails = document.getElementById("topperDetails");

// Store student records
let students = [];

// Handle form submission
resultForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Read student details
    const name = document.getElementById("studentName").value.trim();
    const rollNumber = document.getElementById("rollNumber").value.trim();

    const maths = Number(document.getElementById("maths").value);
    const science = Number(document.getElementById("science").value);
    const english = Number(document.getElementById("english").value);

    // Validate name and roll number
    if (name === "" || rollNumber === "") {
        alert("Please enter the student name and roll number.");
        return;
    }

    // Prevent duplicate roll numbers
    const duplicate = students.some(function (student) {
        return student.rollNumber.toLowerCase() === rollNumber.toLowerCase();
    });

    if (duplicate) {
        alert("This roll number already exists. Please enter a unique roll number.");
        return;
    }

    // Validate marks
    const marks = [maths, science, english];

    const invalidMarks = marks.some(function (mark) {
        return !Number.isFinite(mark) || mark < 0 || mark > 100;
    });

    if (invalidMarks) {
        alert("Each subject mark must be between 0 and 100.");
        return;
    }

    // Calculate total and percentage
    const total = maths + science + english;
    const percentage = (total / 300) * 100;

    // Create a student record
    const student = {
        name: name,
        rollNumber: rollNumber,
        maths: maths,
        science: science,
        english: english,
        total: total,
        percentage: percentage
    };

    // Save the record in the array
    students.push(student);

    // Update the table and topper
    displayStudents();
    displayTopper();

    // Clear the form
    resultForm.reset();
});

// Display all student records
function displayStudents() {
    studentTableBody.innerHTML = "";

    students.forEach(function (student) {
        const row = document.createElement("tr");

        const values = [
            student.rollNumber,
            student.name,
            student.maths,
            student.science,
            student.english,
            student.total,
            student.percentage.toFixed(2) + "%"
        ];

        values.forEach(function (value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        studentTableBody.appendChild(row);
    });
}

// Find and display the topper
function displayTopper() {
    if (students.length === 0) {
        topperDetails.textContent = "No student records available yet.";
        return;
    }

    const topper = students.reduce(function (highest, student) {
        return student.total > highest.total ? student : highest;
    });

    topperDetails.textContent =
        topper.name +
        " (Roll No. " + topper.rollNumber + ")" +
        " — Total: " + topper.total + "/300" +
        ", Percentage: " + topper.percentage.toFixed(2) + "%";
}