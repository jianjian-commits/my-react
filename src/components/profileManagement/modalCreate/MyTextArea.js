import React, { useState, useCallback } from "react";
import { Input } from "antd";
import classes from "./create.module.scss";
const { TextArea } = Input;
function MyTextArea(props) {
  const { onChange, maxLength, forwardRef, ...others } = props;
  const [num, setNum] = useState(0);
  const composeOnChange = useCallback(
    e => {
      onChange && onChange(e);
      setNum(e.target.value.length);
    },
    [onChange]
  );
  const checkNum = num > 30 ? 30 : num;
  return (
    <div>
      <TextArea
        {...others}
        maxLength={maxLength}
        onChange={composeOnChange}
        ref={forwardRef}
      />
      <span className={classes.text}>
        {checkNum}/{maxLength}
      </span>
    </div>
  );
}

export default React.forwardRef((props, ref) => (
  <MyTextArea {...props} forwardRef={ref} />
));
