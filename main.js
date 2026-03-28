import { FPS } from "./JS/config.js"
import { canvas, ctx, state } from "./JS/state.js"
import { backgroundMusic } from "./JS/audio.js"
import { getMapInfo, init_paint_map, loadMapInfo, refreshKeyStatus } from "./JS/map.js"
import { init_creatures } from "./JS/entities.js"
import { borrar, dark_background, showText } from "./JS/ui.js"
import "./JS/input.js"

async function initialize() {
    await getMapInfo()
    init_paint_map()
    init_creatures()
    loadMapInfo()
    state.player.text()
    refreshKeyStatus()
    backgroundMusic.play()
    setInterval(function () {
        principal()
    }, 1000 / FPS)
}

function principal() {
    if (state.player.win) {
        showText("You have passed the level :D, press ENTER to restart")
        return
    }
    borrar()
    init_paint_map()

    state.player.paint()

    for (const enemy of state.enemies) {
        enemy.paint()
    }

    if (state.player.dead) {
        showText("You have died, press ENTER to respawn")
        return
    }

    if (!state.player.requestAccepted) {
        state.delay++
        showText("You need all books")
        if (state.delay >= 100) {
            state.player.requestAccepted = true
            state.delay = 0
        }
        return
    }

    if (state.pause) {
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

    state.player.enemyColition()

    for (const enemy of state.enemies) {
        enemy.move()
    }
}

document.addEventListener("DOMContentLoaded", initialize)