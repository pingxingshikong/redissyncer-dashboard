import request from "@/utils/request";

export function getDashBoard() {
  return request({
    url: '/info/dashboardInfo',
    method: 'post'
  })
}
