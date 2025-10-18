/**
 * @module action.spawn
 * @description Gère la logique de création de nouveaux creeps.
 */
var actionSpawn = {
    /**
     * @param {StructureSpawn} spawn - Le spawner à utiliser.
     */
    run: function(spawn) {
        // Compte le nombre de creeps pour chaque rôle.
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var spawners = _.filter(Game.creeps, (creep) => creep.memory.role == 'spawner');

        // Trouve les sites de construction et les structures à réparer.
        var constructionSites = spawn.room.find(FIND_CONSTRUCTION_SITES);
        var repairableStructures = spawn.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax
        });

        // Crée un nouveau builder s'il y en a moins de 4 et qu'il y a des travaux à faire.
        if(builders.length < 4 && (constructionSites.length > 0 || repairableStructures.length > 0)) {
            var newName = 'Builder' + Game.time;
            console.log('Création d\'un nouveau builder: ' + newName);
            spawn.spawnCreep([WORK,CARRY,MOVE], newName, 
                {memory: {role: 'builder'}});
        }

        // Crée un nouveau harvester s'il y a des sources d'énergie non assignées.
        var sources = spawn.room.find(FIND_SOURCES);
        if(harvesters.length < sources.length) {
            var assignedSources = _.map(harvesters, (c) => c.memory.source_id);
            var targetSource = _.find(sources, (s) => !_.includes(assignedSources, s.id));

            if(targetSource) {
                var newName = 'Harvester' + Game.time;
                console.log('Création d\'un nouvel harvester pour la source ' + targetSource.id);
                spawn.spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
                    {memory: {role: 'harvester', source_id: targetSource.id}});
            }
        }

        // Crée un nouvel upgrader s'il n'y en a pas.
        if(upgraders.length < 1) {
            var newName = 'Upgrader' + Game.time;
            console.log('Création d\'un nouvel upgrader: ' + newName);
            spawn.spawnCreep([WORK,CARRY,MOVE], newName, 
                {memory: {role: 'upgrader'}});
        }

        // Crée un nouveau spawner s'il n'y en a pas.
        if(spawners.length < 1) {
            var newName = 'Spawner' + Game.time;
            console.log('Création d\'un nouveau spawner: ' + newName);
            spawn.spawnCreep([WORK,CARRY,MOVE], newName, 
                {memory: {role: 'spawner'}});
        }
    }
};

module.exports = actionSpawn;