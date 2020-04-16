import React, { useState, useEffect } from "react";
import { Icon } from "antd";
import classes from "../../../scss/bind/FilterField.module.scss"
const operationArr = [
  {label: "修改筛选条件", type: 'modify'},
  {label: "删除筛选条件", type: 'remove'}
];


const FilterField = (props) => {
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [btnVisible, setBtnVisible] = useState(false);
  const { item } = props;

  useEffect(() => {
    const dropDownEvent = event => {
      setPopoverVisible(false);
    }

    if(popoverVisible) {
      document.addEventListener("click", dropDownEvent);
    }
  
    return () => {
      if(popoverVisible) {
        document.removeEventListener("click", dropDownEvent);
      }
    }
  });

  const getSelectOperation = value => {
    item.handleFilter(value.type, item);
  };

  const handleDeleteTarget = () => {
    item.removeField(item);
  };

  const handlMouseEnter = () => {
    setBtnVisible(true);
  };

  const handlMouseLeave = () => {
    setBtnVisible(false);
  };

  return (
    <div className={classes.FilterContainer}>
      <div
        className={classes.dropDownBtn}
        onMouseEnter={handlMouseEnter} 
        onMouseLeave={handlMouseLeave}
        onClick={e => {
          setPopoverVisible(!popoverVisible);
        }}
      >
        {popoverVisible === false ? <Icon type="down" /> : <Icon type="up" />}
        <span className={classes.dropDownBtnSpan}>
          {item.alias ? item.alias : item.label}
        </span>
        {btnVisible && <Icon type="close-circle" onClick={handleDeleteTarget} theme="filled" />}
      </div>
      {popoverVisible && (
        <div className={classes.dropDownItemContainer}>
          {operationArr.map((operation, index) => (
            <div
              className={classes.dropDownItem}
              onClick={() => {
                getSelectOperation(operationArr[index]);
                setPopoverVisible(false);
              }}
              key={index}
            >
              <span className={classes.dropDownItemSpan}>
                {operation.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterField;
