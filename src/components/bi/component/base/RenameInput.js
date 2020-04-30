import React, { useEffect, useState } from 'react';
import { Icon, Tooltip } from 'antd';
import classes from '../../scss/base/RenameInput.module.scss';

const RenameInput = (props) => {
  const {handleCommit, name} = props;
  const [value, setValue] = useState(name);
  const [inputClass, setInputClass] = useState(classes.renameInput);

  useEffect(() => {
    setValue(name);
  }, [name])

  const onBlur = (e) => {
    handleCommit(e.target.value || name);
    setInputClass(classes.renameInput);
  }

  const onChange = (e) => {
    setValue(e.target.value)
  }

  const onFocus = () => {
    setInputClass(classes.selInput);
  }

  return (
    <Tooltip title={"点击重命名"}>
      <input className={inputClass} value={ value } onFocus={onFocus}
        onChange={onChange} onBlur={onBlur}/>
      <Icon type="edit" style={{color: 'white', marginLeft: '5px'}}/>
    </Tooltip>
  )
}

export default RenameInput;