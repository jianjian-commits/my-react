import React, { Component } from "react";
import PropTypes from "prop-types";
import { findDOMNode } from "react-dom";
import { DragSource, DropTarget } from "react-dnd";
import ItemTypes from "../../../../utils/ItemTypes";
import { logDOM, logRoles } from "@testing-library/react";

const _hideAllComponent = (componentArray, isNotHideParentTop) => {
  for (let i = 0, len = componentArray.length; i < len; i++) {
    document.getElementById(`dragItem${i}Top`).style.display = "none";
    document.getElementById(`dragItem${i}Bottom`).style.display = "none";
  }
  if (isNotHideParentTop !== false) {
    if (document.getElementById("dragParentTop")  != void 0) {
      document.getElementById("dragParentTop").style.display = "none";
    }
  }

  if (document.getElementById("formChildTest")  != void 0) {
    document.getElementById("formChildTest").setAttribute("class", "")
  }
}

const _hideAllFormChild = (parentId, componentArray) => {
  for (let i = 0, len = componentArray.length; i < len; i++) {
    document.getElementById(`${parentId}${i}Top`).style.display = "none";
    document.getElementById(`${parentId}${i}Bottom`).style.display = "none";
  }
}

let domHeight = 0;
let dragType = null;

let _isFormChildIgnoreComponent = (type) => {
  return type !== "FormChildTest" && type !== "GetLocalPosition" && type !== "HandWrittenSignature" && type !== "ComponentTemplate" && type !== "Button"

}

let _hoverIntoComponent = (component, props, monitor, targetComponentId, targetType) => {
  let index = null;
  let monItem = monitor.getItem();
  let draggedType = monItem.data.type;

  props.componentArray.forEach((item, i) => {
    if (item.id === targetComponentId) {
      index = i
    }
  });

  const dom = findDOMNode(component);
  const hoverBoundingRect = dom.getBoundingClientRect();
  const clientOffset = monitor.getClientOffset();
  const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
  const hoverClientY = clientOffset.y - hoverBoundingRect.top;

  _hideAllComponent(props.componentArray);

  if (targetType === "FormChildTest" && _isFormChildIgnoreComponent(draggedType)) {
    const hoverSize = 27;
    let formChildArray = component.props.data.values;
    _hideAllFormChild(targetComponentId, formChildArray);

    if (dragType !== targetType) {
      domHeight = hoverBoundingRect.height;
      dragType = targetType;
    }
    if (hoverClientY <= hoverSize) {
      // 放置在上一个       
      document.getElementById(`dragItem${index}Top`).style.display = "block";
    } else if (hoverClientY > (domHeight - hoverSize)) {
      // 放置在下一个
      document.getElementById(`dragItem${index}Bottom`).style.display = "block";
    } else {
      if (formChildArray.length > 0) {
        // let formChildContainer = document.querySelector(`#${targetComponentId} .form-child-test`);

        let childRectArray = formChildArray.map((item) => {
          return document.getElementById(item.id).getBoundingClientRect();
        });

        let childRectLength = childRectArray.length;
        let clientX = clientOffset.x;
        let lastChild = childRectArray[childRectLength - 1];

        if (clientX <= childRectArray[0].x) {
          document.getElementById(`${targetComponentId}${0}Top`).style.display = "block";
        } else if (clientX >= (lastChild.x + lastChild.width)) {
          document.getElementById(`${targetComponentId}${childRectLength - 1}Bottom`).style.display = "block";
        } else {
          childRectArray.forEach((item, i) => {
            if (clientX > item.x && clientX < (item.x + item.width)) {
              if (clientX <= (item.x + item.width / 2)) {
                document.getElementById(`${targetComponentId}${i}Top`).style.display = "block";
              } else {
                document.getElementById(`${targetComponentId}${i}Bottom`).style.display = "block";
              }
            }
          });
        }
      } else {
        document.getElementById("formChildTest").setAttribute("class", "formChildTest-hover")
      }
    }
  } else {
    if (hoverClientY > hoverMiddleY) {
      // 放置在下一个
      document.getElementById(`dragItem${index}Bottom`).style.display = "block";
    } else {
      // 放置在上一个
      document.getElementById(`dragItem${index}Top`).style.display = "block";
    }
  }
};

const setHoverClass = (props, component, monitor) => {
  let targetComponentId = component.props.data.id;
  let targetType = component.props.data.type;

  if (targetComponentId === "dragParent") {
    _hideAllComponent(props.componentArray, false);

    document.getElementById("dragParentShadow").style.display = "block";
    document.getElementById("dragParentTop").style.display = "block";
  } else {
    _hoverIntoComponent(component, props, monitor, targetComponentId, targetType);
  }
};

const cardSource = {
  beginDrag(props, monitor, component) {
    return {
      id: props.id,
      index: props.index,
      isDragging: true,
      data: {
        type: props.data.type
      }
    };
  },
  endDrag(props, monitor, component) {
    if (props.componentArray  != void 0) {
      _hideAllComponent(props.componentArray)
    }
  }
};

const _isDragIntoEmptyDom = (hoverIndex) => {
  return hoverIndex === -2
}
const _isDragIntoParent = (hoverIndex) => {
  return hoverIndex === -1
}

const cardTarget = {
  drop(props, monitor, component) {
    let monItem = monitor.getItem();
    let dragIndex = monItem.index;
    let dragType = monItem.data.type;
    let hoverIndex = props.index;
    let isDragToParent = false;
    let targetType = component.props.data.type;


    if (document.getElementById("formPlaceHolder")  != void 0) {
      document.getElementById("formPlaceHolder").style.display = "block";
    }
    console.log(document.getElementById("dragParentShadow"));
    if (document.getElementById("dragParentShadow")  != void 0) {
      document.getElementById("dragParentShadow").style.display = "none";
    }
    if (document.getElementById("dragParentTop")  != void 0) {
      document.getElementById("dragParentTop").style.display = "none";
    }

    if (_isDragIntoEmptyDom(hoverIndex)) {
      props.insertCard(monItem.onCreate(monItem.data), 0);

    } else {
      if (props.componentArray  != void 0) {
        let componentLen = props.componentArray.length;

        _hideAllComponent(props.componentArray)

        if (_isDragIntoParent(hoverIndex)) {
          hoverIndex = componentLen - 1
          isDragToParent = true;
        }
      }

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const dom = findDOMNode(component);
      const hoverBoundingRect = dom.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (_isDragIntoParent(dragIndex)) {
        if (targetType === "FormChildTest" && _isFormChildIgnoreComponent(dragType)) {
          let hoverSize = 27;
          let formChildArray = component.props.data.values;

          if (hoverClientY <= hoverSize) {
            // 放置在上一个
            monItem.index = hoverIndex;
            props.insertCard(monItem.onCreate(monItem.data), hoverIndex);
          } else if (hoverClientY > (domHeight - hoverSize)) {
            // 放置在下一个
            hoverIndex++
            monItem.index = hoverIndex;
            props.insertCard(monItem.onCreate(monItem.data), hoverIndex);
          } else {
            let targetIndex = 0;

            if (formChildArray.length > 0) {
              let childRectArray = formChildArray.map((item) => {
                return document.getElementById(item.id).getBoundingClientRect()
              });

              let childRectLength = childRectArray.length;
              let clientX = clientOffset.x;
              let lastChild = childRectArray[childRectLength - 1];

              if (clientX <= childRectArray[0].x) {
                targetIndex = 0;
              } else if (clientX >= (lastChild.x + lastChild.width)) {
                targetIndex = childRectLength;
              } else {
                targetIndex = childRectArray.reduce((result, item, i) => {
                  if (result >= 0) {
                    return result
                  } else {
                    if (clientX > item.x && clientX < (item.x + item.width)) {
                      if (clientX <= (item.x + item.width / 2)) {
                        return i
                      } else {
                        return i + 1
                      }
                    }

                    return result
                  }
                }, -1);
              };
            } else {
              targetIndex = 0;
            }

            let editComponent = null;
            let editInnerComponent = null;
            let editComponentIndex = -1;
            let resultArr = props.componentArray.map((item) => {
              if (item.id === component.props.data.id) {
                let newArr = [...item.values];
                const newInnerItem = monItem.onCreate(monItem.data);
                newArr.splice(targetIndex, 0, newInnerItem);
                const newItem = {
                  ...item,
                  values: newArr
                };
                editInnerComponent = newInnerItem;
                editComponentIndex = targetIndex;
                editComponent = newItem;
                return newItem

              };
              return item;
            });
            if (props.customValue  != void 0) {
              resultArr.push(props.customValue)
            }

            props.saveData(resultArr)
            props.editModeOn(editComponent, null, editInnerComponent);
            // props.setActiveInnerIndex(editComponentIndex);
            props.setActiveInnerIndex(editInnerComponent.id);
          }
        } else {
          if (isDragToParent) {
            hoverIndex++;
          } else {
            if (hoverClientY > hoverMiddleY) {
              hoverIndex++;
            }
          }
          monItem.index = hoverIndex;
          props.insertCard(monItem.onCreate(monItem.data), hoverIndex);
        }
      } else {
        if (dragIndex === (hoverIndex - 1) && hoverClientY < hoverMiddleY) {
          return;
        } else {
          if (hoverClientY > hoverMiddleY) {
            hoverIndex++
          }

          props.moveCard(dragIndex, hoverIndex, isDragToParent);
          monItem.index = hoverIndex;
        }
      }
    }
  },
  hover(props, monitor, component) {
    if (props.componentArray  != void 0) {
      setHoverClass(props, component, monitor);
    } else if (props.data.id === "EmptyFormComponent") {
      document.getElementById("formPlaceHolder").setAttribute("class", "hover-emptyDom")
    }
  }
};

export default function (ComposedComponent) {
  class Card extends Component {
    static propTypes = {
      connectDragSource: PropTypes.func,
      connectDropTarget: PropTypes.func,
      index: PropTypes.number.isRequired,
      isDragging: PropTypes.bool,
      id: PropTypes.any.isRequired,
      moveCard: PropTypes.func.isRequired
    };


    render() {
      const { isDragging, connectDragSource, connectDropTarget } = this.props;
      const opacity = isDragging ? 0 : 1;
      const style = {
        width: "100%",
        height: "50px",
        border: "1px dashed rgba(0,122,255,1)",
        display: "none",
      };
      let i = this.props.index;

      if (_isDragIntoEmptyDom(i)) {
        return connectDropTarget(
          <div id={String(this.props.id)} onDragLeave={(e) => {
            if (document.getElementById("formPlaceHolder")  != void 0) {
              document.getElementById("formPlaceHolder").setAttribute("class", "")
            }
          }}>
            <div style={style} key={`dragEmptyDomTop`} id={`dragEmptyDomTop`}></div>
            <ComposedComponent {...this.props} style={{ opacity }} />
          </div>
        )
      } else if (_isDragIntoParent(i)) {
        return connectDropTarget(
          <div id={String(this.props.id)} onDragLeave={(e) => {
            if (document.getElementById("dragParentTop")  != void 0) {
              document.getElementById("dragParentTop").style.display = "none";
            }
            // document.getElementById("dragParentShadow").style.display = "none";
          }}>
            {
              _isDragIntoEmptyDom(i) ? <></> :
                <div style={style} key={`dragParentTop`} id={`dragParentTop`}></div>
            }
            <ComposedComponent {...this.props} style={{ opacity }} />

            <div id={`dragParentShadow`}></div>
          </div>
        )
      } else {
        return connectDragSource(
          connectDropTarget(
            <div
              id={String(this.props.id)}
              className={this.props.active ? "form-item-active" : null}
            >
              {
                _isDragIntoEmptyDom(i) ? <></> :
                  <div style={style} key={`dragItem${i}Top`} id={`dragItem${i}Top`} ></div>
              }
              <ComposedComponent {...this.props} style={{ opacity }} />
              {
                _isDragIntoEmptyDom(i) ?
                  <></> : <div style={style} key={`dragItem${i}Bottom`} id={`dragItem${i}Bottom`} ></div>
              }
            </div>
          )
        );
      }
    }
  }

  const x = DropTarget(ItemTypes.CARD, cardTarget, connect => ({
    connectDropTarget: connect.dropTarget()
  }))(Card);

  return DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    };
  })(x);
}
