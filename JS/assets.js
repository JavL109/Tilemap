export const assets = {
    structures: {},
    enemies: {},
    player: null,
    key: null,
    door: null
}

export function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = (e) => reject("Error loading: " + src)
        img.src = src
    })
}