＃VUE table表格+分页</br>
在日常开发中，需要大量用到table组件，所以闲时就整合下</br>

本组件集成了下列</br></br>
＃组件控制参数：</br>
borderParams: {</br>
  operationStatus: true, // 是否显示操作列</br>
  border: false, // 表格是否显示边框</br>
  selection: true, // 多选 如果highlightCurrentRow为true,selection必为false</br>
  stripe: false, // 是否显示斑马线</br>
  highlightCurrentRow: false, // 单选 如果selection为true,highlightCurrentRow必为false</br>
  maxHeight: 'auto', // 设置最大高度</br>
  showSummary: false, // 是否合计</br>
  spanMethod: null, // 行合并还是列合并</br>
  index: false, // 是否显示序号</br>
  emptyText: '暂无数据', // 如数据为空的提示语</br>
  sortable: true, // 是否需要行拖拽</br>
  isPage: true // 是否显示分页组件 默认为false</br>
  isDefaultCheckAll: true // 是否默认全选所有数据</br>
}</br>
</br>
＃分页参数：</br>
  page: {</br>
     url: '/api/prsBuckle/showBalanceDetails', // 列表请求接口 必填 </br>
     currentPage: 1, // 当前页 必填</br>
     pageSizes: [10, 20, 30, 40, 50, 100], // 页显示个数选择器 必填</br>
     pageSize: 10, // 页显示个数 必填</br>
     pageInfo: {}, // 分页传参 必填 初始值可为{}</br>
     background: true // 是否带有背景色的分页 默认false</br>
     layout:"total, sizes, prev, pager, next, jumper" //默认为全部</br>
  }</br>
</br>

＃表头参数</br>
  1、title标题名  必填</br>
  2、value字段名  必填</br>
  3、width单元格宽度 '180'</br>
  4、align对齐方式[left,center,right] 默认center</br>
  5、fixed固定表格[left,center,right]</br>
  6、sortable是否排序[true, false, 'custom'] custom为后台排序</br>
  7、filters列条件查询   [{ text: '名称', value: '值' }] 值会对应表头的value</br>
  8、transitions 数据转换   [{ key: '100', value: '一百' }]</br>
    注：等同于使用管道过滤 如 if(params == '100') reutn '一百' else '无数据'</br>

npm install -g</br>
npm run serve</br>
