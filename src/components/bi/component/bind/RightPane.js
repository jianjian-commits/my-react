import React, { useState } from "react";
import { connect } from "react-redux";
import { Tooltip, Checkbox, Input } from 'antd';
import { updateChartReq, processBind } from '../../utils/ReqUtil';
import ChartInfo from "../elements/data/ChartInfo";
import { changeBind, changeChartData, changeChartInfo, setElemType, changeChartAvailable } from '../../redux/action';
import { useParams } from "react-router-dom";
import classNames from "classnames";
import classes from '../../scss/bind/rightPane.module.scss';
import { chartGroup } from "../elements/ElemType";
import { ChartType } from "../elements/Constant";
import Item from "antd/lib/list/Item";
import { getChartAvailableList } from '../../utils/ChartUtil';

const RightPane = (props) => {
  const { changeBind, changeChartData, chartInfo, bindDataArr, elemName, changeChartInfo, dataSource, setElemType, elemType, chartAvailableList, changeChartAvailable } = props;
  const { elementId } = useParams();
  let [activeIcon, setActiveIcon] = useState(elemType || ChartType.HISTOGRAM);
  let [titleXAxis, setTitleXAxis] = useState(chartInfo.titleXAxis);
  let [titleYAxis, setTitleYAxis] = useState(chartInfo.titleYAxis);
  let [showLegend, setShowLegend] = useState(chartInfo.showLegend);
  let [showDataTag, setShowDataTag] = useState(chartInfo.showDataTag);
  let showRPTTitle = true;

  let ChartAvailableList = getChartAvailableList(bindDataArr);
  changeChartAvailable(ChartAvailableList);

  const onChangeShowLegend = () => {
    let show = !showLegend;
    setShowLegend(show);
    let info = getChartInfo();
    info.showLegend = show
    updateChartInfo(info);
  }

  const onChangeShowDataTag = () => {
    let show = !showDataTag;
    setShowDataTag(show);
    let info = getChartInfo();
    info.showDataTag = show;
    updateChartInfo(info);
  }

  const handleSelectIcon = chartIcon => {
    setActiveIcon(chartIcon);
    setElemType(chartIcon);
    processBind(bindDataArr, dataSource.id, changeBind, changeChartData, chartIcon, setElemType);
  }

  const onChangeTitleXAxis = (e) => {
    e.persist();
    setTitleXAxis(e.target.value);
  }

  const onChangeTitleYAxis = (e) => {
    e.persist();
    setTitleYAxis(e.target.value);
  }

  const getChartInfo = () => {
    let chartInfo = new ChartInfo();
    chartInfo.titleXAxis = titleXAxis;
    chartInfo.titleYAxis = titleYAxis;
    chartInfo.showLegend = showLegend;
    chartInfo.showDataTag = showDataTag;
    return chartInfo;
  }

  const updateChartInfo = (chartInfo) => {
    chartInfo = chartInfo || getChartInfo();
    updateChartReq(elementId, dataSource.id, bindDataArr, elemName || "新建图表", {...chartInfo});
    changeChartInfo(chartInfo || new ChartInfo());
  }

  showRPTTitle = elemType != ChartType.AREA_CHART;

  return (
    <div className={classes.rightPane}>
      <div className={classes.rightPaneChart}>
        <span>可视化</span>
        <div className={classes.chartGroup}>
        {chartGroup.map(chart =>
        <Tooltip key={chart.type}  title={chart.intro}>
          <div
            className={chartAvailableList.include(chart.type)? (classes.IconBox, {activeIcon: activeIcon==chart.type}) : classes.unavailable }
            onClick={()=>{handleSelectIcon(chart.type)}}
          >
            <img src={"/image/davinci/"+chart.type+".svg"}/>
          </div>
        </Tooltip>
        )}
        </div>
      </div>
      <div className={classes.rightPaneTools}>
        <span className={classes.title}>工具栏</span>
        <div className={showRPTTitle? classes.showXYTitle : classes.hideXYTitle}>
          <p>X轴标题</p>
          <Input value={titleXAxis} onBlur={(e) => {updateChartInfo()}} onChange={onChangeTitleXAxis}/>
          <p>Y轴标题</p>
          <Input value={titleYAxis} onBlur={(e) => {updateChartInfo()}} onChange={onChangeTitleYAxis}/>
        </div>
        <div className={classes.checkboxGroup}>
          <Checkbox checked={showDataTag} onClick={onChangeShowDataTag}>显示数据标签</Checkbox>
          <Checkbox checked={showLegend} onClick={onChangeShowLegend}>显示图例</Checkbox>
        </div>
      </div>
    </div>
  )
}

export default connect((store) => {
  return {
    chartInfo: store.bi.chartInfo,
    bindDataArr: store.bi.bindDataArr,
    elemName: store.bi.elemName,
    dataSource: store.bi.dataSource,
    elemType: store.bi.elemType,
    chartAvailableList: store.bi.chartAvailableList
  }
}, { changeBind, changeChartData, changeChartInfo, setElemType, changeChartAvailable })(RightPane)