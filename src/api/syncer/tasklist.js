import request from '@/utils/request'

export function createTask(data) {
  return request({
    url: '/api/v2/createtask',
    method: 'post',
    json: true,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function getTaskList(data) {
  return request({
    url: '/api/v2/listtasks',
    method: 'post',
    json: true,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function getTaskListByPage(data) {
  return request({
    url: '/api/v2/listtasksByPage',
    method: 'post',
    json: true,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 按id查询
 * @param data
 * @returns {*}
 */
export function getTaskByIds(data) {
  var object = {
    regulation: 'byids',
    taskids: data
  }
  return request({
    url: '/api/v2/listtasks',
    method: 'post',
    json: true,
    data: JSON.stringify(object),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 删除任务
 * @param data
 * @returns {*}
 */
export function removeTaskByIds(data) {
  var object = {
    taskids: data
  }
  return request({
    url: '/api/v2/removetask',
    method: 'post',
    json: true,
    data: JSON.stringify(object),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 启动任务
 * @param data
 * @returns {*}
 */
export function startTaskByIds(data, afresh) {
  var object = {
    taskid: data,
    afresh: afresh
  }
  return request({
    url: '/api/v2/starttask',
    method: 'post',
    json: true,
    data: JSON.stringify(object),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
/**
 * 停止任务
 * @param data
 * @returns {*}
 */
export function stopTaskByIds(data) {
  var object = {
    taskids: data
  }
  return request({
    url: '/api/v2/stoptask',
    method: 'post',
    json: true,
    data: JSON.stringify(object),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function getDataParam(data, id) {
  for (let i = 0; i < data.length; i++) {
    if ( data[i].taskId === id ) {
      return data[i]
    }
  }
  return {
    code: '1000',
    taskId: id,
    msg: '任务不存在'
  }
}
