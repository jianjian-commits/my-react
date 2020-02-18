import React, { Component, Fragment } from "react";
import { Table, Popconfirm, Row, Col, ConfigProvider, Icon } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { deleteForm, getForms } from "./redux/utils/operateFormUtils";
import HeaderBar from "../base/NavBar";

// 加载数据时重写表格为空状态
const noRenderEmpty = () => (
  <div style={{ height: "20vh" }}></div>
);

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      pageSize: 6
    };
  }

  handleDeleteForm = key => {
    this.props.deleteForm(key);
  };
  onChangePages = (current, pageSize) => {
    this.setState({
      pageSize,
      currentPage: current
    });
    this.props.getForms(pageSize, current);
  };

  componentDidMount() {
    this.props.getForms(this.state.pageSize, this.state.currentPage);
  }

  render() {
    const confirmContent = (
      <Fragment>
        <p>确定要删除该表单</p>
        <p> 删除表单会将表单的所有数据删除 </p>
      </Fragment>
    );
    const columns = [
      {
        title: "表单名",
        dataIndex: "name",
        key: "name",
        width: "25%",
        render: text => <span>{text}</span>
      },
      {
        title: "创建时间",
        dataIndex: "created",
        width: "20%",
        key: "created"
      },
      {
        title: "修改时间",
        dataIndex: "modified",
        width: "20%",
        key: "modified"
      },
      {
        title: "操作",
        key: "action",
        width: "35%",
        render: (text, record) => {
          return (
            <div>
              <Link
                to={`/layout?id=${record.id}&page=${this.state.currentPage}`}
              >
                {" "}
                布局{" "}
              </Link>
              <Link to={`/submission?id=${record.id}`}> 提交 </Link>
              <Link to={`/formbuild?id=${record.id}`}> 编辑 </Link>
              <Link to={`/submitdata?id=${record.id}`}> 数据 </Link>
              <Popconfirm
                placement="bottom"
                title={confirmContent}
                onConfirm={() => {
                  this.handleDeleteForm(record.id);
                }}
                okText="确定"
                cancelText="取消"
              >
                <a>删除</a>
              </Popconfirm>
            </div>
          );
        }
      }
    ];
    const paginationProps = {
      defaultCurrent: 1,
      position: "bottom",
      showQuickJumper: true,
      pageSize: this.state.pageSize,
      total: this.props.total,
      current: this.state.currentPage,
      onChange: (current, pageSize) => {
        this.onChangePages(current, pageSize);
      },
      onShowSizeChange: (current, pageSize) => {
        this.onChangePages(current, pageSize);
      }
    };

    return (
      <>
        <HeaderBar
          backCallback={() => {
            return 0;
          }}
          name="已创建的表单"
          isShowBtn={true}
          btnValue="创建表单"
          isShowBackBtn={false}
          clickCallback={() => {
            // location.href = config.hostUrl + "/formbuild";
            console.log("1")
          }}
        />
        <Fragment>
          <ConfigProvider locale={zhCN} renderEmpty={this.props.total > -1 ? null : noRenderEmpty}>
            <div className="home-wrapper">
              <Row className="home-table-wrapper">
                <Col>
                  <Table
                    loading={this.props.total < 0}
                    columns={columns}
                    dataSource={this.props.forms}
                    pagination={paginationProps}
                    rowClassName={(record, index) => {
                      let className = "light-row";
                      if (index % 2 === 0) {
                        className = "dark-row";
                        return className;
                      }
                    }}
                  />
                </Col>
              </Row>
            </div>
          </ConfigProvider>
        </Fragment>
      </>
    );
  }
}

const mapToProps = state => {
  return {
    forms: state.forms.formArray,
    total: state.forms.total
  };
};

export default connect(mapToProps, {
  deleteForm,
  getForms
})(Home);
