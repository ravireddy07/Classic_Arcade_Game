const billboard = document.getElementById('billboard')
const announcements = document.getElementById('announcements')
const winDisplay = document.getElementById('win')
const lossDisplay = document.getElementById('loss')
const winPhrases = ['Bananas!!', 'You win', 'Great', 'Wonderful', 'How did you do that!', 'Epic', 'This will be remembered', 'Historic crossing', 'What a dodge!', 'Look at you!', 'Champ', 'BUG-CRUSH', 'Do it. DO IT', 'Viral meme', 'Happy thoughts', 'Win-win']
const lossPhrases = ['Mashed', 'Guacamoled', 'Banana split', 'Pureed', 'Bugged infested', 'Wasted youth', 'Give up!', 'Look before you cross', 'reaction level: 0', 'Hold the door', 'Over ran', 'Trashed', 'Trailer parked', 'Lost your marbles']

// ********** Enemy
let Enemy = function(x, y, speed) {
    /* Params set on object initialization */
    this.x = x
    this.y = y
    this.speed = speed
    this.sprite = 'images/enemy-bug.png'
}

// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // Multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt

    // when off canvas, respawn enemy
    if (this.x > 505) {
        /* respawn params: (min speed, max speed, min starting position, max starting position) */
        this.respawn(100, 300, 50, 500)
        this.levelUp()
    }

    this.collision()
}

// Respawn enemy with random speed and off screen position
Enemy.prototype.respawn = function(minSpeed, maxSpeed, minPos, maxPos) {
    let randomSpeed = numberGenerator(minSpeed, maxSpeed)
    let randomStartingPoint = numberGenerator(minPos, maxPos)
    this.x = -randomStartingPoint
    this.speed = randomSpeed
}

// Level up every 5 accumulated wins
Enemy.prototype.levelUp = function() {
    let wins = winDisplay.innerText
    /* speed between 100 (very slow) - 1000 (very fast). Position between 50 (immediately off screen left) and 500 (farther left, takes time to reappear on screen) */
    if (wins > 4) this.respawn(200, 400, 50, 400)
    if (wins > 9) this.respawn(250, 400, 50, 350)
    if (wins > 14) this.respawn(250, 500, 50, 300)
    if (wins > 19) this.respawn(100, 700, 50, 200)
    if (wins > 24) this.respawn(300, 600, 50, 100)
    if (wins > 29) this.respawn(400, 800, 50, 100)
    if (wins > 34) this.respawn(500, 1000, 50, 100)
}

// Collision between player and enemy
Enemy.prototype.collision = function() {
     if (player.x < this.x + 70 &&
        player.x + 37 > this.x &&
        player.y < this.y + 25 &&
        30 + player.y > this.y) {
        player.reset()
        player.handleLoss()
    }
}

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y)
}


// ********** Player
let Player = function(x, y, speed) {
    /* Params set on object initialization */
    this.x = x
    this.y = y
    this.speed = speed
    this.sprite = 'images/char-cat-girl.png'
}

Player.prototype.update = function() {
    // Keep Player inside canvas
    if (this.x < 0)  this.x = 0
    if (this.x > 400) this.x = 400
    if (this.y > 380)  this.y = 380

    // Win condition
    if (this.y < 0) {
        this.reset()
        this.handleWin()
    }
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y)
}

// Reset function that places  Player on a random starting block
Player.prototype.reset = function() {
    let xArray = [0, 100, 200, 300, 400]
    let yArray = [300, 380]
    shuffle(xArray)
    shuffle(yArray)
    this.x = xArray[0]
    this.y = yArray[0]
}

// Win and Loss sequences
let loss = 0
Player.prototype.handleLoss = function() {
    shuffle(lossPhrases)
    loss++
    lossDisplay.innerText = loss
    announcements.classList.add('loss-sequence')
    lossDisplay.classList.add('loss-sequence')
    announcements.innerText = lossPhrases[0]
    setTimeout( () => {
        announcements.classList.remove('loss-sequence')
        lossDisplay.classList.remove('loss-sequence')
    }, 800)
}

let win = 0
Player.prototype.handleWin = function() {
    shuffle(winPhrases)
    win++
    winDisplay.innerText = win
    announcements.classList.add('win-sequence')
    winDisplay.classList.add('win-sequence')
    announcements.innerText = winPhrases[0]
    this.nextLevel()
    setTimeout( () => {
        announcements.classList.remove('win-sequence')
        winDisplay.classList.remove('win-sequence')
    }, 800)
}

Player.prototype.nextLevel = function() {
    let wins = winDisplay.innerText
    if (wins === '1') announcements.innerText = 'Level: 1. Gentle stroll'
    if (wins === '5') announcements.innerText = 'Level: 2. Morning rush'
    if (wins === '10') announcements.innerText = 'Level: 3. Quick dash'
    if (wins === '15') announcements.innerText = 'Level: 4. Run for it'
    if (wins === '20') announcements.innerText = 'Level: 5. Cross fit'
    if (wins === '25') announcements.innerText = 'Level: 6. Cross trial, and error'
    if (wins === '30') announcements.innerText = 'Level: 7. Hit and run'
    if (wins === '35') announcements.innerText = 'Level: 8. Insane mode UNLOCKED'
}

Player.prototype.handleInput = function(keyPress) {
    switch (keyPress) {
        case 'left':
            this.x -= this.speed + 50
            break
        case 'up':
            this.y -= this.speed + 30
            break
        case 'right':
            this.x += this.speed + 50
            break
        case 'down':
            this.y += this.speed + 30
            break
    }
}

// Instantiate Player
/* Params: x, y (200, 380 for central starting block), speed */
let player = new Player(200, 380, 50)

// Instantiate Enemy
let allEnemies = []
let enemyLane = [60, 140, 220]

enemyLane.forEach( y => {
    // Instantiate on enemy for each y lane, spawn it 150 off screen left (x), and give it a random speed
    let randomSpeed = numberGenerator(100, 300)
    let enemy = new Enemy(-150, y, randomSpeed)
    allEnemies.push(enemy)
})

document.addEventListener('keyup', function(e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    }

    player.handleInput(allowedKeys[e.keyCode])
})

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }

    return array
}

function numberGenerator(min, max) {
    return min + Math.floor(Math.random() * max)
}