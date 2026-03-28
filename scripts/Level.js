class Level {
    name = null
    levelData = null

    constructor(name) {
        this.name = name
    }

    async load() {
        if (!this.name) return;

        const response = await fetch("./maps/map" + this.name + ".json")
        if (!response) {
            throw new Error("Could not fetch map " + this.name)
        }
        if (!response.ok) {
            throw new Error(response.status)
        }

        const json = await response.json()
        if (!json) {
            throw new Error("Invalid json syntax of level " + this.name)
        }

        this.levelData = json;
    }
}