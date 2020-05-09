import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Tooltip, Checkbox, Input } from 'antd';
import { processBind } from '../../utils/reqUtil';
import ChartInfo from "../elements/data/ChartInfo";
import { changeBind, changeChartData, changeChartInfo, setElemType } from '../../redux/action';
import { useParams } from "react-router-dom";
import classNames from "classnames";
import classes from '../../scss/bind/rightPane.module.scss';
import { chartGroup } from "../elements/ElemType";
import { ChartType } from "../elements/Constant";

const RightPane = (props) => {
  const { changeBind, changeChartData, chartInfo, bindDataObj, elemName, changeChartInfo, dataSource, setElemType, elemType,
    chartAvailableList } = props;
  const { elementId } = useParams();

  let [activeIcon, setActiveIcon] = useState(elemType || ChartType.HISTOGRAM);
  let [titleXAxis, setTitleXAxis] = useState(chartInfo.titleXAxis);
  let [titleYAxis, setTitleYAxis] = useState(chartInfo.titleYAxis);
  let [showLegend, setShowLegend] = useState(chartInfo.showLegend);
  let [showDataTag, setShowDataTag] = useState(chartInfo.showDataTag);
  let showRPTTitle = true;
  let showRPTools = true;

  useEffect(()=> {
    setActiveIcon(chartInfo.elemType);
    setTitleXAxis(chartInfo.titleXAxis);
    setTitleYAxis(chartInfo.titleYAxis);
    setShowLegend(chartInfo.showLegend);
    setShowDataTag(chartInfo.showDataTag);
  }, [chartInfo])

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
    processBind(bindDataObj, dataSource.id, changeBind, changeChartData, chartIcon);
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
    changeChartInfo(chartInfo || new ChartInfo());
  }

  const chartTitle = (intro)=> {
    return (
      <div>
        {intro.map((item, idx)=>
          <div className={classes.tooltipTitle} key={item + idx}>{item}</div>
        )}
      </div>
    )  
  }

  showRPTTitle = elemType != ChartType.PIE;
  showRPTools = elemType != ChartType.INDEX_DIAGRAM;

  return (
    <div className={classes.rightPane}>
      <div className={classes.rightPaneChart}>
        <span>可视化</span>
        <div className={classes.chartGroup}>
        {chartGroup.map(chart =>
        <Tooltip key={chart.type} title={chartTitle(chart.intro)} placement="left" overlayClassName={classes.TooltipBox} mouseLeaveDelay={0}>
          <div
            className={chartAvailableList.includes(chart.type) ? classNames(classes.IconBox, {activeIcon: elemType==chart.type}) : classes.unavailable }
            onClick={()=>{handleSelectIcon(chartAvailableList.includes(chart.type) ? chart.type : ChartType.HISTOGRAM)}}
          >
            <img src={"/image/davinci/"+chart.type+".svg"}/>
          </div>
        </Tooltip>
        )}
        </div>
      </div>
      <div className={showRPTools? classes.rightPaneTools : classes.hideRightPaneTools}>
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
    bindDataObj: store.bi.bindDataObj,
    elemName: store.bi.elemName,
    dataSource: store.bi.dataSource,
    elemType: store.bi.elemType,
    chartAvailableList: store.bi.chartAvailableList
  }
}, { changeBind, changeChartData, changeChartInfo, setElemType })(RightPane)
