import request from "@/utils/request";

export function getDashBoard() {
  return request({
    url: '/info/dashboardInfo',
    method: 'post'
  })
}

export function getDashBoardChart() {
  return request({
    url: '/info/chardashboardInfo',
    method: 'post'
  })
}



