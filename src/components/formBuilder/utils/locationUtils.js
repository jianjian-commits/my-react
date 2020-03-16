function getUrlParamObj() {
  var args = {};
  var query = window.location.search.substring(1);
  var pairs = query.split("&");
  for (var i = 0; i < pairs.length; i++) {
    var pos = pairs[i].indexOf("=");
    if (pos === -1) continue;
    var name = pairs[i].substring(0, pos);
    var value = pairs[i].substring(pos + 1);
    value = decodeURIComponent(value);
    args[name] = value;
  }
  return args;
}

/**
 * @description: 从url中获取数据
 * @param {String} 数据名
 * @return: {String}
 */
export function getDataFromUrl(name, defaultValue = "") {
  if (!name) {
    return defaultValue;
  }
  var query = decodeURIComponent(window.location.search.substring(1));
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == name) {
      return decodeURIComponent(pair[1]) || defaultValue;
    }
  }
  return defaultValue;
}

export default {
  getUrlParamObj: getUrlParamObj
};
