document.addEventListener('DOMContentLoaded', function() {
    let previousHealth = 100;
    let previousArmor = 100;
    let playerId = 'Loading...'; // Initialize with loading text

    // Display player's ID and voice status function
    function displayPlayerInfo(playerId, talking) {
        const playerIdElement = document.getElementById('player-id');
        const voiceIconElement = document.getElementById('voice-icon');

        if (playerIdElement && voiceIconElement) {
            playerIdElement.textContent = `ID: ${playerId}`;
            voiceIconElement.classList.toggle('active', talking); // Toggle 'active' class based on talking status
        }
    }

    // Initial display
    displayPlayerInfo(playerId, false); // Initially not talking

    window.addEventListener('message', function(event) {
        if (event.data.type === "initialLoad") {
            const healthBarElement = document.getElementById('health-bar');
            const armorBarElement = document.getElementById('armor-bar');

            if (healthBarElement && armorBarElement) {
                const newHealth = event.data.health;
                const newArmor = event.data.armor;
                playerId = event.data.id; // Update player's ID from event data
                const talking = event.data.talking; // Get voice status from event data

                // Display player's ID and voice status
                displayPlayerInfo(playerId, talking);

                // Update health bar width immediately
                healthBarElement.style.width = newHealth + '%';
                armorBarElement.style.width = newArmor + '%';

                // Update previous values
                previousHealth = newHealth;
                previousArmor = newArmor;
            }
        } else if (event.data.type === "updateStatus") {
            const healthBarElement = document.getElementById('health-bar');
            const armorBarElement = document.getElementById('armor-bar');

            if (healthBarElement && armorBarElement) {
                const newHealth = event.data.health;
                const newArmor = event.data.armor;
                playerId = event.data.id; // Update player's ID from event data
                const talking = event.data.talking; // Get voice status from event data

                // Display player's ID and voice status
                displayPlayerInfo(playerId, talking);

                // Update health bar width smoothly
                updateBarWidth(healthBarElement, newHealth, previousHealth);

                // Update armor bar width smoothly
                updateBarWidth(armorBarElement, newArmor, previousArmor);

                // Update previous values
                previousHealth = newHealth;
                previousArmor = newArmor;
            }
        }
    });

    function updateBarWidth(barElement, newValue, previousValue) {
        // Ensure values are within valid range
        newValue = Math.max(0, Math.min(100, newValue));
        previousValue = Math.max(0, Math.min(100, previousValue));

        // Calculate difference
        const diff = newValue - previousValue;

        // Animate bar width change
        const animationDuration = Math.abs(diff) * 5; // Adjust animation speed (higher value = slower animation)
        const animationSteps = Math.abs(diff) > 1 ? Math.abs(diff) : 1; // Ensure at least 1 step
        const stepValue = diff / animationSteps;

        let currentWidth = previousValue;

        const interval = setInterval(function() {
            currentWidth += stepValue;
            barElement.style.width = currentWidth + '%';

            // Stop interval when animation complete
            if (diff > 0 ? currentWidth >= newValue : currentWidth <= newValue) {
                clearInterval(interval);
                barElement.style.width = newValue + '%'; // Ensure final width is exact
            }
        }, animationDuration / animationSteps);
    }
});
