import Layout from '@/layout'

const syncerMultiMenuRouter = {
  path: '/mutilsyncer',
  component: Layout,
  redirect: 'noRedirect',
  name: '双活任务管理',
  meta: {
    title: '双活任务管理',
    icon: 'list'
  },
  children: [
    {
      path: 'tasklists',
      component: () => import('@/views/syncer/list/tasklists'),
      name: '双活任务列表',
      meta: { title: '双活任务列表', noCache: true }
    },
    {
      path: 'line',
      component: () => import('@/views/charts/line'),
      name: '双活任务监控',
      meta: { title: '双活任务监控', noCache: true }
    }
  ]
}

export default syncerMultiMenuRouter
