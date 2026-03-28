import { canvas, ctx } from "./state.js"

export function dark_background() {
    ctx.fillStyle = "rgba(0,0,0,0.5)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

export function showText(text) {
    ctx.save()
    dark_background()
    ctx.fillStyle = "#FFFF"
    ctx.font = "bold 60px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)
    ctx.restore()
}

export function borrar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}