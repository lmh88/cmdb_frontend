/* Layout */

const sqlDetail = () => import('@/views/slow-sql/sql-detail')
const preSql = () => import('@/views/slow-sql/PreSql')
const sqlProjects = () => import('@/views/slow-sql/sql-projects')

const slowSqlRouter = [
  {
    name: 'slow-sql',
    path: 'slow-sql',
    component: () => import('@/views/slow-sql/index'),
    meta: { title: '质量', breadcrumb: false },
    children: [
      {
        name: 'pre-sql',
        path: 'pre-sql',
        meta: { title: '事前sql治理', icon: '' },
        component: preSql
      },
      {
        name: 'sql-detail',
        path: 'sql-detail',
        meta: { title: 'sql详情', icon: '' },
        component: sqlDetail
      },
      {
        name: 'sql-projects',
        path: 'projects',
        meta: { title: '应用管理', icon: '' },
        component: sqlProjects
      }
    ]
  }
]

export { slowSqlRouter }
