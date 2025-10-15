var roleHarvester = require('role.harvester');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var sources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);

    if(harvesters.length < sources.length) {
        var newName = 'Harvester' + Game.time;
        
        var assigned_creeps = _.map(harvesters, (c) => c.memory.source_id);
        var available_source = _.find(sources, (s) => !_.contains(assigned_creeps, s.id));

        if(available_source) {
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
                {memory: {role: 'harvester', source_id: available_source.id}});
        }
    }
}