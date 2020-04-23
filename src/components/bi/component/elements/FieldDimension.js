import React ,{ useState, useEffect, useRef }from "react";
import { Icon, Input, Button } from "antd";
import {TimeSumType,SortType, DataType} from "./Constant";
import classes from "../../scss/bind/optionSelect.module.scss";
import {FieldSecondMenus,transforObjIntoArr} from "./FieldMeasureSelect";
import FieldNameModal from "../elements/modal/fieldNameModal";
export default function FieldDimensionSelect(props) {
  const {sort,currentGroup} = props.item;
  const SortTypeArr = transforObjIntoArr(SortType);
  const TimeSumTypeArr = transforObjIntoArr(TimeSumType);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [nameInputVisible,setNameInputVisible] = useState(false);
  const [deleteBtnVisible,setDeleteBtnVisible] = useState(false);
  //字段排序和字段汇总方式
  const [sortTypeIndex,setSortTypeIndex] = useState(0);
  const [sumTypeIndex,setSumTypeIndex] = useState(4);
  const dropDownBtn = useRef(null);
  useEffect(() => {
    const dropDownEvent = event => {
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
    if (sort) {
      SortTypeArr.map((sortType,i) => {
        if(sort.value == sortType.value){
          setSortTypeIndex(i);
        }
      })
    }
    if(currentGroup.value){
      TimeSumTypeArr.map((sumType,j) => {
        if(currentGroup.value == sumType.value){
          setSumTypeIndex(j);
        }
      })
    }
  }, [props]);

  //二级菜单根据时间汇总回调
  const secondMenuSumFunc = index => {
    setSumTypeIndex(index);
    props.item.changeGroup(TimeSumTypeArr[index], props.item.fieldId);
    setPopoverVisible(false);
  }
  //二级菜单字段排序回调
  const secondMenuSortFunc = index => {
    setSortTypeIndex(index);
    props.item.changeSortType(SortTypeArr[index], props.item.fieldId);
    setPopoverVisible(false);
  }

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
      }
    },
    {
      name: "数据格式",
      click: () => {}
    },
    {
      name: "删除字段",
      click: () => {
        handleDeleteTarget();
      }
    }
  ];
  
  const handleOK = name => {
    props.item.changeFieldName(name, props.item.fieldId);
    setNameInputVisible(false);
  }
  const handleCancel = () => {
    setNameInputVisible(false);
  }

  const showSortIcon = () => {
    const sortImgArr = [SortType.ASC.value,SortType.DESC.value];
    if(sort && sortImgArr.includes(sort.value)){
        return <img src={"/image/davinci/"+sort.value+".svg"}/>
    }else{
        return null;
    }
  }
  return (
    <div 
      className={classes.dimContainer}
      onMouseEnter={handlMouseEnter} 
      onMouseLeave={handlMouseLeave}
    >
      <div
        className={classes.dropDownBtn}
        ref={dropDownBtn}
        onClick={e => {
          e.stopPropagation();
          setPopoverVisible(!popoverVisible);
        }}
      >
        {popoverVisible === false ? <Icon type="down" /> : <Icon type="up" />}
        <span className={classes.dropDownBtnSpan}>
          {props.item.type==DataType.DATETIME ? props.item.label+`(${TimeSumType[currentGroup.value].name})` :props.item.label}
          {showSortIcon()}
        </span>
        {deleteBtnVisible && <Icon type="close-circle" onClick={handleDeleteTarget} theme="filled" />}
      </div>
      {nameInputVisible && <FieldNameModal label={props.item.label} handleOK={handleOK} handleCancel={handleCancel}/>}
      {popoverVisible && (
        <div className={classes.dropDownItemContainer}>
          <FieldSecondMenus
            selectIndex={sortTypeIndex}
            click={secondMenuSortFunc}
            list={SortTypeArr}
            label={"排序方式"}
          />
          {
            props.item.type==DataType.DATETIME &&
            <FieldSecondMenus
            selectIndex={sumTypeIndex}
            click={secondMenuSumFunc}
            list={TimeSumTypeArr}
            label={"汇总方式"}
          />
          }
          {operationList.map(operation => (
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