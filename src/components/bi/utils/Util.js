/**
 * Just for Object that with simple type and simple obj, not work for special obj and function.
 */
export const deepClone = Obj => {
  return JSON.parse(JSON.stringify(Obj));
};