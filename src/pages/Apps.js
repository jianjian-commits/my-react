import React from "react";
import { connect } from "react-redux";
import { history } from "../store";
import { Layout, Button, Card, message, Modal, Input, Form } from "antd";
import ModalCreation from "../components/profileManagement/modalCreate/ModalCreation";
import request from "../utils/request";
import { getAppList } from "../store/appReducer";
import Authenticate from "../components/shared/Authenticate";
import { HomeLayout, HomeContentTitle } from "../components/shared";
import { TEAM_CREATE_APP, APP_VISIABLED } from "../auth";
import commonClasses from "../styles/common.module.scss";
import { catchError } from "../utils";
import classes from "../styles/apps.module.scss";
import { NoAppImg, NoCompany, NoAppUnSysImg } from "../assets/images";
import { CloseIcon } from "../assets/icons/header";
import { initAllDetail } from "../store/loginReducer";

const { Content } = Layout;
const { Meta } = Card;

const checkCompanyName = async (rule, value, callback) => {
  if (!value) return callback();
  try {
    const res = await request(`/company/companyName/check?name=${value}`);
    if (res && res.data === false) return callback("该公司名已被注册");
  } catch (err) {
    catchError(err);
  }
  callback();
};

const getApps = (list) => {
  return list.map((e) => {
    return (
      <Authenticate key={e.id} auth={APP_VISIABLED(e.id)}>
        <Card
          className={classes.appCard}
          loading={false}
          onClick={() => history.push(`/app/${e.id}/detail`)}
        >
          <Meta
            className={classes.appCardMeta}
            avatar={<img src={`/image/appCreateIcons/${e.icon}.svg`} alt="" />}
            title={e.name}
            description={e.description}
          />
        </Card>
      </Authenticate>
    );
  });
};

class Apps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleCancel = this.handleCancel.bind(this);
  }

  // 完成新建
  async handleCreate(data) {
    try {
      const res = await request("/customApplication", {
        method: "POST",
        data,
      });
      if (res && res.status === "SUCCESS") {
        message.success("创建应用成功");
        this.props.initAllDetail();
        this.handleCancel();
      } else {
        message.error(res.msg || "创建应用失败");
      }
    } catch (err) {
      catchError(err);
    }
  }

  // 取消新建/关闭模态窗
  handleCancel() {
    this.setState({
      open: false,
      noCompanyModalOpen: false,
    });
  }

  render() {
    const {
      appList,
      sysUserName,
      name,
      form,
      allCompany,
      initAllDetail,
      fetchingNecessary,
    } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const appsPanelWidth = document.getElementById("appsPanel");
    let hideApps;
    if (appsPanelWidth) {
      const rowAppNum = parseInt(appsPanelWidth.clientWidth / 210);
      hideApps = Array.from(new Array(rowAppNum).keys());
    }
    const noCompanyStyle = {
      title: {
        fontSize: "18px",
        lineHeight: "26px",
        color: "#000000",
      },
      label: {
        fontSize: "14px",
        lineHeight: "20px",
        color: "#777F97",
      },
      image: {
        width: "530px",
        height: "250px",
      },
    };
    const handleConfirm = (e) => {
      e.preventDefault();
      validateFields((err, { ...rest }) => {
        if (!err) {
          request("/company", {
            method: "POST",
            data: rest,
          }).then(
            (res) => {
              if (res && res.status === "SUCCESS") {
                initAllDetail();
              } else {
                message.error(res.msg || "创建公司失败");
              }
            },
            (error) => catchError(error)
          );
        }
      }).then(() => this.setState({ noCompanyModalOpen: false }));
    };
    if (fetchingNecessary) return <HomeLayout />;
    if (!fetchingNecessary && (!allCompany || allCompany.length === 0))
      return (
        <HomeLayout>
          <div className={classes.noCompany}>
            <div>
              <NoCompany />
            </div>
            <div>
              <Button
                onClick={() => this.setState({ noCompanyModalOpen: true })}
              >
                创建公司
              </Button>
            </div>
          </div>
          <Modal
            closeIcon={<CloseIcon />}
            destroyOnClose={true}
            title={<span style={noCompanyStyle.title}>创建公司</span>}
            visible={this.state.noCompanyModalOpen}
            width={"610px"}
            onCancel={() => this.setState({ noCompanyModalOpen: false })}
            onOk={(e) => handleConfirm(e)}
            wrapClassName={classes.noCompanyModalFormWarp}
          >
            <Form>
              <Form.Item
                label={<span style={noCompanyStyle.label}>公司名称</span>}
                colon={false}
                hasFeedback={true}
              >
                {getFieldDecorator("companyName", {
                  validateTrigger: "onBlur",
                  rules: [
                    { required: true, message: "公司名不可为空" },
                    { validator: checkCompanyName },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item
                label={<span style={noCompanyStyle.label}>公司介绍</span>}
                colon={false}
              >
                {getFieldDecorator("companyDescription")(
                  <Input.TextArea
                    autoSize={{ minRows: 5, maxRows: 8 }}
                    allowClear={true}
                    placeholder={"简单描述一下你的公司吧"}
                  />
                )}
              </Form.Item>
            </Form>
          </Modal>
        </HomeLayout>
      );
    return (
      <HomeLayout>
        <Content className={commonClasses.container}>
          <HomeContentTitle title="我的应用"/>
          <Content className={classes.innerMain}>
            <div id="appsPanel" className={classes.appsPanel}>
              {getApps(appList)}
              <Authenticate auth={TEAM_CREATE_APP}>
                <Button
                  type="dashed"
                  icon="plus"
                  onClick={() => this.setState({ open: true })}
                >
                  创建应用
                  </Button>
                {appList.length < 1 && (
                  <div className={classes.noApp}>
                    <NoAppImg />
                  </div>
                )}
              </Authenticate>
              {hideApps &&
                hideApps.map((a, index) => (
                  <div
                    key={index}
                    style={{
                      width: "180px",
                      margin: "10px 15px 30px 15px",
                    }}
                  ></div>
                ))}
            </div>
            {appList.length < 1 && sysUserName !== name && (
              <>
                <NoAppUnSysImg />
              </>
            )}
          </Content>
          <ModalCreation
            title={"创建应用"}
            visible={this.state.open}
            onOk={(data) => this.handleCreate(data)}
            onCancel={this.handleCancel}
          />
        </Content>
      </HomeLayout>
    );
  }
}

export default Form.create({ name: "createCompany-form" })(
  connect(
    ({ app, login }) => ({
      appList: app.appList,
      sysUserName: login.currentCompany.sysUserName,
      name: login.userDetail.name,
      allCompany: login.allCompany,
      fetchingNecessary: login.fetchingNecessary,
    }),
    {
      getAppList,
      initAllDetail,
    }
  )(Apps)
);
