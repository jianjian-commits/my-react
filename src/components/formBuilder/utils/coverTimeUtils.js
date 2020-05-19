import moment from 'moment'

export function localDate(date, componentType, isEditData) {
  // 将utc时区时间转为当前本地时间
  if(componentType === "PureTime" && !moment(date).isValid()) {
    date =  new Date(`2016-09-03T${date}Z`)
  } else if(componentType === "DateInput") {
    date = date+"Z"
  }

  const isValid = moment(date).isValid();
  if(isValid && isEditData) {
    return moment.utc(date).local();
  }

  switch(componentType) {
    case "DateInput":
      return isValid ? moment.utc(date).local().format("YYYY-MM-DD HH:mm:ss") : "";
    case "PureTime":
      return moment.utc(date).local().format("HH:mm:ss");
    case "PureDate":
      return isValid ? moment(date).local().format("YYYY-MM-DD") : "";
  }

  return "";
}

export function utcDate(date, componentType){
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

