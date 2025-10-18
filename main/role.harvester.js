/**
 * @module role.harvester
 * @description Logique pour le rôle de harvester.
 */

// Fonction pour assigner une source non utilisée à un nouveau harvester
function assignSourceToNewHarvester(creep) {
    if (!creep.memory.source_id) {
        // Récupérer toutes les sources dans la pièce
        const sources = creep.room.find(FIND_SOURCES);
        
        // Boucle externe : parcourir les sources
        for (let source of sources) {
            let isSourceUsed = false;
            
            // Boucle interne : parcourir les harvesters pour vérifier si la source est attribuée
            for (let name in Game.creeps) {
                let otherCreep = Game.creeps[name];
                if (otherCreep.memory.role === 'harvester' && otherCreep.memory.source_id === source.id && otherCreep.id !== creep.id) {
                    isSourceUsed = true;
                    break; // Sortir de la boucle interne dès qu'on trouve un harvester utilisant cette source
                }
            }
            
            // Si la source n'est pas utilisée, l'attribuer au creep
            if (!isSourceUsed) {
                creep.memory.source_id = source.id;
                return; // Sortir après avoir assigné une source
            }
        }
        
        // Cas où aucune source n'est disponible
        console.log('Aucune source libre pour ' + creep.name);
    }
}

var roleHarvester = {

    /** 
     * @param {Creep} creep - Le creep qui exécute le rôle.
     */
    run: function(creep) {
        // Assigne une source au harvester s'il n'en a pas.
        assignSourceToNewHarvester(creep);
        
        var source = Game.getObjectById(creep.memory.source_id);

        // Si la source n'existe plus, réinitialise la mémoire du creep.
        if (!source) {
            delete creep.memory.source_id;
            return;
        }

        // Recherche un conteneur à proximité de la source.
        var container = source.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: s => s.structureType == STRUCTURE_CONTAINER
        })[0];

        // Si le harvester est plein.
        if(creep.store.getFreeCapacity() == 0) {
            // S'il y a un conteneur, transfère l'énergie dedans.
            if(container) {
                if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            // Sinon, recherche un site de construction de conteneur.
            else {
                var constructionSite = source.pos.findInRange(FIND_CONSTRUCTION_SITES, 1, {
                    filter: s => s.structureType == STRUCTURE_CONTAINER
                })[0];

                // S'il y a un site de construction, le harvester le construit.
                if(constructionSite) {
                    if(creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(constructionSite, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                // Sinon, il crée un site de construction pour un conteneur.
                else {
                    creep.room.createConstructionSite(creep.pos, STRUCTURE_CONTAINER);
                }
            }
        }
        // Si le harvester n'est pas plein.
        else {
            // S'il y a un conteneur, il se déplace dessus et récolte.
            if (container) {
                if(creep.pos.isEqualTo(container.pos)) {
                    creep.harvest(source);
                } else {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            // Sinon, il se déplace vers la source et récolte.
            else {
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};

module.exports = roleHarvester;