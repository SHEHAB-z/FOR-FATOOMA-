// GLOBALS
let exitAttempts = 0;
let backgroundMusic = null;

// MUSIC CONFIG - غير اسم الملف هنا
const MUSIC_FILE = 'music.mp3'; // حط اسم ملف الموسيقى هنا

// WARNING MESSAGES
const WARNING_MESSAGES = [
    { text: 'اوعا تفكري 🔪', image: 'sticker1.png' },
    { text: 'انا ما بهزر 🙂', image: 'sticker2.png' },
    { text: 'بطلع ليك بره الشاشه بعده 🙂🔪', image: 'sticker3.png' }
];

// START
window.onload = function() {
    console.log('🎬 Cinematic Experience Starting...');
    
    // Prepare music (but don't play yet)
    prepareMusic();
    
    // Create floating particles
    createFloatingParticles();
    
    // Auto transition after 5 seconds
    setTimeout(function() {
        transitionScene('intro', 'buttons-screen');
        initButtons();
    }, 5000);
};

// SCENE TRANSITION
function transitionScene(from, to) {
    const fromScene = document.getElementById(from);
    const toScene = document.getElementById(to);
    
    if (typeof gsap !== 'undefined') {
        gsap.to(fromScene, {
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: function() {
                fromScene.classList.remove('active');
                toScene.classList.add('active');
                gsap.fromTo(toScene, 
                    { opacity: 0, scale: 1.1 },
                    { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
                );
            }
        });
    } else {
        fromScene.classList.remove('active');
        toScene.classList.add('active');
    }
}

// MUSIC INIT
function prepareMusic() {
    backgroundMusic = new Audio(MUSIC_FILE);
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.7; // مستوى الصوت واضح بس مش عالي أوي (0.7 من 1.0)
    console.log('🎵 Music prepared, will start on Next button');
}

function startMusic() {
    if (backgroundMusic) {
        backgroundMusic.play().then(function() {
            console.log('🎵 Music started!');
        }).catch(function(error) {
            console.log('Music play error:', error);
        });
    }
}

// CONTROL MUSIC VOLUME
function setMusicVolume(volume) {
    if (backgroundMusic) {
        backgroundMusic.volume = Math.max(0, Math.min(1, volume));
    }
}

// PAUSE/RESUME MUSIC
function toggleMusic() {
    if (backgroundMusic) {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
        } else {
            backgroundMusic.pause();
        }
    }
}

// FLOATING PARTICLES
function createFloatingParticles() {
    const container = document.querySelector('.floating-particles');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(212, 175, 55, 0.6)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 10 + 5}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(particle);
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(20px, -20px); }
            50% { transform: translate(-20px, 20px); }
            75% { transform: translate(20px, 20px); }
        }
    `;
    document.head.appendChild(style);
}

// BUTTONS INIT
function initButtons() {
    const nextBtn = document.getElementById('next-btn');
    const exitBtn = document.getElementById('exit-btn');
    
    nextBtn.onclick = function() {
        console.log('Next clicked');
        
        // Start music when Next is clicked
        startMusic();
        
        transitionScene('buttons-screen', 'warning-screen');
        
        // Show warning for 3 seconds
        setTimeout(function() {
            transitionScene('warning-screen', 'main-message-screen');
            createPetals();
            
            // Show main message for 30 seconds (زودناها من 15 لـ 30)
            setTimeout(function() {
                transitionScene('main-message-screen', 'game-screen');
                initGame();
            }, 30000);
        }, 3000);
    };
    
    exitBtn.onclick = function() {
        console.log('Exit attempt:', exitAttempts + 1);
        
        if (exitAttempts < 3) {
            showWarning(exitAttempts);
            exitAttempts++;
            
            // After 3rd attempt, replace Exit with Next
            if (exitAttempts === 3) {
                setTimeout(function() {
                    replaceExitWithNext();
                }, 3000);
            }
        }
    };
}

// REPLACE EXIT BUTTON WITH NEXT
function replaceExitWithNext() {
    const exitBtn = document.getElementById('exit-btn');
    
    // Animate exit button disappearing
    if (typeof gsap !== 'undefined') {
        gsap.to(exitBtn, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            ease: 'back.in',
            onComplete: function() {
                // Change button to Next
                exitBtn.classList.remove('exit');
                exitBtn.classList.add('next');
                exitBtn.innerHTML = '<span class="btn-text">NEXT</span><span class="btn-glow"></span>';
                exitBtn.style.cursor = 'pointer';
                exitBtn.style.borderColor = 'var(--gold)';
                exitBtn.style.color = 'var(--gold)';
                
                // Update onclick
                exitBtn.onclick = function() {
                    console.log('Second Next clicked');
                    startMusic();
                    transitionScene('buttons-screen', 'warning-screen');
                    
                    setTimeout(function() {
                        transitionScene('warning-screen', 'main-message-screen');
                        createPetals();
                        
                        setTimeout(function() {
                            transitionScene('main-message-screen', 'game-screen');
                            initGame();
                        }, 30000);
                    }, 3000);
                };
                
                // Animate appearing
                gsap.to(exitBtn, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.5,
                    ease: 'back.out'
                });
            }
        });
    } else {
        exitBtn.classList.remove('exit');
        exitBtn.classList.add('next');
        exitBtn.innerHTML = '<span class="btn-text">NEXT</span><span class="btn-glow"></span>';
        exitBtn.onclick = function() {
            startMusic();
            transitionScene('buttons-screen', 'warning-screen');
            setTimeout(function() {
                transitionScene('warning-screen', 'main-message-screen');
                createPetals();
                setTimeout(function() {
                    transitionScene('main-message-screen', 'game-screen');
                    initGame();
                }, 30000);
            }, 3000);
        };
    }
}

// SHOW WARNING
function showWarning(attemptIndex) {
    const overlay = document.getElementById('warning-overlay');
    const warningContent = overlay.querySelector('.warning-content');
    const message = WARNING_MESSAGES[attemptIndex];
    
    // Update content
    warningContent.innerHTML = `
        <img src="${message.image}" alt="" class="warning-img" onerror="this.style.display='none'">
        <div class="warning-text">${message.text}</div>
    `;
    
    overlay.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(function() {
        overlay.classList.remove('show');
    }, 3000);
}

// CREATE PETALS
function createPetals() {
    const containers = document.querySelectorAll('.petals-container');
    
    containers.forEach(container => {
        container.innerHTML = '';
        
        const petals = ['🌹', '🌺', '🌸', '💐', '🌷'];
        
        for (let i = 0; i < 25; i++) {
            const petal = document.createElement('div');
            petal.textContent = petals[Math.floor(Math.random() * petals.length)];
            petal.style.position = 'absolute';
            petal.style.fontSize = Math.random() * 25 + 15 + 'px';
            petal.style.left = Math.random() * 100 + '%';
            petal.style.top = '-50px';
            petal.style.opacity = '0.7';
            petal.style.animation = `petalFall ${Math.random() * 5 + 4}s linear infinite`;
            petal.style.animationDelay = Math.random() * 5 + 's';
            container.appendChild(petal);
        }
    });
    
    if (!document.getElementById('petal-animation')) {
        const style = document.createElement('style');
        style.id = 'petal-animation';
        style.textContent = `
            @keyframes petalFall {
                to {
                    transform: translateY(110vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// GAME INIT
function initGame() {
    createPetals();
    
    const choices = document.querySelectorAll('.choice-card');
    
    choices.forEach(card => {
        card.onclick = function() {
            const playerChoice = this.getAttribute('data-choice');
            console.log('Player chose:', playerChoice);
            playGame(playerChoice);
        };
    });
}

// PLAY GAME
function playGame(playerChoice) {
    let computerChoice = 'rock';
    let result;
    
    if (playerChoice === 'scissors') {
        result = 'lose';
    } else if (playerChoice === 'rock') {
        result = 'tie';
    } else if (playerChoice === 'paper') {
        result = 'win';
    }
    
    const resultDiv = document.getElementById('game-result');
    const choices = {
        'rock': 'حجر ✊',
        'paper': 'ورقة ✋',
        'scissors': 'مقص ✌️'
    };
    
    resultDiv.textContent = `اخترتي: ${choices[playerChoice]} | اخترت: ${choices[computerChoice]}`;
    
    setTimeout(function() {
        if (result === 'win') {
            transitionScene('game-screen', 'win-screen');
            createConfetti();
            
            setTimeout(function() {
                transitionScene('win-screen', 'final-screen');
                createPetals();
            }, 4000);
        } else if (result === 'lose') {
            transitionScene('game-screen', 'lose-screen');
            
            setTimeout(function() {
                transitionScene('lose-screen', 'final-screen');
                createPetals();
            }, 4000);
        } else {
            resultDiv.textContent = 'تعادل! جربي مرة تانية';
            setTimeout(function() {
                resultDiv.textContent = '';
            }, 2000);
        }
    }, 2000);
}

// CREATE CONFETTI
function createConfetti() {
    const container = document.querySelector('.confetti-rain');
    if (!container) return;
    
    container.innerHTML = '';
    
    const emojis = ['🎊', '🎉'];
    const colors = ['#ff6b9d', '#ffd700', '#ff1493', '#ffed4e'];
    
    for (let i = 0; i < 60; i++) {
        const confetti = document.createElement('div');
        
        if (Math.random() > 0.5) {
            confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            confetti.style.fontSize = Math.random() * 30 + 20 + 'px';
        } else {
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = confetti.style.width;
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        }
        
        confetti.style.position = 'absolute';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-50px';
        confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear infinite`;
        confetti.style.animationDelay = Math.random() * 3 + 's';
        container.appendChild(confetti);
    }
    
    if (!document.getElementById('confetti-animation')) {
        const style = document.createElement('style');
        style.id = 'confetti-animation';
        style.textContent = `
            @keyframes confettiFall {
                to {
                    transform: translateY(110vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}
