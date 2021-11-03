import { UpdateResult, DeleteResult } from 'typeorm'
/**
 * 2000 成功
 * 2001 参数错误
 * 
 * 3000 查询失败
 * 3001 创建失败
 * 3002 更新失败
 * 
 * 500 服务器内部错误
 */
 export type ResponseCode = 2000 | 2001 | 3000 | 3001 | 3002 | 500;
 export interface ResponseReturn<T> {
   code: ResponseCode;
   data?: T;
   message: string;
 }
 export interface ActionResponseReturn {
   code: ResponseCode;
   message: string;
 }
 
 type ListResponseReturnData<T> = {
   total: number
   items: T
 }
 export interface ListResponseReturn<T> {
   code: ResponseCode;
   data: ListResponseReturnData<T>;
   message: string;
 }
 

// 创建成功返回
export function createReturn<T>(reason: T | string): ResponseReturn<T> {
  if (typeof reason === 'string') { // 自定义错误信息
    return {
      code: 3000,
      message: reason
    }
  }
  return {
    code: 2000,
    data: reason,
    message: 'ok'
  }
}
// 更新成功返回
export function updateReturn(code: ResponseCode = 2000, message = 'ok'): ActionResponseReturn {
  return { code, message }
}

// {
//   "n": 1,
//   "affected": 1,
//   "generatedMaps": 1
//   "raw": 1
// }
export function updateServiceReturn(reason: UpdateResult | { n: number }): ActionResponseReturn {
  let message = 'ok'
  let code: ResponseCode = 3002
  if (reason instanceof UpdateResult) {
    if (reason.affected >= 1) {
      message = 'ok'
      code = 2000
    }
  } else {
    if (reason.n < 1) {
      message = '没有此集合'
      code = 3000
    }
  }
  return { 
    code,
    message
  }
}

// 查询成功返回
export function queryReturn<T>(data: T): ResponseReturn<T> {
  let code: ResponseCode = 2000
  let message = 'ok'
  if (!data) {
    code = 3000
    message = '没有此集合'
  }
  return { code, message, data }
}

// 列表查询返回
export function queryByListReturn<T>(items: T, total: number): ListResponseReturn<T> {
  return {
    code: 2000,
    data: { total, items },
    message: 'ok'
  }
}

// {
//   "n": 1,
//   "raw": 1,
//   "affected": 1
// }
export const deleteReturn = (reason: DeleteResult | { n: number }): ActionResponseReturn => {
  let message = 'ok'
  let code: ResponseCode = 3002
  if (reason instanceof DeleteResult) {
    if (reason.affected >= 1) {
      message = 'ok'
      code = 2000
    }
  } else {
    if (reason.n < 1) {
      message = '没有此集合'
      code = 3000
    }
  }
  return { code, message }
}