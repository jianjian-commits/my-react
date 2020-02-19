import React from "react";
import ComponentBox from "../componentBox";
import { Button } from "antd";

export default class DragParent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    let baseClasses = "form-group submitBtn-parent";

    if (this.props.active) {
      baseClasses += " active";
    }

    return (
      <></>
      // <div
      //   className={baseClasses}
      //   onClick={this.props.editModeOn.bind(
      //     this.props.parent,
      //     {
      //       type: "SubmitBtn",
      //       key: "SubmitBtn",
      //       element: "SubmitBtn",
      //     })}
      // >
      //   {/* <Button type={btnObj.type} size={btnObj.size} >{btnObj.name}</Button> */}
      // </div>
    );
  }
}
