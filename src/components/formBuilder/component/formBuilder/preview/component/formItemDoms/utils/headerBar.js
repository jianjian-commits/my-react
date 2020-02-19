import React from "react";
import { Tooltip } from "antd";
import LabelUtils from "./LabelUtils";
import ID from "../../../../../../utils/UUID";

export default class HeaderBar extends React.Component {
  handleDestoryComponent = e => {
    this.props.onDestroy(this.props.data);
    this.props.editModeOn({ element: "clearInspector" }, e);
  };

  handleCopyComponent = e => {
    const { data, editModeOn, parent, insertCard, index } = this.props;
    if ((data.type === "FormChildTest")) {
      let newData = JSON.parse(JSON.stringify(data)); // 深度克隆()
      let key = ID.uuid();
      newData.id = key;
      newData.key = key;
      newData.layout.i = key;
      newData.layout.y = 0;
      if (data.values) {
        let newValues = JSON.parse(JSON.stringify(data.values));
        newValues.forEach((element, index) => {
          let newKey = ID.uuid();
          newValues[index].id = newKey;
          newValues[index].key = newKey;
        });
        newData.values = newValues;
      }
      insertCard(newData, index);
      editModeOn(newData, e);
    } else {
      let newData = JSON.parse(JSON.stringify(data)); // 深度克隆()
      let key = ID.uuid();
      newData.id = key;
      newData.key = key;
      newData.layout.i = key;
      newData.layout.y = 0;
      insertCard(newData, index);
      editModeOn(newData, e);
    }
  };

  render() {
    const { active, data } = this.props;
    const dotClassStr = active ? "dot active" : "dot";
    return (
      <div className="toolbar-header">
        
        {data.type=="Button"? null :<><span className={dotClassStr}></span><LabelUtils data={data} /></> }
        <div className="toolbar-header-buttons">
          {data.element !== "LineBreak" && (
            <Tooltip title="复制">
              <div
                className="btn is-isolated btn-school"
                onClick={this.handleCopyComponent}
              >
                <img src="/image/icons/bar_copy_hover.png" />
              </div>
            </Tooltip>
          )}
          <Tooltip title="删除">
            <div
              className="btn is-isolated btn-school"
              onClick={this.handleDestoryComponent}
            >
              <img src="/image/icons/bar_delete_hover.png" />
            </div>
          </Tooltip>
        </div>
      </div>
    );
  }
}
