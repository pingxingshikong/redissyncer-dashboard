import Layout from '@/layout'

const syncerMenuRouter = {
  path: '/syncer',
  component: Layout,
  redirect: 'noRedirect',
  name: '任务管理',
  meta: {
    title: '任务管理',
    icon: 'list'
  },
  children: [
    {
      path: 'keyboard',
      component: () => import('@/views/charts/keyboard'),
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
