let userpaddle = document.querySelector('#user-paddle');
let user2paddle = document.querySelector('#user2-paddle');
let ball = document.querySelector('#ball');

userpaddle.style.marginLeft = '30px';
userpaddle.style.marginTop = '0px';
user2paddle.style.marginLeft = '1048px';
user2paddle.style.marginTop = '0px'; // Fixed marginTop assignment
ball.style.marginLeft = '530px';
ball.style.marginTop = '262px';

// For user1
let W_Pressed = false;
let S_Pressed = false;

// For user2
let K_Pressed = false;
let O_Pressed = false;

let ID;
let vx = -1;
let vy = -1;
// Distance from mid boundary to both users
let v = Math.sqrt(Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2)));

// Initialize scores
let userScore = 0;
let user2Score = 0;

// Get score limit from URL parameters
function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get(name)) || 10; // Default to 10 if not set
}
const scoreLimit = getParameterByName('score');

// Keyboard events
document.addEventListener('keydown', (e) => {
    if (e.keyCode == '87') { // W key for user1
        W_Pressed = true;
    } else if (e.keyCode == '83') { // S key for user1
        S_Pressed = true;
    } else if (e.keyCode == '75') { // K key for user2
        K_Pressed = true;
    } else if (e.keyCode == '79') { // O key for user2
        O_Pressed = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.keyCode == '87') { W_Pressed = false; }
    else if (e.keyCode == '83') { S_Pressed = false; }
    else if (e.keyCode == '75') { K_Pressed = false; }
    else if (e.keyCode == '79') { O_Pressed = false; }
});

gameLoop();

function reset() {
    new Audio('music/Game Over.mp3').play();
    clearInterval(ID);

    // Check for winning condition
    if (userScore >= scoreLimit) {
        alert("User 1 wins!");
        return endGame();
    } else if (user2Score >= scoreLimit) {
        alert("User 2 wins!");
        return endGame();
    }

    ball.style.marginLeft = '530px';
    ball.style.marginTop = '262px';
    gameLoop();
}

function gameLoop() {
    setTimeout(() => {
        ID = setInterval(() => {
            if (marginLeft(ball) < 0) {
                user2Score++;
                document.querySelector('#user2-score').innerHTML = user2Score;
                reset();
                return;
            }
            if ((marginLeft(ball) + 20) > 1088) {
                userScore++;
                document.querySelector('#user-score').innerHTML = userScore;
                reset();
                return;
            }
            if (marginTop(ball) < 0 || (marginTop(ball) + 30) > 544) {
                new Audio('music/boundaryhit-topbottom.mp3').play();
                vy *= -1; // Reverse vertical direction on boundary hit
            }

            let paddle = (marginLeft(ball) + 10 < 544) ? userpaddle : user2paddle;

            if (collisionDetected(paddle)) {
                console.log('collision');
                new Audio('music/paddlehit.mp3').play();
                let angle;
                let type = (marginLeft(paddle) == 30) ? 'user' : 'user2';
                if (ball.centerY < paddle.centerY) {
                    angle = (type == 'user' ? -Math.PI / 4 : (-3 * Math.PI) / 4);
                } else if (ball.centerY > paddle.centerY) {
                    angle = (type == 'user' ? Math.PI / 4 : (3 * Math.PI) / 4);
                }
                if (ball.centerY == paddle.centerY) {
                    angle = (type == 'user' ? 0 : Math.PI);
                }
                v += 0.5;

                vx = v * Math.cos(angle);
                vy = v * Math.sin(angle);
            }

            ball.style.marginLeft = `${marginLeft(ball) + vx}px`;
            ball.style.marginTop = `${marginTop(ball) + vy}px`;

            // User paddle movement
            if (W_Pressed && marginTop(userpaddle) > 0) {
                userpaddle.style.marginTop = `${marginTop(userpaddle) - 2}px`;
            } else if (S_Pressed && marginTop(userpaddle) < 472) {
                userpaddle.style.marginTop = `${marginTop(userpaddle) + 2}px`;
            }

            // User2 paddle movement
            if (K_Pressed && marginTop(user2paddle) < 472) {
                user2paddle.style.marginTop = `${marginTop(user2paddle) + 2}px`;
            } else if (O_Pressed && marginTop(user2paddle) > 0) {
                user2paddle.style.marginTop = `${marginTop(user2paddle) - 2}px`;
            }

        }, 5);
    }, 500);
}

function collisionDetected(paddle) {
    ball.top = marginTop(ball);
    ball.bottom = marginTop(ball) + 30;
    ball.left = marginLeft(ball);
    ball.right = marginLeft(ball) + 30;
    ball.centerX = marginLeft(ball) + 15;
    ball.centerY = marginTop(ball) + 15;

    paddle.top = marginTop(paddle);
    paddle.bottom = marginTop(paddle) + 72;
    paddle.left = marginLeft(paddle);
    paddle.right = marginLeft(paddle) + 10;
    paddle.centerX = marginLeft(paddle) + 5;
    paddle.centerY = marginTop(paddle) + 36;

    let type = (marginLeft(paddle) == 30) ? 'user' : 'user2';

    let bool = false;
    if (type == 'user' && vx < 0) { bool = true; }
    else if (type == 'user2' && vx > 0) { bool = true; }

    return ball.left < paddle.right && ball.top < paddle.bottom && ball.right > paddle.left && ball.bottom > paddle.top && bool;
}

function marginTop(element) {
    return Number(element.style.marginTop.split('p')[0]);
}

function marginLeft(element) {
    return Number(element.style.marginLeft.split('p')[0]);
}

// Function to end the game
function endGame() {
    clearInterval(ID); // Stop the game loop

    window.location.href = "index3.html"
}