import request from './../utils/request'

export function orderAdd (params) {
  return request.post('/order/add', params)
}

// 获取确认订单的数据列表
export function ConfirmOrderInfo (params) {
  return request.post('/order/ConfirmOrderInfo', params)
}

// 添加地址
export function addressAdd (params) {
  return request.post('/address/add', params)
}

// 更新订单地址
export function updateOrderAddress (params) {
  return request.post('/order/updateAdress', params)
}

// 获取默认地址
export function getDefuailAddress (params) {
  return request.post('/address/defualtAddress', params)
}

// 获取地址列表
export function getAddresslist (params) {
  return request.post('/address/addresslist', params)
}

// 修改默认地址
export function updateDefaultAddress (params) {
  return request.post('/address/addressdefaultupdate', params)
}

// 去支付删除购物车数
export function deleteCartData (params) {
  return request.post('/order/deleteCartData', params)
}

// 支付
export function pay (params) {
  return request.get('/pay/payment', { params })
}
