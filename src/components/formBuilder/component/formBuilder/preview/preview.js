import React from "react";
import { connect } from "react-redux";
import FormComponentContainer from "./component/formComponentContainer";
// import PreviewHeader from "./component/previewHeader";
import { updateOrder, setDragState } from "../redux/utils/operateFormComponent";
import { setFormName } from "../redux/utils/operateForm";

class Preview extends React.Component {
  constructor(props) {
    super(props);

    this.customValue = null;
    this.formChildScrollObj = {};
    this.editForm = React.createRef();
    this.moveCard = this.moveCard.bind(this);
    this.insertCard = this.insertCard.bind(this);
    this.updateElement = this.updateElement.bind(this);
    this.deleteFormComponent = this.deleteFormComponent.bind(this);
    this.saveData = this.saveData.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.editModeOff);
    if (this.props.defaultForm && this.props.defaultForm.components) {
      this.props.defaultForm.components.forEach((component, index) => {
        if (component.type !== "CustomValue") {
          this.insertCard(component, index);
        } else {
          this.setState({ customValue: component });
        }
      });

      this.props.setFormName(this.props.defaultForm.name);
      this.props.editModeOn(null);
    }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.editModeOff);
  }

  editModeOff = e => {
    if (this.editForm.current && !this.editForm.current.contains(e.target)) {
      this.manualEditModeOff();
    }
  };

  manualEditModeOff = () => {
    const { editElement } = this.props;
    if (editElement && editElement.dirty) {
      editElement.dirty = false;
      this.updateElement(editElement);
    }
    this.props.manualEditModeOff();
  };

  _setValue(text) {
    return text.replace(/[^A-Z0-9]+/gi, "_").toLowerCase();
  }

  updateElement(element) {
    const { data } = this.props;
    let found = false;

    for (let i = 0, len = data.length; i < len; i++) {
      if (element.id === data[i].id) {
        data[i] = element;
        found = true;
        break;
      }
    }

    if (found) {
      this.props.updateOrder(data);
    }
  }

  _calcLayoutY(dataArray, index, removeCard) {
    dataArray.forEach((item, i) => {
      if (item.type === "CustomValue") return;
      if (i > index) {
        if (removeCard.layout.y !== item.layout.y) {
          item.layout.y -= 3;
        }
      }
    });

    return dataArray;
  }

  deleteFormComponent(removeCard) {
    let newDataArray = [...this.props.data];
    let index = newDataArray.indexOf(removeCard);
    let hasSameLevelItem =
      newDataArray
        .filter(item => {
          return item.id !== removeCard.id && item.type !== "CustomValue";
        })
        .filter(item => {
          return item.layout.y === removeCard.layout.y;
        }).length >= 1;

    if (!hasSameLevelItem) {
      newDataArray = this._calcLayoutY(newDataArray, index, removeCard);
    }

    newDataArray.splice(index, 1);

    this.props.updateOrder(newDataArray);
  }

  insertCard(item, hoverIndex) {
    const { data } = this.props;

    data.splice(hoverIndex, 0, item);

    // this.saveData(item, hoverIndex, hoverIndex);
    this.props.updateOrder(data);

    this.props.editModeOn(item, null);
  }

  saveData(dragCard, dragIndex, hoverIndex) {
    let { data } = this.props;

    let newData = [...data];
    let customValue = null;

    if (dragIndex < hoverIndex) {
      hoverIndex -= 1;
    }

    newData.forEach((item, index) => {
      if (item.type === "CustomValue") {
        customValue = item;
        newData.splice(index, 1);
      }
    });

    newData.splice(dragIndex, 1);
    newData.splice(hoverIndex, 0, dragCard);

    if (customValue != void 0) {
      newData.push(customValue);
    }

    this.props.updateOrder(newData);
    this.props.editModeOn(this.props.data[hoverIndex], null);
  }

  _calcLayoutYWithInsert(data, index) {
    data.forEach((item, i) => {
      if (i >= index && item.layout) {
        item.layout.y += 3;
      }
    });
  }

  moveCard(dragIndex, hoverIndex, isDragToParent) {
    const { data } = this.props;
    const dragCard = data[dragIndex];
    if (isDragToParent) {
      hoverIndex = data.length - 1;
    }

    this.saveData(dragCard, dragIndex, hoverIndex);
    // this.props.editModeOn(this.props.data[hoverIndex], null);
  }

  handleSetDragState = state => {
    this.props.setDragState(state);
  };

  getElement(data, item, index, activeIndex, customValue) {
    const FormComponent = FormComponentContainer[item.element];
    let active = index === activeIndex ? true : false;

    if (this.formChildScrollObj[item.key] == void 0) {
      this.formChildScrollObj[item.key] = 0;
    }

    return (
      <FormComponent
        key={Math.random()}
        id={item.key}
        index={index}
        componentArray={data}
        moveCard={this.moveCard}
        insertCard={this.insertCard}
        mutable={false}
        parent={this.props.parent}
        editModeOn={this.props.editModeOn}
        setActiveInnerIndex={this.props.setActiveInnerIndex}
        isDraggable={true}
        sortData={item.key}
        data={item}
        customValue={customValue}
        setDragState={this.handleSetDragState}
        saveData={this.props.updateOrder}
        _onDestroy={this.deleteFormComponent}
        active={active}
        scrollLeft={this.formChildScrollObj[item.key]}
        saveScrollLeft={value => {
          this.formChildScrollObj[item.key] = value;
        }}
      />
    );
  }

  handleSetFormName = e => {
    this.props.editModeOn({ element: "SetFormName" }, e);
  };

  buildDragParent(data, activeIndex) {
    const FormComponent = FormComponentContainer["DragParent"];
    let item = { id: "dragParent", key: "dragParent" };
    let active = activeIndex === -2 ? true : false;

    return (
      <FormComponent
        key={Math.random()}
        id={"dragParent"}
        index={-1}
        componentArray={data}
        moveCard={this.moveCard}
        insertCard={this.insertCard}
        mutable={false}
        parent={this.props.parent}
        isDraggable={false}
        draggable={false}
        sortData={item.key}
        data={item}
        active={active}
        editModeOn={this.props.editModeOn}
        setDragState={() => { }}
        _onDestroy={() => { }}
      />
    );
  }

  buildEmptyComponent() {
    const FormComponent = FormComponentContainer["EmptyFormComponent"];
    let item = { id: "EmptyFormComponent", key: "EmptyFormComponent" };

    return (
      <FormComponent
        key={Math.random()}
        id="emptyFormComponent"
        index={-2}
        moveCard={this.moveCard}
        insertCard={this.insertCard}
        mutable={false}
        parent={this.props.parent}
        isDraggable={false}
        sortData={item.key}
        data={item}
        show={true}
        text="从左侧拖拽字段添加到此工作区"
      />
    );
  }

  render() {
    let { isEditMode, isDragging, activeIndex } = this.props;
    let classes = this.props.className;
    if (isEditMode) {
      classes += " is-editing";
    }
    if (isDragging) {
      // classes += " isdragging";
    }
    let data = [];

    if (this.props.data != void 0) {
      data = this.props.data.filter(x => {
        if (x.type === "CustomValue") {
          this.customValue = x;
        }

        return x.type !== "CustomValue";
      });
    }

    const items = data.map((item, index) =>
      this.getElement(data, item, index, activeIndex, this.customValue)
    );

    return (
      <div className="preview-container">
        <div className={classes} id="dragWrapper">
          {items.length > 0 ? (
            <div className="Sortable">
              {items}
              {this.buildDragParent(data, activeIndex)}
            </div>
          ) : (
              this.buildEmptyComponent()
            )}
        </div>
      </div>
    );
  }
}

Preview.defaultProps = {
  showCorrectColumn: false,
  isEditMode: false,
  editElement: null,
  className: "react-form-builder-preview perview-container"
};

export default connect(
  store => ({
    data: store.formBuilder.data,
    isDragging: store.formBuilder.isDragging,
    activeIndex: store.formBuilder.activeIndex
  }),
  {
    updateOrder,
    setFormName,
    setDragState
  }
)(Preview);
