const roleHarvester = require("./role.harvester");
const roleUpgrader = require("./role.upgrader");

module.exports.loop = function () {
  console.log(`CPU limit: ${Game.cpu.limit}`);
  console.log(`CPU used: ${Game.cpu.getUsed()}`);
  // Check if harvester creeps exist, if not, spawn them
  const harvesters = _.filter(
    Game.creeps,
    (creep) => creep.memory.role === "harvester"
  );
  const sources = Game.spawns["Spawn1"].room.find(FIND_SOURCES);

  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    const sourceHarvesters = _.filter(
      harvesters,
      (creep) => creep.memory.sourceIndex === i
    );

    if (sourceHarvesters.length === 0) {
      const newName = "Harvester" + Game.time + "_" + i;
      Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
        memory: { role: "harvester", sourceIndex: i },
      });
      console.log(`Spawned new harvester ${newName} for source ${i}`);
    }
  }

  // Spawn an upgrader if there are none
  const upgraders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role === "upgrader"
  );
  if (upgraders.length === 0) {
    const newName = "Upgrader" + Game.time;
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: "upgrader" },
    });
    console.log(`Spawned new upgrader: ${newName}`);
  }

  // Run the appropriate role for each creep
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role === "harvester") {
      roleHarvester.run(creep);
    } else if (creep.memory.role === "upgrader") {
      roleUpgrader.run(creep);
    }
  }
};
