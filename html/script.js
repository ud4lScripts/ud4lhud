document.addEventListener('DOMContentLoaded', function() {
    let previousHealth = 100;
    let previousArmor = 100;
    let playerId = 'Loading...';

    function displayPlayerInfo(playerId, talking) {
        const playerIdElement = document.getElementById('player-id');
        const voiceIconElement = document.getElementById('voice-icon');

        if (playerIdElement && voiceIconElement) {
            playerIdElement.textContent = `ID: ${playerId}`;
            voiceIconElement.classList.toggle('active', talking); 
        }
    }

    displayPlayerInfo(playerId, false); 

    window.addEventListener('message', function(event) {
        if (event.data.type === "initialLoad") {
            const healthBarElement = document.getElementById('health-bar');
            const armorBarElement = document.getElementById('armor-bar');

            if (healthBarElement && armorBarElement) {
                const newHealth = event.data.health;
                const newArmor = event.data.armor;
                playerId = event.data.id;
                const talking = event.data.talking;

                displayPlayerInfo(playerId, talking);

                healthBarElement.style.width = newHealth + '%';
                armorBarElement.style.width = newArmor + '%';

                previousHealth = newHealth;
                previousArmor = newArmor;
            }
        } else if (event.data.type === "updateStatus") {
            const healthBarElement = document.getElementById('health-bar');
            const armorBarElement = document.getElementById('armor-bar');

            if (healthBarElement && armorBarElement) {
                const newHealth = event.data.health;
                const newArmor = event.data.armor;
                playerId = event.data.id; 
                const talking = event.data.talking;

                displayPlayerInfo(playerId, talking);

                updateBarWidth(healthBarElement, newHealth, previousHealth);

                updateBarWidth(armorBarElement, newArmor, previousArmor);

                previousHealth = newHealth;
                previousArmor = newArmor;
            }
        }
    });

    function updateBarWidth(barElement, newValue, previousValue) {
        newValue = Math.max(0, Math.min(100, newValue));
        previousValue = Math.max(0, Math.min(100, previousValue));

        const diff = newValue - previousValue;

        const animationDuration = Math.abs(diff) * 5; 
        const animationSteps = Math.abs(diff) > 1 ? Math.abs(diff) : 1; 
        const stepValue = diff / animationSteps;

        let currentWidth = previousValue;

        const interval = setInterval(function() {
            currentWidth += stepValue;
            barElement.style.width = currentWidth + '%';

            if (diff > 0 ? currentWidth >= newValue : currentWidth <= newValue) {
                clearInterval(interval);
                barElement.style.width = newValue + '%'; 
            }
        }, animationDuration / animationSteps);
    }
});
