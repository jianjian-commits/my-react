import React, { useEffect, useState } from 'react';
import { Icon, Tooltip } from 'antd';
import { getTextWidth } from '../../utils/Util';
import classes from '../../scss/base/RenameInput.module.scss';

const RenameInput = (props) => {
  const {handleCommit, name} = props;
  const [value, setValue] = useState(name);
  const [valWidth, setValWidth] = useState(getTextWidth(name, '14px'))
  const [inputClass, setInputClass] = useState(classes.renameInput);

  useEffect(() => {
    setValue(name);
    setValWidth(getTextWidth(name, '14px'));
  }, [name])

  const onBlur = (e) => {
    handleCommit(e.target.value || name);
    setInputClass(classes.renameInput);
  }

  const onChange = (e) => {
    const val = e.target.value;
    setValue(val)
    setValWidth(getTextWidth(val, '14px'));
  }

  const onFocus = () => {
    setInputClass(classes.selInput);
  }

  return (
    <Tooltip title={"点击重命名"}>
      <input className={inputClass} value={ value } onFocus={onFocus}
        onChange={onChange} onBlur={onBlur}/>
      <span className={classes.iconholder}>
        <Icon type="edit" style={{color: 'white', marginLeft: (valWidth < 200 ? valWidth : 200) + "px"}}/>
      </span>
    </Tooltip>
  )
}

export default RenameInput;