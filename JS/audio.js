export const backgroundMusic = new Audio("./music/music.wav")
backgroundMusic.loop = true
backgroundMusic.volume = 0.4

export function playMusic(src, vol = 0.5) {
    const music = new Audio(src)
    music.volume = vol
    music.play()
}