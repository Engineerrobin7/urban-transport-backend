// Global variable to track the selected role
let selectedRole = "";

// Function to show the appropriate form based on the selected role
function showForm(role) {
    selectedRole = role;
    document.getElementById("role-buttons").style.display = "none";
    hideAllForms();

    let formToShow = document.getElementById(`${role}-form`);
    if (formToShow) {
        formToShow.classList.remove("hidden");
    } else {
        console.error(`Error: Form not found for role ${role}-form`);
    }
}

// Function to hide all forms
function hideAllForms() {
    let formIds = ["passenger-form", "passenger-signup-form", "driver-form", "driver-signup-form"];
    formIds.forEach(id => {
        let element = document.getElementById(id);
        if (element) {
            element.classList.add("hidden");
        }
    });
}

// Function to toggle between login and signup forms
function toggleAuthForm() {
    if (!selectedRole) {
        alert("Please select Passenger or Driver first!");
        return;
    }

    let loginForm = document.getElementById(`${selectedRole}-form`);
    let signupForm = document.getElementById(`${selectedRole}-signup-form`);

    if (loginForm && signupForm) {
        if (!loginForm.classList.contains("hidden")) {
            loginForm.classList.add("hidden");
            signupForm.classList.remove("hidden");
        } else {
            loginForm.classList.remove("hidden");
            signupForm.classList.add("hidden");
        }
    } else {
        console.error(`Error: Form not found for role ${selectedRole}-form`);
    }
}

// Function to toggle password visibility
function togglePasswordVisibility(inputId) {
    const passwordInput = document.getElementById(inputId);
    if (passwordInput) {
        passwordInput.type = passwordInput.type === "password" ? "text" : "password";
    }
}

// Function to validate email format
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+$/.test(email);
}

// Function to validate phone number (10 digits)
function isValidPhone(phone) {
    return /^[0-9]{10}$/.test(phone);
}

// Function to validate password (at least 6 characters)
function isValidPassword(password) {
    return password.length >= 6;
}

// Function to handle signup for both passenger and driver (API CALL)
async function handleSignup(event, role) {
    event.preventDefault();

    let fullname = document.getElementById(`${role}-signup-fullname`).value.trim();
    let username = document.getElementById(`${role}-signup-username`).value.trim();
    let email = document.getElementById(`${role}-signup-email`).value.trim();
    let phone = document.getElementById(`${role}-signup-phone`).value.trim();
    let password = document.getElementById(`${role}-new-password`).value.trim();

    if (!fullname || !username || !email || !phone || !password) {
        alert("All fields are required!");
        return;
    }

    if (!isValidEmail(email)) {
        alert("Invalid email format!");
        return;
    }

    if (!isValidPhone(phone)) {
        alert("Phone number must be 10 digits!");
        return;
    }

    if (!isValidPassword(password)) {
        alert("Password must be at least 6 characters long!");
        return;
    }

    let userData = { fullname, username, email, phone, password, role };

    try {
        let response = await fetch("http://localhost:5000/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        let data = await response.json();
        if (response.ok) {
            alert(`Signup successful! ${data.message}`);
            window.location.href = role === "driver" ? "driver-dashboard.html" : "dashboard.html";
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("Signup error:", error);
    }
}

// Function to handle login for both passenger and driver (API CALL)
async function handleLogin(event, role) {
    event.preventDefault();

    let username = document.getElementById(`${role}-username`).value.trim();
    let password = document.getElementById(`${role}-password`).value.trim();
    let driverId = role === "driver" ? document.getElementById("driver-id")?.value.trim() : null;

    if (!username || !password || (role === "driver" && !driverId)) {
        alert("Driver ID, Username, and Password are required!");
        return;
    }

    let loginData = { username, password, role };
    if (role === "driver") loginData.driverId = driverId;

    try {
        let response = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData)
        });

        let data = await response.json();
        if (response.ok) {
            alert(`Login successful! Welcome back, ${data.fullname}`);
            window.location.href = role === "passenger" ? "dashboard.html" : "driver-dashboard.html";
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("Login error:", error);
    }
}

// Function to fetch buses from the backend (API CALL)
async function fetchBuses(fromLocation, toLocation) {
    try {
        let url = "http://localhost:5000/api/buses";
        if (fromLocation && toLocation) {
            url += `?from=${fromLocation}&to=${toLocation}`;
        }
        let response = await fetch(url);
        let data = await response.json();

        console.log("Bus Data:", data);

        let busList = document.getElementById("availableBuses");
        busList.innerHTML = ""; // Clear old data

        if (data && data.length > 0) {
            data.forEach(bus => {
                let li = document.createElement("li");
                li.textContent = `Bus - From ${bus.from_location} to ${bus.to_location} via ${bus.via} at ${bus.departure_time}`;
                busList.appendChild(li);
            });
        } else {
            busList.innerHTML = "<li>No buses available for this route.</li>";
        }
    } catch (error) {
        console.error("Error fetching buses:", error);
        let busList = document.getElementById("availableBuses");
        busList.innerHTML = "<li>Error fetching buses. Please try again.</li>";
    }
}

// Attach event listeners after DOM loads
document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:5000/api/buses")
    .then(response => response.json())
    .then(data => {
        console.log(data); // Check if data is received
  })
    .catch(error => console.error("Error fetching buses:", error));

    const passengerSignupForm = document.getElementById("passenger-signup-form");
    if (passengerSignupForm) {
        passengerSignupForm.addEventListener("submit", (e) => handleSignup(e, "passenger"));
    } else {
        console.warn("Element with ID 'passenger-signup-form' not found.");
    }

    document.getElementById("driver-signup-form").addEventListener("submit", (e) => handleSignup(e, "driver"));
    document.getElementById("passenger-form").addEventListener("submit", (e) => handleLogin(e, "passenger"));
    document.getElementById("driver-form").addEventListener("submit", (e) => handleLogin(e, "driver"));

    fetchBuses(); // Fetch buses on page load
});
