const toolsRouter = [
  {
    name: 'tools',
    path: 'tools',
    component: () => import('@/views/tools/index'),
    meta: { title: '哆啦A梦', breadcrumb: false },
    children: [
      {
        name: 'json-editor',
        path: 'json-editor',
        meta: { title: 'json编辑工具', icon: '' },
        component: () => import('@/views/tools/JsonEditor')
      }
    ]
  }
]

export { toolsRouter }
