const MAX_TOWERS = 2;
/**
 * @param {Creep} creep
 */
const roleBuilder = {
  run: function (creep) {
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.building = false;
      creep.say("🔄 harvest");
    }
    if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
      creep.memory.building = true;
      creep.say("🚧 build");
    }

    if (creep.memory.building) {
      const buildPriority = [
        STRUCTURE_TOWER,
        STRUCTURE_EXTENSION,
        STRUCTURE_ROAD,
        STRUCTURE_WALL,
        STRUCTURE_RAMPART,
        STRUCTURE_STORAGE,
      ];

      for (const structureType of buildPriority) {
        if (shouldBuildStructure(creep.room, structureType, MAX_TOWERS)) {
          const buildPos = findBuildLocation(creep.room, structureType);
          creep.room.createConstructionSite(buildPos, structureType);
          break;
        }
      }

      const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#ffffff" },
          });
        }
      } else {
        const damagedStructures = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => structure.hits < structure.hitsMax,
        });
        if (damagedStructures.length) {
          if (creep.repair(damagedStructures[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(damagedStructures[0], {
              visualizePathStyle: { stroke: "#ffffff" },
            });
          }
        }
      }
    } else {
      const sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }
  },
};

function shouldBuildStructure(room, structureType, maxCount) {
  const structures = room.find(FIND_STRUCTURES, {
    filter: (structure) => structure.structureType === structureType,
  });

  return structures.length < maxCount;
}

function findBuildLocation(room, structureType) {
  // Logic to find a suitable build location for the given structure type
  // You can customize this based on your specific requirements
  // For simplicity, let's assume we want to build structures near the spawn
  const spawn = room.find(FIND_MY_SPAWNS)[0];
  const buildPos = spawn.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
    filter: (site) => site.structureType === structureType,
  });

  if (buildPos) {
    return buildPos;
  }

  return spawn.pos.findClosestByRange(FIND_MY_STRUCTURES, {
    filter: (structure) => structure.structureType === STRUCTURE_SPAWN,
  }).pos;
}

module.exports = roleBuilder;
