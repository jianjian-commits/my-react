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

/**
 * Vary simple id.
 */
export const getUUID = () => {
  return Date.now() + parseInt(Math.random() * 1000)
}

/**
 * Get the text width.
 */
export const getTextWidth = (text, fontSize = "12px", fontFamily = 'sans-serif') => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = fontSize + " " + fontFamily;
  return context.measureText(text).width;
}