import Layout from '@/layout'

const syncerMenuRouter = {
  path: '/syncer',
  component: Layout,
  redirect: 'noRedirect',
  name: '同步任务管理',
  meta: {
    title: '同步任务管理',
    icon: 'list'
  },
  children: [
    {
      path: 'tasklists',
      component: () => import('@/views/syncer/list/tasklists'),
      name: '任务列表',
      meta: { title: '任务列表', noCache: true }
    },
    {
      path: 'line',
      component: () => import('@/views/charts/line'),
      name: 'RDB版本管理',
      meta: { title: 'RDB版本管理', noCache: true }
    }
  ]
}

export default syncerMenuRouter
