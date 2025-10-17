const roomDefense = {
    planWalls: function(room) {
        if (room.memory.wallsPlanned) {
            return;
        }

        const exits = room.find(FIND_EXIT);
        const terrain = Game.map.getRoomTerrain(room.name);

        for (let i = 0; i < exits.length; i++) {
            const exit = exits[i];

            // Determine wall placement direction
            let wallDirection;
            if (exit.x === 0) wallDirection = 'right';
            else if (exit.x === 49) wallDirection = 'left';
            else if (exit.y === 0) wallDirection = 'down';
            else if (exit.y === 49) wallDirection = 'up';

            // Find a suitable line for the wall
            for (let dist = 2; dist < 5; dist++) {
                let wallLineClear = true;
                let wallPositions = [];

                for (let j = -2; j <= 2; j++) {
                    let x = exit.x;
                    let y = exit.y;

                    if (wallDirection === 'left' || wallDirection === 'right') {
                        x = (wallDirection === 'left') ? exit.x - dist : exit.x + dist;
                        y = exit.y + j;
                    } else {
                        x = exit.x + j;
                        y = (wallDirection === 'up') ? exit.y - dist : exit.y + dist;
                    }

                    if (x < 0 || x > 49 || y < 0 || y > 49 || terrain.get(x, y) === TERRAIN_MASK_WALL) {
                        wallLineClear = false;
                        break;
                    }
                    wallPositions.push({x: x, y: y});
                }

                if (wallLineClear) {
                    for (const pos of wallPositions) {
                        room.createConstructionSite(pos.x, pos.y, STRUCTURE_WALL);
                    }
                    break; // Move to the next exit
                }
            }
        }

        room.memory.wallsPlanned = true;
    }
};

module.exports = roomDefense;