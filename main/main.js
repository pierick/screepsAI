/**
 * @module main
 * @description Fichier principal du jeu, contient la boucle de jeu.
 */

// Importation des différents modules de rôles et d'actions.
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleSpawner = require('role.spawner');
var roomDefense = require('room.defense');
var actionSpawn = require('action.spawn');

/**
 * @description Boucle de jeu principale, exécutée à chaque tick.
 */
module.exports.loop = function () {

    // Nettoyage de la mémoire des creeps qui n'existent plus.
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Nettoyage de la mémoire du creep inexistant:', name);
        }
    }

    // Planification des murs de défense pour chaque pièce.
    for(var roomName in Game.rooms) {
        var room = Game.rooms[roomName];
        roomDefense.planWalls(room);
    }

    // Exécution de la logique de spawn.
    actionSpawn.run(Game.spawns['Spawn1']);

    // Affichage d'un indicateur visuel lors de la création d'un creep.
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }

    // Exécution de la logique pour chaque creep en fonction de son rôle.
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'spawner') {
            roleSpawner.run(creep);
        }
    }
}