import React, { PureComponent } from "react";
import { Icon, Dropdown } from "antd";
import { history } from "../../../../store";
import { Button } from "../../../shared/customWidget";
import { HomeContentTitle } from "../../../content/HomeContent";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { submitFormDataAuth } from "../../utils/permissionUtils";
import FilterFieldsComponents from "../formData/components/filterFields/filterFieldsComponents";
import { FilterModeIcon } from "./../../svg"

const Divider = () => <div style={{ display: "inline-block", width: 10 }}/>;
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
      selectedFieldsNumber,
      forms
    } = this.props;

    // 提交权限
    const { appName, permissions, teamId, match, formId, isFilterMode, navs } = this.props;
    const { appId } = match.params;
    const isSubmitAuth = submitFormDataAuth(permissions, teamId, appId, formId);

    const btns = isShowExtraTitle ? (
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
          <Button>
            <span id="fieldsBtn"> 显示字段 {selectedFieldsNumber < forms.components.length ? <Icon component={FilterModeIcon} /> : null}</span>
          </Button>

        </Dropdown>
        <Divider />
        <Button onClick={clickExtendCallBack}>
          <span> 筛选条件 {isFilterMode ? <Icon component={FilterModeIcon} /> : null}</span>
        </Button>
        <Divider />
        {isShowBtn === true && isSubmitAuth ? (
          <Button
            className="headerBarButton"
            type="primary"
            onClick={() => clickCallback()}
          >
            {btnValue}
          </Button>
        ) : (
            null
          )}
      </div>) : this.props.btns;
    return (
      <HomeContentTitle
        title={name}
        navs={navs || [
          { key: 0, label: "我的应用", onClick: () => history.push("/app/list") },
          { key: 1, label: appName || "未知应用名", disabled: true },
          { key: 1, label: "表单", disabled: true }
        ]}
        btns={btns}
      />
    );
    // return (
    //   <div className="formBuilder-NavBar">
    //     {isShowBackBtn === true ? (
    //       <div className="headerBarBack">
    //         <Button type="link" onClick={() => backCallback()}>
    //           <Icon type="left" />
    //           返回
    //         </Button>
    //       </div>
    //     ) : null}

    //     <div className="headerBarTitle">
    //       <span>{name}</span>
    //     </div>
    //     {isShowExtraTitle ? (
    //       <div className="headerBarExtraTitle">
    //         <Dropdown
    //           overlay={
    //             <FilterFieldsComponents
    //               components={forms.components}
    //               handleSetShowFields={handleFilterFields}
    //             />
    //           }
    //           trigger={["click"]}
    //         >
    //           <span id="fieldsBtn"> 显示字段 </span>
    //         </Dropdown>
    //         {/* <span> 显示字段 </span> */}
    //         <span onClick={clickExtendCallBack}> 筛选条件 {isFilterMode ? <Icon component={FilterModeIcon} />: null}</span>
    //         {isShowBtn === true && isSubmitAuth ? (
    //           <Button
    //             className="headerBarButton"
    //             type="primary"
    //             onClick={() => clickCallback()}
    //           >
    //             {btnValue}
    //           </Button>
    //         ) : (
    //           <></>
    //         )}
    //       </div>
    //     ) : (
    //       <></>
    //     )}
    //   </div>
    // );
  }
}

export default connect(({ login, formSubmitData }) => ({
  forms: formSubmitData.forms,
  teamId: login.currentCompany && login.currentCompany.id,
  permissions: (login.userDetail && login.userDetail.permissions) || []
}))(withRouter(NavBar));
