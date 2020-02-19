import React from "react";
import { connect } from "react-redux";
import { Popconfirm, Input } from "antd";
import { fetchDatas } from "../store/_loginReducer";
import HomeHeader from "../components/header/HomeHeader";

export default connect(({ login }) => ({ userDatas: login.userDatas }), {
  fetchDatas
})(function UserDetail(props) {
  const { userDatas, fetchDatas } = props;
  const render = item => {
    const inputRef = React.createRef();
    const title = (
      <Input
        ref={inputRef}
        defaultValue={userDatas[item]}
        maxLength={item === "phone" ? 11 : null}
      />
    );
    return (
      <Popconfirm
        title={title}
        onConfirm={() => {
          localStorage.setItem(
            "register",
            JSON.stringify(
              JSON.parse(localStorage.getItem("userData")).map(r => {
                return userDatas.username === r.username
                  ? { ...r, [item]: inputRef.current.state.value }
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
      value: "username",
      render: () => render("username")
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
                <>
                  <div key={user.key} style={{ display: "flex" }}>
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
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
});
