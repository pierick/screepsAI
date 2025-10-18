var actionSpawn = {
    run: function(spawn) {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var spawners = _.filter(Game.creeps, (creep) => creep.memory.role == 'spawner');

        var constructionSites = spawn.room.find(FIND_CONSTRUCTION_SITES);
        var repairableStructures = spawn.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax
        });

        if(builders.length < 4 && (constructionSites.length > 0 || repairableStructures.length > 0)) {
            var newName = 'Builder' + Game.time;
            console.log('Spawning new builder: ' + newName);
            spawn.spawnCreep([WORK,CARRY,MOVE], newName, 
                {memory: {role: 'builder'}});
        }

        var sources = spawn.room.find(FIND_SOURCES);
        if(harvesters.length < sources.length) {
            var assignedSources = _.map(harvesters, (c) => c.memory.source_id);
            var targetSource = _.find(sources, (s) => !_.includes(assignedSources, s.id));

            if(targetSource) {
                var newName = 'Harvester' + Game.time;
                console.log('Spawning new harvester for source ' + targetSource.id);
                spawn.spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
                    {memory: {role: 'harvester', source_id: targetSource.id}});
            }
        }

        if(upgraders.length < 1) {
            var newName = 'Upgrader' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            spawn.spawnCreep([WORK,CARRY,MOVE], newName, 
                {memory: {role: 'upgrader'}});
        }

        if(spawners.length < 1) {
            var newName = 'Spawner' + Game.time;
            console.log('Spawning new spawner: ' + newName);
            spawn.spawnCreep([WORK,CARRY,MOVE], newName, 
                {memory: {role: 'spawner'}});
        }
    }
};

module.exports = actionSpawn;
