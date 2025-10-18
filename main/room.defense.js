/**
 * @module room.defense
 * @description Gère la planification de la défense de la pièce.
 */
const roomDefense = {
    /**
     * @param {Room} room - La pièce à défendre.
     */
    planWalls: function(room) {
        // Si les murs ont déjà été planifiés, ne rien faire.
        if (room.memory.wallsPlanned) {
            return;
        }

        // Recherche toutes les sorties de la pièce.
        const exits = room.find(FIND_EXIT);
        const terrain = Game.map.getRoomTerrain(room.name);

        // Pour chaque sortie, planifie une ligne de murs.
        for (let i = 0; i < exits.length; i++) {
            const exit = exits[i];

            // Détermine la direction du mur en fonction de la position de la sortie.
            let wallDirection;
            if (exit.x === 0) wallDirection = 'right';
            else if (exit.x === 49) wallDirection = 'left';
            else if (exit.y === 0) wallDirection = 'down';
            else if (exit.y === 49) wallDirection = 'up';

            // Trouve une ligne appropriée pour le mur.
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

                    // Vérifie si la position est valide et n'est pas un mur naturel.
                    if (x < 0 || x > 49 || y < 0 || y > 49 || terrain.get(x, y) === TERRAIN_MASK_WALL) {
                        wallLineClear = false;
                        break;
                    }
                    wallPositions.push({x: x, y: y});
                }

                // Si la ligne est dégagée, crée les sites de construction pour les murs.
                if (wallLineClear) {
                    for (const pos of wallPositions) {
                        room.createConstructionSite(pos.x, pos.y, STRUCTURE_WALL);
                    }
                    break; // Passe à la sortie suivante.
                }
            }
        }

        // Marque les murs comme planifiés pour ne pas recommencer à chaque tick.
        room.memory.wallsPlanned = true;
    }
};

module.exports = roomDefense;
