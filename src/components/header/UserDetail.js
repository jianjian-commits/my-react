import React, { useState } from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import { Modal } from "../shared/customWidget";
import {
  updateUserDetail,
  resetAllowSendCodeState,
  sendCode
} from "../../store/loginReducer";
// import HomeHeader from "./HomeHeader";
import { userDetailParameter, formItems } from "../login/formItemConfig";
import userDetailStyles from "./header.module.scss";
import { HomeLayout } from "../shared";
import HomeContent from "../content/HomeContent";
import clx from "classnames";
import store from "../../store";

const Mete = {
  companyName: "企业名称",
  name: "昵称",
  mobilePhone: "当前手机号",
  code: "验证码",
  oldPassWord: "当前密码",
  newPassWord: "新密码",
  confirmPassWord: "确认密码"
};

export default Form.create({ name: "reset-form" })(
  connect(
    ({ login }) => ({
      userDetail: login.userDetail,
      currentCompany: login.currentCompany,
      allowSendCode: login.allowSendCode,
      isFetchCoding: login.isFetchCoding,
      fetchText: login.fetchText,
      timeout: login.timeout
    }),
    {
      updateUserDetail,
      resetAllowSendCodeState,
      sendCode
    }
  )(function UserDetail(props) {
    const {
      userDetail,
      updateUserDetail,
      form,
      currentCompany,
      resetAllowSendCodeState,
      allowSendCode,
      sendCode,
      isFetchCoding,
      fetchText,
      timeout
    } = props;
    const { dispatch } = store;
    const {
      validateFields,
      getFieldDecorator,
      getFieldValue
      // getFieldError
    } = form;
    const initModalMeter = {
      key: null,
      value: null,
      meter: null,
      render: null
    };
    const [modalMeter, setModalMeter] = useState(initModalMeter);
    const parameters = userDetailParameter[modalMeter.meter] || [];
    const items = parameters.map(m => {
      if (m.key === "confirmPassWord") {
        return formItems[m.key]({
          form,
          payload: m.value,
          newPassWord: getFieldValue("newPassWord"),
          itemName: m.itemName,
          icon: m.icon,
          modalMeter,
          setModalMeter,
          resetAllowSendCodeState,
          dispatch,
          activeKey: "resetPhone",
          allowSendCode,
          codeType: "RESETPHONE",
          sendCode,
          isFetchCoding,
          fetchText,
          placeholder: m.placeholder
        });
      }
      return formItems[m.key]({
        form,
        payload: m.value,
        itemName: m.itemName,
        icon: m.icon,
        modalMeter,
        setModalMeter,
        update: true,
        resetAllowSendCodeState,
        dispatch,
        activeKey: "resetPhone",
        allowSendCode,
        codeType: "RESETPHONE",
        sendCode,
        isFetchCoding,
        fetchText,
        placeholder: m.placeholder
      });
    });
    const render = meter => {
      return <>{meter === "resetPassword" ? "修改密码" : "修改"}</>;
    };
    const resetUser = [
      {
        key: "所在企业",
        value: "companyName",
        meter: "resetCompanyName",
        render: () => {},
        redit: true
      },
      {
        key: "用户昵称",
        value: "name",
        meter: "resetName",
        render: meter => render(meter),
        redit: true
      },
      { key: "职位", value: "position", render: () => {}, redit: false },
      { key: "分组", value: "group", render: () => {}, redit: false },
      { key: "邮箱", value: "email", render: () => {}, redit: false },
      {
        key: "手机",
        value: "mobilePhone",
        meter: "resetMobilePhone",
        render: meter => render(meter),
        redit: true
      },
      {
        key: "密码",
        value: "oldPassWord",
        meter: "resetPassword",
        render: meter => render(meter),
        redit: false
      }
    ];
    // const [rest0, ...rest] = resetUser;
    const handleSubmit = e => {
      e.preventDefault();
      validateFields(
        (
          err,
          { actionType, userDetailModalSubmit, verificationCode, ...rest }
        ) => {
          if (!err) {
            updateUserDetail(
              Object.assign(
                {
                  form,
                  setModalMeter,
                  initModalMeter,
                  verificationCode,
                  timeout,
                  resetAllowSendCodeState
                },
                rest,
                rest.mobilePhone && verificationCode
                  ? { code: verificationCode }
                  : {}
              )
            );
          }
        }
      );
    };
    return (
      <HomeLayout>
        <HomeContent title="个人信息">
          <div className={userDetailStyles.userDetail}>
            <div>
              <ul>
                {/* <li>
                <span>{rest0.key}</span>
                <span>
                  {userDetail[rest0.value]}
                  <span onClick={() => setModalMeter(rest0)}>
                    {rest0.render(rest0.meter)}
                  </span>
                </span>
              </li> */}
                {resetUser.map(r => {
                  return (
                    <li key={r.value}>
                      <span>{r.key}</span>
                      <span>
                        {r.value === "oldPassWord"
                          ? "********"
                          : r.value === "companyName"
                          ? currentCompany.companyName
                          : userDetail[r.value]}
                        <span
                          onClick={() => {
                            resetAllowSendCodeState &&
                              resetAllowSendCodeState();
                            setModalMeter(r);
                          }}
                          style={{ color: "#1890ff", cursor: "pointer" }}
                        >
                          {r.render(r.meter)}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <Modal
            title={`修改${modalMeter.key}`}
            visible={!!modalMeter.meter}
            footer={null}
            width={"452px"}
            onCancel={() => {
              setModalMeter({ ...modalMeter, meter: false });
            }}
            afterClose={() => {
              modalMeter.value === "mobilePhone" && resetAllowSendCodeState();
              modalMeter.value === "mobilePhone" &&
                timeout &&
                timeout.int &&
                timeout.clear(0);
            }}
            className={userDetailStyles.detailUpdateModal}
          >
            <div>
              <Form
                onSubmit={e => handleSubmit(e)}
                className={clx(
                  userDetailStyles.modalForm,
                  {
                    [userDetailStyles.detailUpdateModalPhone]:
                      modalMeter.value === "mobilePhone"
                  },
                  {
                    [userDetailStyles.noLabelInput]: modalMeter.value === "name"
                  }
                )}
              >
                {items.map(o => {
                  const helpText = form.getFieldError(o.itemName);
                  return (
                    <Form.Item
                      key={o.itemName}
                      label={o.itemName !== "name" && Mete[o.itemName]}
                      hasFeedback={false}
                      colon={false}
                      labelAlign={"right"}
                      help={
                        (o.help === "register" ||
                          o.help === "forgetPassword") &&
                        helpText ? (
                          <div
                            style={{
                              position: "absolute",
                              left: "340px",
                              width: "224px",
                              height: "42px",
                              lineHeight: "45px"
                            }}
                          >
                            {helpText}
                          </div>
                        ) : (
                          <span
                            style={{
                              display: "block",
                              height: helpText ? "22px" : 0,
                              lineHeight: "22px"
                            }}
                          >
                            {helpText}
                          </span>
                        )
                      }
                    >
                      {getFieldDecorator(o.itemName, {
                        ...o.options,
                        validateFirst: true
                        // initialValue:
                        //   o.itemName === "oldPassWord"
                        //     ? null
                        //     : o.itemName === "verificationCode"
                        //     ? null
                        //     : userDetail[o.itemName]
                      })(o.component)}
                      {o.additionComponent}
                    </Form.Item>
                  );
                })}
              </Form>
            </div>
          </Modal>
        </HomeContent>
      </HomeLayout>
    );
  })
);
