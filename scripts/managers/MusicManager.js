
class MusicManager {
    backgroundMusic = new Audio("./music/music.wav")
    deadAudio = new Audio("./music/dead.wav")
    moveAudio = new Audio("./music/move.wav")
    keyAudio = new Audio("./music/key.wav")
    portalAudio = new Audio("./music/portal.wav")
    moveAudio = new Audio("./music/move.wav")

    constructor() {
        initInput()
    }

    initInput() {
        document.addEventListener("keydown", (e) => {
            if (e.key == " ") {
                //togglePause()
            }
        })
    }
}
