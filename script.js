const map1_history = "You decided to enter the Inferno Dungeons to 'save the world' How noble! What they didn't tell you is that it smells like sulfur, it's unbearably hot, and everything here wants to kill you. By the way, why does this fortress need three books to open a single portal? Demon architects are really something else.";
let mapCharged = false
let currentMap = 1

const delayForKeyRequest = 0
let delay = delayForKeyRequest


let canmove = true
let canvas = document.getElementById("canv");
let ctx = canvas.getContext("2d");

canvas.width = 1650
canvas.height = 850

const position = document.getElementById("position")
const status = document.getElementById("status")
const history = document.getElementById("history")

const FPS = 50;

//Colores
const rock = 0
const grass = 1
const lava = 2
const land = 3
const key = 4
const door = 5
//Casilla
const BoxS = 50;

//Ruta de imágrenes
const PlayerR = "./map/player.png";
const DevilR = "./map/devil.png"
const SkullR = "./map/skull.png"
const SlimeR = "./map/slime.png"
const keyR = "./map/book.png"
const wallR = "./map/wall.png"
const landR = "./map/land.png"
const doorR = "./map/portal.png"
const lavaR = "./map/lava.png"
//Move lists
const playerMovList = [door, land, key, grass]
const devilMovList = [grass, land]
const skullMovList = [grass, land, lava]
const slimeMovList = [grass, land]

const InitPlayerX = 100
const InitPlayerY = 150

const InitDevilX = 100
const InitDevilY = 600

const InitSkullX = 800
const InitSkullY = 550

const InitSlimeX = 1200
const InitSlimeY = 300

//const sprites
const sprites = {
    wall: new Image(),
    land: new Image(),
    door: new Image(),
    key: new Image(),
    skull: new Image(),
    player: new Image(),
    devil: new Image(),
    slime: new Image(),
    lava: new Image(),
}

const ranges = {
    skull: 5,
    slime: 6,
    devil: 4,
}

sprites.wall.src = wallR
sprites.land.src = landR

sprites.door.src = doorR
sprites.key.src = keyR

sprites.devil.src = DevilR
sprites.player.src = PlayerR
sprites.skull.src = SkullR
sprites.slime.src = SlimeR
sprites.lava.src = lavaR

let keyL = []
let numKeys = 0

//Mapa
//0 rock
//1 grass
//2 lava
//3 land
//4 key
//5 door
const map = [   //h= 17 x=33
    [2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2],
    [2, 2, 5, 2, 2, 1, 1, 0, 0, 0, 2, 2, 2, 2, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2],
    [2, 2, 1, 2, 1, 1, 1, 1, 1, 0, 2, 2, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 2, 2],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 1, 2, 2, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
    [0, 1, 1, 1, 1, 1, 1, 1, 4, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2],
    [0, 1, 1, 1, 1, 1, 2, 1, 1, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2],
    [0, 2, 1, 1, 1, 1, 2, 2, 1, 0, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2],
    [2, 2, 1, 1, 1, 2, 2, 2, 2, 0, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2],
    [2, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 2, 2, 1, 2, 2, 2, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 0, 1, 1, 1, 1, 1, 1, 4, 1, 1, 2, 2, 2],
    [0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2],
    [0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 2],
    [2, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2],
    [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2],
    [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    [2, 2, 2, 1, 2, 0, 1, 1, 1, 1, 1, 1, 0, 2, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
    [2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2],
]

//Clases
const prota = function (x, y, image, movL) {
    this.dead = false
    this.x = x;
    this.y = y;
    this.image = image
    this.win = false
    this.key = 0
    this.requestAccepted = true
    this.movL = movL

    this.logic = function (prevX, prevY) {
        if (getGrid(this.x, this.y) == key) {
            this.requestAccepted = true
            this.key++
            playMusic(keyAudioRoute, keyVolume)
            paint_map(this.x, this.y, grass)
            refreshKeyStatus()
        }

        if (getGrid(this.x, this.y) == door) {
            if (this.key >= numKeys) {
                this.win = true
                playMusic(portalAudioRoute, portalVolume)
                restart()
            } else {
                this.requestAccepted = false
                this.y = prevY
                this.x = prevX
            }
        }
    }

    this.enemyColition = function () {
        let hitDevil = false
        let hitSkull = false
        let hitSlime = false
        if (parseInt(this.x / 50) == parseInt(devil.x / 50) && parseInt(this.y / 50) == parseInt(devil.y / 50)) {
            hitDevil = true
        }

        if (parseInt(this.x / 50) == parseInt(skull.x / 50) && parseInt(this.y / 50) == parseInt(skull.y / 50)) {
            hitSkull = true
        }

        if (parseInt(this.x / 50) == parseInt(slime.x / 50) && parseInt(this.y / 50) == parseInt(slime.y / 50)) {
            hitSlime = true
        }

        if (hitSlime | hitSkull | hitDevil) {
            this.dead = true
            playMusic(deadAudioRoute, deadVolume)
            restart()
        }
    }

    this.paint = function () {
        ctx.drawImage(this.image, this.x, this.y, BoxS, BoxS)
    }

    this.move = function (where) {
        if (CanMove(this.x, this.y, where, movL)) {
            let prevX = this.x
            let prevY = this.y
            switch (where) {
                case "Up":
                    this.y -= BoxS
                    break
                case "Down":
                    this.y += BoxS
                    break
                case "Left":
                    this.x -= BoxS
                    break
                case "Right":
                    this.x += BoxS
                    break
            }
            this.logic(prevX, prevY)
            this.text()
            // playMusic(moveAudioRoute,moveVolume)
        }
    }

    this.text = function () {
        position.innerHTML = "<p>X:" + this.x + " Y:" + this.y + "</p>"
    }
}

const enemy = function (x, y, image, movL, timeToMov, range) {
    this.x = x
    this.y = y
    this.image = image
    this.movL = movL
    this.timeMov = timeToMov
    this.time = 0
    this.range = range

    this.paint = function () {
        ctx.drawImage(this.image, this.x, this.y, BoxS, BoxS)
    }

    this.move = function () {
        this.time += 1
        if (this.time >= this.timeMov) {
            let validMove = false
            this.time = 0
            const list = moveMaker(this.x, this.y, range, movL)
            this.x=list[0]
            this.y=list[1]
        }
    }
}
//Objetos
let player = new prota(InitPlayerX, InitPlayerY, sprites.player, playerMovList)
let devil = new enemy(InitDevilX, InitDevilY, sprites.devil, devilMovList, 30, ranges.devil)
let skull = new enemy(InitSkullX, InitSkullY, sprites.skull, skullMovList, 20, ranges.skull)
let slime = new enemy(InitSlimeX, InitSlimeY, sprites.slime, slimeMovList, 35, ranges.slime)


//-------------Iniciar carga de personajes y enemigos-------

function init_paint_map() {
    let selected
    for (let y = 0; y < canvas.height / BoxS; y++) {
        for (let x = 0; x < canvas.width / BoxS; x++) {
            if (map[y][x] == 0) {
                selected = sprites.wall
            } if (map[y][x] == 1) {
                selected = sprites.land
            } if (map[y][x] == 2) {
                selected = sprites.lava
            } if (map[y][x] == 3) {
                selected = sprites.land
            } if (map[y][x] == 4) {
                selected = sprites.key
                if (!mapCharged) {
                    keyL.push([x, y])
                    numKeys++
                }
            } if (map[y][x] == 5) {
                selected = sprites.door
            }

            ctx.drawImage(selected, x * BoxS, y * BoxS, BoxS, BoxS)
        }
    }
    mapCharged = true
}

function paint_map(x, y, color) {
    map[parseInt(y / BoxS)][parseInt(x / BoxS)] = color
}

function borrar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

//........................................Handle positions, if can move or not------------------------------------------
function moveMaker(x, y, range, list) {
    const distance = Math.sqrt((Math.pow(player.x - x,2)) + Math.pow(player.y - y, 2))/BoxS
    if (distance > range) {
        let validMove = false

        const canMoveR = CanMove(x, y, "Right", list)
        const canMoveL = CanMove(x, y, "Left", list)
        const canMoveU = CanMove(x, y, "Up", list)
        const canMoveD = CanMove(x, y, "Down", list)
        const canMoveUR = CanMove(x, y, "DiagUR", list)
        const canMoveUL = CanMove(x, y, "DiagUL", list)
        const canMoveDR = CanMove(x, y, "DiagDR", list)
        const canMoveDL = CanMove(x, y, "DiagDL", list)

        while (!validMove) {
            let ranNum = Math.round(Math.random() * 8) + 1
            switch (ranNum) {
                case 1:
                    if (canMoveUL) {
                        x -= BoxS
                        y -= BoxS
                        validMove = true
                    }
                    break
                case 2:
                    if (canMoveU) {
                        y -= BoxS
                        validMove = true
                    }
                    break
                case 3:
                    if (canMoveUR && canMoveU && canMoveR) {
                        x += BoxS
                        y -= BoxS
                        validMove = true
                    }
                    break

                case 4:
                    if (canMoveL) {
                        x -= BoxS
                        validMove = true
                    }
                    break

                case 5:
                    validMove = true
                    break

                case 6:
                    if (canMoveR) {
                        x += BoxS
                        validMove = true
                    }
                    break
                case 7:
                    if (canMoveDL && canMoveD && canMoveL) {
                        x -= BoxS
                        y += BoxS
                        validMove = true
                    }
                    break
                case 8:
                    if (canMoveD) {
                        y += BoxS
                        validMove = true
                    }
                    break
                case 9:
                    if (canMoveDR && canMoveD && canMoveR) {
                        x += BoxS
                        y += BoxS
                        validMove = true
                    }
                    break
                default:
                    console.log("Number not expected in function 'moveMaker'")
            }
        }
        return [x,y]
    } else {
        const path = aStar(x,y,player.x,player.y,list)
        if (path && path.length >1){
            const nextMove = path[1] ? path[1] : path[0]
            if (nextMove && typeof nextMove.x == "number" && typeof nextMove.y == "number"){
                return [nextMove.x, nextMove.y]
            } else {
                console.log("Error con el path")
            }
        }
        return [x,y]

    }
}

function getGrid(x, y) {
    return map[parseInt(y / BoxS)][parseInt(x / BoxS)]
}

function isMovable(x, y, movableL) {
    const grid = getGrid(x, y)
    for (let i = movableL.length - 1; i >= 0; i--) {
        if (grid == movableL[i]) {
            return true
        }
    }
    return false
}

function CanMove(x, y, where, movableL) {
    switch (where) {
        case "Up":
            if (y > 0) {
                if (isMovable(x, y - BoxS, movableL)) {
                    return true
                }
            }
            return false

        case "Down":
            if (y < canvas.height - BoxS) {
                if (isMovable(x, y + BoxS, movableL)) {
                    return true
                } else {
                    return false
                }
            }
            return false

        case "Right":
            if (x < canvas.width - BoxS) {
                if (isMovable(x + BoxS, y, movableL)) {
                    return true
                }
            }
            return false

        case "Left":
            if (x > 0) {
                if (isMovable(x - BoxS, y, movableL)) {
                    return true
                }
            }
            return false
        case "DiagUL":
            if (x > 0 && y > 0) {
                if (isMovable(x - BoxS, y - BoxS, movableL)) {
                    return true
                }
            }
            return false

        case "DiagUR":
            if (x < canvas.width - BoxS && y > 0) {
                if (isMovable(x + BoxS, y - BoxS, movableL)) {
                    return true
                }
            }
            return false

        case "DiagDL":
            if (x > 0 && y < canvas.height - BoxS) {
                if (isMovable(x - BoxS, y + BoxS, movableL)) {
                    return true
                }
            }
            return false

        case "DiagDR":
            if (x < canvas.width - BoxS && y < canvas.height - BoxS) {
                if (isMovable(x + BoxS, y + BoxS, movableL)) {
                    return true
                }
            }
            return false
    }

}

//------------------------Logic A*------------------------------------------
class Node {
    constructor(x, y, parent = null, cost = 0, goal) {
        this.x = x
        this.y = y
        this.parent = parent
        this.cost = cost
        this.h = 0 //heurística
        this.g = cost
        this.f = 0 //costo total estimado
        this.goal = goal

        if (this.goal) {
            this.h = heuristicVal(this, this.goal)
            this.f = this.g + this.h
        }
    }
}

function heuristicVal(InitNode, ExitNode) {
    const dx = Math.abs(InitNode.x - ExitNode.x)
    const dy = Math.abs(InitNode.y - ExitNode.y)

    return (10 * (dx + dy) - 6 * Math.min(dx, dy))
}

function aStar(initx, inity, finalx, finaly, list) {
    const finalNode = new Node(Math.floor(finalx / BoxS), Math.floor(finaly / BoxS))
    const initNode = new Node(Math.floor(initx / BoxS), Math.floor(inity / BoxS), null, 0, finalNode)

    const closedList = []
    const openList = []

    const movements = [
        { x: 0, y: -1, cost: 10 }, //Arriba
        { x: 0, y: 1, cost: 10 }, //Abajo
        { x: 1, y: 0, cost: 10 }, //Derecha
        { x: -1, y: 0, cost: 10 }, //Izq

        { x: -1, y: -1, cost: 14 }, //Arriba izquierda
        { x: 1, y: -1, cost: 14 }, //Arriba derecha
        { x: -1, y: 1, cost: 14 }, //Abajo izquierda
        { x: 1, y: 1, cost: 14 }, //Abajo Derecha
    ]

    openList.push(initNode)
    while (openList.length > 0) {

        //Obtener mejor casilla dentro de la open list
        let betterNode = openList[0]
        let betterIndex = 0 //F
        for (let i = 1; i < openList.length; i++) {
            const node = openList[i]
            if (node.f < betterNode.f ||
                node.f == betterNode.f && node.h < betterNode.h ||
                node.f == betterNode.f && node.h < betterNode.h && node.g < betterNode.g) {
                betterNode = node
                betterIndex = i
            }
        }


        //Mover casilla a la closedList
        openList.splice(betterIndex, 1)
        closedList.push(betterNode)
        //Verificar si esta casilla es la final
        if (betterNode.x == finalNode.x && betterNode.y == finalNode.y) {
            const path = []
            let actualNode = betterNode
            while (actualNode) {
                path.push({ x: actualNode.x * BoxS, y: actualNode.y * BoxS })
                actualNode = actualNode.parent
            }
            return path.reverse()
        }
        //Si no es la final buscar las vecinas  y añadirlas a la OpenList -> //Verificar si se puede mover o no
        for (const move of movements) {
            let cost, valid
            if (move.cost == 14) {   //Entonces es diagonal
                if (canMoveGrid(betterNode.x, betterNode.y + move.y, list) && canMoveGrid(betterNode.x + move.x, betterNode.y, list) && canMoveGrid(betterNode.x + move.x, betterNode.y + move.y, list)) valid = true
            } else {    //Es en línea
                if (canMoveGrid(betterNode.x + move.x, betterNode.y + move.y, list)) valid = true
            }
            if (!valid) continue
            const newNode = new Node(betterNode.x + move.x, betterNode.y + move.y, betterNode, betterNode.g + move.cost, finalNode)
            const inClosedList = closedList.find(n => n.x == newNode.x && n.y == newNode.y)
            if (inClosedList) continue
            const inOpenList = openList.find(n => n.x == newNode.x && n.y == newNode.y)
            if (!inOpenList) {
                openList.push(newNode)
            } else if (newNode.g < inOpenList.g) {
                inOpenList.g = newNode.g
                inOpenList.f = newNode.f
                inOpenList.parent = betterNode
                inOpenList.cost = newNode.cost
            }
        }
        //Actualizar el g,h y f de las casillas
    }
    return []
}

function canMoveGrid(gridX, gridY, movL) {
    if (gridX < 0 || gridY < 0 || gridX >= map[0].length || gridY >= map.length) {
        return false
    }

    const tileKey = map[gridY][gridX]
    if (movL.includes(tileKey)) return true

    return false
}

//--------------------------------Restart----------------------------------

function restart() {
    drawKey()

    player.x = InitPlayerX
    player.y = InitPlayerY
    player.key = 0

    devil.x = InitDevilX
    devil.y = InitDevilY

    slime.x = InitSlimeX
    slime.y = InitSlimeY

    skull.x = InitSkullX
    skull.y = InitSkullY

    mapCharged = false

    init_paint_map()
    refreshKeyStatus()
}

function drawKey() {
    for (let i = 0; i < numKeys; i++) {
        let actualArray = keyL[i]
        paint_map(actualArray[0] * BoxS, actualArray[1] * BoxS, key)
    }
    numKeys = 0
    keyL = []
}

//-----------------------------------------------------------------------------------------------------------
function dark_background() {
    ctx.fillStyle = "rgba(0,0,0,0.5)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)    //Low lighting on background}
}

function showText(text) {
    ctx.save()
    dark_background()
    ctx.fillStyle = "#FFFF"
    ctx.font = "bold 60px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)
    ctx.restore()
}

function loadMapInfo() {
    if (currentMap == 1) {
        history.innerHTML = map1_history
    }
}

function refreshKeyStatus() {
    init_paint_map()
    status.innerHTML = "<p>Amount of books: " + player.key + "</p><p>Total needed: " + numKeys
    const bookTrue = player.key
    const bookFalse = numKeys - bookTrue
    for (let i = 0; i < bookTrue; i++) {
        status.innerHTML += "<img src='./map/IconBookTrue.png' style='width:75px;height:75px' >"
    }
    for (let i = 0; i < bookFalse; i++) {
        status.innerHTML += "<img src='./map/IconBookFalse.png' style='width:75px;height:75px'>"
    }
}
//---------------------------------------Events---------------------------------
let pause = false

function spaceBar() {
    if (pause) {
        pause = false
        backgroundMusic.play()
    } else {
        pause = true
        backgroundMusic.pause()
    }
}
document.addEventListener("keydown", function (e) {

    if (e.key == " " && !player.dead) {
        spaceBar()
    }

    if (e.key == " " || e.key == "Enter") {
        if (player.dead) {
            player.dead = false
        }
    }

    if (e.key === "" || e.key === "Enter" && player.win) {
        player.win = false
    }

    if (!canmove || pause || player.dead || !player.requestAccepted) return;

    if (e.key == "ArrowUp" || e.key == "w") {
        player.move("Up")
        canmove = false
    }

    if (e.key == "ArrowDown" || e.key == "s") {
        player.move("Down")
        canmove = false
    }

    if (e.key == "ArrowRight" || e.key == "d") {
        player.move("Right")
        canmove = false
    }

    if (e.key == "ArrowLeft" || e.key == "a") {
        player.move("Left")
        canmove = false
    }

})

document.addEventListener("keyup", function (e) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(e.key)) {
        canmove = true;
    }
});

//-----------------------------------------------------------------------------
const backgroundMusic = new Audio("./music/music.wav")
backgroundMusic.loop = true
backgroundMusic.volume = 0.4
const deadAudioRoute = "./music/dead.wav"
const deadVolume = 1
const keyAudioRoute = "./music/key.wav"
const keyVolume = 0.3
const portalAudioRoute = "./music/portal.wav"
const portalVolume = 1
const moveAudioRoute = "./music/move.wav"
const moveVolume = 0.05

function playMusic(src, vol = 0.5) {
    const music = new Audio(src)
    music.volume = vol
    music.play()
}

function inicializar() {
    player.text()
    loadMapInfo()
    backgroundMusic.play()
    console.log("Funciona");
    init_paint_map()
    refreshKeyStatus()
    setInterval(function () {
        principal()
    }, 1000 / FPS)

}


function principal() {
    if (player.win) {
        showText("You have passed the level :D, press ENTER to restart")
        return
    }
    borrar()
    init_paint_map()
    slime.paint()
    devil.paint()
    skull.paint()
    player.paint()

    if (!player.requestAccepted) {
        delay++
        showText("You need all books")
        if (delay >= 100) {
            player.requestAccepted = true
            delay = 0
        }
        return
    }

    if (player.dead) {
        showText("You have died, press ENTER to respawn")
        return
    }

    if (pause) {
        ctx.save()

        dark_background()

        ctx.fillStyle = "#ede245d8"
        const barWidth = 20
        const barHeight = 80
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2

        ctx.fillRect(centerX - 40, centerY - barHeight / 2, barWidth, barHeight)
        ctx.fillRect(centerX + 20, centerY - barHeight / 2, barWidth, barHeight)

        ctx.restore()

        return
    }

    player.enemyColition()

    //player.showlocation()

    devil.move()
    skull.move()
    slime.move()

}
//---------Futuras cosas-----------
//Hacer para que el A* solo busque el path si el jugador se encuentra dentro del rango enemigo y no actualizar hasta q el jugador se mueva
//Cambiar el parseInt por Math.floor
//Más mapas
//Sistema de inteligencia para enemigos -> A*
//Objeto que permita al personaje caminar sobre la lava
//Objeto para caminar sobre el agua
//Mapa final
//Sistema para leer otros archivos que es donde se guarda la información
//de los mapas y ubicación de enemigos
//Sistema de colores e imágenes autoajustable -> meter dentro de string cada cosa
