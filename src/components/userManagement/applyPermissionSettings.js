import React from "react";
import { Button, Icon } from "antd";
import settingStyles from "./user.module.scss";

export default function PermissionSetting() {
  const metedataPermissions = () => {
    return (
      <>
        <div>
          <span>元数据权限</span>
        </div>
      </>
    );
  };
  return (
    <>
      <div className={settingStyles.setting}>
        <div className={settingStyles.panel}>
          <div>
            <span>
              <Icon type="arrow-left" />
            </span>
            <span>应用权限设置</span>
          </div>
          <div>
            <span>
              <Button>取消</Button>
            </span>
            <span>
              <Button>保存</Button>
            </span>
          </div>
        </div>
        <metedataPermissions />
      </div>
    </>
  );
}
