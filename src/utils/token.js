// 获取token
export function getToken() {
  return localStorage.getItem('token')
}
// 设置token
export function setToken(token) {
  localStorage.setItem('token',token)
}
//  delete token
export function delToken() {
  localStorage.removeItem('token')
}


