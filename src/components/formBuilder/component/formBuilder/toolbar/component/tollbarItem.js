import React from "react";
import { DragSource } from "react-dnd";
import { connect } from "react-redux";
import { setDragState } from "../../redux/utils/operateFormComponent";
import FormIcon from "../../../base/FormIcon";
import ItemTypes from "../../../../utils/ItemTypes";
import ID from "../../../../utils/UUID";

const cardSource = {
  beginDrag(props, monitor) {
    return {
      // id: ID.uuid(),
      index: -1,
      data: props.data,
      onCreate: props.onCreate,
      isDragging: monitor.isDragging()
    };
  }
};

class ToolbarItem extends React.Component {
  render() {
    const { connectDragSource, data, isDragging, setDragState } = this.props;

    setDragState(isDragging);

    if (!connectDragSource) return null;
    return connectDragSource(
      <li>
        <FormIcon icon={data.icon} />
        {data.label}
      </li>
    );
  }
}

export default DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(
  connect(store => ({}), {
    setDragState
  })(ToolbarItem)
);
