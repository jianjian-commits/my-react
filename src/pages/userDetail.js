import React from "react";
import { connect } from "react-redux";
import { Popconfirm, Form, message } from "antd";
import { fetchDatas } from "../store/_loginReducer";
import HomeHeader from "../components/header/HomeHeader";
import { nickname, company, phone, password } from "../utils/formItems";

export default Form.create({ name: "reset-form" })(
  connect(({ login }) => ({ userDatas: login.userDatas }), {
    fetchDatas
  })(function UserDetail(props) {
    console.log(props);
    const { userDatas, fetchDatas, form } = props;
    console.log(form);
    const render = item => {
      let option;
      console.log(item);
      if (item === "nickname") {
        option = nickname;
      } else if (item === "company") {
        option = company;
      } else if (item === "phone") {
        option = phone;
      } else if (item === "password") {
        option = password();
      }
      console.log(option);
      function title() {
        return (
          <Form.Item>
            {form.getFieldDecorator(item, {
              ...option.options,
              initialValue: item === "password" ? null : userDatas[item]
            })(option.component)}
            {item.additionComponent}
          </Form.Item>
        );
      }
      return (
        <Popconfirm
          title={title(props)}
          onConfirm={() => {
            if (form.getFieldError(item))
              return message.error("个人信息修改失败");
            localStorage.setItem(
              "userData",
              JSON.stringify(
                JSON.parse(localStorage.getItem("userData")).map(r => {
                  console.log(form.getFieldValue(item));
                  return userDatas.username === r.username
                    ? { ...r, [item]: form.getFieldValue(item) }
                    : r;
                })
              )
            );
            fetchDatas();
          }}
          icon={null}
          onCancel={() => ""}
          okText="确定"
          cancelText="取消"
          placement="right"
        >
          <span style={{ color: "#1548EB", cursor: "pointer" }}>
            {item === "password" ? "修改密码" : "修改"}
          </span>
        </Popconfirm>
      );
    };
    const resetUser = [
      {
        key: "所在企业",
        value: "company",
        render: () => render("company")
      },
      { key: "用户名", value: "username" },
      {
        key: "姓名",
        value: "nickname",
        render: () => render("nickname")
      },
      { key: "邮箱", value: "email" },
      {
        key: "手机",
        value: "phone",
        render: () => render("phone")
      },
      {
        key: "密码",
        value: "password",
        render: () => render("password")
      }
    ];
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
          <div style={{ width: "90vw", position: "absolute", top: "6vw" }}>
            <h2>个人信息</h2>
            <div style={{ width: "100%" }}>
              {resetUser.map(user => {
                return (
                  <React.Fragment key={user.value}>
                    <div style={{ display: "flex" }}>
                      <div
                        style={{
                          width: "100px",
                          fontSize: "10px"
                        }}
                      >
                        {user.key}
                      </div>
                      {user.value !== "password" && (
                        <>
                          <div
                            style={{
                              fontSize: "10px"
                            }}
                          >
                            {userDatas[user.value]}
                          </div>
                          <div
                            style={{
                              width: "40px",
                              fontSize: "10px"
                            }}
                          />
                        </>
                      )}
                      {user.render && user.render()}
                    </div>
                    <hr style={{ color: "#979797", margin: "15px 0" }} />
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  })
);
