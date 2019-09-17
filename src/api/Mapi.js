export function TMap () {
  return new Promise(function (resolve, reject) {
    window.init = function () {
      resolve(window.qq)
    }
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://map.qq.com/api/js?v=2.exp&callback=init&key=7VIBZ-NUQK3-JIX33-YYSXO-DZLLO-BYBI2'
    script.onerror = reject
    document.head.appendChild(script)
  })
}
