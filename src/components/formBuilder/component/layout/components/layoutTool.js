import React from "react";
import { useDrag } from "react-dnd";

const LayoutTool = props => {
  const [{ }, drag] = useDrag({
    item: { id: props.data.id, type: "BOX" },
    canDrag: () => {
        let res = props.data.isShow ? false : true;
        return res;
    },
    begin: () => {
      props.handleSetDragState(true);
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        props.handleChange(item.id);
        // alert(`You dropped ${item.id} into ${dropResult.name}!`);
      }
      props.handleSetDragState(false);
    }
  });

  return (
    <li
        className={props.data.isShow ? "" : "active"}
      ref={drag}
    >
      <span>{props.data.label}</span>
    </li>
  );
};

export default LayoutTool;
