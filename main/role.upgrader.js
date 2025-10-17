var actionHarvest = require('action.harvest');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if (!creep.memory.roadPlanned) {
            const path = creep.pos.findPathTo(creep.room.controller);
            creep.memory.pathToController = path;
            for (const pos of path) {
                creep.room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
            }
            creep.memory.roadPlanned = true;
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            actionHarvest.run(creep);
        }
    }
};

module.exports = roleUpgrader;
