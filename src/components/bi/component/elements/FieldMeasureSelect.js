import React, { useState, useEffect, useRef } from "react";
import { Icon, Popover, Input, Button } from "antd";
import { GroupType, SortTypeArr } from "./Constant";
import classes from "../../scss/bind/optionSelect.module.scss";
const operationArr = [
  { ...GroupType.SUM },
  { ...GroupType.COUNT },
  { ...GroupType.AVERAGE },
  { ...GroupType.MAX },
  { ...GroupType.MIN },
];

export const FieldSecondMenus = (props) => {
  //二级菜单组件{菜单列表，选中索引，方法回调}
  const { list, selectIndex, click } = props;
  return (
    <Popover
      placement="rightTop"
      title=""
      overlayStyle={{ paddingLeft: 0 }}
      overlayClassName={classes.FieldSelectPopover}
      content={
        <div className={classes.popoverSelectionGroup}>
          {list.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                click(index);
              }}
              className={classes.selectionBox}
            >
              {item.name}
              {selectIndex === index && <Icon type="check" />}
            </div>
          ))}
        </div>
      }
      trigger="hover"
    >
      <div className={classes.dropDownItem}>
        <span className={classes.dropDownItemSpan}>{props.label}</span>
        <Icon type="right" />
      </div>
    </Popover>
  );
};

export default function FieldMeasureSelect(props) {
  const [selectIndex, setSelectIndex] = useState(props.item.selectIndex);
  const [sortTypeIndex, setSortTypeIndex] = useState(0);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [nameInputVisible, setNameInputVisible] = useState(false);
  const [deleteBtnVisible, setDeleteBtnVisible] = useState(false);
  const dropDownBtn = useRef(null);
  useEffect(() => {
    const dropDownEvent = (event) => {
      if (popoverVisible) {
        setPopoverVisible(false);
      }
    };
    document.addEventListener("click", dropDownEvent);
    return () => {
      document.removeEventListener("click", dropDownEvent);
    };
  }, [popoverVisible]);

  useEffect(() => {
    if (props.item.sort) {
      SortTypeArr.map((sortType,i) => {
        if(props.item.sort.value == sortType.value){
          setSortTypeIndex(i);
        }
      })
    }
  }, [props]);

  const handleDeleteTarget = () => {
    props.item.removeField(props.item);
  };

  const handlMouseEnter = () => {
    setDeleteBtnVisible(true);
  };

  const handlMouseLeave = () => {
    setDeleteBtnVisible(false);
  };

  const operationList = [
    {
      name: "修改显示名",
      click: () => {
        setNameInputVisible(true);
      },
    },
    {
      name: "数据格式",
      click: () => {},
    },
    {
      name: "删除字段",
      click: () => {
        handleDeleteTarget();
      },
    },
  ];

  const secondMenuSumFunc = (index) => {
    setSelectIndex(index);
    props.item.changeGroup(operationArr[index], props.item.fieldId);
    setPopoverVisible(false);
  };

  //二级菜单字段排序回调
  const secondMenuSortFunc = (index) => {
    setSortTypeIndex(index);
    props.item.changeSortType(SortTypeArr[index], props.item.fieldId);
    setPopoverVisible(false);
  };

  return (
    <div
      className={classes.meaContainer}
      onMouseEnter={handlMouseEnter}
      onMouseLeave={handlMouseLeave}
    >
      <div
        className={classes.dropDownBtn}
        ref={dropDownBtn}
        onClick={(e) => {
          e.stopPropagation();
          setPopoverVisible(!popoverVisible);
        }}
      >
        {popoverVisible === false ? <Icon type="down" /> : <Icon type="up" />}
        <span className={classes.dropDownBtnSpan}>
          {`${props.item.label}(${operationArr[selectIndex].name})`}
        </span>
        {deleteBtnVisible && (
          <Icon
            type="close-circle"
            onClick={handleDeleteTarget}
            theme="filled"
          />
        )}
      </div>
      {nameInputVisible && (
        <div className={classes.nameInputContainer}>
          <div className={classes.inputBox}>
            <Input />
          </div>
          <div className={classes.btnBox}>
            <Button
              onClick={() => {
                setNameInputVisible(false);
              }}
            >
              取消
            </Button>
            <Button
              onClick={() => {
                setNameInputVisible(false);
              }}
            >
              确定
            </Button>
          </div>
        </div>
      )}
      {popoverVisible && (
        <div className={classes.dropDownItemContainer}>
          <FieldSecondMenus
            selectIndex={sortTypeIndex}
            click={secondMenuSortFunc}
            list={SortTypeArr}
            label={"排序方式"}
          />
          {props.item.type == "NUMBER" && (
            <FieldSecondMenus
              selectIndex={selectIndex}
              click={secondMenuSumFunc}
              list={operationArr}
              label={"汇总方式"}
            />
          )}
          {operationList.map((operation) => (
            <div
              className={classes.dropDownItem}
              onClick={() => {
                operation.click();
                setPopoverVisible(false);
              }}
              key={operation.name}
            >
              <span className={classes.dropDownItemSpan}>{operation.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
