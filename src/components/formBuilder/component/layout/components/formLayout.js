import React from "react";
import { useDrop } from "react-dnd";
import GridLayout from "react-grid-layout";

const FormLayout = props => {
  const [{ }, drop] = useDrop({
    accept: "BOX",
    drop: () => ({ name: "Dustbin" })
  });

  let classes = "form-layout";
  classes += props.isDragging ? ' active' : '';
  return (
    <div className={classes} ref={drop}>
      <GridLayout
        className="layout"
        layout={props.layout}
        cols={props.cols}
        rowHeight={props.rowHeight}
        width={props.width}
        onLayoutChange={props.onLayoutChange}
      >
        {props.children}
      </GridLayout>
    </div>
  );
};

export default FormLayout;
