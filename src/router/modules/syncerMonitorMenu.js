import Layout from '@/layout'

const syncerMonitorMenuRouter = {
  path: '/syncerMonitor',
  component: Layout,
  redirect: 'noRedirect',
  name: '监控管理',
  meta: {
    title: '监控管理',
    icon: 'list'
  },
  children: [
    {
      path: 'log',
      component: () => import('@/views/syncer/list/log'),
      name: '在线实时日志',
      meta: { title: '在线实时日志', noCache: true }
    },
    {
      path: 'line',
      component: () => import('@/views/charts/line'),
      name: 'RDB版本管理',
      meta: { title: 'RDB版本管理', noCache: true }
    }
  ]
}

export default syncerMonitorMenuRouter
