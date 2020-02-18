function formatTime(time) {
  return time < 10 ? "0" + time : time;
};
// 参数 时间字符串, 格式化的样式
function localTime(time, formatString="yyyy-MM-dd hh:mm:ss"){
  let date = new Date(time);
  // 将utc时区时间转为当前本地时间
  let currentTimeZoneOffsetInHours = date.getTimezoneOffset()/60;
  date.setHours(date.getHours()-currentTimeZoneOffsetInHours)

  formatString = formatString.replace("yyyy",date.getFullYear())
                  .replace("MM", date.getMonth() + 1)
                  .replace("dd", formatTime(date.getDate()))
                  .replace("hh", formatTime(date.getHours()))
                  .replace("mm", formatTime(date.getMinutes()))
                  .replace("ss", formatTime(date.getSeconds()));
  return formatString;
};

export default {
  localTime: localTime
};