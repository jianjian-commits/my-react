import React, { useEffect, useState } from "react";
import { Modal, Icon, Button, Input } from "antd";
import classes from "../../../scss/modal/fieldSortModal.module.scss";
import request from "../../../utils/request";
import { ChartType,SortType} from "../Constant";
import {connect} from "react-redux";
import { setDashboards} from '../../../redux/action';
function FieldSortModal(props) {
  const [chartBindAttr, setChartBindAttr] = useState({});
  const [dimensions, setDimensions] = useState([]);
  const [indexes, setIndexes] = useState([]);
  const { chartId, chartName } = props;
  useEffect(() => {
    request(`/bi/charts/${chartId}`).then((res) => {
      if (res && res.msg === "success") {
        const data = res.data.view;
        const formId = data.formId;
        const dimensions = data.dimensions;
        const indexes = data.indexes;
        const newChartBindAttr = {
          chartId,
          formId,
          dimensions,
          indexes,
          conditions: data.conditions,
          chartType: data.type
        };
        setChartBindAttr(newChartBindAttr);
        setDimensions(dimensions);
        setIndexes(indexes);
      }
    });
  }, []);
  const showFieldArr = () => {
    if(dimensions.length == 1){
      return [].concat(dimensions).concat(indexes);
    }else{
      return [].concat(dimensions);
    }
  }
  const setFieldSortType = (fieldId,sortType) => {
    if(dimensions.length == 1){
      const newDismensions = dimensions.map(dim => {
        if(dim.field.fieldId == fieldId){
          dim.sort.value = sortType;
        }else{
          dim.sort.value = SortType.DEFAULT.value;
        }
        return dim;
      })
      setDimensions(newDismensions);
      const newIndexes = indexes.map(idx => {
        if(idx.field.fieldId == fieldId){
          idx.sort.value = sortType;
        }else{
          idx.sort.value = SortType.DEFAULT.value;
        }
        return idx;
      })
      setIndexes(newIndexes);
    }else{
      const newDismensions = dimensions.map(dim => {
        if(dim.field.fieldId == fieldId){
          dim.sort.value = sortType;
        }
        return dim;
      })
      setDimensions(newDismensions);
    }
  }
  const btnGroup = [
    {
      label: SortType.DEFAULT.name,
      value: SortType.DEFAULT.value,
      onClick: setFieldSortType,
    },
    {
      label: SortType.ASC.name,
      value: SortType.ASC.value,
      onClick: setFieldSortType,
    },
    {
      label: SortType.DESC.name,
      value: SortType.DESC.value,
      onClick:  setFieldSortType,
    },
  ];
  const setSort = () => {
    let newChartBindAttr = chartBindAttr;
    newChartBindAttr["dimensions"] = dimensions;
    newChartBindAttr["indexes"] = indexes;
    request(`/bi/charts/data`, {
      method: "POST",
      data: newChartBindAttr
    }).then((res) => {
      if(res && res.msg === "success") {
        const dataObj = res.data;
        const data = dataObj.data;
        const newDashboardsItem = {
          name:props.dashboards[0].name,
          elements:props.dashboards[0].elements.map(element => {
            if(element.id == chartId){
              element.data = data;
            }

            return element;
          })
        }
        const newDashboards = [];
        newDashboards.push(newDashboardsItem);
        props.setDashboards(newDashboards);
        props.handleCancel();
      }
    })
  }
  return (
    <Modal
      title={
        <span className={classes.modalTitle}>排序规则设置({chartName})</span>
      }
      visible={true}
      closable={false}
      footer={null}
      width={500}
      bodyStyle={{ padding: 0 }}
      handleCancel={props.handleCancel}
      wrapClassName={classes.BIFieldSortModal}
      centered
    >
      <div className={classes.modalContent}>
        {showFieldArr().map((fieldObj, index) => (
          <div key={fieldObj.field.fieldId} className={classes.sortBtnBox}>
            <span className={classes.fieldName}>{fieldObj.field.label}</span>
            <div className={classes.btnGroup}>
              {btnGroup.map((btn) => (
                <Button
                  key={btn.label}
                  style={fieldObj.sort.value == btn.value ? 
                    {backgroundColor: "#dfecff"} : {}}
                  onClick={()=>{btn.onClick(fieldObj.field.fieldId,btn.value)}}
                >
                  {btn.label}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={classes.footBtns}>
        <Button onClick={props.handleCancel}>取消</Button>
        <Button onClick={setSort}>排序</Button>
      </div>
    </Modal>
  );
}
export default connect(store => 
  ({
    dashboards: store.bi.dashboards,
  }),{
    setDashboards
  })(FieldSortModal);