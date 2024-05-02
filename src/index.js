const _ = require("lodash");
const roleHarvester = require("./role.harvester");
const roleUpgrader = require("./role.upgrader");
const roleBuilder = require("./role.builder");
const roleDefender = require("./role.defender");

const ROLE_HARVESTER = "harvester";
const ROLE_UPGRADER = "upgrader";
const ROLE_BUILDER = "builder";
const ROLE_DEFENDER = "defender";

const creepConfig = {
  [ROLE_HARVESTER]: [WORK, CARRY, MOVE],
  [ROLE_UPGRADER]: [WORK, CARRY, MOVE],
  [ROLE_BUILDER]: [WORK, CARRY, MOVE],
  [ROLE_DEFENDER]: [ATTACK, MOVE],
};

module.exports.loop = function () {
  console.log(`CPU limit: ${Game.cpu.limit}`);
  console.log(`CPU used: ${Game.cpu.getUsed()}`);

  // Check if harvester creeps exist, if not, spawn them
  const harvesters = _.filter(
    Game.creeps,
    (creep) => creep.memory.role === ROLE_HARVESTER
  );
  const sources = Game.spawns["Spawn1"].room.find(FIND_SOURCES);

  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    const sourceHarvesters = _.filter(
      harvesters,
      (creep) => creep.memory.sourceIndex === i
    );

    if (sourceHarvesters.length === 0) {
      const newName = `${ROLE_HARVESTER}_${Game.time}_${i}`;
      Game.spawns["Spawn1"].spawnCreep(creepConfig[ROLE_HARVESTER], newName, {
        memory: { role: ROLE_HARVESTER, sourceIndex: i },
      });
      console.log(`Spawned new harvester ${newName} for source ${i}`);
    }
  }

  // Spawn an upgrader if there are none
  const upgraders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role === ROLE_UPGRADER
  );
  if (upgraders.length === 0) {
    const newName = `${ROLE_UPGRADER}_${Game.time}`;
    Game.spawns["Spawn1"].spawnCreep(creepConfig[ROLE_UPGRADER], newName, {
      memory: { role: ROLE_UPGRADER },
    });
    console.log(`Spawned new upgrader: ${newName}`);
  }

  // Spawn builders
  const builders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role === ROLE_BUILDER
  );
  if (builders.length < 2) {
    const newName = `${ROLE_BUILDER}_${Game.time}`;
    Game.spawns["Spawn1"].spawnCreep(creepConfig[ROLE_BUILDER], newName, {
      memory: { role: ROLE_BUILDER },
    });
    console.log(`Spawned new builder: ${newName}`);
  }

  // Spawn defenders
  const defenders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role === ROLE_DEFENDER
  );
  if (defenders.length < 1) {
    const newName = `${ROLE_DEFENDER}_${Game.time}`;
    Game.spawns["Spawn1"].spawnCreep(creepConfig[ROLE_DEFENDER], newName, {
      memory: { role: ROLE_DEFENDER },
    });
    console.log(`Spawned new defender: ${newName}`);
  }

  // Run the appropriate role for each creep
  for (const creepName in Game.creeps) {
    const creep = Game.creeps[creepName];
    switch (creep.memory.role) {
      case ROLE_HARVESTER:
        roleHarvester.run(creep);
        break;
      case ROLE_UPGRADER:
        roleUpgrader.run(creep);
        break;
      case ROLE_BUILDER:
        roleBuilder.run(creep);
        break;
      case ROLE_DEFENDER:
        roleDefender.run(creep);
        break;
      default:
        console.log(`Unknown role: ${creep.memory.role}`);
    }
  }
};
