import { state } from "./state.js"
import { backgroundMusic } from "./audio.js"
import { reset_level } from "./map.js"

function spaceBar() {
    if (state.pause) {
        state.pause = false
        backgroundMusic.play()
    } else {
        state.pause = true
        backgroundMusic.pause()
    }
}

document.addEventListener("keydown", function (e) {

    if (e.key == " " && !state.player.dead) {
        spaceBar()
    }

    if (e.key == " " || e.key == "Enter") {
        if (state.player.dead) {
            state.player.dead = false
            reset_level()
        }
    }

    if (e.key === "" || e.key === "Enter" && state.player.win) {
        state.player.win = false
    }

    if (!state.canmove || state.pause || state.player.dead || !state.player.requestAccepted) return;

    if (e.key == "ArrowUp" || e.key == "w") {
        state.player.move("Up")
        state.canmove = false
    }

    if (e.key == "ArrowDown" || e.key == "s") {
        state.player.move("Down")
        state.canmove = false
    }

    if (e.key == "ArrowRight" || e.key == "d") {
        state.player.move("Right")
        state.canmove = false
    }

    if (e.key == "ArrowLeft" || e.key == "a") {
        state.player.move("Left")
        state.canmove = false
    }

})

document.addEventListener("keyup", function (e) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(e.key)) {
        state.canmove = true;
    }
});