var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (!creep.memory.source_id) {
            var sources = creep.room.find(FIND_SOURCES);
            if (sources.length > 0) {
                creep.memory.source_id = sources[0].id;
            }
        }
        var source = Game.getObjectById(creep.memory.source_id);

        if (!source) {
            delete creep.memory.source_id;
            return;
        }

        // Find container
        var container = source.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: s => s.structureType == STRUCTURE_CONTAINER
        })[0];

        // If harvester is full
        if(creep.store.getFreeCapacity() == 0) {
            // If container found, transfer energy
            if(container) {
                if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            // If no container, check for construction site
            else {
                var constructionSite = source.pos.findInRange(FIND_CONSTRUCTION_SITES, 1, {
                    filter: s => s.structureType == STRUCTURE_CONTAINER
                })[0];

                // If construction site found, build it
                if(constructionSite) {
                    if(creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(constructionSite, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                // If no construction site, create one
                else {
                    creep.room.createConstructionSite(creep.pos, STRUCTURE_CONTAINER);
                }
            }
        }
        // If harvester is not full
        else {
            // If a container exists, move to its position and harvest
            if (container) {
                if(creep.pos.isEqualTo(container.pos)) {
                    creep.harvest(source);
                } else {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            // If no container, move to the source position and harvest
            else {
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};

module.exports = roleHarvester;