import React from "react";
import ComponentBox from "../componentBox";
import { ComponentHeader } from "../utils/commonDom";
import {
  setActiveInnerIndex,
  setItemAttr
} from "../../../../redux/utils/operateFormComponent";
import classNames from "classnames";
import { connect } from "react-redux";

const style = {
  width: "60px",
  height: "100%",
  border: "1px dashed rgba(0,122,255,1)",
  display: "none"
};
class FormChildTest extends React.Component {
  constructor(props) {
    super(props);
    this.formChildTest = null;
  }

  renderComponentIcon = (iconName,item,i,parentId) =>{
    const { data } = this.props;
    return (
      <div
        id={item.id}
        onClick={e => {
          this.props.editModeOn(data, e, item);
          this.props.setActiveInnerIndex(item.id);
        }}
        className="form-child-item"
        key={item.id}
      >
        <div style={style} id={`${parentId}${i}Top`}></div>
        <div
          className={classNames("child-item-content", {
            'activeContent': this.props.activeInnerIndex === item.id
          })}
        >
          <div className={item.validate.required ? "item-title-required" : "item-title"}>{item.label}</div>
          <div className="item-component">
            <div className="checkboxComponent">
              <div className="component-icon">
                <img src={"/image/icons/"+iconName+".png"} alt="图片加载出错" />
              </div>
            </div>
            <div
              className={classNames("deleteBtn", {
                activeItem: this.props.activeInnerIndex !== item.id
              })}
              onClick={(e) => {
                e.stopPropagation()
                const { values } = this.props.data;
                const newValues = values.filter(
                  (innerItem, index) => innerItem.id !== item.id
                );
                this.props.setItemAttr(
                  this.props.data,
                  "values",
                  newValues
                );
                this.props.setActiveInnerIndex(-1);
                this.props.editModeOn(data,e);
              }}
            >
              <img src="/image/icons/bar_delete_hover.png" />
            </div>
          </div>
        </div>
        <div style={style} id={`${parentId}${i}Bottom`}></div>
      </div>
    );
  }
  renderChildrenComponent(parentId, componentArray) {
    const style = {
      width: "60px",
      height: "100%",
      border: "1px dashed rgba(0,122,255,1)",
      display: "none"
    };
    return componentArray.map((item, i) => {
      const { data } = this.props;
      switch (item.type) {
        case "RadioButtons":
          return this.renderComponentIcon("radio",item,i,parentId);
        case "CheckboxInput":
          return this.renderComponentIcon("checkbox",item,i,parentId);
        case "FileUpload":
          return this.renderComponentIcon("file",item,i,parentId);
        case "ImageUpload":
          return this.renderComponentIcon("image",item,i,parentId);
        case "GetLocalPosition":
          return this.renderComponentIcon("location",item,i,parentId);
        case "DateInput":
          return this.renderComponentIcon("date",item,i,parentId);
        case "Address":
          return this.renderComponentIcon("address",item,i,parentId);
          // return (
          //   <div
          //     id={item.id}
          //     onClick={e => {
          //       this.props.editModeOn(data, e, item);
          //       this.props.setActiveInnerIndex(item.id);
          //     }}
          //     className="form-child-item"
          //     key={item.id}
          //   >
          //     <div style={style} id={`${parentId}${i}Top`}></div>
          //     <div
          //       className={classNames("child-item-content", {
          //         'activeContent': this.props.activeInnerIndex === item.id
          //       })}
          //     >
          //       <div className={item.validate.required ? "item-title-required" : "item-title"}>{item.label}</div>
          //       <div className="item-component">
          //         <div className="checkboxComponent">
          //           <img src="/image/icons/edit.png" alt="图片加载出错" />
          //         </div>
          //         <div
          //           className={classNames("deleteBtn", {
          //             activeItem: this.props.activeInnerIndex !== item.id
          //           })}
          //           onClick={(e) => {
          //             e.stopPropagation()
          //             const { values } = this.props.data;
          //             const newValues = values.filter(
          //               (innerItem, index) => innerItem.id !== item.id
          //             );
          //             this.props.setItemAttr(
          //               this.props.data,
          //               "values",
          //               newValues
          //             );
          //             this.props.setActiveInnerIndex(-1);
          //             this.props.editModeOn(data,e);
          //           }}
          //         >
          //           <img src="/image/icons/bar_delete_hover.png" />
          //         </div>
          //       </div>
          //     </div>
          //     <div style={style} id={`${parentId}${i}Bottom`}></div>
          //   </div>
          // );
        case "DropDown":
          return this.renderComponentIcon("dropdown",item,i,parentId);
        case "MultiDropDown":
          return this.renderComponentIcon("check_dropdown",item,i,parentId);
          // return (
          //   <div
          //     id={item.id}
          //     onClick={e => {
          //       this.props.editModeOn(data, e, item);
          //       this.props.setActiveInnerIndex(item.id);
          //     }}
          //     className="form-child-item"
          //     key={item.id}
          //   >
          //     <div style={style} id={`${parentId}${i}Top`}></div>
          //     <div
          //       className={classNames("child-item-content", {
          //         'activeContent': this.props.activeInnerIndex === item.id
          //       })}
          //     >
          //       <div className={item.validate.required ? "item-title-required" : "item-title"}>{item.label}</div>
          //       <div className="item-component">
          //         <Select />
          //         <div
          //           className={classNames("deleteBtn", {
          //             activeItem: this.props.activeInnerIndex !== item.id
          //           })}
          //           onClick={(e) => {
          //             e.stopPropagation()
          //             const { values } = this.props.data;
          //             const newValues = values.filter(
          //               (innerItem, index) => innerItem.id !== item.id
          //             );
          //             this.props.setItemAttr(
          //               this.props.data,
          //               "values",
          //               newValues
          //             );
          //             this.props.setActiveInnerIndex(-1);
          //             this.props.editModeOn(data,e);
          //           }}
          //         >
          //           <img src="/image/icons/bar_delete_hover.png" />
          //         </div>
          //       </div>
          //     </div>
          //     <div style={style} id={`${parentId}${i}Bottom`}></div>
          //   </div>
          // );
        case "SingleText":
          return this.renderComponentIcon("text",item,i,parentId);
        case "TextArea":
          return this.renderComponentIcon("textarea",item,i,parentId);
        case "NumberInput":
          return this.renderComponentIcon("number",item,i,parentId);
        case "PhoneInput":
          return this.renderComponentIcon("phone",item,i,parentId);
        case "IdCardInput":
          return this.renderComponentIcon("idcard",item,i,parentId);
        case "EmailInput":
          return this.renderComponentIcon("email",item,i,parentId);
          // return (
          //   <div
          //     id={item.id}
          //     onClick={e => {
          //       this.props.editModeOn(data, e, item);
          //       this.props.setActiveInnerIndex(item.id);
          //     }}
          //     className="form-child-item"
          //     key={item.id}
          //   >
          //     <div style={style} id={`${parentId}${i}Top`}></div>
          //     <div
          //       className={classNames("child-item-content", {
          //         'activeContent': this.props.activeInnerIndex === item.id
          //       })}
          //     >
          //       <div className={item.validate.required ? "item-title-required" : "item-title"}>{item.label}</div>
          //       <div className="item-component">
          //         <Input />
          //         <div
          //           className={classNames("deleteBtn", {
          //             activeItem: this.props.activeInnerIndex !== item.id
          //           })}
          //           onClick={(e) => {
          //             e.stopPropagation()
          //             const { values } = this.props.data;
          //             const newValues = values.filter(
          //               (innerItem, index) => innerItem.id !== item.id
          //             );
          //             this.props.setItemAttr(
          //               this.props.data,
          //               "values",
          //               newValues
          //             );
          //             this.props.setActiveInnerIndex(-1);
          //             this.props.editModeOn(data,e);
          //           }}
          //         >
          //           <img src="/image/icons/bar_delete_hover.png" />
          //         </div>
          //       </div>
          //     </div>
          //     <div style={style} id={`${parentId}${i}Bottom`}></div>
          //   </div>
          // );
        default:
          break;
      }
    });
  }

  componentDidUpdate() {
    this.formChildTest.scrollLeft = this.props.scrollLeft;
  };

  render() {
    let baseClasses = "SortableItem rfb-item";

    if (this.props.active) {
      baseClasses += " active";
    }

    let componentArray = this.props.data.values;

    return (
      <ComponentBox
        {...this.props}
        className={baseClasses}
        content={
          <>
            <ComponentHeader {...this.props} active={this.props.active} />
            <div className="form-group">
              <div className="form-child-test" ref={value => this.formChildTest = value} onScroll={(e) => {
                this.props.saveScrollLeft(e.target.scrollLeft);
              }}>
                <div className="form-child-head">
                  <div className="item-title" />
                  <div className="item-component">1</div>
                </div>
                {
                  componentArray.length > 0 ? (
                    this.renderChildrenComponent(this.props.data.id, componentArray)
                  ) : (
                      <div id="formChildTest">从左侧拖拽添加字段</div>
                    )
                }
                {
                  componentArray.length > 0 ?
                    <div className="form-child-foot"></div> : <></>
                }
              </div>
            </div>
          </>
        }
      />
    );
  }
}
export default connect(
  store => ({
    activeInnerIndex: store.formBuilder.activeInnerIndex
  }),
  { setActiveInnerIndex, setItemAttr }
)(FormChildTest);
