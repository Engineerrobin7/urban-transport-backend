document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 script.js loaded!");

    // Function to show/hide forms based on role (passenger/driver)
    window.showForm = function (role) {
        // Hide all forms first
        document.getElementById('passenger-form').classList.add('hidden');
        document.getElementById('passenger-signup-form').classList.add('hidden');
        document.getElementById('driver-form').classList.add('hidden');
        document.getElementById('driver-signup-form').classList.add('hidden');

        // Show the selected role's login form
        document.getElementById(`${role}-form`).classList.remove('hidden');
    }

    // Function to toggle between login and signup forms
    window.toggleAuthForm = function () {
        const passengerLoginForm = document.getElementById('passenger-form');
        const passengerSignupForm = document.getElementById('passenger-signup-form');
        const driverLoginForm = document.getElementById('driver-form');
        const driverSignupForm = document.getElementById('driver-signup-form');

        if (passengerLoginForm && !passengerLoginForm.classList.contains('hidden')) {
            passengerLoginForm.classList.add('hidden');
            passengerSignupForm.classList.remove('hidden');
        } else if (passengerSignupForm && !passengerSignupForm.classList.contains('hidden')) {
            passengerSignupForm.classList.add('hidden');
            passengerLoginForm.classList.remove('hidden');
        } else if (driverLoginForm && !driverLoginForm.classList.contains('hidden')) {
            driverLoginForm.classList.add('hidden');
            driverSignupForm.classList.remove('hidden');
        } else if (driverSignupForm && !driverSignupForm.classList.contains('hidden')) {
            driverSignupForm.classList.add('hidden');
            driverLoginForm.classList.remove('hidden');
        }
    }

    // Function to toggle password visibility
    window.togglePasswordVisibility = function (inputId) {
        const passwordInput = document.getElementById(inputId);
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        // Toggle the eye icon
        const toggleIcon = passwordInput.parentNode.querySelector('.toggle-password i');
        toggleIcon.classList.toggle('fa-eye');
        toggleIcon.classList.toggle('fa-eye-slash');
    }

    // --- Form Submission Handling ---
    // Example for passenger login form
    const passengerLoginForm = document.getElementById('passenger-form');
    if (passengerLoginForm) {
        passengerLoginForm.addEventListener('submit', async function (event) {
            event.preventDefault(); // Prevent default form submission

            // Get form data
            const username = document.getElementById('passenger-username').value;
            const password = document.getElementById('passenger-password').value;

            // Basic validation
            if (!username || !password) {
                alert('Please enter both username and password.');
                return;
            }

            // Send data to backend (replace with your actual API endpoint)
            try {
                const response = await fetch('http://localhost:5000/api/passenger/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Handle successful login (e.g., redirect to dashboard)
                    console.log('Login successful:', data);
                    alert('Login successful!');
                    // window.location.href = 'dashboard.html'; // Redirect to dashboard
                } else {
                    // Handle login error (e.g., display error message)
                    console.error('Login failed:', data);
                    alert('Login failed: ' + data.message);
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('Error during login: ' + error.message);
            }
        });
    }

    const stopCheckInBtn = document.getElementById("stopCheckIn");
    const availableBusesList = document.getElementById("availableBuses");
    const submitRouteBtn = document.getElementById("submitRoute");

    // 🚍 Fetch and Display Buses Based on User Input
    async function fetchBuses(fromLocation, toLocation) {
        try {
            if (!fromLocation || !toLocation) {
                alert("⚠️ Please enter both 'From' and 'To' locations.");
                return;
            }

            let url = `http://localhost:5000/api/buses?from=${encodeURIComponent(fromLocation)}&to=${encodeURIComponent(toLocation)}`;
            let response = await fetch(url);
            let data = await response.json();

            console.log("📊 Bus Data:", data);

            availableBusesList.innerHTML = ""; // Clear previous results

            if (data && data.length > 0) {
                data.forEach(bus => {
                    let li = document.createElement("li");
                    li.textContent = `🚌 Bus from ${bus.from_location} to ${bus.to_location} via ${bus.via} at ${bus.departure_time}`;
                    availableBusesList.appendChild(li);
                });
            } else {
                availableBusesList.innerHTML = "<li>No buses available for this route.</li>";
            }
        } catch (error) {
            console.error("❌ Error fetching buses:", error);
            availableBusesList.innerHTML = "<li>Error fetching buses. Please try again.</li>";
        }
    }

    // 🏷️ Event listener for Fetching Buses
    if (submitRouteBtn) {
        submitRouteBtn.addEventListener("click", function () {
            const fromLocation = document.getElementById("fromLocation")?.value.trim();
            const toLocation = document.getElementById("toLocation")?.value.trim();

            fetchBuses(fromLocation, toLocation);
        });
    } else {
        console.warn("🚨 Warning: submitRoute button not found!");
    }

    // 📍 Passenger Check-In (Geolocation)
    if (stopCheckInBtn) {
        stopCheckInBtn.addEventListener("click", function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        let lat = position.coords.latitude;
                        let lng = position.coords.longitude;
                        let timestamp = new Date().toLocaleTimeString();
                        let checkIns = JSON.parse(localStorage.getItem("passengerCheckIns")) || [];
                        checkIns.push({ lat, lng, timestamp });

                        localStorage.setItem("passengerCheckIns", JSON.stringify(checkIns));

                        alert("✅ Check-In successful! The driver will see your location.");
                    },
                    function (error) {
                        alert("❌ Error getting location: " + error.message);
                    }
                );
            } else {
                alert("⚠️ Geolocation is not supported by this browser.");
            }
        });
    } else {
        console.warn("🚨 Warning: stopCheckIn button not found!");
    }
});
