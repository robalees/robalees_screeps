/**
 * @param {Creep} creep
 */
const roleDefender = {
  run: function (creep) {
    const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
    if (hostiles.length) {
      if (creep.attack(hostiles[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(hostiles[0], {
          visualizePathStyle: { stroke: "#ff0000" },
        });
      }
    } else {
      const flags = Game.flags;
      if (flags.length) {
        creep.moveTo(flags[0]);
      }
    }
  },
};

module.exports = roleDefender;
