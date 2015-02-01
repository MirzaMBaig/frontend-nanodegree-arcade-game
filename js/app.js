/**
 * initial position of enemy
 * @const {number}
 */
var ENEMY_INIT_POSITION_Y = 62;
/**
 * distance of one step on y axis
 * @const {number}
 */
var STEP_Y = 83;
/**
 * distance of one step on x axis
 * @const {number}
 */
var STEP_X = 101;
/**
 * initial default speed of enemy
 * @const {number}
 */
var ENEMY_DEFAULT_SPEED = 200;

/**
 * Max number of rounds
 * @const {number}
 */
var MAX_ROUNDS = 5;

/**
 * count the
 * @type {number}
 */
var roundCount = 0;

/**
 * when game start this will set to true & on collision/completion it will set to false
 * @type {boolean}
 */
var startGame = false;

/**
 * game level
 * @type {number}
 */
var gameLevel = gameLevel || Number(2);

/**
 * Enemy {object} the player must avoid
 * @param position_y initial position
 * @param speed initial speed
 * @constructor
 */
var Enemy = function (position_y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    //init position of enemy
    this.x = 1;
    this.y = position_y;
    //default speed of enemy
    this.speed = speed;
};

//generates random number for speed
var randomSpeed = function () {
    return (((Math.ceil(Math.random() * 2)) * (Number(gameLevel))) / 2) * ENEMY_DEFAULT_SPEED;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks

Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.speed <= 1) {
        this.speed = 10;
    }
    if (this.x > 505) {
        this.x = 1;
        this.speed = dt * randomSpeed();
    } else {
        this.x += this.speed;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * resets enemy while start of game/round
 */
Enemy.prototype.reset = function () {
    this.x = 1;
};

/**
 * player initial position on x axis
 * @returns {number}
 */
var positionX = function () {
    return 200;
};

/**
 * player initial position on y axis
 * @returns {number}
 */
var positionY = function () {
    return 325;
};

var Player = function () {
    this.x = positionX();
    this.y = positionY();
    this.sprite = 'images/char-boy.png';
};


/**
 * move the player as per key directions
 * @param directionKey
 */
Player.prototype.move = function (directionKey) {

    switch (directionKey) {
        case 'up':
            if (this.y < STEP_Y) {
                this.y = 0;
                setTimeout(function () {
                    success();
                }, 100);
            } else {
                this.y -= STEP_Y;
            }
            break;
        case 'right':
            if (this.x > 390) {
                return false;
            }
            this.x += STEP_X;
            break;
        case 'left':
            if (this.x < 30) {
                return false;
            }
            this.x -= STEP_X;
            break;
        case 'down':
            if (this.y > 400) {
                return false;
            }
            this.y += STEP_Y;
            break;
    }
};

Player.prototype.update = function (dt) {
};

Player.prototype.reset = function () {
    this.x = positionX();
    this.y = positionY();
};

// Draw the player on the screen, required method for game
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// handles direction arrows and guide player movements
Player.prototype.handleInput = function (directionKey) {
    if (!directionKey || !startGame) {
        return false;
    }
    this.move(directionKey);
};

/**
 * instantiating player object.
 * @type {Player}
 */
var player = new Player();

// factory object to create enemies
var EnemyFactory = function () {
    this.createEnemies = function (howMany) {
        var enemies = [];
        for (var i = 0; i < howMany; ++i) {
            enemies.push(new Enemy(ENEMY_INIT_POSITION_Y + (STEP_Y * i), randomSpeed()));
        }
        return enemies;
    }
};

//Place all enemy objects in an array called allEnemies
var allEnemies = new EnemyFactory().createEnemies(3);

/**
 * start new game
 */
function startNewGame() {
    roundCount = 0;
    $('img').remove();
    startRound();
    Engine.init();
}
/**
 * start new round
 */
function startRound() {
    startGame = true;
    player.reset();
    allEnemies.forEach(function (enemy) {
        enemy.reset();
    });
}

/**
 * @param success
 * collision detected OR game is successfully completed
 */
function endRound(success) {
    greyOutScreen('collided');
    setTimeout(function () {
        startRound();
    }, 2000);
    startGame = success || false;
}

/**
 * on completion(collision OR success) grey out the screen
 */
function greyOutScreen(outcome) {
    var imgData = ctx.getImageData(0, 0, 505, 606);
    var l = imgData.data.length;
    for (var i = 0; i < l; i += 4) {
        var avg = (imgData.data[i] * 0.34) + (imgData.data[i + 1] * 0.5 ) + (imgData.data[i + 2] * 0.16);
        imgData.data[i] = avg;
        imgData.data[i + 1] = avg;
        imgData.data[i + 2] = avg;
        //imgData.data[i+3]=255;

    }
    ctx.putImageData(imgData, 0, 0);

    ctx.font = '36pt Impact';
    ctx.fillStyle = 'Red';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    var fillTxt = '';
    var strokeTxt = '';
    if (outcome === 'gameover') {
        ctx.font = '40pt Impact';
        ctx.fillStyle = 'Green';
        fillTxt = 'You Won';
        strokeTxt = 'You Won';
        ctx.fillText(fillTxt, 150, 195);
        ctx.strokeText(strokeTxt, 150, 195);
    } else if (outcome === 'collided') {
        ctx.fillStyle = 'Red';
        fillTxt = 'Oops...Run again';
        strokeTxt = 'Oops...Run again';
        ctx.fillText(fillTxt, 100, 95);
        ctx.strokeText(strokeTxt, 100, 95);
    } else if (outcome === 'roundover') {
        ctx.fillStyle = 'Green';
        fillTxt = 'Hurry...Play again';
        strokeTxt = 'Hurry...Play again';
        ctx.fillText(fillTxt, 100, 95);
        ctx.strokeText(strokeTxt, 100, 95);
    }
}

/**
 *
 * @param player_x - player x axis
 * @param player_y - player y axis
 * @param tile_x - tile x axis
 * @param tile_y - tile y axis
 */
function checkCollisions(player_x, player_y, tile_x, tile_y) {
    var h = STEP_Y / 2;//height
    var w = STEP_X - 10;//width
    if (player_x < tile_x + w &&
        player_x + w > tile_x &&
        player_y < tile_y + h &&
        h + player_y > tile_y) {
        endRound();
    }
}

/**
 * add a gem on success
 */
function addGem() {
    $('#gems').append('<img src="images/Gem Orange.png" alt="One Gen added"/>');
}

/**
 * successful completion of round
 */
function success() {
    addGem();
    startGame = false;
    if (++roundCount >= MAX_ROUNDS) {
        greyOutScreen('gameover');
        setTimeout(function () {
            startNewGame();
        }, 2000);

    } else {
        greyOutScreen('roundover');
        setTimeout(function () {
            startRound();
        }, 1000);
    }

}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});