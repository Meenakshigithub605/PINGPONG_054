let userpaddle = document.querySelector('#user-paddle');
let comppaddle = document.querySelector('#comp-paddle');
let ball = document.querySelector('#ball');

userpaddle.style.marginLeft = '30px';
userpaddle.style.marginTop = '0px';
comppaddle.style.marginLeft = '1048px';
comppaddle.style.marginTop = '0px';
ball.style.marginLeft = '530px';
ball.style.marginTop = '262px';

let W_Pressed = false;
let S_Pressed = false;

let ID;

let vx = -1;
let vy = -1;
let v = Math.sqrt(Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2)));

let userScore = 0;
let compScore = 0;

document.addEventListener('keydown', (e) => {
    if (e.keyCode == '87') {
        W_Pressed = true;
    }
    else if (e.keyCode == '83') {
        S_Pressed = true;
    }
});
document.addEventListener('keyup', (e) => {
    if (e.keyCode == '87') {
        W_Pressed = false;
    }
    else if (e.keyCode == '83') {
        S_Pressed = false;
    }
});

// Get score limit from URL parameters
function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get(name)) || 10; // Default to 10 if not set
}
const scoreLimit = getParameterByName('score');

gameLoop();

function reset() {
    new Audio('music/Game Over.mp3').play();
    clearInterval(ID);
    console.log(compScore, userScore);
    // Check for winning condition
    if (userScore >= scoreLimit) {
        alert("User 1 wins!");
        return endGame();
    } else if (compScore >= scoreLimit) {
        alert("Computer wins!");
        return endGame();
    }

    let vx = -1;
    let vy = -1;
    let v = Math.sqrt(Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2)));
    ball.style.marginLeft = '530px';
    ball.style.marginTop = '262px';
    gameLoop();
}

function gameLoop() {
    setTimeout(() => {
        ID = setInterval(() => {
            if (marginLeft(ball) < 0) {
                compScore++;
                document.querySelector('#comp-score').innerHTML = Number(document.querySelector('#comp-score').innerHTML) + 1;
                reset();
                return;
            }
            if ((marginLeft(ball) + 20) > 1088) {
                userScore++;
                document.querySelector('#user-score').innerHTML = Number(document.querySelector('#user-score').innerHTML) + 1;
                reset();
                return;
            }
            if (marginTop(ball) < 0 || (marginTop(ball) + 30) > 544) {
                new Audio('music/boundaryhit-topbottom.mp3').play();
                vy = -vy;
            }

            let paddle = (marginLeft(ball) + 10 < 544) ? userpaddle : comppaddle;

            if (collisionDetected(paddle)) {
                console.log('collision');
                new Audio('music/paddlehit.mp3').play();
                let angle;
                let type = (marginLeft(paddle) == 30) ? 'user' : 'comp';
                if (ball.centerY < paddle.centerY) {
                    angle = (type == 'user' ? -Math.PI / 4 : (-3 * Math.PI) / 4);
                }
                else if (ball.centerY > paddle.centerY) {
                    angle = (type == 'user' ? Math.PI / 4 : (3 * Math.PI) / 4);
                }
                if (ball.centerY == paddle.centerY) {
                    angle = (type == 'user' ? 0 : Math.PI);
                }
                v += 0.5;

                vx = v * Math.cos(angle);
                vy = v * Math.sin(angle);
            }

            let compLevel = 1;
            comppaddle.style.marginTop = `${marginTop(comppaddle) + ((ball.centerY - (marginTop(comppaddle) + 36))) * compLevel}px`

            ball.style.marginLeft = `${marginLeft(ball) + vx}px`;
            ball.style.marginTop = `${marginTop(ball) + vy}px`;

            if (W_Pressed && marginTop(userpaddle) > 0) {
                userpaddle.style.marginTop = `${marginTop(userpaddle) - 2}px`;
            }
            else if (S_Pressed && marginTop(userpaddle) < 472) {
                userpaddle.style.marginTop = `${marginTop(userpaddle) + 2}px`;
            }

            if (marginTop(comppaddle) < 0) {
                comppaddle.style.marginTop = '0px';
            }
            else if (marginTop(comppaddle) > 472) {
                comppaddle.style.marginTop = '472px';
            }

        }, 5)
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

    let type = (marginLeft(paddle) == 30) ? 'user' : 'comp';

    let bool = false;
    if (type == 'user' && vx < 0) { bool = true }
    else if (type == 'comp' && vx > 0) {
        bool = true
    }

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