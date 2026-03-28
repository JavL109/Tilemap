const Move = { Up, Down, Left, Right };

class Player {
    // Player parameters
    x = 0
    y = 0
    playerSprite = null
    moveLength = 0

    // Signals
    onHasWinned = new Signal()

    constructor(x, y,
                playerSprite, moveLength) {
        this.x = x
        this.y = y
        this.playerSprite = playerSprite
        this.moveLength = moveLength
    }

    paint(ctx) {
        ctx.drawImage(this.image, this.x, this.y, BoxS, BoxS)
    }

    move(where) {
        if (!CanMove(this.x, this.y, where, this.moveLength)) return;

        let prevX = this.x
        let prevY = this.y
        switch (where) {
            case Move.Up:
                this.y -= BoxS
                break
            case Move.Down:
                this.y += BoxS
                break
            case Move.Left:
                this.x -= BoxS
                break
            case Move.Right:
                this.x += BoxS
                break
        }
    
        this.onHasMoved(prevX, prevY)
        // playMusic(moveAudioRoute,moveVolume)
    }

    onHasMoved(previousX, previousY) {
        const gridX = Math.floor(this.x / BoxS)
        const gridY = Math.floor(this.y / BoxS)

        if (keys.length > 0) {
            let i = 0
            for (const k of keys) {
                if (gridX == k.gridX && gridY == k.gridY) {
                    this.requestAccepted = true
                    this.key++
                    playMusic(keyAudioRoute, keyVolume)
                    refreshKeyStatus()
                    console.log("LLAVE RECOGIDA. Restantes en keys:", keys.length);
                    break
                }
                i++
            }
            keys.splice(i, 1)
        }

        if (doors.length > 0) {
            for (const door in doors) {
                const hasEnteredDoor = door.gridX == gridX && door.gridY == gridY;
                const hasEnoughKeys = this.key >= numKeys;
                
                if (!hasEnteredDoor) return
                
                if (!hasEnoughKeys) {
                    this.requestAccepted = false
                    console.log(this.requestAccepted)
                    this.y = prevY
                    this.x = prevX
                        
                    return
                }

                onHasWinned.fire()
                break
            }
        }
    }
}
