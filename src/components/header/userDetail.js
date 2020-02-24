import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Modal, Form, message } from "antd";
import { getUserDetail } from "../../store/userDetailReducer";
import HomeHeader from "./HomeHeader";
import { userDetailParameter, formItems } from "../../utils/formItems";
import userDetailStyles from "./header.module.scss";

export default Form.create({ name: "reset-form" })(
  connect(
    ({ login, user }) => ({
      loginData: login.loginData,
      userData: user.userData
    }),
    {
      getUserDetail
    }
  )(function UserDetail(props) {
    const { loginData, userData, getUserDetail, form } = props;
    const [init, setInit] = useState(false);
    useEffect(() => {
      if (!init) getUserDetail(loginData.ownerId);
      return () => setInit(true);
    });
    const initModalMeter = {
      key: null,
      value: null,
      meter: null,
      render: null
    };
    const [modalMeter, setModalMeter] = useState(initModalMeter);
    const parameters = userDetailParameter[modalMeter.meter] || [];
    const items = parameters.map(m =>
      formItems[m.key]({ form, payload: m.value })
    );
    const render = meter => {
      return <>{meter === "resetPassword" ? "修改密码" : "修改"}</>;
    };
    const resetUser = [
      {
        key: "所在企业",
        value: "companyName",
        meter: "resetCompanyName",
        render: meter => render(meter)
      },
      {
        key: "昵称",
        value: "name",
        meter: "resetName",
        render: meter => render(meter)
      },
      { key: "邮箱", value: "email", render: () => {} },
      {
        key: "手机",
        value: "mobilePhone",
        meter: "resetUserMobilePhone",
        render: meter => render(meter)
      },
      {
        key: "密码",
        value: "password",
        meter: "resetPassword",
        render: meter => render(meter)
      }
    ];
    const [rest0, ...rest] = resetUser;
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
                  <th>{userData[rest0.value]}</th>
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
                        {r.value === "password"
                          ? "********"
                          : userData[r.value]}
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
          <Form
          // onSubmit={() => {
          //   if (form.getFieldError(modalMeter.meter))
          //     return message.error("个人信息修改失败");
          //   localStorage.setItem(
          //     "useruserData",
          //     JSON.stringify(
          //       JSON.parse(localStorage.getItem("useruserData")).map(r => {
          //         return userData.username === r.username
          //           ? {
          //               ...r,
          //               [modalMeter.value]: form.getFieldValue(
          //                 modalMeter.value
          //               )
          //             }
          //           : r;
          //       })
          //     )
          //   );
          //   fetchuserDatas();
          // }}
          >
            {items.map((o, index) => (
              <Form.Item key={o.itemName}>
                {form.getFieldDecorator(parameters[index]["key"], {
                  ...o.options,
                  initialValue:
                    o.itemName === "password"
                      ? null
                      : o.itemName === "verificationCode"
                      ? null
                      : userData[o.itemName]
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
