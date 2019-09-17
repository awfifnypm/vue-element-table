import axios from 'axios'
/*
  params 需要操作的数组
  keyArr 需要转换的字段 ['id','memberNumber']
  symbol 需要切换的字符
  使用 checkAll(arr,['id','memberNumber']).id     结果1,2,3,4
*/
// 封装elementUi table全选后数据提取
export const checkAll = (params, keyArr, symbol = ',') => {
  let paramsData = JSON.parse(JSON.stringify(params))
  let returnData = {}
  let arrObj = {}
  keyArr.forEach(e => {
    arrObj[e] = []
  })
  paramsData.forEach(val => {
    keyArr.forEach(e => {
      if (val[e] != undefined) {
        arrObj[e].push(val[e])
      }
    })
  })
  for (var key in arrObj) {
    returnData[key] = arrObj[key].join(symbol)
  }
  return returnData
}

// 自定义时间选择，一般用于筛选的月份选择
export const monthPackaging = (status, day = 30) => {
  const end = new Date()
  const start = new Date()
  let obj = {
    0: start.setTime(start.getTime() - 3600 * 1000 * 24 * day),
    1: end.setTime(end.getTime() + 3600 * 1000 * 24 * day)
  }
  obj[status]
  return [start, end]
}

// 数据批量导出 post

/* params = {
     url:'url',
     obj:{ids: this.idsStr},
     fileName: '会员管理列表'
   }
   batchPostExport(params)
*/
export const batchPostExport = (params, suffix = 'xlsx') => {
  axios.post(params.url, params.obj, {
    responseType: 'blob'
  })
    .then(res => {
      var blob = new Blob([res.data]) // 指定格式为vnd.ms-excel
      var downloadElement = document.createElement('a')
      var href = window.URL.createObjectURL(blob) // 创建下载的链接
      downloadElement.href = href
      downloadElement.download = `${params.fileName}.${suffix}` // 下载后文件名
      document.body.appendChild(downloadElement)
      downloadElement.click() // 点击下载
      document.body.removeChild(downloadElement) // 下载完成移除元素
      window.URL.revokeObjectURL(href) // 释放掉blob对象
    })
}

// 金额千位符转换
// 转换数据只有一个值的，status=1代表是带两位小数点，其它即是不带小数点
export const KilobitTransition = (level, status = '1') => {
  if (level != undefined && level != null) {
    let A = status == '1' ? Number(level).toFixed(2) : Number(level)
    return '￥' + (status == '1' ? (A || 0).toString().replace(/(\d{1,3})(?=(\d{3})+\.)/g, '$1,') : (A || 0).toString().replace(/(\d{1,3})(?=(\d{3}))/g, '$1,'))
  } else {
    return '￥' + (status == '1' ? '0.00' : '0')
  }
}
// 转换数据中有多个值的，如1000,2000
export const multiKilobitTransition = level => {
  if (level != undefined && level != null) {
    var arr = level.split(',')
    var arrStr = ''
    arr.forEach(val => {
      arrStr +=
        '￥' +
        (Number(val).toFixed(2) || 0)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+\.)/g, '$1,') +
        ','
    })
    return arrStr.slice(0, arrStr.length - 1)
  } else {
    return '￥' + '0.00'
  }
}

// 信息脱敏
export const InfoDesensitization = level => {
  let data = level.toString()
  // 身份证
  let A = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/
  let B = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/
  // 手机号码
  let C = /^1[34578]\d{9}$/
  // 银行卡号
  let D = /^([1-9]{1})(\d{14}|\d{18})$/
  if (C.test(data)) {
    return data.replace(/(\d{3})\d*(\d{4})/, '$1****$2')
  } else if (A.test(data) || B.test(data) || D.test(data)) {
    return data.replace(/(\d{4})\d*(\d{4})/, '$1*********$2')
  }
}
