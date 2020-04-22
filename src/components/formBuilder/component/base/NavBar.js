import React, { PureComponent } from "react";
import { Button, Icon, Dropdown } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { submitFormDataAuth } from "../../utils/permissionUtils";
import FilterFieldsComponents from "../formData/components/filterFields/filterFieldsComponents";
import {ReactComponent as FilterModeIcon } from "./filterModeIcon.svg"

class NavBar extends PureComponent {
  render() {
    const {
      backCallback,
      name = "",
      isShowBtn,
      btnValue = "创建表单",
      isShowBackBtn = true,
      isShowExtraTitle = true,
      clickCallback = () => {
        return 0;
      },
      clickExtendCallBack,
      handleFilterFields,
      forms
    } = this.props;

    // 提交权限
    const { permissions, teamId, match, formId, isFilterMode } = this.props;
    const { appId } = match.params;
    const isSubmitAuth = submitFormDataAuth(permissions, teamId, appId, formId);

    return (
      <div className="formBuilder-NavBar">
        {isShowBackBtn === true ? (
          <div className="headerBarBack">
            <Button type="link" onClick={() => backCallback()}>
              <Icon type="left" />
              返回
            </Button>
          </div>
        ) : null}

        <div className="headerBarTitle">
          <span>{name}</span>
        </div>
        {isShowExtraTitle ? (
          <div className="headerBarExtraTitle">
            <Dropdown
              overlay={
                <FilterFieldsComponents
                  components={forms.components}
                  handleSetShowFields={handleFilterFields}
                />
              }
              trigger={["click"]}
            >
              <span id="fieldsBtn"> 显示字段 </span>
            </Dropdown>
            {/* <span> 显示字段 </span> */}
            <span onClick={clickExtendCallBack}> 筛选条件 {isFilterMode ? <Icon component={FilterModeIcon} />: null}</span>
            {isShowBtn === true && isSubmitAuth ? (
              <Button
                className="headerBarButton"
                type="primary"
                onClick={() => clickCallback()}
              >
                {btnValue}
              </Button>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
        {/* <div className="headerBarButton">
          {isShowBtn === true && isSubmitAuth ? (
            <Button type="primary" onClick={() => clickCallback()}>
              {btnValue}
            </Button>
          ) : (
            <></>
          )}
        </div> */}
      </div>
    );
  }
}

export default connect(({ login, formSubmitData }) => ({
  forms: formSubmitData.forms,
  teamId: login.currentCompany && login.currentCompany.id,
  permissions: (login.userDetail && login.userDetail.permissions) || []
}))(withRouter(NavBar));
