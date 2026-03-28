import { BoxS } from "./config.js"
import { canvas, state } from "./state.js"

export function getGrid(x, y) {
    return state.newMap[Math.floor((y / BoxS))][Math.floor(parseInt(x / BoxS))]
}

export function isMovable(x, y, movableL) {
    const grid = getGrid(x, y)
    for (let i = movableL.length - 1; i >= 0; i--) {
        if (grid == movableL[i]) {
            return true
        }
    }
    return false
}

export function CanMove(x, y, where, movableL) {
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

class Node {
    constructor(x, y, parent = null, cost = 0, goal) {
        this.x = x
        this.y = y
        this.parent = parent
        this.cost = cost
        this.h = 0
        this.g = cost
        this.f = 0
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

export function aStar(initx, inity, finalx, finaly, list) {
    const finalNode = new Node(Math.floor(finalx / BoxS), Math.floor(finaly / BoxS))
    const initNode = new Node(Math.floor(initx / BoxS), Math.floor(inity / BoxS), null, 0, finalNode)

    const closedList = []
    const openList = []

    const movements = [
        { x: 0, y: -1, cost: 10 },
        { x: 0, y: 1, cost: 10 },
        { x: 1, y: 0, cost: 10 },
        { x: -1, y: 0, cost: 10 },
        { x: -1, y: -1, cost: 14 },
        { x: 1, y: -1, cost: 14 },
        { x: -1, y: 1, cost: 14 },
        { x: 1, y: 1, cost: 14 },
    ]

    openList.push(initNode)
    while (openList.length > 0) {

        let betterNode = openList[0]
        let betterIndex = 0
        for (let i = 1; i < openList.length; i++) {
            const node = openList[i]
            if (node.f < betterNode.f ||
                node.f == betterNode.f && node.h < betterNode.h ||
                node.f == betterNode.f && node.h < betterNode.h && node.g < betterNode.g) {
                betterNode = node
                betterIndex = i
            }
        }

        openList.splice(betterIndex, 1)
        closedList.push(betterNode)

        if (betterNode.x == finalNode.x && betterNode.y == finalNode.y) {
            const path = []
            let actualNode = betterNode
            while (actualNode) {
                path.push({ x: actualNode.x * BoxS, y: actualNode.y * BoxS })
                actualNode = actualNode.parent
            }
            return path.reverse()
        }

        for (const move of movements) {
            let cost, valid
            if (move.cost == 14) {
                if (canMoveGrid(betterNode.x, betterNode.y + move.y, list) && canMoveGrid(betterNode.x + move.x, betterNode.y, list) && canMoveGrid(betterNode.x + move.x, betterNode.y + move.y, list)) valid = true
            } else {
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
    }
    return []
}

export function canMoveGrid(gridX, gridY, movL) {
    if (gridX < 0 || gridY < 0 || gridX >= state.newMap[0].length || gridY >= state.newMap.length) {
        return false
    }
    const tileKey = state.newMap[gridY][gridX]
    if (movL.includes(tileKey)) return true
    return false
}

export function moveMaker(x, y, range, list) {
    const distance = Math.sqrt((Math.pow(state.player.x - x, 2)) + Math.pow(state.player.y - y, 2)) / BoxS
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
                    if (canMoveUL) { x -= BoxS; y -= BoxS; validMove = true }
                    break
                case 2:
                    if (canMoveU) { y -= BoxS; validMove = true }
                    break
                case 3:
                    if (canMoveUR && canMoveU && canMoveR) { x += BoxS; y -= BoxS; validMove = true }
                    break
                case 4:
                    if (canMoveL) { x -= BoxS; validMove = true }
                    break
                case 5:
                    validMove = true
                    break
                case 6:
                    if (canMoveR) { x += BoxS; validMove = true }
                    break
                case 7:
                    if (canMoveDL && canMoveD && canMoveL) { x -= BoxS; y += BoxS; validMove = true }
                    break
                case 8:
                    if (canMoveD) { y += BoxS; validMove = true }
                    break
                case 9:
                    if (canMoveDR && canMoveD && canMoveR) { x += BoxS; y += BoxS; validMove = true }
                    break
                default:
                    console.log("Number not expected in function 'moveMaker'")
            }
        }
        return [x, y]
    } else {
        const path = aStar(x, y, state.player.x, state.player.y, list)
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