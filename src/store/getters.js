const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  setting: state => state.user.setting,
  permission_routes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes,
  errorLogs: state => state.errorLog.logs,
  display_name: state =>
    state.user.username ? state.user.username : state.user.name,
  group_code: state => state.user.group_code
}
export default getters
