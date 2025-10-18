/**
 * @module role.builder
 * @description Logique pour le rôle de builder.
 */
var actionHarvest = require('action.harvest');

var roleBuilder = {

    /** 
     * @param {Creep} creep - Le creep qui exécute le rôle.
     */
    run: function(creep) {

        // Si le creep est en mode construction et n'a plus d'énergie, il passe en mode récolte.
        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 récolte');
        }
        // Si le creep n'est pas en mode construction et que sa soute est pleine, il passe en mode construction.
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 construction');
        }

        // Si le creep est en mode construction.
        if(creep.memory.building) {
            // Recherche des sites de construction.
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                // S'il y a des sites de construction, le creep construit le plus proche.
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                // Sinon, il recherche des structures à réparer.
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax
                });

                // Trie les cibles par points de vie restants.
                targets.sort((a,b) => a.hits - b.hits);

                // S'il y a des structures à réparer, le creep répare la plus endommagée.
                if(targets.length > 0) {
                    if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        }
        // Si le creep n'est pas en mode construction, il récolte de l'énergie.
        else {
            actionHarvest.run(creep);
        }
    }
};

module.exports = roleBuilder;