import React, { useState } from "react";
import { connect } from "react-redux";
import { Modal, Form } from "antd";
import {
  updateUserDetail,
  resetAllowSendCodeState,
  sendCode
} from "../../store/loginReducer";
import HomeHeader from "./HomeHeader";
import { userDetailParameter, formItems } from "../login/formItemConfig";
import userDetailStyles from "./header.module.scss";
import { CloseIcon } from "../../assets/icons/header";
import clx from "classnames";
import store from "../../store";
import { registerMap } from "echarts";

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
          codeType: "RESET",
          sendCode,
          isFetchCoding,
          fetchText
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
        codeType: "RESET",
        sendCode,
        isFetchCoding,
        fetchText
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
      validateFields((err, { actionType, verificationCode, ...rest }) => {
        if (!err) {
          updateUserDetail({ ...rest, code: verificationCode }).then(() => {
            setModalMeter(initModalMeter);
            verificationCode && timeout && timeout.int && timeout.clear(0);
            verificationCode && resetAllowSendCodeState();
          });
        }
      });
    };
    return (
      <>
        <HomeHeader />
        <div className={userDetailStyles.userDetail}>
          <div>
            <div>
              <span>个人信息</span>
            </div>
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
                          resetAllowSendCodeState && resetAllowSendCodeState();
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
          title={
            <span
              style={{
                fontSize: "16px",
                color: "#333333"
              }}
            >{`修改${modalMeter.key}`}</span>
          }
          visible={!!modalMeter.meter}
          footer={null}
          width={"484px"}
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
          closeIcon={<CloseIcon />}
        >
          <Form
            onSubmit={e => handleSubmit(e)}
            className={clx(userDetailStyles.modalForm, {
              [userDetailStyles.detailUpdateModalPhone]:
                modalMeter.value === "mobilePhone"
            })}
          >
            {items.map((o, index) => {
              // const helpText = getFieldError(o.itemName);
              return (
                <Form.Item
                  key={o.itemName}
                  label={Mete[o.itemName]}
                  hasFeedback={false}
                  colon={false}
                  labelAlign={"right"}
                  // help={
                  //   helpText && (
                  //     <div
                  //       style={{
                  //         position: "absolute",
                  //         left: "340px",
                  //         width: "224px",
                  //         height: "42px",
                  //         lineHeight: "45px"
                  //       }}
                  //     >
                  //       {helpText}
                  //     </div>
                  //   )
                  // }
                >
                  {getFieldDecorator(parameters[index]["key"], {
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
        </Modal>
      </>
    );
  })
);
