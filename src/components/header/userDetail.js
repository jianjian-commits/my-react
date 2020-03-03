import React, { useState } from "react";
import { connect } from "react-redux";
import { Modal, Form } from "antd";
import { updateUserDetail } from "../../store/loginReducer";
import HomeHeader from "./HomeHeader";
import { userDetailParameter, formItems } from "../../utils/formItems";
import userDetailStyles from "./header.module.scss";

export default Form.create({ name: "reset-form" })(
  connect(
    ({ login }) => ({
      userDetail: login.userDetail
    }),
    {
      updateUserDetail
    }
  )(function UserDetail(props) {
    const { userDetail, updateUserDetail, form } = props;
    const { validateFields, getFieldDecorator, getFieldValue } = form;
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
          newPassWord: getFieldValue("newPassWord")
        });
      }
      return formItems[m.key]({ form, payload: m.value });
    });
    const render = meter => {
      return <>{meter === "resetPassword" ? "修改密码" : "修改"}</>;
    };
    const resetUser = [
      {
        key: "所在企业",
        value: "companyName",
        meter: "resetCompanyName",
        render: meter => render(meter),
        redit: true
      },
      {
        key: "昵称",
        value: "name",
        meter: "resetName",
        render: meter => render(meter),
        redit: true
      },
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
    const [rest0, ...rest] = resetUser;
    const handleSubmit = e => {
      e.preventDefault();
      validateFields((err, { actionType, verificationCode, ...rest }) => {
        if (!err) {
          console.log("Received values of form: ", rest);
          updateUserDetail(rest).then(() => {
            setModalMeter(initModalMeter);
          });
        }
      });
    };
    return (
      <>
        <HomeHeader />
        <div
          style={{
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            position: "relative"
          }}
        >
          <div
            style={{
              width: "90vw",
              position: "absolute",
              top: "6vw"
            }}
          >
            <h2>个人信息</h2>
            <table className={userDetailStyles.table}>
              <thead>
                <tr>
                  <th>{rest0.key}</th>
                  <th>{userDetail[rest0.value]}</th>
                  <th>
                    <span
                      onClick={() => setModalMeter(rest0)}
                      style={{ color: "#1548EB", cursor: "pointer" }}
                    >
                      {rest0.render(rest0.meter)}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rest.map(r => {
                  return (
                    <tr key={r.value}>
                      <td>{r.key}</td>
                      <td>
                        {r.value === "oldPassWord"
                          ? "********"
                          : userDetail[r.value]}
                      </td>
                      <td>
                        <span
                          onClick={() => setModalMeter(r)}
                          style={{ color: "#1548EB", cursor: "pointer" }}
                        >
                          {r.render(r.meter)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <Modal
          title={`修改${modalMeter.key}`}
          visible={!!modalMeter.meter}
          footer={null}
          width="419px"
          onCancel={() => setModalMeter(initModalMeter)}
        >
          <Form onSubmit={e => handleSubmit(e)}>
            {items.map((o, index) => (
              <Form.Item key={o.itemName}>
                {getFieldDecorator(parameters[index]["key"], {
                  ...o.options,
                  initialValue:
                    o.itemName === "oldPassWord"
                      ? null
                      : o.itemName === "verificationCode"
                      ? null
                      : userDetail[o.itemName]
                })(o.component)}
                {o.additionComponent}
              </Form.Item>
            ))}
          </Form>
        </Modal>
      </>
    );
  })
);
