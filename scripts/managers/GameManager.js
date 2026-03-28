class GameManager {
    musicManager = new MusicManager()
    levelManager = new LevelManager()

    enemies = []
    player = new Player()

    async initalize() {
        await getMapInfo()
        init_paint_map()
        init_creatures()
        levelManager.load()
        player.text()
        refreshKeyStatus()
        musicManager.play()

        setInterval(function () {
            main()
        }, 1000 / FPS)
    };

    main() {
        if (player.win) {
            showText("You have passed the level :D, press ENTER to restart")
            return
        }
        borrar()
        init_paint_map()

        player.paint()
        
        for (const enemy of enemies) {
            enemy.paint()
        }
            
        if (player.dead) {
            showText("You have died, press ENTER to respawn")
            return
        }

        if (!player.requestAccepted) {
            delay++
            showText("You need all books")
            if (delay >= 100) {
                player.requestAccepted = true
                delay = 0
            }
            return
        }

        if (pause) {
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

        player.enemyColition()

        //player.showlocation()

        for (const enemy of enemies) {
            enemy.move()
        }
    };
}
