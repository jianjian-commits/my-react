import React from "react";
import { Content } from "../components/shared/customWidget";
import { connect } from "react-redux";
import commonClasses from "../styles/common.module.scss";
import { Route } from "react-router-dom";
import Authenticate from "../components/shared/Authenticate";
import { HomeLayout } from "../components/shared";
import { companyWebs } from "../routers";

const TeamManagement = props => {
  return (
    <HomeLayout>
      <Content className={commonClasses.container}>
        {companyWebs.map(route => (
          <Authenticate key={route.path} auth={route.auth}>
            <Route {...route} />
          </Authenticate>
        ))}
      </Content>
    </HomeLayout>
  );
};

export default connect(({ login, debug }) => ({
  permissions: (login.userDetail && login.userDetail.permissions) || [],
  teamId: login.currentCompany && login.currentCompany.id,
  debug: debug.isOpen
}))(TeamManagement);
