/**
 * Just for Object that with simple type and simple obj, not work for special obj and function.
 */
export const deepClone = Obj => {
  return JSON.parse(JSON.stringify(Obj));
};

export const findKey = (value, obj, compare = (a, b) => a === b) => {
  return Object.keys(obj).find(k => compare(obj[k], value))
  }