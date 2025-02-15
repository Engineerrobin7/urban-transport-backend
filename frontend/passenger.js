document.addEventListener("DOMContentLoaded", function () {
    console.log("Passenger.js loaded!");

    const stopCheckInBtn = document.getElementById("stopCheckIn");
    const availableBusesList = document.getElementById("availableBuses");
    const submitRouteBtn = document.getElementById("submitRoute");

    async function fetchBuses(fromLocation, toLocation) {
        if (!availableBusesList) {
            console.error("🚨 Error: Element 'availableBuses' not found in DOM.");
            return;
        }

        // Ensure at least one input is provided
        if (!fromLocation && !toLocation) {
            alert("⚠️ Please enter at least one location.");
            return;
        }

        let url = `http://localhost:5000/api/buses`;
        let params = [];

        if (fromLocation) params.push(`from=${encodeURIComponent(fromLocation)}`);
        if (toLocation) params.push(`to=${encodeURIComponent(toLocation)}`);

        if (params.length > 0) {
            url += "?" + params.join("&");
        }

        try {
            let response = await fetch(url);

            if (!response.ok) {
                throw new Error(`API responded with ${response.status}`);
            }

            let data = await response.json();
            console.log("Bus Data:", data); 

            availableBusesList.innerHTML = ""; 

            if (data.length > 0) {
                data.forEach(bus => {
                    let li = document.createElement("li");
                    li.textContent = `🚌 Bus from ${bus.from_location} to ${bus.to_location} at ${bus.departure_time}`;
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

    if (submitRouteBtn) {
        submitRouteBtn.addEventListener("click", function () {
            const fromLocation = document.getElementById("fromLocation")?.value.trim();
            const toLocation = document.getElementById("toLocation")?.value.trim();
            
            if (!fromLocation && !toLocation) {
                alert("⚠️ Please enter at least one location.");
                return;
            }

            fetchBuses(fromLocation, toLocation);
        });
    } else {
        console.warn("🚨 Warning: submitRoute button not found!");
    }
});
