import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */

/** note: sub-menu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in sub-menu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
    affix: true                  if true, the tag will affix in the tags-view
  }
**/
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  // {
  //   path: '/auth-redirect',
  //   component: () => import('@/views/login/authredirect'),
  //   hidden: true
  // },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/403',
    component: () => import('@/views/errorPage/403'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: {
          title: 'dashboard',
          icon: 'dashboard',
          noCache: true,
          affix: true
        }
      },
      {
        path: '/git',
        component: () => import('@/views/git/git'),
        alwaysShow: true,
        name: 'GitList',
        meta: {
          title: 'git',
          icon: 'copy-document'
        }
      },
      {
        path: '/env',
        component: () => import('@/views/env/env'),
        alwaysShow: true,
        name: 'EnvList',
        meta: {
          title: 'env',
          icon: 'copy-document'
        }
      },
      {
        path: '/host',
        component: () => import('@/views/host/host'),
        alwaysShow: true,
        name: 'HostList',
        meta: {
          title: 'host',
          icon: 'cpu'
        }
      },
      {
        path: '/group',
        component: () => import('@/views/group/group'),
        alwaysShow: true,
        name: 'GroupList',
        meta: {
          title: 'group',
          icon: 'cpu'
        }
      },
      {
        path: '/mirror',
        component: () => import('@/views/mirror/mirror'),
        alwaysShow: true,
        name: 'MirrorList',
        meta: {
          title: 'mirror',
          icon: 'cpu'
        }
      },
      {
        path: '/code',
        component: () => import('@/views/code/code'),
        alwaysShow: true,
        name: 'CodeList',
        meta: {
          title: 'code',
          icon: 'cpu'
        }
      },
      {
        path: '/application',
        component: () => import('@/views/application/application'),
        alwaysShow: true,
        name: 'Application',
        meta: {
          title: 'application',
          icon: 'cpu'
        }
      },
      {
        path: '/rds',
        component: () => import('@/views/rds/rds'),
        alwaysShow: true,
        name: 'Application',
        meta: {
          title: 'rds',
          icon: 'cpu'
        }
      },
      {
        path: '/user',
        component: () => import('@/views/user/userManage'),
        name: 'StructureManage',
        meta: {
          title: 'userManage'
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

export const asyncRoutes = [
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/index',
  //   alwaysShow: true, // will always show the root menu
  //   meta: {
  //     title: 'permission',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import('@/views/permission/page'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: 'pagePermission',
  //         roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import('@/views/permission/directive'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: 'directivePermission'
  //         // if do not set roles, means: this page does not require permission
  //       }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/permission/role'),
  //       name: 'RolePermission',
  //       meta: {
  //         title: 'rolePermission',
  //         roles: ['admin']
  //       }
  //     }
  //   ]
  // },
]
