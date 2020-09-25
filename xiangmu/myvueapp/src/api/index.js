import request from './../utils/request'
export function getHomeBannerlistData () {
  return request.get('/banner')
}
/**
 * 请求首页的列表数据
 * get
 * limit 默认值为10
 * count 默认值为1
 */
export function getHomeProlistData (params) {
  return request.get('/pro', { params })
}
// 不要改 params
// 详情数据
export function getProDetailData (params) {
  return request.get('/pro/detail', { params })
}

// 验证手机号
export function docheckphone (params) {
  return request.post('/user/docheckphone', params)
}

// 发送验证码
export function dosendmsgcode (params) {
  return request.post('/user/dosendmsgcode', params)
}

// 验证验证码
export function docheckcode (params) {
  return request.post('/user/docheckcode', params)
}

// 注册
export function dosetpassword (params) {
  return request.post('/user/dosetpassword', params)
}

// 登陆验证码
export function dosendloginCode (params) {
  return request.post('/user/dosendloginCode', params)
}

// 登陆
export function dosmslogin (params) {
  return request.post('/user/dosmslogin', params)
}

// 账户登陆/邮箱登陆/手机号登陆
export function domlogin (params) {
  return request.post('/user/domlogin', params)
}

// 加入购物车
export function addCart (params) {
  return request.post('/cart/add', params)
}

// 获取购物车数据
export function getCartData (params) {
  return request.post('/cart', params)
}

// 删除购物车数据
export function deleteCartData (params) {
  return request.post('/cart/delete', params)
}

// 更新购物车数量
export function updateCartNum (params) {
  return request.post('/cart/updateNum', params)
}

// 更新所有的钻中和非选中状态
export function updateAllFlag (params) {
  return request.post('/cart/updateAllFlag', params)
}

// 更新单个商品的选中状态
export function updateFlag (params) {
  return request.post('/cart/updateFlag', params)
}

// 获取类型分类接口
export function getCategory (params) {
  return request.get('/pro/categroy', { params })
}

// 获取品牌分类接口
export function getCategoryBrand (params) {
  return request.get('/pro/categroybrand', { params })
}

// 获取某分类下的某品牌的数据列表
export function getCategoryBrandLists (params) {
  return request.get('/pro/categroybrandlist', { params })
}

// 搜索
export function getSearchData (params) {
  return request.get('/search', { params })
}
