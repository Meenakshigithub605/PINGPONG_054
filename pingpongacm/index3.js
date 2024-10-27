document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('play-button');
    const mainMenu = document.getElementById('main-menu');
    const modeSelection = document.getElementById('mode-selection');

    const scorePopup = document.getElementById('score-popup');
    const closePopup = document.getElementById('close-popup');

    const scoreInput = document.getElementById('score-input');
    const loadingMessage = document.getElementById('loading');

    function playClickSound() {
        const audio = new Audio('music/buttonclick.mp3');
        audio.play().catch(error => {
            console.error("Error playing audio:", error);
        });
    }

    playButton.addEventListener('click', () => {
        playClickSound();
        mainMenu.classList.add('hidden');
        modeSelection.classList.remove('hidden');
    });

    document.getElementById('one-player').addEventListener('click', () => {
        playClickSound();
        modeSelection.classList.add('hidden');
        showScorePopup(1);
    });

    document.getElementById('two-player').addEventListener('click', () => {
        playClickSound();
        modeSelection.classList.add('hidden');
        showScorePopup(2);
    });

    document.getElementById('back-button').addEventListener('click', () => {
        playClickSound();
        modeSelection.classList.add('hidden');
        mainMenu.classList.remove('hidden');
        hideScorePopup();
    });

    closePopup.addEventListener('click', () => {
        playClickSound();
        hideScorePopup();
        modeSelection.classList.remove('hidden');
    });

    function showScorePopup(mode) {
        scorePopup.classList.remove('hidden');

        document.getElementById('start').onclick = () => {
            playClickSound();
            startGame(mode);
        };

        resetLoading();

        // Hide loading message initially
        loadingMessage.classList.add('hidden');

        // Add overlay
        const overlay = document.createElement("div");
        overlay.className = "popup-overlay";
        document.body.appendChild(overlay);

        overlay.onclick = hideScorePopup; // Close popup on overlay click
    }

    function hideScorePopup() {
        scorePopup.classList.add('hidden');

        // Remove overlay if it exists
        const overlay = document.querySelector('.popup-overlay');
        if (overlay) {
            overlay.remove();
        }

        resetLoading();

        // Clear input field when closing
        scoreInput.value = '';
    }

    function startGame(mode) {
        const scoreLimit = parseInt(scoreInput.value);

        if (!scoreLimit || scoreLimit <= 0) {
            alert("Please enter a valid score limit.");
            return;
        }

        // Show loading message
        loadingMessage.classList.remove('hidden');

        // Simulate loading time (e.g., fetching resources)
        setTimeout(() => {
            loadingMessage.classList.add('hidden');

            if (mode === 1) {
                window.location.href = `index.html?score=${scoreLimit}`; // Pass score limit to game
            } else {
                window.location.href = `new2.html?score=${scoreLimit}`; // Pass score limit to game
            }

            hideScorePopup(); // Hide popup after starting the game
        }, 2000); // Simulate a 2-second loading time
    }

    function resetLoading() {
        loadingMessage.classList.add('hidden'); // Hide loading message when navigating back
    }
});