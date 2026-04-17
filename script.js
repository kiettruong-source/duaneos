const letterBtn = document.getElementById("letterBtn");
const closeBtn = document.getElementById("closeBtn");
const birthdayCard = document.getElementById("birthdayCard");
const bgMusic = document.getElementById("bgMusic");

async function startMusic() {
    try {
        bgMusic.currentTime = 78.5; // Skip to 1:18.5
        await bgMusic.play();
    } catch (err) {
        console.log("Music blocked until another user gesture.");
    }
}


function triggerSurprise() {
    const isMobile = window.innerWidth < 480;
    
    const photos = [
        'assets/photo1.jpg',
        'assets/photo2.jpg',
        'assets/photo3.jpg',
        'assets/photo4.jpg'
    ];

    // Calculate positions relative to the center
    // On mobile, we reduce the offsets significantly so photos stay on screen
    const positions = isMobile ? [
        { x: -90, y: -130, r: -15 }, // Top Left
        { x: 90, y: -135, r: 12 },   // Top Right
        { x: -85, y: 140, r: -8 },   // Bottom Left
        { x: 90, y: 145, r: 18 }     // Bottom Right
    ] : [
        { x: -160, y: -200, r: -15 }, // Top Left
        { x: 160, y: -245, r: 12 },   // Top Right
        { x: -155, y: 155, r: -8 },   // Bottom Left
        { x: 165, y: 160, r: 18 }     // Bottom Right
    ];

    const stickerPool = ['🍓', '⭐', '💖', '✨', '🌸', '🎁', '🎈', '🍰'];

    photos.forEach((src, i) => {
        const frame = document.createElement('div');
        frame.className = 'photo-frame';
        
        const img = document.createElement('img');
        img.src = src;
        img.className = 'surprise-photo';
        frame.appendChild(img);
        
        // Special rule for Bottom-Right photo (index 3): One guaranteed cucumber + others
        const isCucumberPhoto = (i === 3);
        const stickerCount = Math.floor(Math.random() * 5) + 3;
        
        for (let j = 0; j < stickerCount; j++) {
            const sticker = document.createElement('div');
            sticker.className = 'sticker';
            
            // If it's the bottom-right photo, make the first two stickers cucumbers
            if (isCucumberPhoto && j < 2) {
                sticker.innerText = '🥒';
            } else {
                sticker.innerText = stickerPool[Math.floor(Math.random() * stickerPool.length)];
            }
            
            // Randomly pick a side (0: top, 1: right, 2: bottom, 3: left)
            const side = Math.floor(Math.random() * 4);
            let top = 0, left = 0;
            
            if (side === 0) { top = -10; left = Math.random() * 100; }
            else if (side === 1) { top = Math.random() * 100; left = 95; }
            else if (side === 2) { top = 100; left = Math.random() * 100; }
            else { top = Math.random() * 100; left = -10; }
            
            sticker.style.top = `${top}%`;
            sticker.style.left = `${left}%`;
            sticker.style.transform = `rotate(${(Math.random() - 0.5) * 60}deg)`;
            
            frame.appendChild(sticker);
        }
        
        document.querySelector('.content').appendChild(frame);

        setTimeout(() => {
            frame.classList.add('active');
            frame.style.transform = `translate(calc(-50% + ${positions[i].x}px), calc(-50% + ${positions[i].y}px)) scale(1) rotate(${positions[i].r}deg)`;
        }, 100 + (i * 150));
    });

    // Particle Burst (Increased by 20% from 50 to 60 particles)
    for (let i = 0; i < 60; i++) {
        setTimeout(() => createParticle(), i * 20);
    }
}

function createParticle() {
    const isHeart = Math.random() > 0.4;
    const particle = document.createElement('div');
    particle.className = isHeart ? 'heart' : 'sparkle';
    particle.innerHTML = isHeart ? '❤' : ''; // Use simple heart char
    
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    
    particle.style.left = startX + 'px';
    particle.style.top = startY + 'px';
    
    const dx = (Math.random() - 0.5) * 800;
    const dy = (Math.random() - 0.7) * 800; // More bias upwards
    const dr = (Math.random() - 0.5) * 720;
    
    particle.style.setProperty('--dx', `${dx}px`);
    particle.style.setProperty('--dy', `${dy}px`);
    particle.style.setProperty('--dr', `${dr}deg`);
    
    particle.style.animation = `floatUp ${2 + Math.random() * 2}s ease-out forwards`;
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 4000);
}

// Ensure this is called inside your letterBtn event listener
letterBtn.addEventListener("click", async () => {
    birthdayCard.classList.remove("hidden");
    letterBtn.classList.add("hidden");
    triggerSurprise();
    await startMusic();
});

closeBtn.addEventListener("click", () => {
    birthdayCard.classList.add("hidden");
    letterBtn.classList.remove("hidden");
    
    // Cleanup frames (including photos and stickers)
    const existingFrames = document.querySelectorAll('.photo-frame');
    existingFrames.forEach(frame => frame.remove());
});