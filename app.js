document.addEventListener("DOMContentLoaded", function () {
    const pinLocationBtn = document.getElementById("pin-location-btn");
    const locationInfo = document.getElementById("location-info");
    const orderBtn = document.getElementById("order-btn");
    const orderForm = document.getElementById("order-form");
    const orderLocation = document.getElementById("order-location");
    const confirmOrderBtn = document.getElementById("confirm-order");
    const timelineList = document.getElementById("section-4-timeline"); // Timeline Section Fix

    let pinnedAddress = ""; // Store human-readable address

    // Function to Convert Coordinates to Address
    function reverseGeocode(latitude, longitude) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.display_name) {
                    pinnedAddress = data.display_name;
                    locationInfo.innerText = `📍 ${pinnedAddress}`;
                    orderLocation.innerText = pinnedAddress;
                } else {
                    pinnedAddress = `Lat: ${latitude}, Lon: ${longitude}`;
                    locationInfo.innerText = `📍 ${pinnedAddress}`;
                    orderLocation.innerText = pinnedAddress;
                }
                orderBtn.disabled = false; // Enable the Order button
            })
            .catch(error => {
                console.error("Reverse geocoding failed:", error);
                locationInfo.innerText = "⚠️ Location not found.";
            });
    }

    // Pin Location Function
    pinLocationBtn.addEventListener("click", function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    // Convert to Human-Readable Address
                    reverseGeocode(latitude, longitude);
                },
                function () {
                    locationInfo.innerText = "⚠️ Failed to get location. Try again.";
                }
            );
        } else {
            locationInfo.innerText = "⚠️ Geolocation is not supported by your browser.";
        }
    });

    // Show Order Form When "Order via WhatsApp" is Clicked
    orderBtn.addEventListener("click", function () {
        if (!pinnedAddress) {
            alert("Please pin your location first.");
            return;
        }
        orderForm.style.display = "block"; // Show the form
    });

    // Confirm and Send Order via WhatsApp
    confirmOrderBtn.addEventListener("click", function () {
        const name = document.getElementById("customer-name").value.trim();
        const phone = document.getElementById("customer-phone").value.trim();

        if (!name || !phone) {
            alert("Please enter your name and phone number.");
            return;
        }

        const message = `Hello, I want to order Chips Mwitu.\n\nName: ${name}\nPhone: ${phone}\nLocation: ${pinnedAddress}\nOrder: 1 pack @ KES 150.`;
        const whatsappUrl = `https://wa.me/254712345678?text=${encodeURIComponent(message)}`;

        window.location.href = whatsappUrl; // Redirect to WhatsApp
    });

    // 🕒 Time-based Delivery Timeline Logic (Fixed)
    function updateDeliveryTimeline() {
        if (!timelineList) {
            console.error("❌ Error: Element 'section-4-timeline' not found.");
            return;
        }

        timelineList.innerHTML = ""; // Clear previous entries

        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();
        const totalMinutesNow = currentHour * 60 + currentMinutes;

        // Define delivery slots in minutes (10:00 AM to 8:30 PM)
        const deliverySlots = [
            { time: "10:00 AM", minutes: 10 * 60 },
            { time: "12:00 PM", minutes: 12 * 60 },
            { time: "2:00 PM", minutes: 14 * 60 },
            { time: "4:00 PM", minutes: 16 * 60 },
            { time: "6:00 PM", minutes: 18 * 60 },
            { time: "8:30 PM", minutes: 20 * 60 + 30 },
        ];

        deliverySlots.forEach((slot) => {
            const slotItem = document.createElement("li");
            slotItem.textContent = slot.time;

            if (totalMinutesNow >= slot.minutes) {
                slotItem.style.color = "gray"; // Past times
            } else {
                slotItem.style.color = "green"; // Future times
            }

            timelineList.appendChild(slotItem);
        });

        console.log("✅ Delivery timeline updated.");
    }

    // Call the function to update timeline when the page loads
    updateDeliveryTimeline();

    // Refresh timeline every minute
    setInterval(updateDeliveryTimeline, 60000);
});
