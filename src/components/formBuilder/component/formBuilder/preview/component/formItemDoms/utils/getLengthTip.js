const checkMaxAndMin = (min, max) =>{
  if(min !== null && max !== null && min > max){
    const tmp = max;
    max = min;
    min = tmp;
  }
}
export const lengthTip = (data) =>{
  if(data.type === "SingleText" || data.type === "TextArea"){
    if(data.validate.isLimitLength){
      const {maxLength,minLength} = data.validate;
      if (maxLength !== Number.MAX_SAFE_INTEGER && minLength !== 0) {
        return `(字数在${minLength} ~ ${maxLength}之间)`;
      } else if (maxLength !== Number.MAX_SAFE_INTEGER) {
        return  `(最多填${maxLength}个字)`;
      } else if (minLength !== 0){
        return `(最少填${minLength}个字)`;
      } else {
        return "(字数不限)";
      }
    } else {
      return "(字数不限)";
    }
  } 
  if(data.type === "NumberInput") {
    if(data.validate.isLimitLength) {
      const {max,min} = data.validate;
      if (max !== Number.MAX_VALUE && min !== -Number.MAX_VALUE) {
        return `(数字在${min}~${max}之间)`;
      } else if (max !== Number.MAX_VALUE) {
        return `(数字不能大于${max})`;
      } else if (min !== (-Number.MAX_VALUE)){
      return  `(数字不能小于${min})`;
      } else {
        return  "(数字大小不限)";
      } 
    } else {
      return  "(数字大小不限)";
    } 
  }

  if(data.type === "MultiDropDown" ||data.type === "CheckboxInput") {
    if(data.validate.isLimitLength){
      const {maxOptionNumber,minOptionNumber} = data.validate;
      if (maxOptionNumber !== Number.MAX_SAFE_INTEGER && minOptionNumber !== 0) {
      return  `(请选择${minOptionNumber}~${maxOptionNumber}个)`;
      } else if (maxOptionNumber !== Number.MAX_SAFE_INTEGER) {
      return  `(选择个数不能多于${maxOptionNumber}个)`;
      } else if (minOptionNumber !== 0){
      return  `(选择个数不能少于${minOptionNumber}个)`;
      } else {
        return  "(选择个数不限)"
      }
    } else {
      return  "(选择个数不限)"
    }
  }
  if(data.type === "FileUpload"||data.type === "ImageUpload"){
    const {fileSize,fileUnit} = data.validate;
    return `(请上传${fileSize+""+fileUnit}以下的文件)`;
  }
  return "";
}


export const checkComponentMaxAndMin = (components) =>{
  const componentArray = components.map( component =>{
    if (component.type === "SingleText" || component.type === "TextArea") {
      checkMaxAndMin(component.validate.minLength, component.validate.maxLength);
    }
    if (component.type === "NumberInput") {
      checkMaxAndMin(component.validate.min , component.validate.max);
    }
    if (component.type === "MultiDropDown") {
      checkMaxAndMin(component.validate.minOptionNumber , component.validate.maxOptionNumber);
    }
    return component;
  })
  return componentArray;
}