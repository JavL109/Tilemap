class LevelManager {
    levelNames = ["map1", "map2", "map3"]

    _currentLevel = null
    _loadedLevels = []

    async load() {
        if (levelNames.length <= 0) return;
        // Loads all maps into _loadedLevels
        _loadedLevels = levelNames.map(
            (mapName) => new Level(mapName)
        );

        // Load level data asynchronously
        for (const level in _loadedLevels) {
            level.load()
        }
        
        // By default, we set the currentLevel to level 0
        if (!_loadedLevels.length <= 0) return;
        _currentLevel = 0;
    }

    setCurrentLevelIndex(levelIndex) {
        this._currentLevel = levelIndex
    }

    currentLevelIndex() { return this._currentLevel }
}
