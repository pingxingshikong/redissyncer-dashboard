import request from '@/utils/request'



export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    json: true,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function changePassword(data) {
  return request({
    url: '/changePassword',
    method: 'post',
    json: true,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
