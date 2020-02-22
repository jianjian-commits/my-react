import React from "react";

const ErrorPage = props => {
  const { error } = props;
  return (
    <div className="error-page">
      <div className="c">
        <div className="_404">错误</div>
        <hr />
        <div className="_1">错误类型：{error.name}</div>
        <div className="_2">错误原因：{error.message}</div>
        <a className="btn" href="./">
          返回主页
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
