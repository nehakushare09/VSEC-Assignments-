import { useState } from "react";
import StudentForm from "./components/StudentForm";
import StudentDetails from "./components/StudentDetails";
import "./App.css";

function App() {
    const [students, setStudents] = useState([]);

    function addStudent(student) {
        const alreadyExists = students.some(
            (item) => item.rollNo === student.rollNo
        );

        if (alreadyExists) {
            alert("This roll number already exists!");
            return;
        }

        setStudents((previousStudents) => [
            ...previousStudents,
            student
        ]);
    }

    return (
        <div className="app">
            <header>
                <h1>Student Information System</h1>
                <p>Manage student information easily</p>
            </header>

            <main>
                <StudentForm onAddStudent={addStudent} />
                <StudentDetails students={students} />
            </main>

            <footer>
                <p>Student Information System | React Application</p>
            </footer>
        </div>
    );
}

export default App;
