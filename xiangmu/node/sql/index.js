module.exports = {
  insert (collection, insertData) {
    // collection.insertMany(insertData, (err) => {})
    return new Promise((resolve, reject) => {
      collection.insertMany(insertData, (err) => {
        if (err) throw err
        resolve()
      })
    })
  },
  delete (collection, deleteData, num) {
    // collection.deleteOne(deleteData, (err) => {})
    // collection.deleteMany(deleteData, (err) => {})
    // const deleteType = 'deleteOne' || 'deleteMany' 
    // collection[deleteType]()
    // 如果num值存在并且为 1，那么就是删除多条数据， 默认删除的是单条数据
    const deleteType = num && num === 1 ? 'deleteMany' : 'deleteOne'
    return new Promise((resolve, reject) => {
      collection[deleteType](deleteData, (err) => {
        if (err) throw err
        resolve()
      })
    })
  },
  update (collection, whereData, updateData, num) {
    // collection.updateOne(whereData, updateData)
    const updateType = num && num === 1 ? 'updateMany' : 'updateOne'
    return new Promise((resolve, reject) => {
      collection[updateType](whereData, updateData, (err) => {
        if (err) throw err
        resolve()
      })
    })
  },
  find (collection, whereData, showData) {
    // collection.find(whereData, showData, (err, data) => {})
    return new Promise((resolve, reject) => {
      collection.find(whereData, showData, (err, data) => {
        if (err) throw err
        resolve(data)
      })
    })
  },
  paging (collection, whereData, showData, limit, count ) {
    // 页码 count  从 1开始  limit 每页显示个数
    // collection.find(whereData, showData).limit(limit).skip((count - 1) * limit).exec((err, data) => {})
    return new Promise((resolve, reject) => {
      collection.find(whereData, showData).limit(limit).skip((count - 1) * limit).exec((err, data) => {
        if (err) throw err
        resolve(data)
      })
    })
  },
  sort (collection, whereData, showData, sortData) {
    return new Promise((resolve, reject) => {
      collection.find(whereData, showData).sort(sortData).exec((err, data) => {
        if (err) throw err
        resolve(data)
      })
    })
  },
  distinct (collection, type) {
    return new Promise((resolve, reject) => {
      collection.distinct(type).exec((err, data) => {
        if (err) throw err
        resolve(data)
      })
    })
  }
}