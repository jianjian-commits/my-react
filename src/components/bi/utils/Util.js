/**
 * Just for Object that with simple type and simple obj, not work for special obj and function.
 */
export const deepClone = Obj => {
  return JSON.parse(JSON.stringify(Obj));
};


/**
 * Get the key by value and obj.
 */
export const findKey = (value, obj, compare = (a, b) => a === b) => {
  return Object.keys(obj).find(k => compare(obj[k], value))
}

/**
 * Compare two object is equal, only for properties.
 */
export const equals = (o1, o2) => {
  return JSON.stringify(o1) == JSON.stringify(o2)
}