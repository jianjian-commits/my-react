import moment from 'moment'

function localDate(date, componentType, isEditData) {
  // 将utc时区时间转为当前本地时间
  switch(componentType){
    case "DateInput":
      if(moment(date).isValid()){
        if(isEditData){
          return moment.utc(date).local()
        }
        return moment.utc(date).local().format("YYYY-MM-DD HH:mm:ss");
      }
    break;
    case "PureTime":
      if(!moment(date).isValid()){
        // 是否在组件内使用 2020-04-17T03:37:01.633
        date =  new Date(`2016-09-03T${date}Z`)
      };
      if(moment(date).isValid()){
        if(isEditData){
          return moment.utc(date).local()
        }
        return moment.utc(date).local().format("HH:mm:ss");
      }
      break;
    case "PureDate":
      if(moment(date).isValid()){
        if(isEditData){
          return moment.utc(date).local()
        }else {
          return moment(date).local().format("YYYY-MM-DD");
        }
      }
      break;
    default: 
    if(moment(date+"Z").isValid()){
      return moment.utc(date+"Z").local().format("YYYY-MM-DD HH:mm:ss");
    }
  }

  return "";
}

function utcDate(date, componentType){
  // 将本地时间转为utc时间
  switch(componentType){
    case "DateInput":
      return moment(date).utc().millisecond(0).format().replace("Z","");
    case "PureTime":
      return moment(date).utc().millisecond(0).format("HH:mm:ss.SSS")
    case "PureDate":
      return moment(date).millisecond(0).format("YYYY-MM-DD")
  }
  return ;
}


export default {
  localDate,
  utcDate
};
