document.addEventListener("DOMContentLoaded", function () {
    console.log("Passenger.js loaded!");

    // Selecting elements
    const stopCheckInBtn = document.getElementById("stopCheckIn");
    const availableBusesList = document.getElementById("availableBuses");
    const submitRouteBtn = document.getElementById("submitRoute");

    // 🚀 Function to fetch and display buses based on user input
    async function fetchBuses(fromLocation, toLocation) {
        try {
            if (!fromLocation || !toLocation) {
                alert("⚠️ Please enter both 'From' and 'To' locations.");
                return;
            }

            let url = `http://localhost:5000/api/buses?from=${encodeURIComponent(fromLocation)}&to=${encodeURIComponent(toLocation)}`;

            let response = await fetch(url);
            let data = await response.json();

            console.log("Bus Data:", data); // Debugging: Check if data is received

            availableBusesList.innerHTML = ""; // Clear old data

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
            console.error("Error fetching buses:", error);
            availableBusesList.innerHTML = "<li>Error fetching buses. Please try again.</li>";
        }
    }

    // 🏷️ Event listener for fetching buses on button click
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
