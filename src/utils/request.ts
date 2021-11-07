import axios, { AxiosInstance, AxiosRequestConfig, Canceler, CancelTokenStatic } from 'axios'

const CancelToken: CancelTokenStatic = axios.CancelToken

// 取消请求
interface CancelPending {
  u: string | undefined
  m: string | undefined
  e: Canceler
}
const cancelList: CancelPending[] = []
function cancelRequest(conf: AxiosRequestConfig) {
  const { method, url } = conf
  cancelList.forEach(item => {
    const { u, m, e } = item
    if (`${u}_${m}` === `${url}_${method}`) {
      e('取消当前请求')
    }
  })
}

export const request: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 15000,
  headers: {
    // 'Content-Type': 'application/x-www-form-urlencoded' // charset=UTF-8
    'Content-Type': 'application/json'
  }
})

request.interceptors.request.use(
  config => {
    cancelRequest(config)
    config.cancelToken = new CancelToken(executor => {
      cancelList.push({
        u: config.url,
        m: config.method,
        e: executor
      })
    })
    return config
  },
  error => {
    console.log(error)
  }
)

request.interceptors.response.use(
  response => {
    const { status } = response
    if (status === 500) {
      alert({
        type: 'error',
        title: '错误提示',
        message: '服务器内部错误',
        duration: 5000
      })
    }
    return response.data
  },
  error => {
    // console.log('error', error.statusCode)
    alert({
      type: 'error',
      title: '错误提示',
      message: error.message,
      duration: 5000
    })
  }
)