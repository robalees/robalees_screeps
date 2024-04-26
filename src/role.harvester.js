const roleHarvester = {
  run: function (creep) {
    if (creep.store.getFreeCapacity() > 0) {
      const sources = creep.room.find(FIND_SOURCES);
      const sourceIndex = creep.memory.sourceIndex || 0;
      if (creep.harvest(sources[sourceIndex]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[sourceIndex], {
          visualizePathStyle: { stroke: "#ffaa00" },
        });
        console.log(
          `${creep.name} is moving to harvest energy from source ${sourceIndex}`
        );
      } else {
        console.log(
          `${creep.name} is harvesting energy from source ${sourceIndex}`
        );
      }
    } else {
      const targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType === STRUCTURE_EXTENSION ||
              structure.structureType === STRUCTURE_SPAWN) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        },
      });
      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#ffffff" },
          });
          console.log(
            `${creep.name} is moving to transfer energy to ${targets[0].structureType}`
          );
        } else {
          console.log(
            `${creep.name} is transferring energy to ${targets[0].structureType}`
          );
        }
      } else {
        creep.moveTo(creep.room.controller);
        console.log(`${creep.name} is moving to the room controller`);
      }
    }
    console.log(
      `${creep.name} (${creep.memory.role}): ${
        creep.store[RESOURCE_ENERGY]
      }/${creep.store.getCapacity()} energy`
    );
  },
};

module.exports = roleHarvester;
