import moment from 'moment'

function localDate(date, componentType, isReturnMomentType = false) {
  // 将utc时区时间转为当前本地时间
  if(componentType === "PureTime" && !moment(date).isValid()) {
    date =  new Date(`2016-09-03T${date}Z`)
  } else if(componentType === undefined) {
    date = date+"Z"
  }

  if(moment(date).isValid()){
    if(isReturnMomentType === true) {
      return moment.utc(date).local()
    } else {
      switch(componentType){
        case "DateInput":
          return moment.utc(date).local().format("YYYY-MM-DD HH:mm:ss");
        case "PureTime":
          return moment.utc(date).local().format("HH:mm:ss");
        case "PureDate":
          return moment(date).local().format("YYYY-MM-DD");
        default: 
          return moment.utc(date).local().format("YYYY-MM-DD HH:mm:ss");
        }
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
