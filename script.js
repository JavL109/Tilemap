
const delayForKeyRequest = 0
let delay = delayForKeyRequest
let canmove = true

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
            this.x = list[0]
            this.y = list[1]
        }
    }
}

//-------------Iniciar carga de personajes y enemigos-------
let currentMap = 1
let mapCharged = currentMap-1
let mapInfo

let newMap, structures, keys, doors, typesOfEnemies, playerStart, mapId, mapHistory, mapName, playerMovList, numKeys,originalKeys
const assets = {
    structures: {},
    enemies: {},
    player: null,
    key: null,
    door: null
}

async function getMapInfo() {
    if (currentMap > mapCharged) {
        try {
            mapInfo = await chargeMap()
            if (!mapInfo) throw new Error("No se ha recibido el mapa")

            newMap = mapInfo.mapCoords
            structures = mapInfo.structuresCode
            keys = mapInfo.keysCoords
            doors = mapInfo.doorsCoords
            typesOfEnemies = mapInfo.enemies
            playerStart = mapInfo.playerStart
            mapId = mapInfo.id
            mapHistory = mapInfo.history
            mapName = mapInfo.mapName
            playerMovList = mapInfo.playerMovList
            numKeys = keys.length
            originalKeys = JSON.parse(JSON.stringify(mapInfo.keysCoords)); 
            console.log("MAPA CARGADO:", currentMap, "Llaves originales:", originalKeys);
            for (const structure of structures) {
                const src = "./images/structures/" + structure.name + ".png"
                assets.structures[structure.code] = await loadImage(src)
            }

            for (const enemy of typesOfEnemies) {
                const name = enemy.type
                const src = "./images/enemies/" + name + ".png"
                assets.enemies[name] = await loadImage(src)
            }
            assets.key = await loadImage("./images/general/book.png")
            assets.player = await loadImage("./images/general/player.png")
            assets.door = await loadImage("./images/general/portal.png")

            mapCharged++
        } catch (error) {
            console.error("Error: " + error)
        }
    }
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = (e) => reject("Error loading: " + src)
        img.src = src
    })
}

function paint_map(x, y, color) {
    const gridX = x / BoxS
    const gridY = y / BoxS
    newMap[parseInt(gridY)][parseInt(gridX)] = color
}

let enemies = []
let player

function init_creatures() {
    enemies = []
    if (typesOfEnemies) {
        for (const enemyType of typesOfEnemies) {
            const movL = enemyType.walkableStructures
            const name = enemyType.type
            const image = assets.enemies[name]
            const range = enemyType.range
            const timeToMov = enemyType.time
            for (const coord of enemyType.coords) {
                const x = coord.gridX * BoxS
                const y = coord.gridY * BoxS
                enemies.push(new enemy(x, y, image, movL, timeToMov, range))
            }
        }
    }

    if (playerStart) {
        const x = playerStart.gridX * BoxS
        const y = playerStart.gridY * BoxS
        const image = assets.player
        player = new prota(x, y, image, playerMovList)
        refreshKeyStatus()
    }
}

//........................................Handle positions, if can move or not------------------------------------------
function moveMaker(x, y, range, list) {
    const distance = Math.sqrt((Math.pow(player.x - x, 2)) + Math.pow(player.y - y, 2)) / BoxS
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
        return [x, y]
    } else {
        const path = aStar(x, y, player.x, player.y, list)
        if (path && path.length > 1) {
            const nextMove = path[1] ? path[1] : path[0]
            if (nextMove && typeof nextMove.x == "number" && typeof nextMove.y == "number") {
                return [nextMove.x, nextMove.y]
            } else {
                console.log("Error con el path")
            }
        }
        return [x, y]

    }
}

function getGrid(x, y) {
    return newMap[Math.floor((y / BoxS))][Math.floor(parseInt(x / BoxS))]
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
    if (gridX < 0 || gridY < 0 || gridX >= newMap[0].length || gridY >= newMap.length) {
        return false
    }

    const tileKey = newMap[gridY][gridX]
    if (movL.includes(tileKey)) return true

    return false
}

//--------------------------------Restart----------------------------------

async function nextLevel() {
    
    currentMap++
    await getMapInfo()
    init_paint_map()
    init_creatures()
    loadMapInfo()
    player.text()
    refreshKeyStatus()
}

function reset_level(){
    console.log("REINICIANDO... Llaves en memoria:", keys, "Copia de seguridad:", originalKeys);
    keys=JSON.parse(JSON.stringify(originalKeys))
    player.x=playerStart.gridX*BoxS
    player.y=playerStart.gridY*BoxS
    init_paint_map()
    init_creatures()
    loadMapInfo()
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
    history.innerHTML = mapInfo.history
}

function refreshKeyStatus() {
    init_paint_map()
    status.innerHTML = "<p>Amount of books: " + player.key + "</p><p>Total needed: " + numKeys
    const bookTrue = player.key
    const bookFalse = numKeys - bookTrue
    for (let i = 0; i < bookTrue; i++) {
        status.innerHTML += "<img src='./images/icon/IconBookTrue.png' style='width:75px;height:75px' >"
    }
    for (let i = 0; i < bookFalse; i++) {
        status.innerHTML += "<img src='./images/icon/IconBookFalse.png' style='width:75px;height:75px'>"
    }
}
//---------------------------------------Events---------------------------------
document.addEventListener("keydown", function (e) {

    if (e.key == " " && !player.dead) {
        spaceBar()
    }

    if (e.key == " " || e.key == "Enter"){
        if (player.dead) {
            player.dead = false
            reset_level()
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
