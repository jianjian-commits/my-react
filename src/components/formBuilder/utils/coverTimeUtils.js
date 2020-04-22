import moment from 'moment'

function localDate(date, componentType) {
  // 将utc时区时间转为当前本地时间
  switch(componentType){
    case "DateInput":break;
    case "PureTime":
      if(!moment(date).isValid()){
        // 是否在组件内使用
        date = `2016/9/3 ${date}`
      };break;
    case "PureDate":break;
    default: return moment.utc(date+"Z").local().format("YYYY-MM-DD HH:mm:ss")
  }
  if(moment(date).isValid()){
    return moment.utc(date).local();
  }
  return ;
}

function utcDate(date, componentType){
  // 将本地时间转为utc时间
  switch(componentType){
    case "DateInput":
      return moment(date).utc().millisecond(0).format().replace("Z","");
    case "PureTime":
      return moment(date).utc().millisecond(0).format("HH:mm:ss.SSS")
    case "PureDate":
      return moment(date).utc().millisecond(0).format("YYYY-MM-DD")
  }
  return ;
}

export default {
  localDate,
  utcDate
};
