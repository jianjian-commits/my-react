import React, { useState } from 'react';
import Chart from './Chart';
import IndexChart from '../IndexChart'
import { connect } from "react-redux";
import { getOption } from '../../../utils/ChartUtil';
import BlankElement from '../BlankElement';
import ChartToolbarBtn from "../ChartToolbarBtn";
import { DBMode } from '../../dashboard/Constant';
import { ChartType } from '../Constant';
import { useHistory, useParams } from "react-router-dom";
import { changeBind, changeChartData, setDataSource, changeChartInfo, setDashboards, setElemType } from '../../../redux/action';
import EditAction from '../action/EditAction';
import classes from '../../../scss/elements/chart.module.scss';
import fullScreenClasses from '../../../scss/modal/chartModal.module.scss';
import FieldSortModal from "../modal/fieldSortModal";
import DeleteAction from '../action/DeleteAction';
import RefreshAction from '../action/RefreshAction';

const ChartContainer = props => {
  const { chartData, style, dashboards, chartName, isBtnBlock=false, dbMode, chartId,
    changeBind, changeChartData, setDataSource, chartInfo, changeChartInfo, elemType, setElemType, setDashboards } = props;
  const { elementId, dashboardId, appId } = useParams();
  const history = useHistory();

  const chartOption = (chartData && chartInfo) ? getOption(chartData, chartInfo, elemType) : {};
  let chart = elemType == ChartType.INDEX_DIAGRAM ? <IndexChart chartOption={chartOption} /> :
    <Chart chartOption={chartOption} />;
  const [btnVisible, setBtnVisible] = useState(isBtnBlock);
  const [modalVisible,setModalVisible] = useState(false);
  const elements = dashboards && dashboards.length > 0 ? dashboards[0].elements : [];
  let name = "新建图表";
  let iconBtnGroup = [];

  if(elementId) {
    elements.forEach(item => {
      if (item.id == elementId) {
        name = item.name;
      }
    });
  } else {
    name = chartName || name;
  }

  if(dbMode == DBMode.Edit) {
    iconBtnGroup = [
      new EditAction("edit", elemType, chartId, () => {history.push(`/app/${appId}/setting/bi/${dashboardId}/${chartId}`)},
      {changeBind, changeChartData, setDataSource, changeChartInfo, setElemType}),
      new DeleteAction("delete", dashboardId, chartId, {setDashboards}),
      new RefreshAction("redo", elemType, chartId, dashboards, {setDashboards}),
      {
        type:"fullscreen",
        click: props.setFullChart
      },
      {
        type:"swap",
        click:()=>{
          setModalVisible(true);
        }
      }
    ]
  }
  else if(dbMode == DBMode.Visit) {
    iconBtnGroup = [
      new RefreshAction("redo", elemType, chartId, dashboards, {setDashboards}),
      {
        type:"fullscreen",
        click: props.setFullChart
      },
      {
        type:"swap",
        click:()=>{
          setModalVisible(true);
        }
      }
    ]
  }

  if(props.modalNarrowBtn){
    //如果图表放大，将放大按钮变成缩小按钮
    iconBtnGroup = iconBtnGroup.filter(item => item.type!="fullscreen");
    iconBtnGroup.push(props.modalNarrowBtn);
  }

  const handlMouseEnter = () => {
    if (!isBtnBlock) {
      setBtnVisible(true);
    }
  };

  const handlMouseLeave = () => {
    if (!isBtnBlock) {
      setBtnVisible(false);
    }
  };

  if (!chartData) {
    return (
      <div className={props.modalNarrowBtn ? fullScreenClasses.chartContainer : classes.chartContainer} style={style} onMouseEnter={handlMouseEnter}
        onMouseLeave={handlMouseLeave}>
        {btnVisible && (
          <ChartToolbarBtn
            {...props}
            iconBtnGroup={iconBtnGroup.filter(item => item.type!="redo" && item.type!="fullscreen" && item.type!="swap")}
            isBtnBlock={isBtnBlock}
          />
         )} 
        <BlankElement />
      </div>
    );
  }

  return (
    <div
      className={props.modalNarrowBtn ? fullScreenClasses.chartContainer : classes.chartContainer}
      onMouseEnter={handlMouseEnter}
      onMouseLeave={handlMouseLeave}
      style={style}
    >
      <div className={classes.chartTitle}>{name}</div>
      {
        modalVisible && (
          <FieldSortModal 
            chartName={chartName} 
            chartId={chartId} 
            handleCancel={()=>{setModalVisible(false)}}
          />
        )
      }
      {btnVisible && (
        <ChartToolbarBtn
          {...props}
          iconBtnGroup={iconBtnGroup}
          isBtnBlock={isBtnBlock}
        />
      )}
      {chart}
    </div>
  );
};

export default connect(
  store => ({
    dashboards: store.bi.dashboards,
    dbMode: store.bi.dbMode}),
    { changeBind, changeChartData, setDataSource, changeChartInfo, setDashboards, setElemType }
  )(ChartContainer);
