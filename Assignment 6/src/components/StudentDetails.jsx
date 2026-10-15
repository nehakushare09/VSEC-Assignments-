function StudentDetails({ students }) {
    return (
        <div className="student-details">
            <h2>Student Details</h2>

            {students.length === 0 ? (
                <p className="empty-message">
                    No students added yet.
                </p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Roll No.</th>
                                <th>Name</th>
                                <th>Course</th>
                                <th>Email</th>
                            </tr>
                        </thead>

                        <tbody>
                            {students.map((student, index) => (
                                <tr key={index}>
                                    <td>{student.rollNo}</td>
                                    <td>{student.name}</td>
                                    <td>{student.course}</td>
                                    <td>{student.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default StudentDetails;
