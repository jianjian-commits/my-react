import React, {Fragment} from "react";
import { connect } from "react-redux";
import { Button, Icon, Modal, Tooltip, Spin } from "antd";
import { renameElement, changeBind, setDashboards, clearBind } from '../../redux/action';
import request from '../../utils/request';
import { ChartType } from '../elements/Constant';
import { getChartAttrs } from '../../utils/ChartUtil';
import "./element.scss";
import { useParams, useHistory } from "react-router-dom";

const EditorHeader = props => {
  const history = useHistory();
  const { appId, dashboardId, elementId } = useParams();
  const { elemName, renameElement, bindDataArr, setDashboards } = props;

  const handleBack = () => {
    const { clearBind } = props;
    clearBind();
    history.push(`/app/${appId}/setting/bi/${dashboardId}`);
  }

  const handleSave = () => {
    const { dimensions, indexes, conditions } = getChartAttrs(bindDataArr);
    request(`/bi/charts/${elementId}`, {
      method: "PUT",
      data: {
        view: {
          conditions,
          dimensions,
          formFields: [
            {
              id: "string",
              label: "string",
              type: "string"
            }
          ],
          indexes,
          name: "sdsdds",
          supportChartTypes: [
            {
              "metadataId": "string",
              "status": "SUCCESS"
            }
          ],
          type: ChartType.HISTOGRAM
        }
      }
    }).then((res) => {
      if(res && res.msg === "success") {
        request(`/bi/charts?dashboardId=${dashboardId}`).then((res) => {
          if(res && res.msg === "success") {
            const dataObj = res.data;
            setDashboards([{...dataObj.items}]);
            // history.push(`/app/${appId}/setting/bi/${dashboardId}`)
          }
        });
      }
    })
  }

  const onBlur = (e) => {
    renameElement(e.target.value);
  }

  return (
    <div className="element-header">
      <div className="element-header-back">
        <Button onClick={handleBack} type="link">
          <Icon type="left" />
        </Button>
      </div>
      <input className="rename-element" defaultValue={elemName ? elemName: "新建图表"} onBlur={onBlur}/>
      <Button onClick={handleSave} className="element-header-save" type="link">
        保 存
      </Button>
    </div>
  )
}

export default connect(
  store => ({
    elemName: store.bi.elemName,
    bindDataArr: store.bi.bindDataArr
  }),
  { renameElement, changeBind, setDashboards, clearBind }
)(EditorHeader);
