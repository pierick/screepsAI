/**
 * Module pour l'action de récolte d'énergie.
 * @module action.harvest
 */
var actionHarvest = {
    /**
     * Exécute l'action de récolte pour un creep.
     * @param {Creep} creep - Le creep qui va récolter.
     */
    run: function(creep) {
        // Cherche le conteneur le plus proche avec de l'énergie.
        var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
        });

        // Si un conteneur est trouvé, le creep va y retirer de l'énergie.
        if (container) {
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                // Se déplace vers le conteneur s'il n'est pas à portée.
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } 
        // S'il n'y a pas de conteneur, le creep va récolter directement à la source.
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                // Se déplace vers la source si elle n'est pas à portée.
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = actionHarvest;