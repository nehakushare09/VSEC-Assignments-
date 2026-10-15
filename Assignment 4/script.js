const form = document.getElementById("employeeForm");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value.trim();
    const department = document.getElementById("department").value;

    // Get error message elements
    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const phoneError = document.getElementById("phoneError");
    const departmentError = document.getElementById("departmentError");
    const successMessage = document.getElementById("successMessage");

    // Clear previous messages
    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    phoneError.textContent = "";
    departmentError.textContent = "";
    successMessage.textContent = "";

    let isValid = true;

    // Validate name
    if (name.length < 3) {
        nameError.textContent = "Name must contain at least 3 characters.";
        isValid = false;
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        emailError.textContent = "Please enter a valid email address.";
        isValid = false;
    }

    // Validate password
    if (password.length < 8) {
        passwordError.textContent = "Password must contain at least 8 characters.";
        isValid = false;
    }

    // Validate phone number
    const phonePattern = /^[0-9]{10}$/;

    if (!phonePattern.test(phone)) {
        phoneError.textContent = "Enter a valid 10-digit phone number.";
        isValid = false;
    }

    // Validate department
    if (department === "") {
        departmentError.textContent = "Please select a department.";
        isValid = false;
    }

    // Display result
    if (isValid) {
        successMessage.textContent =
            "Employee registered successfully!";

        form.reset();
    }
});
