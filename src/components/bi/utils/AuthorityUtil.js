/**
 * Check the authority of administrator.
 */
function isAdmin(permissions, teamId) {
  return permissions.includes(`${teamId}:*:*:*:*:*`)
}

/**
 * Check the authority of create dashboard.
 */
export function canCreateDB(permissions, teamId, appId) {
  return isAdmin(permissions, teamId) ? true : permissions.includes(`${teamId}:${appId}:dashboard#?:?:?:MC`)
}

/**
 * Check the authority of Edit dashboard.
 */
export function canEditDB(permissions, teamId, appId, dashboardId) {
  return isAdmin(permissions, teamId) ? true : permissions.includes(`${teamId}:${appId}:dashboard#${dashboardId}:?:?:MU`)
}

/**
 * Check the authority of remove dashboard.
 */
export function canRemoveDB(permissions, teamId, appId, dashboardId) {
  return isAdmin(permissions, teamId) ? true : permissions.includes(`${teamId}:${appId}:dashboard#${dashboardId}:?:?:MD`)
}