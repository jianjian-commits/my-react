/* eslint-disable */
// Private array of chars to use
var CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
  ""
);
var ID = {};
let uuidTypeIndex = {};

ID.uuid = function(type, components = []) {
  if(components.length === 0) {
    uuidTypeIndex = {};
  }

  const keys = [];
  components.forEach(component => {
    if (component.type === "FormChildTest") {
      keys.push(component.key);
      component.values.forEach(item => {
        keys.push(item.key);
      });
    } else {
      keys.push(component.key);
    }
  });
  console.log(keys);

  while (
    keys.includes(type) &&
    (keys.includes(type + uuidTypeIndex[type]) ||
      !uuidTypeIndex.hasOwnProperty(type))
  ) {
    if (uuidTypeIndex.hasOwnProperty(type)) {
      uuidTypeIndex[type]++;
    } else {
      uuidTypeIndex[type] = 1;
    }
  }

  if (uuidTypeIndex.hasOwnProperty(type)) {
    return type + uuidTypeIndex[type];
  } else {
    return type;
  }
};

ID.oldUuid = function(len, radix) {
  var chars = CHARS,
    uuid = [],
    i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    // uuid[8] = uuid[13] = uuid[18] = '-'; //组件的ID中间不要连字符 （后端要求的，与公式校验功能有关）
    uuid[0] = 'M';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 1; i < 26; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join("");
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
