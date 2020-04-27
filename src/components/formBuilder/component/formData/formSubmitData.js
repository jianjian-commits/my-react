import React, { PureComponent } from "react";
import { Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  ConfigProvider,
  Table,
  Input,
  Button,
  Menu,
  Dropdown,
  Icon,
  message,
} from "antd";
import zhCN from "antd/es/locale/zh_CN";
import { initToken } from "../../utils/tokenUtils";
import ControlBtn from "./components/controlBtn";
import FormDataDetail from "./components/formDataDetail";
import HeaderBar from "../../component/base/NavBar";
import {
  getSubmissionData,
  getSubmissionDetail,
  getFilterSubmissionData
} from "./redux/utils/getDataUtils";
import { clearFormData, deleteFormData } from "./redux/utils/deleteDataUtils";
import DataDetailModal from "./components/dataDetailModal";
import FilterComponent from "./components/filterComponent/filterComponent";
import coverTimeUtils from "../../utils/coverTimeUtils";
import moment from "moment";

// 加载数据时重写表格为空状态
const noRenderEmpty = () => <div style={{ height: "20vh" }}></div>;

class FormSubmitData extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openDataIdList: [],
      submissionArray: [],
      sortedInfo: null,
      formId: props.formId,
      submissionId: null,
      currentPage: 1,
      pageSize: 10,
      modalVisible: false,
      isShowTotalData: true,
      showNumber: 0,
      total: props.submissionDataTotal,
      limitDataNumber: false,
      isFilterMode: false,
      filterArray: [],
      selectArray: [
        {
          selectedFiled: "",
          selectedLogicalOperator: null,
          logicalOperators: [],
          costomValue: "",
          selectedFiledKey: "",
          field: { type: "", key: Math.random() },
          options: [],
          key: Math.random(),
        },
      ],
      connectCondition: "&",
      formDataDetailId: "",
      // 是否展示筛选界面,默认为false(不展示)
      showFilterBoard: false,
      // 判断鼠标是否已经移出筛选容器,如果已经移出,则可以点击关闭;否则,反之.
      hiddenFilterBoardCanClick: true,
      isLoading: false, // 加在数据的loading标志,
      formDataCache: [],
    };
  }
  showformDataDetail = (id) => {
    this.setState({ formDataDetailId: id });
  };

  showModal = (submissionId) => {
    this.setState((state) => ({
      ...state,
      modalVisible: true,
      submissionId,
    }));
  };

  handleOk = (e) => {
    this.setState((state) => ({
      ...state,
      modalVisible: false,
    }));
  };

  handleCancel = (e) => {
    this.setState((state) => ({
      ...state,
      modalVisible: false,
    }));
  };
  onChangePages = (currentPage, pageSize) => {
    this.setState(
      {
        currentPage,
        pageSize,
      },
      () => {
        const {
          filterArray,
          connectCondition,
          showNumber,
          pageSize,
          currentPage,
          formId,
        } = this.state;
        const { forms, appId } = this.props;
        if (this.state.isFilterMode && !this.state.isShowTotalData) {
          this.props.getFilterSubmissionData({
            formId: formId,
            filterArray: filterArray,
            connectCondition: connectCondition || "&",
            pageSize: showNumber,
            currentPage: 1,
            totalNumber: showNumber,
            appId: appId,
            callback: (isLoading) => {
              this.setState({ isLoading });
            },
          });
        } else if (!this.state.isFilterMode && !this.state.isShowTotalData) {
          this.props.getSubmissionData({
            appId: appId,
            formId: formId,
            pageSize: showNumber,
            currentPage: 1,
            total: showNumber,
            callback: (isLoading) => {
              this.setState({ isLoading });
            },
          });
        } else if (this.state.isFilterMode && this.state.isShowTotalData) {
          this.props.getFilterSubmissionData({
            formId: formId,
            filterArray: filterArray,
            connectCondition: connectCondition || "&",
            pageSize: pageSize,
            currentPage: currentPage,
            totalNumber: showNumber,
            appId: appId,
            callback: (isLoading) => {
              this.setState({ isLoading });
            },
          });
        } else {
          this.props.getSubmissionData({
            appId: appId,
            formId: formId,
            pageSize: pageSize,
            currentPage: currentPage,
            total: -1,
            callback: (isLoading) => {
              this.setState({ isLoading });
            },
          });
        }
      }
    );
  };

  componentDidMount() {
    let { formId, appId } = this.props;
    const { pageSize, currentPage } = this.state;

    if (this.props.searchStatus) {
      initToken()
        .then(() => {
          this.props.getSubmissionData({
            appId: appId,
            formId: formId,
            pageSize: pageSize,
            currentPage: currentPage,
            total: -1,
            callback: (isLoading) => {
              this.setState({ isLoading });
            },
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }

    this.setState({ formId: this.props.formId });
    document.querySelector("html").addEventListener(
      "click",
      () => {
        if (
          this.state.hiddenFilterBoardCanClick &&
          this.state.showFilterBoard
        ) {
          this.setState({
            showFilterBoard: false,
            hiddenFilterBoardCanClick: true,
          });
        }
      },
      false
    );
    if(this.state.formDataCache.length !== 0){
      this.setState({
        formDataCache:[]
      })
    }
  }
  componentWillUnmount() {
    this.props.clearFormData();
  }

  // 将地址对象转化为字符串
  AddressObjToString = (address) => {
    if (address) {
      let { province, county, city, detail } = address;
      return [province, city, county, detail].filter((item) => item).join("");
    } else {
      return "";
    }
  };

  _GetTextLength = (value) => {
    let reg = new RegExp("[\\u4E00-\\u9FFF]", "g");
    let res = String(value).match(reg);
    let length = value.length;
    length += res ? res.length : 0;
    return length;
  };

  _truncateValue(value) {
    Array.isArray(value) && (value = value.toString());
    if (value == void 0) {
      return "";
    } else if (value.length >= 11) {
      return value.substr(0, 10) + "...";
    } else {
      return value;
    }
  }

  _renderFileData = (fileData) => {
    if (fileData.length > 0) {
      return (
        <span className="formChild-item">
          {this._truncateValue(fileData[0]["name"])}
          &nbsp; &nbsp;
          <a
            href={fileData[0]["url"]}
            download={fileData[0]["name"]}
            style={{ textDecoration: "none" }}
          >
            点击下载
          </a>
        </span>
      );
    } else {
      return <div className="formChild-item"></div>;
    }
  };

  _renderImageData = (fileData) => {
    if (fileData.length > 0) {
      return (
        <div className="formChild-Item image">
          <img src={fileData[0].url} style={{ width: 56, height: 36 }} />
        </div>
      );
    } else {
      return <div className="formChild-item"></div>;
    }
  };

  _renderSignatureData = (fileData) => {
    if (fileData && fileData.name) {
      return (
        <p>
          {this._truncateValue(fileData["name"])}
          &nbsp; &nbsp;
          <a
            href={fileData["url"]}
            download={fileData["name"]}
            style={{ textDecoration: "none" }}
          >
            点击下载
          </a>
        </p>
      );
    }
    return "";
  };

  _renderAddress = (addressData) => {
    return addressData !== null ? this._truncateValue(addressData.address) : "";
  };

  _renderFormChildComponentByType(component, submitData) {
    if (submitData == void 0) {
      return <div className="formChild-item"></div>;
    }
    switch (component.type) {
      case "DateInput":
        return (
          <div className="formChild-item">
            {submitData ? coverTimeUtils.localDate(submitData, component.type) : ""}
          </div>
        );
      case "PureDate":
        return (
          <div className="formChild-item">
            {submitData ? coverTimeUtils.localDate(submitData, component.type) : ""}
          </div>
        );
      case "PureTime":
        return (
          <div className="formChild-item">
            {submitData ? coverTimeUtils.localDate(submitData, component.type) : ""}
          </div>
        );
      case "ImageUpload":
        return this._renderImageData(submitData);
      // return <div key={component.key} className="formChild-item">{submitData}</div>
      case "FileUpload":
        // return this._renderFileData(submitData);
        return (
          <div key={component.key} className="formChild-item">
            {submitData.length > 0 ? submitData[0].name : ""}
          </div>
        );
      case "MultiDropDown":
      case "CheckboxInput":
        return (
          <div key={component.key} className="formChild-item">
            {submitData.length > 0 ? submitData.join(",") : ""}
          </div>
        );
      default:
        // return <div key={component.key} className="formChild-item">{this._truncateValue(submitData)}</div>;
        return (
          <div key={component.key} className="formChild-item">
            {submitData}
          </div>
        );
    }
  }

  _renderComponentDataByType(component, submitData, formChild, submission) {
    const { openDataIdList } = this.state;
    switch (component.type) {
      case "FormChildTest":
        let resultDataArray = null;
        let resultArray = component.values.map((item) => {
          return {
            key: item.key,
            type: item.type,
            data: submission[item.key],
          };
        });

        resultArray.forEach((item) => {
          if (item.data != void 0) {
            if (resultDataArray == void 0) {
              resultDataArray = item.data;
            }
          }
        });

        if (
          openDataIdList.filter(
            (item) => item.id === submission.id && item.key === component.key
          ).length !== 1
        ) {
          return (
            <div key={component.key}>
              <div
                key={component.key + "fist"}
                className="formChildDiv"
                style={
                  resultDataArray && resultDataArray.length === 1
                    ? { borderBottom: "none" }
                    : null
                }
              >
                {resultArray.map((item) => {
                  if (item.data == void 0) {
                    return <div className="formChild-item"></div>;
                  } else {
                    return this._renderFormChildComponentByType(
                      item,
                      item.data[0]
                    );
                  }
                })}
              </div>
              {resultDataArray == void 0 || resultDataArray.length === 1 ? (
                <></>
              ) : (
                <div key={component.key + "look"} className="formChildLook">
                  <Button
                    style={{ width: 120 }}
                    type="link"
                    onClick={() => {
                      this.setState({
                        openDataIdList: [
                          ...this.state.openDataIdList,
                          {
                            id: submission.id,
                            key: component.key,
                          },
                        ],
                      });
                    }}
                  >
                    展开剩余{resultDataArray.length - 1}条数据{" "}
                    <Icon type="caret-down" />
                  </Button>
                </div>
              )}
            </div>
          );
        } else {
          return (
            <div>
              {resultDataArray.map((item, index) => {
                return (
                  <div
                    key={component.key + "close" + index}
                    className="formChildDiv"
                  >
                    {resultArray.map((item) => {
                      if (item.data == void 0) {
                        return <div className="formChild-item"></div>;
                      } else {
                        return this._renderFormChildComponentByType(
                          item,
                          item.data[index]
                        );
                      }
                    })}
                  </div>
                );
              })}

              <div className="formChildLook">
                <Button
                  type="link"
                  style={{ width: 120 }}
                  onClick={() => {
                    this.setState({
                      openDataIdList: this.state.openDataIdList.filter(
                        (item) =>
                          !(
                            item.id === submission.id &&
                            item.key === component.key
                          )
                      ),
                    });
                  }}
                >
                  点击收起 <Icon type="caret-up" />
                </Button>
              </div>
            </div>
          );
        }
      case "GetLocalPosition":
        if (submitData == void 0) {
          return <></>;
        }
        return <div key={component.key}>{this._renderAddress(submitData)}</div>;
      case "FileUpload":
        if (submitData == void 0) {
          return <></>;
        }
        return this._renderFileData(submitData);
      case "ImageUpload":
        if (submitData == void 0) {
          return <></>;
        }
        return this._renderImageData(submitData);
      case "HandWrittenSignature":
        if (submitData == void 0) {
          return <></>;
        }
        return this._renderSignatureData(submitData);
      case "founder":
      case "created":
      case "modified":
        if (submitData == void 0) {
          return <></>;
        }
        return coverTimeUtils.localDate(submitData);
      case "MultiDropDown":
      case "CheckboxInput":
        return (
          <div key={component.key} className="formChild-item">
            {submitData ? this._truncateValue(submitData.join(",")) : ""}
          </div>
        );
      case "DateInput":
        return (
          <div key={component.key}>
            {submitData != void 0 ? coverTimeUtils.localDate(submitData, component.type) : ""}
          </div>
        );
      case "PureDate":
          return (
            <div className="formChild-item">
              {submitData ? coverTimeUtils.localDate(submitData, component.type) : ""}
            </div>
      );
      case "PureTime":
        return (
          <div key={component.key}>
            {submitData != void 0
              ? coverTimeUtils.localDate(submitData, component.type)
              : ""}
          </div>
        );
      default:
        if (submitData == void 0) {
          return <></>;
        }
        return <div key={component.key}>{this._truncateValue(submitData)}</div>;
    }
  }

  setColumnSort = (sortedInfo) => {
    this.setState({
      sortedInfo,
    });
  };
  _filterSorter = (type, key) => {
    // 还需要过滤创建时间和修改时间
    switch (type) {
      case "NumberInput":
        return {
          sorter: (a, b) => {
            return a[key] - b[key];
          },
          sortDirections: ["descend", "ascend"],
        };
      default:
        return {};
    }
  };

  onChangeIsShowTotalData = (value) => {
    this.setState({
      isShowTotalData: value === "all" ? true : false,
    });
  };

  onChangeNumer = (event) => {
    event.stopPropagation();
    if (!Number.isNaN(Math.round(event.target.value))) {
      this.setState({
        showNumber: Math.round(event.target.value),
        limitDataNumber: false,
      });
    }
  };

  changeTotalNumber = () => {
    // 这里存在问题////
    //  这里再找产品讨论一下。。。
    this.setState(
      {
        currentPage: 1,
      },
      () => {
        this.onChangePages(this.state.currentPage, this.state.pageSize);
      }
    );
  };

  handleClickNumber = (event) => {
    event.stopPropagation();
  };

  setFilterMode = (filterArray, connectCondition, isFilterMode) => {
    // 如果筛选条件为有效的，则筛选；如果筛选条件只有一个，且为空的，则不筛选
    if (isFilterMode) {
      this.setState(
        {
          isFilterMode,
          filterArray,
          connectCondition,
          currentPage: 1,
          isFilterMode: true,
        },
        () => {
          this.onChangePages(this.state.currentPage, this.state.pageSize);
        }
      );
    } else {
      this.setState(
        {
          isFilterMode: false,
          filterArray: [],
          connectCondition: "&",
          isFilterMode: false,
          currentPage: 1,
        },
        () => {
          this.onChangePages(this.state.currentPage, this.state.pageSize);
        }
      );
    }
  };

  // 过滤显示数据，争对不同字段进行渲染(将object转为String)
  filterSubmitDataToString = (value) => {
    if (value instanceof Object) {
      if (value.province !== undefined) {
        return this.AddressObjToString(value);
      } else if (value.time) {
        // value.time = (new Date(value.time)).toLocaleDateString();
        return value;
      }
    }
    return value;
  };

  handleDeleteSubmisson = (submissionId) => {
    this.props
      .deleteFormData(this.state.formId, submissionId)
      .then((response) => {
        if (response.data === "ok") {
          if (this.props.formData.length === 1 && this.state.currentPage > 1) {
            this.setState(
              {
                currentPage: this.state.currentPage - 1,
              },
              () => {
                this.onChangePages(this.state.currentPage, this.state.pageSize);
              }
            );
          } else {
            this.onChangePages(this.state.currentPage, this.state.pageSize);
          }
        }
        this.props.actionFun(true);
      })
      .catch((err) => {
        message.error("删除失败！", 2);
        console.log(err);
      });
  };

  // 过滤字段
  handleFilterFields = (fields) => {
    this.setState({
      selectedFields: fields,
    });
  };

  // 点击按钮显示筛选界面
  showFilterComponent = (e) => {
    let hiddenFilterBoard = !this.state.showFilterBoard;

    this.setState({
      showFilterBoard: hiddenFilterBoard,
      hiddenFilterBoardCanClick: !this.setState.hiddenFilterBoardCanClick,
    });
  };

  render() {
    let { formData, forms, mobile = {}, mountClassNameOnRoot } = this.props;
    const {
      selectArray,
      connectCondition,
      isFilterMode,
    } = this.state.filterArray;

    if(this.props.searchStatus){

    }else{
      if (formData.length !== 0) {
        this.setState({ formDataCache: formData });
      }
      if (formData.length === 0 && this.state.isFilterMode === false) {
        formData = this.state.formDataCache;
      }
    }
    let total =
       this.state.formDataCache.length === 0 && !this.props.searchStatus
         ? -1
         : this.props.submissionDataTotal;
    const controlCol = [
      {
        title: "操作",
        dataIndex: "id",
        key: "control",
        width: 200,
        fixed: "right",
        render: (id, record) => {
          return (
            <ControlBtn
              appId={this.props.appId}
              formId={this.state.formId}
              submissionId={record.id}
              userId={record.userId}
              data={record}
              handleDeleteSubmisson={this.handleDeleteSubmisson}
              showModal={this.showModal}
              getSubmissionDetail={this.props.getSubmissionDetail}
              setSubmissionId={this.props.actionFun}
              showformDataDetail={this.showformDataDetail}
              appId={this.props.appId}
            />
          );
        },
      },
    ];
    let formChildIdArray = [];

    let { sortedInfo } = this.state;
    sortedInfo = sortedInfo || {};
    let columns = this.props.forms.components
      ? this.props.forms.components
          .filter((item) => {
            if (item.type === "Button") {
              return false;
            }
            if (item.type === "FormChildTest" && this.state.selectedFields) {
              return item.values.length !== 0 && this.state.selectedFields.includes(item.key);
            }
            // 根据选择的字段进行过滤
            if (this.state.selectedFields) {
              return this.state.selectedFields.includes(item.key);
            }

            return true;
          })
          .map((item) => {
            let resultObj = null;
            let sorter = {};

            if (item.type === "FormChildTest") {
              //? 子表单的排序还没有做。。。。
              resultObj = {
                title: item.label,
                key: item.length === 0 ? item.key : null,
                children:
                  item.length !== 0
                    ? item.values.map((formChild, i) => {
                        return {
                          title: formChild.label,
                          dataIndex: formChild.key,
                          key: formChild.key,
                          width: 110,
                          render: (record, submission) => {
                            let obj = {
                              children: this._renderComponentDataByType(
                                item,
                                record,
                                formChild,
                                submission
                              ),
                              props: {
                                colSpan: item.values.length,
                              },
                            };
                            if (i >= 1) {
                              obj.props.colSpan = 0;
                            }

                            return obj;
                          },
                        };
                      })
                    : null,
              };
              formChildIdArray.push(item.key);
            } else if (item.type === "NumberInput") {
              resultObj = {
                title: item.label,
                dataIndex: item.key,
                key: item.key,
                width: 210,
                sorter: (a, b) => a[item.key] - b[item.key],
                sortOrder:
                  sortedInfo.columnKey === item.key && sortedInfo.order,
                render: (record) => {
                  return this._renderComponentDataByType(item, record);
                },
              };
            } else if (item.type === "DateInput") {
              resultObj = {
                title: item.label,
                dataIndex: item.key,
                key: item.key,
                width: 210,
                sorter: (a, b) => new Date(a[item.key]) - new Date(b[item.key]),
                sortOrder:
                  sortedInfo.columnKey === item.key && sortedInfo.order,
                render: (record) => {
                  return this._renderComponentDataByType(item, record);
                },
              };
            } else {
              sorter = this._filterSorter(item.type, item.key);
              resultObj = {
                title: item.label,
                dataIndex: item.key,
                key: item.key,
                width: 210,
                render: (record) => {
                  return this._renderComponentDataByType(item, record);
                },
              };
            }
            return resultObj;
          })
      : [];
    columns.push({
      title: "创建人",
      dataIndex: "founder",
      key: "founder",
      width: 210,
      sorter: (a, b) => new Date(a.created) - new Date(b.created),
      sortOrder: sortedInfo.columnKey === "founder" && sortedInfo.order,
    });
    columns.push({
      title: "创建时间",
      dataIndex: "created",
      key: "created",
      width: 210,
      sorter: (a, b) => new Date(a.created) - new Date(b.created),
      sortOrder: sortedInfo.columnKey === "created" && sortedInfo.order,
      render: (record) => {
        return this._renderComponentDataByType({ type: "created" }, record);
      },
    });
    columns.push({
      title: "修改时间",
      dataIndex: "modified",
      key: "modified",
      width: 210,
      sorter: (a, b) => new Date(a.created) - new Date(b.created),
      sortOrder: sortedInfo.columnKey === "modified" && sortedInfo.order,
      render: (record) => {
        return this._renderComponentDataByType({ type: "modified" }, record);
      },
    });

    columns = columns.concat(controlCol);

    let formDataShowArray = [];

    formData.forEach((dataObj, i) => {
      let { name, id } = dataObj.extraProp["user"]
        ? dataObj.extraProp["user"]
        : { name: "", id: "" };
      let obj = {
        id: dataObj.id,
        created: dataObj.created,
        modified: dataObj.modified,
        founder: name,
        userId: id,
      };
      let dataItem = dataObj.data;
      for (let n in dataItem) {
        if (formChildIdArray.includes(n)) {
          dataItem[n].forEach((submitDataObj) => {
            for (let m in submitDataObj) {
              if (obj[m] == void 0) {
                obj[m] = [];
              }
              // 此处因该加判断formType的类型，如果为Adrress 才去转换
              let data = this.filterSubmitDataToString(submitDataObj[m].data);
              // obj[m].push("data");
              obj[m].push(this.filterSubmitDataToString(submitDataObj[m].data));
            }
          });
        } else {
          // let data = this.filterSubmitDataToString(dataItem[n]);
          // obj[n] = data;
          obj[n] = this.filterSubmitDataToString(dataItem[n]);
        }
      }
      formDataShowArray.push(obj);
    });

    const paginationProps = {
      defaultCurrent: 1,
      position: "bottom",
      showQuickJumper: true,
      pageSize: this.state.pageSize,
      total: total,
      loading: this.props.loading,
      current: this.state.currentPage,
      onChange: (current, pageSize) => {
        if (pageSize != void 0 && current != void 0) {
          this.onChangePages(current, pageSize);
        }
      },
      onShowSizeChange: (current, pageSize) => {
        if (pageSize != void 0 && current != void 0) {
          this.onChangePages(current, pageSize);
        }
      },
    };

    let mobileProps = {};
    if (mobile.is) {
      mobileProps = {
        title: forms.title,
        mobile,
        mountClassNameOnRoot,
      };
    }

    const fileds = this.props.forms.components.filter((item) => {
      return item.type !== "Button" && item.type !== "FormChildTest";
    });
    const menu = (
      <Menu style={{ padding: 0, fontSize: 13 }}>
        <Menu.Item style={{ borderBottom: "1px solid #D6D8DE" }}>
          <div
            style={{ width: 126 }}
            onClick={() => {
              this.onChangeIsShowTotalData("all");
            }}
          >
            全部
          </div>
        </Menu.Item>
        <Menu.Item>
          <div
            style={{ width: 126, height: 22 }}
            onClick={() => {
              this.onChangeIsShowTotalData("recent");
            }}
          >
            显示
            <Input
              min={0}
              style={{ width: 50, height: 22, marginLeft: 3, marginRight: 3 }}
              value={this.state.showNumber}
              onChange={this.onChangeNumer}
            />
            条
          </div>
        </Menu.Item>
      </Menu>
    );
    return (
      <>
        {this.state.formDataDetailId ? (
          <FormDataDetail
            id={this.props.formId}
            dataId={this.state.formDataDetailId}
            appId={this.props.appId}
            actionFun={this.props.actionFun}
            enterPort={"FormSubmitData"}
          />
        ) : (
          <>
            {mobile.is ? null : (
              <HeaderBar
                backCallback={() => {
                  this.props.history.go(-1);
                }}
                name={this.props.forms.name}
                isShowBtn={true}
                isShowBackBtn={false}
                btnValue="提交数据"
                formId={this.props.formId}
                clickCallback={() => {
                  this.props.actionFun(null, true);
                }}
                clickExtendCallBack={this.showFilterComponent}
                isFilterMode={this.state.isFilterMode}
                handleFilterFields={this.handleFilterFields}
              />
            )}
            <div
              className="form-submit-data-table"
              style={mobile.is ? mobile.style.table : null}
            >
              <DataDetailModal
                modalVisible={this.state.modalVisible}
                handleCancel={this.handleCancel}
                handleOk={this.handleOk}
                submissionId={this.state.submissionId}
                formId={this.state.formId}
                components={this.props.forms.components}
              />
              {this.state.showFilterBoard ? (
                <FilterComponent
                  fileds={fileds}
                  selectArray={this.state.selectArray}
                  changeFilterArray={(selectArray) => {
                    this.setState({ selectArray: selectArray });
                  }}
                  connectCondition={this.state.connectCondition}
                  setConnectCondition={(connectCondition) => {
                    this.setState({ connectCondition: connectCondition });
                  }}
                  isFilterMode={isFilterMode}
                  filterData={this.props.getFilterSubmissionData}
                  setFilterMode={this.setFilterMode}
                  formId={this.state.formId}
                  currentPage={this.state.currentPage}
                  pageSize={this.state.pageSize}
                  clickExtendCallBack={this.showFilterComponent}
                  canClick={() =>
                    this.setState({ hiddenFilterBoardCanClick: true })
                  }
                  canNotClick={() =>
                    this.setState({ hiddenFilterBoardCanClick: false })
                  }
                />
              ) : (
                <></>
              )}

              <div className="limit-data-number-container">
                <Dropdown
                  overlay={menu}
                  placement="bottomCenter"
                  trigger={["click"]}
                >
                  {this.state.isShowTotalData ? (
                    <Button style={{ width: 150 }}>
                      <span
                        style={{
                          display: "inline-block",
                          width: 98,
                          textAlign: "left",
                        }}
                      >
                        全部
                      </span>
                      <Icon type="caret-down" style={{ color: "#777F97" }} />
                    </Button>
                  ) : (
                    <Button style={{ width: 150 }}>
                      显示
                      <Input
                        min={0}
                        style={{
                          width: 50,
                          height: 22,
                          marginLeft: 3,
                          marginRight: 3,
                        }}
                        value={this.state.showNumber}
                        onChange={this.onChangeNumer}
                        onClick={this.handleClickNumber}
                      />
                      条
                      <Icon type="caret-down" style={{ color: "#777F97" }} />
                    </Button>
                  )}
                </Dropdown>
                <Button onClick={this.changeTotalNumber}>查询</Button>
              </div>

              <ConfigProvider
                locale={zhCN}
                renderEmpty={
                  this.props.submissionDataTotal > -1 ? null : noRenderEmpty
                }
              >
                <Table
                  key={Math.random()}
                  loading={this.state.isLoading}
                  rowClassName={"tableRow"}
                  rowKey={(record) => record.id}
                  columns={columns}
                  dataSource={formDataShowArray}
                  pagination={paginationProps}
                  onChange={(pagination, filters, sorter) => {
                    this.setColumnSort(sorter);
                  }}
                  scroll={{ x: true }}
                />
              </ConfigProvider>
            </div>
          </>
        )}
      </>
    );
  }
}

export default connect(
  (store) => ({
    formData: store.formSubmitData.formData,
    forms: store.formSubmitData.forms,
    submissionDataTotal: store.formSubmitData.submissionDataTotal,
    loading: store.formSubmitData.formDataLoading,
  }),
  {
    getSubmissionData,
    getFilterSubmissionData,
    deleteFormData,
    clearFormData,
    getSubmissionDetail
  }
)(withRouter(FormSubmitData));
