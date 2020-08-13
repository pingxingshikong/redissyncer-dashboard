import request from "@/utils/baserequest";

export function getMemoryUsed() {
  return request({
    url: '/actuator/metrics/jvm.memory.used',
    method: 'get'
  })
}
