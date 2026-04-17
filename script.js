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
    // Increased offsets to push photos further out to the corners
    const positions = isMobile ? [
        { x: -110, y: -160, r: -15 }, // Top Left
        { x: 110, y: -165, r: 12 },   // Top Right
        { x: -105, y: 170, r: -8 },   // Bottom Left
        { x: 110, y: 175, r: 18 }     // Bottom Right
    ] : [
        { x: -220, y: -260, r: -15 }, // Top Left
        { x: 220, y: -285, r: 12 },   // Top Right
        { x: -215, y: 225, r: -8 },   // Bottom Left
        { x: 225, y: 230, r: 18 }     // Bottom Right
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

// --- Dynamic URL Themes ---

function applyUrlTheme() {
    const params = new URLSearchParams(window.location.search);
    const color = params.get('color')?.toLowerCase();
    
    const themes = {
        'blue': { 
            main: '#a2d2ff', 
            accent: '#3d85c6', 
            gStart: 'rgba(162, 210, 255, 0.25)', 
            gEnd: 'rgba(61, 133, 198, 0.35)' 
        },
        'green': { 
            main: '#b7e4c7', 
            accent: '#2d6a4f', 
            gStart: 'rgba(183, 228, 199, 0.25)', 
            gEnd: 'rgba(45, 106, 79, 0.35)' 
        },
        'sunset': { 
            main: '#ffcb91', 
            accent: '#d35400', 
            gStart: 'rgba(255, 203, 145, 0.25)', 
            gEnd: 'rgba(211, 84, 0, 0.35)' 
        }
    };
    
    if (color && themes[color]) {
        const root = document.documentElement;
        const theme = themes[color];
        
        root.style.setProperty('--theme-color', theme.main);
        root.style.setProperty('--accent-color', theme.accent);
        root.style.setProperty('--gradient-start', theme.gStart);
        root.style.setProperty('--gradient-end', theme.gEnd);
        
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) metaTheme.setAttribute('content', theme.main);
    }
}

// Run theme check on load
applyUrlTheme();