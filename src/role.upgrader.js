/**
 * @param {Creep} creep
 */
const roleUpgrader = {
  run: function (creep) {
    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.upgrading = false;
      creep.say("🔄 harvest");
      console.log(`${creep.name} is switching to harvesting`);
    }
    if (!creep.memory.upgrading && creep.store.getFreeCapacity() === 0) {
      creep.memory.upgrading = true;
      creep.say("⚡ upgrade");
      console.log(`${creep.name} is switching to upgrading`);
    }

    if (creep.memory.upgrading) {
      if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {
          visualizePathStyle: { stroke: "#ffffff" },
        });
        console.log(`${creep.name} is moving to upgrade the controller`);
      } else {
        console.log(`${creep.name} is upgrading the controller`);
      }
    } else {
      const sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
        console.log(`${creep.name} is moving to harvest energy`);
      } else {
        console.log(`${creep.name} is harvesting energy`);
      }
    }
    console.log(
      `${creep.name} (${creep.memory.role}): ${
        creep.store[RESOURCE_ENERGY]
      }/${creep.store.getCapacity()} energy`
    );
  },
};

module.exports = roleUpgrader;
