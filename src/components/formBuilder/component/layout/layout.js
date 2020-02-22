import React, { PureComponent } from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { Select, Form, Popconfirm, Input } from "antd";
import FormLayout from "./components/formLayout";
import LayoutTool from "./components/layoutTool";
import { submitLayout } from "../submission/redux/utils/operateSubmissionUtils";
import { connect } from "react-redux";
import HeaderBar from "../base/NavBar";
import locationUtils from "../../utils/locationUtils";
import config from "../../config/config";
import PhoneInput from "../submission/component/phoneInput";
import Email from "../submission/component/Email";
import Checkbox from "../submission/component/checkboxInput/checkboxTest";
import DropDown from "../submission/component/dropDown/dropDownTest";
import IdCard from "../submission/component/idCard";
import SingleText from "../submission/component/singleTextInput";
import RadioButtons from "../submission/component/radioInput/radioTest";
import NumberInput from "../submission/component/numberInput";
import DateInput from "../submission/component/dateInput";
import FileUpload from "../submission/component/fileUpload";
import TextArea from "../submission/component/textArea";
import MultiDropDown from "../submission/component/multiDropDown/multiDropDown";
import FormChildTest from "../submission/component/formChildTest/formChildTest";
import Address from "../submission/component/address";
import HandWrittenSignaturePc from "../submission/component/handWrittenSignature/handWrittenSignaturePc";
import PositionComponentPC from "../submission/component/getLocalPosition/component/positionComponentPC";
import ImageUpload from "../submission/component/imageUpload/imageUpload";
import { initToken } from "../../utils/tokenUtils";
import LayoutModal from "./components/layoutModal";
import { instanceAxios } from "../../utils/tokenUtils";

class Layout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formChildDataObj: {},
      formComponent: {},
      defaultLayout: [],
      currentLayout: [],
      currentLayoutId: "",
      currentLayoutName: "",
      isDragging: false,
      PureComponent: [], //组件数组
      toolComponent: [], //拖拽区表单数据
      formId: locationUtils.getUrlParamObj().id,
      currentPage: locationUtils.getUrlParamObj().page,
      modalVisible: false,
      formLayoutList: [], //当前表单的所有布局
      operationType: "",
      customValue: {}
    };
    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    // this.setCurrentLayout = this.setCurrentLayout.bind(this);
  }
  showModal = () => {
    this.setState(state => ({
      ...state,
      modalVisible: true
    }));
  };

  handleOk = e => {
    this.setState(state => ({
      ...state,
      modalVisible: false
    }));
  };

  handleCancel = e => {
    this.setState(state => ({
      ...state
    }));
  };

  componentDidMount() {
    // initToken()
    //   .then(() => {
    // this.props.getForms(6, this.state.currentPage).then(forms => {
    //   // 获得表单数据，避免render重复处理
    //   this._handleFilterDate(forms);
    // });
    instanceAxios
      .get(config.apiUrl + "/form/" + this.state.formId)
      .then(res => {
        this._handleFilterDate(res.data);
      })
      .catch(err => {
        console.error(err);
      });
    // })
    // .catch(err => {
    //   console.error(err);
    // });
  }

  renderFormComponent = (getFieldDecorator, components) => {
    return components.map((item, i) => {
      switch (item.type) {
        case "EmailInput":
          return (
            <div key={item.key} className="layout-parent">
              <Popconfirm
                title="确定要隐藏该组件吗？"
                onConfirm={this.handleToolItemClick.bind(this, item.id)}
                okText="确定"
                cancelText="取消"
              >
                <div className="btn is-isolated btn-school">
                  <i className="is-isolated fa fa-trash-o"></i>
                </div>
              </Popconfirm>
              <Email
                disabled={true}
                key={item.key}
                getFieldDecorator={getFieldDecorator}
                item={item}
              />
              <div className="layout-shadow"></div>
            </div>
          );
        case "PhoneInput":
          return (
            <div key={item.key}>
              <Popconfirm
                title="确定要隐藏该组件吗？"
                onConfirm={this.handleToolItemClick.bind(this, item.id)}
                okText="确定"
                cancelText="取消"
              >
                <div className="btn is-isolated btn-school">
                  <i className="is-isolated fa fa-trash-o"></i>
                </div>
              </Popconfirm>
              <PhoneInput
                disabled={true}
                key={item.key}
                getFieldDecorator={getFieldDecorator}
                item={item}
              />
              <div className="layout-shadow"></div>
            </div>
          );
        case "IdCardInput":
          return (
            <div key={item.key}>
              <Popconfirm
                title="确定要隐藏该组件吗？"
                onConfirm={this.handleToolItemClick.bind(this, item.id)}
                okText="确定"
                cancelText="取消"
              >
                <div className="btn is-isolated btn-school">
                  <i className="is-isolated fa fa-trash-o"></i>
                </div>
              </Popconfirm>
              <IdCard
                disabled={true}
                key={item.key}
                getFieldDecorator={getFieldDecorator}
                item={item}
              />
              <div className="layout-shadow"></div>
            </div>
          );
        case "SingleText":
          return (
            <div key={item.key}>
              <Popconfirm
                title="确定要隐藏该组件吗？"
                onConfirm={this.handleToolItemClick.bind(this, item.id)}
                okText="确定"
                cancelText="取消"
              >
                <div className="btn is-isolated btn-school">
                  <i className="is-isolated fa fa-trash-o"></i>
                </div>
              </Popconfirm>
              <SingleText
                disabled={true}
                key={item.key}
                getFieldDecorator={getFieldDecorator}
                item={item}
              />
              <div className="layout-shadow"></div>
            </div>
          );
        case "NumberInput":
          return (
            <div key={item.key}>
              <Popconfirm
                title="确定要隐藏该组件吗？"
                onConfirm={this.handleToolItemClick.bind(this, item.id)}
                okText="确定"
                cancelText="取消"
              >
                <div className="btn is-isolated btn-school">
                  <i className="is-isolated fa fa-trash-o"></i>
                </div>
              </Popconfirm>
              <NumberInput
                key={item.key}
                getFieldDecorator={getFieldDecorator}
                item={item}
              />
              <div className="layout-shadow"></div>
            </div>
          );
        case "RadioButtons":
          return (
            <div key={item.key}>
              <Popconfirm
                title="确定要隐藏该组件吗？"
                onConfirm={this.handleToolItemClick.bind(this, item.id)}
                okText="确定"
                cancelText="取消"
              >
                <div className="btn is-isolated btn-school">
                  <i className="is-isolated fa fa-trash-o"></i>
                </div>
              </Popconfirm>
              <RadioButtons
                key={item.key}
                getFieldDecorator={getFieldDecorator}
                item={item}
              />
              <div className="layout-shadow"></div>
            </div>
          );
          break;
        case "CheckboxInput":
          return (
            <div key={item.key}>
              <Popconfirm
                title="确定要隐藏该组件吗？"
                onConfirm={this.handleToolItemClick.bind(this, item.id)}
                okText="确定"
                cancelText="取消"
              >
                <div className="btn is-isolated btn-school">
                  <i className="is-isolated fa fa-trash-o"></i>
                </div>
              </Popconfirm>
              <Checkbox
                key={item.key}
                getFieldDecorator={getFieldDecorator}
                item={item}
              />
              <div className="layout-shadow"></div>
            </div>
          );
          break;
        case "DropDown":
          return (
            <div key={item.key}>
              <Popconfirm
                title="确定要隐藏该组件吗？"
                onConfirm={this.handleToolItemClick.bind(this, item.id)}
                okText="确定"
                cancelText="取消"
              >
                <div className="btn is-isolated btn-school">
                  <i className="is-isolated fa fa-trash-o"></i>
                </div>
              </Popconfirm>
              <DropDown
                key={item.key}
                getFieldDecorator={getFieldDecorator}
                item={item}
              />
              <div className="layout-shadow"></div>
            </div>
          );
        case "DateInput":
          return (
            <div key={item.key}>
              <Popconfirm
                title="确定要隐藏该组件吗？"
                onConfirm={this.handleToolItemClick.bind(this, item.id)}
                okText="确定"
                cancelText="取消"
              >
                <div className="btn is-isolated btn-school">
                  <i className="is-isolated fa fa-trash-o"></i>
                </div>
              </Popconfirm>
              <DateInput getFieldDecorator={getFieldDecorator} item={item} />
              <div className="layout-shadow"></div>
            </div>
          );
        case "FileUpload":
          return (
            <div key={item.key}>
              <Popconfirm
                title="确定要隐藏该组件吗？"
                onConfirm={this.handleToolItemClick.bind(this, item.id)}
                okText="确定"
                cancelText="取消"
              >
                <div className="btn is-isolated btn-school">
                  <i className="is-isolated fa fa-trash-o"></i>
                </div>
              </Popconfirm>
              <FileUpload
                key={item.key}
                getFieldDecorator={getFieldDecorator}
                item={item}
              />
              <div className="layout-shadow"></div>
            </div>
          );
        case "TextArea":
          return (
            <div key={item.key}>
              <Popconfirm
                title="确定要隐藏该组件吗？"
                onConfirm={this.handleToolItemClick.bind(this, item.id)}
                okText="确定"
                cancelText="取消"
              >
                <div className="btn is-isolated btn-school">
                  <i className="is-isolated fa fa-trash-o"></i>
                </div>
              </Popconfirm>
              <TextArea
                key={item.key}
                getFieldDecorator={getFieldDecorator}
                item={item}
              />
              <div className="layout-shadow"></div>
            </div>
          );
        case "MultiDropDown":
          return (
            <div key={item.key}>
              <Popconfirm
                title="确定要隐藏该组件吗？"
                onConfirm={this.handleToolItemClick.bind(this, item.id)}
                okText="确定"
                cancelText="取消"
              >
                <div className="btn is-isolated btn-school">
                  <i className="is-isolated fa fa-trash-o"></i>
                </div>
              </Popconfirm>
              <MultiDropDown
                disabled={true}
                key={item.key}
                getFieldDecorator={getFieldDecorator}
                item={item}
              />
              <div className="layout-shadow"></div>
            </div>
          );
        case "FormChildTest":
          if (this.state.formChildDataObj[item.key] == void 0) {
            this.state.formChildDataObj[item.key] = [];
          }
          return (
            <div key={item.key} className="formChild-container">
              <Popconfirm
                title="确定要隐藏该组件吗？"
                onConfirm={this.handleToolItemClick.bind(this, item.id)}
                okText="确定"
                cancelText="取消"
              >
                <div className="btn is-isolated btn-school">
                  <i className="is-isolated fa fa-trash-o"></i>
                </div>
              </Popconfirm>
              <FormChildTest
                disabled={true}
                key={`${item.key}${i}`}
                getFieldDecorator={getFieldDecorator}
                item={item}
                submitDataArray={this.state.formChildDataObj[item.key]}
                removeSubmitData={newArray => {}}
                saveSubmitData={newArray => {
                  if (newArray.length === 1) {
                    this.state.formChildDataObj[item.key] = newArray;
                  }
                }}
              />
              <div className="layout-shadow"></div>
            </div>
          );
        case "Address":
          return (
            <div key={item.key}>
              <Popconfirm
                title="确定要隐藏该组件吗？"
                onConfirm={this.handleToolItemClick.bind(this, item.id)}
                okText="确定"
                cancelText="取消"
              >
                <div className="btn is-isolated btn-school">
                  <i className="is-isolated fa fa-trash-o"></i>
                </div>
              </Popconfirm>
              <Address
                key={item.key}
                getFieldDecorator={getFieldDecorator}
                handleSetAddress={() => {}}
                item={item}
              />
              <div className="layout-shadow"></div>
            </div>
          );
        case "ImageUpload":
          return (
            <div key={item.key}>
              <Popconfirm
                title="确定要隐藏该组件吗？"
                onConfirm={this.handleToolItemClick.bind(this, item.id)}
                okText="确定"
                cancelText="取消"
              >
                <div className="btn is-isolated btn-school">
                  <i className="is-isolated fa fa-trash-o"></i>
                </div>
              </Popconfirm>
              <ImageUpload
                disabled={true}
                getFieldDecorator={getFieldDecorator}
                item={item}
              />
              <div className="layout-shadow"></div>
            </div>
          );
        case "GetLocalPosition":
          return (
            <div key={item.key}>
              <Popconfirm
                title="确定要隐藏该组件吗？"
                onConfirm={this.handleToolItemClick.bind(this, item.id)}
                okText="确定"
                cancelText="取消"
              >
                <div className="btn is-isolated btn-school">
                  <i className="is-isolated fa fa-trash-o"></i>
                </div>
              </Popconfirm>
              <PositionComponentPC
                disabled={true}
                getFieldDecorator={getFieldDecorator}
                item={item}
              />
              <div className="layout-shadow"></div>
            </div>
          );
        case "HandWrittenSignature":
          return (
            <div key={item.key}>
              <Popconfirm
                title="确定要隐藏该组件吗？"
                onConfirm={this.handleToolItemClick.bind(this, item.id)}
                okText="确定"
                cancelText="取消"
              >
                <div className="btn is-isolated btn-school">
                  <i className="is-isolated fa fa-trash-o"></i>
                </div>
              </Popconfirm>
              <HandWrittenSignaturePc
                getFieldDecorator={getFieldDecorator}
                item={item}
              />
              <div className="layout-shadow"></div>
            </div>
          );
        default:
          return <div key={item.key}>{`${item.type} not defind`}</div>;
      }
    });
  };

  _handleFilterDate = form => {
    const { components, currentLayoutId, layoutArray } = form;
    let PureComponent = components.filter(item => {
      return item.element !== "Button";
    });
    //拿取默认布局,默认所有组件显示
    let layout = PureComponent.filter(item => {
      return item.isShow !== false;
    }).map(item => {
      return {
        ...item.layout
      };
    });
    this.setState(state => ({
      ...state,
      toolComponent: [...PureComponent],
      PureComponent,
      formComponent: form,
      currentLayout: layout,
      defaultLayout: layout,
      formLayoutList: form.layoutArray,
      currentLayoutId: form.currentLayoutId
      // customValue: customComponent
    }));
  };

  handleSaveLayout = () => {
    initToken().then(() => {
      const {
        currentLayout,
        PureComponent,
        formComponent,
        defaultLayout,
        formLayoutList,
        currentLayoutId
      } = this.state;
      const layoutIdArr = currentLayout.map(item => item.i);
      const newLayout = PureComponent.map(item => {
        let index = layoutIdArr.indexOf(item.id);
        if (index > -1) {
          return currentLayout[index];
        } else {
          return {
            ...item.layout,
            isShow: item.isShow
          };
        }
      });

      let resultDataArray = PureComponent.map(item => {
        let layout = defaultLayout.filter(layoutItem => {
          return layoutItem.i === item.key;
        })[0];

        if (layout != void 0) {
          item.layout = layout;
        }

        return item;
      });
      // resultDataArray.push(customValue)

      console.log(resultDataArray);

      this.props.submitLayout(
        resultDataArray,
        formComponent,
        formLayoutList,
        currentLayoutId
      );

      // if (this.state.operationType === "edit") {
      //   this.state.formLayoutList.map(item => {
      //     if (item.id === this.state.currentLayoutId) {
      //       item.layout = newLayout;
      //       item.name = this.state.currentLayoutName;
      //       return item;
      //     } else {
      //       return item;
      //     }
      //   });
      //   const newFormLayoutList = [...this.state.formLayoutList];
      //   this.props.submitLayout(
      //     newFormLayoutList,
      //     formComponent,
      //     this.state.currentLayoutId
      //   );
      // } else {
      //   const createLayout = {
      //     name: this.state.currentLayoutName,
      //     layout: newLayout,
      //     id: this.state.currentLayoutId
      //   };
      //   const newFormLayoutList = [...this.state.formLayoutList, createLayout];
      //   this.props.submitLayout(
      //     newFormLayoutList,
      //     formComponent,
      //     this.state.currentLayoutId
      //   );
      // }
    });
  };

  handleSetDragState = isDragging => {
    this.setState({
      isDragging
    });
  };

  handleAddItem = id => {
    let { PureComponent } = this.state;
    const newPureComponent = PureComponent.map(item => {
      if (item.id === id) {
        return {
          ...item,
          isShow: !item.isShow
        };
      } else {
        return item;
      }
    });

    let defaultLayout = newPureComponent
      .filter(item => {
        return item.isShow !== false;
      })
      .map(item => {
        return {
          ...item.layout
        };
      });

    this.setState({
      // currentLayout: newLayout,
      toolComponent: newPureComponent,
      PureComponent: newPureComponent,
      defaultLayout
      // formComponent: {
      //   ...formComponent,
      //   components: formComponent.components.map(item => {
      //     if (item.id === id) {
      //       item.isShow = !item.isShow;
      //     }
      //     return item;
      //   })
      // }
    });
  };

  handleToolItemClick = id => {
    let {
      formComponent,
      formLayoutList,
      PureComponent,
      toolComponent,
      currentLayout,
      currentLayoutId,
      defaultLayout
    } = this.state;
    // 还原隐藏元素后还原其选择的布局
    // let newLayout;
    // if (formLayoutList.map(item => item.id).indexOf(id) !== -1) {
    //   newLayout = [
    //     ...formLayoutList.filter(item => item.id === currentLayoutId)[0].layout
    //   ];
    // } else {
    //   newLayout = currentLayout;
    //   console.log("newLayout", newLayout);
    // }
    // let newLayout = currentLayout.map(item => {
    //   if(item.i === id){
    //     item.isShow = !item.isShow;
    //   }
    //   return item;
    // })

    let removeLayout = null;

    defaultLayout = defaultLayout.filter(item => {
      if (item.i === id) {
        removeLayout = item;
      }

      return item.i !== id;
    });

    const newPureComponent = PureComponent.map(item => {
      if (item.id === id) {
        return {
          ...item,
          isShow: !item.isShow,
          layout: removeLayout
        };
      } else {
        return item;
      }
    });
    this.setState({
      // currentLayout: newLayout,
      toolComponent: newPureComponent,
      PureComponent: newPureComponent,
      defaultLayout
      // formComponent: {
      //   ...formComponent,
      //   components: formComponent.components.map(item => {
      //     if (item.id === id) {
      //       item.isShow = !item.isShow;
      //     }
      //     return item;
      //   })
      // }
    });
  };

  // setCurrentLayout = (layout, type, id, name) => {
  //   const idList = this.state.PureComponent.map(item => item.id);
  //   const newPureFormComponents = this.state.PureComponent.map(item => {
  //     return {
  //       ...item,
  //       isShow: layout[idList.indexOf(item.id)].isShow
  //     };
  //   });
  //   console.log("layOut", layout);

  //   console.log("newPureFormComponents", newPureFormComponents);

  //   this.setState(state => ({
  //     ...state,
  //     PureComponent: newPureFormComponents,
  //     toolComponent: newPureFormComponents,
  //     currentLayout: layout,
  //     operationType: type,
  //     currentLayoutId: id,
  //     currentLayoutName: name
  //   }));
  // };

  //将新添加的组件layout设为默认的layout
  // _handlNewComponentLayout(currentLayout, defaultLayout) {
  //   const currentLayoutIdList = currentLayout.map(item => item.i);
  //   const defaultLayoutIdList = defaultLayout.map(item => item.i);
  //   defaultLayoutIdList.map(id => {
  //     if (currentLayoutIdList.indexOf(id) === -1) {
  //       currentLayout.push(defaultLayout.filter(item => item.i === id)[0]);
  //     }
  //     return id;
  //   });
  //   return currentLayout;
  // }

  render() {
    const { getFieldDecorator } = this.props.form;
    let {
      PureComponent,
      formComponent,
      toolComponent,
      currentLayout,
      defaultLayout
    } = this.state;
    PureComponent = PureComponent.filter(item => item.isShow);
    // const idList = currentLayout.map(item => item.i);
    // PureComponent=PureComponent.filter(item => {
    //   const index = idList.indexOf(item.id);
    //   if(index!=-1){

    //     return currentLayout[index].isShow;
    //   }else{
    //     return false
    //   }
    // });

    return (
      <>
        {/* <LayoutModal
          showModal={this.showModal}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
          modalVisible={this.state.modalVisible}
          formLayoutList={this.state.formLayoutList}
          setCurrentLayout={this.setCurrentLayout}
          defaultLayout={this.state.defaultLayout}
          currentLayoutId={this.state.currentLayoutId}
          _handlNewComponentLayout={this._handlNewComponentLayout}
        /> */}

        <HeaderBar
          backCallback={() => {
            window.location.href = config.hostUrl;
          }}
          title={formComponent.name}
          isShowBtn={true}
          btnValue="保存"
          clickCallback={this.handleSaveLayout}
        />
        <div className="formBuilder-Submission layout-wrapper">
          <DndProvider backend={HTML5Backend}>
            <div className="layout-center">
              <div className="content">
                <div className="submission-title">{formComponent.name}</div>
                <FormLayout
                  className="layout"
                  isDragging={this.state.isDragging}
                  layout={defaultLayout}
                  cols={12}
                  rowHeight={22}
                  width={870}
                  onLayoutChange={layout => {
                    layout = layout.map(item => {
                      if (item.y < 0) {
                        item.y = 0;
                      }
                      return item;
                    });

                    this.setState({ defaultLayout: layout });

                    // const layoutIdList = layout.map(item => item.i);
                    // const newCurrentLayout = currentLayout.map(item => {
                    //   const index = layoutIdList.indexOf(item.i);
                    //   if (index !== -1) {
                    //     if (layout[index].w !== 1) {
                    //       return {
                    //         ...layout[index],
                    //         isShow: true
                    //       };
                    //     } else {
                    //       return {
                    //         ...item,
                    //         isShow: true
                    //       };
                    //     }
                    //   } else {
                    //     return {
                    //       ...item,
                    //       isShow: false
                    //     };
                    //   }
                    // });
                    // console.log("newCurrentLayout", newCurrentLayout);

                    // this.setState({ currentLayout: newCurrentLayout });
                  }}
                >
                  {this.renderFormComponent(getFieldDecorator, PureComponent)}
                </FormLayout>
              </div>
            </div>
            <div className="layout-right">
              <div className="tool-header">
                可选字段
                {/* |
                {this.state.operationType === "edit" ? (
                  <Select
                    defaultValue={this.state.currentLayoutName}
                    onChange={value => {
                      const currentLayoutObj = this.state.formLayoutList.filter(
                        item => item.id === value
                      )[0];
                      this.setCurrentLayout(
                        this._handlNewComponentLayout(currentLayoutObj.layout,this.state.defaultLayout),
                        "edit",
                        currentLayoutObj.id,
                        currentLayoutObj.name
                      );
                    }}
                  >
                    {this.state.formLayoutList.map((item, key) => (
                      <Select.Option key={key} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                ) : (
                  <>
                    布局名称
                    <Input
                      value={this.state.currentLayoutName}
                      onChange={e => {
                        const newName = e.target.value
                        this.setState(state => ({
                          ...state,
                          currentLayoutName: newName
                        }));
                      }}
                    />
                  </>
                )} */}
              </div>
              <ul className="component-wrap">
                {toolComponent.map(item => (
                  <LayoutTool
                    handleSetDragState={this.handleSetDragState}
                    key={item.id}
                    data={item}
                    handleChange={this.handleAddItem}
                  />
                ))}
              </ul>
            </div>
          </DndProvider>
        </div>
      </>
    );
  }
}

const layoutForm = Form.create()(Layout);

export default connect(store => ({}), {
  submitLayout
})(layoutForm);
