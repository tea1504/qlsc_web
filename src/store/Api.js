import axios from 'axios'
import cookie from 'js-cookie'

let BaseApi = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
})

let Api = function () {
  let token = cookie.get('jwt')
  if (token) BaseApi.defaults.headers.common['Authorization'] = `Bearer ${token}`

  return BaseApi
}

export default Api
