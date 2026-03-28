
// This is an HTML custom element, which means
// you can include this into html by doing:
// <canvas-manager></canvas-manager>
// directly.
class CanvasManager extends HTMLCanvasElement {
    ctx = this.getContext("2d");
    FPS = 50;

    constructor() {
        this.width = 1650
        this.height = 850
    }

    onPaint() {
        paintMap();
    }

    clearCanvas() {
        ctx.clearRect(0, 0, this.width, this.height);
    }

    paintMap() {
        for (let gridY = 0; gridY < newMap.length; gridY++) {
            for (let gridX = 0; gridX < newMap[0].length; gridX++) {
                const code = newMap[gridY][gridX]
                const img = assets.structures[code]
                const x = gridX * BoxS
                const y = gridY * BoxS
                if (img) {
                    if (newMap[gridY][gridX] == code) {

                        ctx.drawImage(img, x, y, BoxS, BoxS)
                    }
                } else {
                    ctx.Style = "magenta"    //If no image was uploades
                    ctx.fillRect(x, y, BoxS, BoxS)
                }
            }
        }

        if (keys) {
            for (const key of keys) {
                const x = key.gridX * BoxS
                const y = key.gridY * BoxS
                ctx.drawImage(assets.key, x, y, BoxS, BoxS)
            }
        }
        if (doors) {
            for (const door of doors) {
                const x = door.gridX * BoxS
                const y = door.gridY * BoxS
                ctx.drawImage(assets.door, x, y, BoxS, BoxS)
            }
        }
    }
}

customElements.define("canvas-manager", CanvasManager)