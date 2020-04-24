import request from '@/utils/request'

export function getRdbList() {
  return request({
    url: 'http://114.67.67.7:8080/api/v2/getRdbList',
    method: 'post',
    json: true,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function getRdbListByPage(data) {
  return request({
    url: 'http://114.67.67.7:8080/api/v2/getRdbListByPage',
    method: 'post',
    json: true,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 更新RDB映射关系
 * @param data
 * @returns {*}
 */
export function updateRdbList(data) {
  return request({
    url: 'http://114.67.67.7:8080/api/v2/updateRdbVersion',
    method: 'post',
    json: true,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
/**
 * 新增RDB映射关系
 * @param data
 * @returns {*}
 */
export function insertRdbList(data) {
  return request({
    url: 'http://114.67.67.7:8080/api/v2/insetRdbVersion',
    method: 'post',
    json: true,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
/**
 * 新增RDB映射关系
 * @param data
 * @returns {*}
 */
export function deleteRdbList(data) {
  return request({
    url: 'http://114.67.67.7:8080/api/v2/deleteRdbVersion',
    method: 'post',
    json: true,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
