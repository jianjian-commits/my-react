import React, { useState, useEffect } from "react";
import { Icon, Popover } from "antd";
import { GroupType } from "./Constant";
import classNames from "classnames";
import classes from "../../scss/bind/optionSelect.module.scss";
const operationArr = [
  { ...GroupType.SUM },
  { ...GroupType.AVERAGE },
  { ...GroupType.MAX },
  { ...GroupType.MIN },
  { ...GroupType.COUNT }
];
export default function FieldMeasureSelect(props) {
  const [selectIndex, setSelectIndex] = useState(0);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [btnVisible, setBtnVisible] = useState(false);
  useEffect(() => {
    const dropDownEvent = event => {
      const e = event || window.event;
      const btn = document.getElementById("dropDownBtn" + props.item.id);
      if (
        e.srcElement.parentElement &&
        !e.srcElement.parentElement.isSameNode(btn) &&
        !e.srcElement.isSameNode(btn)
      ) {
        setPopoverVisible(false);
      }
    };
    document.addEventListener("click", dropDownEvent);
    getSelectOperation(operationArr[selectIndex]);
    return () => {
      document.removeEventListener("click", dropDownEvent);
    };
  }, []);

  const getSelectOperation = value => {
    props.item.changeGroup(value, props.item.id);
  };

  const handleDeleteTarget = () => {
    props.item.removeField(props.item);
  };

  const handlMouseEnter = () => {
    setBtnVisible(true);
  };

  const handlMouseLeave = () => {
    setBtnVisible(false);
  };

  const className = props.item.className;

  return (
    <div className={classes.meaContainer}>
      <Popover
        placement="right"
        title=""
        overlayStyle={{ backgroundColor: "blank" }}
        overlayClassName={classes.FieldSelectPopover}
        content={"这是一串二级菜单"}
        trigger="hover"
        visible={true}
      >
        <div
          className={classes.dropDownBtn}
          onMouseEnter={handlMouseEnter}
          onMouseLeave={handlMouseLeave}
          id={"dropDownBtn" + props.item.id}
          onClick={e => {
            e.stopPropagation();
            setPopoverVisible(!popoverVisible);
          }}
        >
          {popoverVisible === false ? <Icon type="down" /> : <Icon type="up" />}
          <span className={classes.dropDownBtnSpan}>
            {`${props.item.label}(${operationArr[selectIndex].name})`}
          </span>
          {btnVisible && (
            <Icon
              type="close-circle"
              onClick={handleDeleteTarget}
              theme="filled"
            />
          )}
        </div>
      </Popover>
      {popoverVisible && (
        <div
          className={classes.dropDownItemContainer}
          id={"dropDown" + props.item.id}
        >
          {operationArr.map((operation, index) => (
            <div
              className={classes.dropDownItem}
              style={selectIndex == index ? { backgroundColor: "#dfecff" } : {}}
              // className={classNames("dropDownItem", {
              //   selectOption: selectIndex == index
              // })}
              onClick={() => {
                if (selectIndex === index) {
                  setPopoverVisible(false);
                } else {
                  setSelectIndex(index);
                  getSelectOperation(operationArr[index]);
                  setPopoverVisible(false);
                }
              }}
              key={index}
            >
              <span className={classes.dropDownItemSpan}>{operation.name}</span>
              {selectIndex === index && <Icon type="check" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
