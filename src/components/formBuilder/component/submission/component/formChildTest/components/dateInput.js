/*
 * @Author: your name
 * @Date: 2020-04-13 14:08:15
 * @LastEditors: komons
 * @LastEditTime: 2020-04-13 14:33:00
 * @Description:
 * @FilePath: \form-builderc:\Komons\work\all\davinci-paas-frontend\src\components\formBuilder\component\submission\component\formChildTest\components\dateInput.js
 */

import React, { useEffect, useState } from "react";
import { DatePicker, TimePicker } from "antd";
import moment from "moment";

let style;
const DateInput = ({ data = {}, ...props }) => {
  const [value, setValue] = useState();

  useEffect(() => {
    if (data.autoInput) {
      setInterval(() => {
        setValue(new moment());
      }, 1000);
      setValue(new moment());
    }
    if(data.formType === "DateInput") {
        style = {width: "200px"};
    } else {
        style = null;
    }
  }, []);

  return data.formType === "PureTime" ? <TimePicker value={value} {...props} disabled={data.autoInput} style={style} /> : <DatePicker value={value} {...props} disabled={data.autoInput} style={style} />;
};

export default DateInput;
