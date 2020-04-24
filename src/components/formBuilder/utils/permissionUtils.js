/*
 * @Author: your name
 * @Date: 2020-03-19 09:32:47
 * @LastEditors: komons
 * @LastEditTime: 2020-04-23 14:52:07
 * @Description: 表单权限工具函数
 * @FilePath: \form-builderc:\Komons\work\all\davinci-paas-frontend\src\components\formBuilder\utils\permissionUtils.js
 */

// "5e707908078ed213542482a6:5e707921078ed213542482a9:id#mRK:extraProp.user.id#sdfgr:?:DR"
// 团队：APP ：id#表单id ：(extraProp.user.id#用户id | *) ：? :（DU编辑，DD删除）

// 数据：
// 提交：1:2:3:?:?:DC
// 编辑数据：1:2:3:(两种情况):？：DU
// 删除数据：1:2:3:(两种情况):？：DD

// 表单：
// 新建表单：1:2:?:?:?:MC
// 表单编辑: 1:2:3:?:?:MU
// 删除：1:2:3:?:?:MD

/**
 * @description: 是否有超级管理员权限
 * @param {Array} permissions
 * @return {bool}
 */
function hasSuperAuth(permissions, teamId) {
  return permissions.includes(`${teamId}:*:*:*:*:*`)
}


/**
 * @description: 新建表单权限校验
 * @param {Array} permissions
 * @param {String} teamId
 * @param {Steing} appId
 * @return {bool}
 */
export function newFormAuth(permissions, teamId, appId) {
  if (hasSuperAuth(permissions, teamId)) return true;
  // 校验1,2位和最后一位
  const auth = `${teamId}:${appId}:?:?:?:MC`;
  return permissions.includes(auth);
}

/**
 * @description: 表单编辑权限校验
 * @return {bool}
 */
export function editFormAuth(permissions, teamId, appId, formId) {
  if (hasSuperAuth(permissions, teamId)) return true;
  // 校验1,2位和最后一位
  const auth = `${teamId}:${appId}:form#${formId}:?:?:MU`;
  return permissions.includes(auth);
}

/**
 * @description: 表单删除权限校验
 * @return {bool}
 */
export function deleteFormAuth(permissions, teamId, appId, formId) {
  if (hasSuperAuth(permissions, teamId)) return true;
  // 校验1,2位和最后一位
  const auth = `${teamId}:${appId}:form#${formId}:?:?:MD`;
  return permissions.includes(auth);
}

/**
 * @description: 数据编辑权限校验
 * @return {bool}
 */
export function editFormDataAuth(permissions, teamId, appId, formId, userId) {
  if (hasSuperAuth(permissions, teamId)) return true;
  // 校验1,2位和最后一位
  const auth1 = `${teamId}:${appId}:form#${formId}:extraProp.user.id#${userId}:?:DU`; //等后台更新后owner替换为变量userId
  const auth2 = `${teamId}:${appId}:form#${formId}:*:?:DU`;
  return (permissions.includes(auth1) || permissions.includes(auth2));
}

/**
 * @description: 数据删除权限校验
 * @return {bool}
 */
export function deleteFormDataAuth(permissions, teamId, appId, formId, userId) {
  if (hasSuperAuth(permissions, teamId)) return true;
  // 校验1,2位和最后一位
  const auth1 = `${teamId}:${appId}:form#${formId}:extraProp.user.id#${userId}:?:DD`; //等后台更新后owner替换为变量userId
  const auth2 = `${teamId}:${appId}:form#${formId}:*:?:DD`;
  return (permissions.includes(auth1) || permissions.includes(auth2));
}

/**
 * @description: 数据提交权限校验
 * @param {Array} permissions
 * @return {bool}
 */
export function submitFormDataAuth(permissions, teamId, appId, formId) {
  if (hasSuperAuth(permissions, teamId)) return true;
  // 校验1,2位和最后一位
  const auth = `${teamId}:${appId}:form#${formId}:?:?:DC`;
  return permissions.includes(auth);
}

// 5e72ccaa64ef3171e54354bb:5e72ccc864ef3171e54354be:id#csF:extraProp.user.id#owner:?:UD
// "5e72ccaa64ef3171e54354bb:5e72ccc864ef3171e54354be:id#csF:extraProp.user.id#owner:?:DU"