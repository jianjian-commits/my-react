/*
 * @Author: your name
 * @Date: 2020-03-19 09:32:47
 * @LastEditors: komons
 * @LastEditTime: 2020-03-19 10:21:17
 * @Description: 表单权限工具函数
 * @FilePath: \form-builderc:\Komons\work\all\davinci-paas-frontend\src\components\formBuilder\utils\permissionUtils.js
 */

// "5e707908078ed213542482a6:5e707921078ed213542482a9:id#mRK:extraProp.id#owner:?:DR"
// 团队：APP ：id#表单id ：(extraProp.id#用户id | *) ：? :（DU编辑，DD删除）

// 数据：
// 提交：1:2:3:?:?:DC
// 编辑数据：1:2:3:(两种情况):？：DU
// 删除数据：1:2:3:(两种情况):？：DD

// 表单：
// 新建表单：1:2:?:?:?:MC
// 表单编辑: 1:2:3:?:?:MU
// 删除：1:2:3:?:?:MD

/**
 * @description: 新建表单权限校验
 * @param {Array} permissions
 * @param {String} teamId
 * @param {Steing} appId
 * @return {bool}
 */ 
export function newFormAuth(permissions, teamId, appId) {
  if (permissions.includes(`${teamId}:*:*:*:*:*`)) return true;
  // 校验1,2位和最后一位
  const auth = `${teamId}:${appId}:?:?:?:MC`;
  return permissions.includes(auth);
}
