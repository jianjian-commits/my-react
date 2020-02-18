export const checkValueValidByType = (item, data) => {
    let reg = null;
    const { formType, validate } = item;

    if (data == void 0) {
        return true;
    }

    // console.log(item, data)

    switch (formType) {
        case "PhoneInput":
            if (item.validate.required == false) {
                if (data == "") { return true }
            }
            reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
            return reg.test(data);
        case "SingleText":
            if (item.validate.required == false) {
                if (data == "") { return true }
            }
            return checkMaxAndMin(validate.isLimitLength, validate.minLength, validate.maxLength, data.length);
        case "TextArea":
            if (item.validate.required == false) {
                if (data == "") { return true }
            }
            return checkMaxAndMin(validate.isLimitLength, validate.minLength, validate.maxLength, data.length);
        case "NumberInput":
            if (item.validate.required == false) {
                if (data == "") { return true }
            }
            return checkMaxAndMin(validate.isLimitLength, validate.min, validate.max, Number(data));
        case "IdCardInput":
            if (item.validate.required == false) {
                if (data == "") { return true }
            }
            reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
            return reg.test(data);
        case "EmailInput":
            if (item.validate.required == false) {
                if (data == "") { return true }
            }
            reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
            return reg.test(data);
        case "CheckboxInput":
            if (item.validate.required == false) {
                if (data.length == 0) { return true }
            }
            return checkMaxAndMin(validate.isLimitLength, validate.minOptionNumber, validate.maxOptionNumber, data.length);
        case "MultiDropDown":
            if (item.validate.required == false) {
                if (data.length == 0) { return true }
            }
            console.log("测试方法", checkMaxAndMin(validate.isLimitLength, validate.minOptionNumber, validate.maxOptionNumber, data.length))
            return checkMaxAndMin(validate.isLimitLength, validate.minOptionNumber, validate.maxOptionNumber, data.length);
        case "Address": return true; break;
        case "DateInput": 
            if (item.validate.required == false) {
                if (data == null) { return true }
            } 
            return true;
        default: return true; break;
    }
};

function checkMaxAndMin(isLimitLength, min, max, value) {
    if (isLimitLength) {
        if (min == void 0 && value <= max) {
            return true;
        }
        if (max == void 0 && min <= value) {
            return true;
        }
        if ((min <= value) && (max >= value)) {
            return true;
        }
    } else {
        return true;
    }
}