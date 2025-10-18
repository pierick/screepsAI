/**
 * @module role.upgrader
 * @description Logique pour le rôle d'upgrader.
 */
var actionHarvest = require('action.harvest');

var roleUpgrader = {

    /** 
     * @param {Creep} creep - Le creep qui exécute le rôle.
     */
    run: function(creep) {

        // Si le creep est en mode amélioration et n'a plus d'énergie, il passe en mode récolte.
        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 récolte');
        }
        // Si le creep n'est pas en mode amélioration et que sa soute est pleine, il passe in mode amélioration.
        if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ amélioration');
        }

        // Si aucune route vers le contrôleur n'a été planifiée, en crée une.
        if (!creep.memory.roadPlanned) {
            const path = creep.pos.findPathTo(creep.room.controller);
            creep.memory.pathToController = path;
            for (const pos of path) {
                // Ne crée pas de site de construction à l'emplacement du contrôleur.
                if (pos.x === creep.room.controller.pos.x && pos.y === creep.room.controller.pos.y) {
                    continue; // Passe à la position suivante.
                }
                creep.room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
            }
            creep.memory.roadPlanned = true;
        }

        // Si le creep est en mode amélioration.
        if(creep.memory.upgrading) {
            // Se déplace vers le contrôleur et l'améliore.
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        // Sinon, il récolte de l'énergie.
        else {
            actionHarvest.run(creep);
        }
    }
};

module.exports = roleUpgrader;