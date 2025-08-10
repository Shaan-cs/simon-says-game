
        document.addEventListener('DOMContentLoaded', () => {
            const buttons = {
                green: document.getElementById('green'),
                red: document.getElementById('red'),
                yellow: document.getElementById('yellow'),
                blue: document.getElementById('blue')
            };
            
            const sounds = {
                green: document.getElementById('green-sound'),
                red: document.getElementById('red-sound'),
                yellow: document.getElementById('yellow-sound'),
                blue: document.getElementById('blue-sound'),
                wrong: document.getElementById('wrong-sound')
            };
            
            const startBtn = document.getElementById('start-btn');
            const strictMode = document.getElementById('strict-mode');
            const scoreDisplay = document.getElementById('score');
            const gameOverDisplay = document.getElementById('game-over');
            const levelText = document.getElementById('level-text');
            const body = document.body;
            
            let sequence = [];
            let playerSequence = [];
            let level = 0;
            let isGameActive = false;
            let isPlayerTurn = false;
            let isSequencePlaying = false;
            
            // Initialize button click handlers
            Object.keys(buttons).forEach(color => {
                buttons[color].addEventListener('click', () => {
                    if (!isGameActive || !isPlayerTurn || isSequencePlaying) return;
                    
                    handlePlayerInput(color);
                });
            });
            
            // Start button handler
            startBtn.addEventListener('click', () => {
                if (isGameActive) {
                    resetGame();
                } else {
                    startGame();
                }
            });
            
            function startGame() {
                sequence = [];
                playerSequence = [];
                level = 0;
                isGameActive = true;
                isPlayerTurn = false;
                gameOverDisplay.textContent = '';
                levelText.textContent = '0';
                startBtn.textContent = 'Restart Game';
                nextLevel();
            }
            
            function resetGame() {
                isGameActive = false;
                scoreDisplay.textContent = '--';
                levelText.textContent = '0';
                startBtn.textContent = 'Start Game';
                gameOverDisplay.textContent = '';
                body.classList.remove('wrong');
            }
            
            function nextLevel() {
                level++;
                scoreDisplay.textContent = level;
                levelText.textContent = level;
                playerSequence = [];
                isPlayerTurn = false;
                
                // Add a random color to the sequence
                const colors = ['green', 'red', 'yellow', 'blue'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                sequence.push(randomColor);
                
                // Play the sequence
                playSequence();
            }
            
            function playSequence() {
                isSequencePlaying = true;
                let i = 0;
                
                const interval = setInterval(() => {
                    if (i >= sequence.length) {
                        clearInterval(interval);
                        isSequencePlaying = false;
                        isPlayerTurn = true;
                        return;
                    }
                    
                    const color = sequence[i];
                    activateButton(color);
                    i++;
                }, 800);
            }
            
            function activateButton(color) {
                buttons[color].classList.add('active');
                sounds[color].currentTime = 0;
                sounds[color].play();
                
                setTimeout(() => {
                    buttons[color].classList.remove('active');
                }, 300);
            }
            
            function handlePlayerInput(color) {
                playerSequence.push(color);
                activateButton(color);
                
                // Check if the player's move matches the sequence
                if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
                    // Wrong move
                    sounds.wrong.currentTime = 0;
                    sounds.wrong.play();
                    gameOverDisplay.textContent = 'Wrong!';
                    body.classList.add('wrong');
                    
                    setTimeout(() => {
                        body.classList.remove('wrong');
                        if (strictMode.checked) {
                            resetGame();
                        } else {
                            gameOverDisplay.textContent = '';
                            playSequence();
                        }
                    }, 1000);
                    return;
                }
                
                // Check if the player completed the sequence
                if (playerSequence.length === sequence.length) {
                    if (level === 20) {
                        // Player won the game
                        gameOverDisplay.textContent = 'You Win!';
                        setTimeout(() => {
                            resetGame();
                        }, 2000);
                    } else {
                        // Move to next level
                        setTimeout(() => {
                            nextLevel();
                        }, 1000);
                    }
                }
            }
        });
  