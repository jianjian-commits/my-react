import React, { PureComponent } from "react";

/* *****************这里都是自定义组件的 icon图标************************** */


export default class FormIcon extends PureComponent {
  render() {
    let name = "";
    let [icon, width] = this.props.icon;
    let classess = this.props.className
      ? "icon-wrap " + this.props.className
      : "icon-wrap";
    switch (icon) {
      case "text": {
        name = "/image/icons/text";
        break;
      }
      case "number": {
        name = "/image/icons/number";
        break;
      }
      case "radio": {
        name = "/image/icons/radio";
        break;
      }
      case "dropdown": {
        name = "/image/icons/dropdown";
        break;
      }
      case "checkbox": {
        name = "/image/icons/checkbox";
        break;
      }
      case "idcard": {
        name = "/image/icons/idcard";
        break;
      }
      case "phone": {
        name = "/image/icons/phone";
        break;
      }
      case "email": {
        name = "/image/icons/email";
        break;
      }
      case "file": {
        name = "/image/icons/file";
        break;
      }
      case "form": {
        name = "/image/icons/form";
        break;
      }
      case "check_dropdown": {
        name = "/image/icons/check_dropdown";
        break;
      }
      case "dot": {
        name = "./image/icons/dot";
        break;
      }
      case "textarea": {
        name = "/image/icons/textarea";
        break;
      }
      case "date": {
        name = "/image/icons/date";
        break;
      }
      case "puredate": {
        name = "/image/icons/pureDate";
        break;
      }
      case "puretime": {
        name = "/image/icons/pureTime";
        break;
      }
      case "location": {
        name = "/image/icons/location";
        break;
      }
      case "address": {
        name = "/image/icons/address";
        break;
      }
      case "writtensign": {
        name = "/image/icons/writtensign";
        break;
      }
      case "image": {
        name = "/image/icons/image";
        break;
      }
      case "tmpForm": {
        name = "/image/icons/tmpForm";
        break;
      }
      case "childForm": {
        name = "/image/icons/childForm";
        break;
      }
      case "advanced": {
        name = "/image/icons/advanced";
        break;
      }
      case "basic": {
        name = "/image/icons/basic";
        break;
      }
      case "delete": {
        name = "/image/icons/delete";
        break;
      }
      case "edit": {
        name = "/image/icons/edit";
        break;
      }
      case "delete2": {
        name = "/image/icons/delete2";
        break;
      }
      default:
        name = "/image/icons/dot";
    }
    width = width ? width : 14;
    const hoverName = name + "_hover.png";
    return (
      <span className={classess} onClick={this.props.onClick}>
        <i
          className="form-icon text"
          style={{
            backgroundImage: `url(${name + ".png"})`,
            width: `${width}px`
          }}
        ></i>
        <i
          className="form-icon text"
          style={{ backgroundImage: `url(${hoverName})`, width: `${width}px` }}
        ></i>
      </span>
    );
  }
}
