document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const videoWrapper = document.getElementById('video-wrapper');
    const lightboxVid = document.getElementById('lightbox-vid');
    
    // Custom controls elements
    const playPauseBtn = document.getElementById('play-pause-btn');
    const progressBar = document.getElementById('progress-bar');
    const timeDisplay = document.getElementById('time-display');
    const muteBtn = document.getElementById('mute-btn');

    // 1. Open Media Logic
    window.openMedia = function(element) {
        const img = element.querySelector('img');
        const vid = element.querySelector('video');

        // Reset
        lightboxImg.classList.remove('show');
        videoWrapper.classList.remove('show');
        lightboxVid.pause();

        if (img) {
            lightboxImg.src = img.src;
            lightboxImg.classList.add('show');
        } else if (vid) {
            lightboxVid.src = vid.src;
            videoWrapper.classList.add('show');
            lightboxVid.play();
            playPauseBtn.innerHTML = '⏸'; // Set to pause icon initially
            // Ensure audio is on when clicked in full screen
            lightboxVid.muted = false; 
            muteBtn.innerHTML = '🔊';
        }

        lightbox.classList.add('active');
    };

    // 2. Close Media Logic
    window.closeLightbox = function(event) {
        // Trigger fade out
        lightbox.classList.remove('active');

        // Wait for CSS transition before clearing
        setTimeout(() => {
            lightboxVid.pause();
            lightboxImg.src = "";
            lightboxVid.src = "";
        }, 400); 
    };

    // Close on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape" && lightbox.classList.contains('active')) {
            window.closeLightbox();
        }
    });

    // =========================================
    // Custom Video Controls Logic
    // =========================================

    // Play / Pause Toggle
    playPauseBtn.addEventListener('click', () => {
        if (lightboxVid.paused) {
            lightboxVid.play();
            playPauseBtn.innerHTML = '⏸';
        } else {
            lightboxVid.pause();
            playPauseBtn.innerHTML = '▶';
        }
    });

    // Also toggle play/pause if clicking directly on the video
    lightboxVid.addEventListener('click', () => {
        playPauseBtn.click();
    });

    // Mute / Unmute Toggle
    muteBtn.addEventListener('click', () => {
        lightboxVid.muted = !lightboxVid.muted;
        muteBtn.innerHTML = lightboxVid.muted ? '🔇' : '🔊';
    });

    // Format time into MM:SS
    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    // Update Progress Bar and Time as video plays
    lightboxVid.addEventListener('timeupdate', () => {
        // Calculate percentage for the range slider
        const percentage = (lightboxVid.currentTime / lightboxVid.duration) * 100;
        progressBar.value = percentage || 0;
        
        // Update the text display
        timeDisplay.textContent = `${formatTime(lightboxVid.currentTime)} / ${formatTime(lightboxVid.duration)}`;
    });

    // Allow user to click/drag the progress bar to seek through the video
    progressBar.addEventListener('input', () => {
        const seekTime = (progressBar.value / 100) * lightboxVid.duration;
        lightboxVid.currentTime = seekTime;
    });

    document.getElementById('close-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    window.closeLightbox();
});
});