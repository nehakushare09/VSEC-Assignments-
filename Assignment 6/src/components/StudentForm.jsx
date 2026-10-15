import { useState } from "react";

function StudentForm({ onAddStudent }) {
    const [name, setName] = useState("");
    const [rollNo, setRollNo] = useState("");
    const [course, setCourse] = useState("");
    const [email, setEmail] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        if (!name.trim() || !rollNo.trim() || !course.trim() || !email.trim()) {
            alert("Please fill in all fields.");
            return;
        }

        onAddStudent({
            name: name.trim(),
            rollNo: rollNo.trim(),
            course: course.trim(),
            email: email.trim()
        });

        setName("");
        setRollNo("");
        setCourse("");
        setEmail("");
    }

    return (
        <form onSubmit={handleSubmit} className="student-form">
            <h2>Add Student</h2>

            <label>Student Name</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter student name"
                required
            />

            <label>Roll Number</label>
            <input
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="Enter roll number"
                required
            />

            <label>Course</label>
            <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="Enter course"
                required
            />

            <label>Email</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                required
            />

            <button type="submit">Add Student</button>
        </form>
    );
}

export default StudentForm;
