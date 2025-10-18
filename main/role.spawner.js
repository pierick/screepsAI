/**
 * @module role.spawner
 * @description Logique pour le rôle de spawner. Ce creep a pour but de transporter l'énergie 
 * des sources vers les spawns et extensions.
 */
var actionHarvest = require('action.harvest');

var roleSpawner = {

    /** 
     * @param {Creep} creep - Le creep qui exécute le rôle.
     */
    run: function(creep) {

        // Si le creep a de la capacité libre, il va récolter de l'énergie.
        if(creep.store.getFreeCapacity() > 0) {
            actionHarvest.run(creep);
        }
        // Sinon, il va transférer l'énergie aux spawns ou extensions.
        else {
            // Recherche des spawns et extensions qui ont besoin d'énergie.
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            // S'il y a des cibles, le creep transfère l'énergie à la plus proche.
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleSpawner;