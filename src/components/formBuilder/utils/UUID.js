/* eslint-disable */
// Private array of chars to use
var CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
  ""
);
var ID = {};

const uuidTypeIndex = {};
ID.uuid = function(type) {
  if (uuidTypeIndex.hasOwnProperty(type)) {
    uuidTypeIndex[type]++;
    return type + uuidTypeIndex[type];
  } else {
    uuidTypeIndex[type] = 0;
    return type;
  }
};

// A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
// by minimizing calls to random()
ID.uuidFast = function() {
  var chars = CHARS,
    uuid = new Array(36),
    rnd = 0,
    r;
  for (var i = 0; i < 36; i++) {
    if (i == 8 || i == 13 || i == 18 || i == 23) {
      uuid[i] = "-";
    } else if (i == 14) {
      uuid[i] = "4";
    } else {
      if (rnd <= 0x02) rnd = (0x2000000 + Math.random() * 0x1000000) | 0;
      r = rnd & 0xf;
      rnd = rnd >> 4;
      uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
    }
  }
  return uuid.join("");
};

// A more compact, but less performant, RFC4122v4 solution:
ID.uuidCompact = function() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
module.exports = ID;
