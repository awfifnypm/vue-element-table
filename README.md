# VUE table表格+分页

## 描述

在日常开发中，需要大量用到table组件，所以闲时就整合下

**本组件集成了下列:**

组件控制参数：

```json
borderParams: {
  operationStatus: true, // 是否显示操作列
  border: false, // 表格是否显示边框
  selection: true, // 多选 如果highlightCurrentRow为true,selection必为false
  stripe: false, // 是否显示斑马线
  highlightCurrentRow: false, // 单选 如果selection为true,highlightCurrentRow必为false
  maxHeight: 'auto', // 设置最大高度
  showSummary: false, // 是否合计
  spanMethod: null, // 行合并还是列合并
  index: false, // 是否显示序号
  emptyText: '暂无数据', // 如数据为空的提示语
  sortable: true, // 是否需要行拖拽
  isPage: true // 是否显示分页组件 默认为false
  isDefaultCheckAll: true // 是否默认全选所有数据
}
```

分页参数：

```json
  page: {
     url: '/api/prsBuckle/showBalanceDetails', // 列表请求接口 必填 
     currentPage: 1, // 当前页 必填
     pageSizes: [10, 20, 30, 40, 50, 100], // 页显示个数选择器 必填
     pageSize: 10, // 页显示个数 必填
     pageInfo: {}, // 分页传参 必填 初始值可为{}
     background: true // 是否带有背景色的分页 默认false
     layout:"total, sizes, prev, pager, next, jumper" //默认为全部
  }
```

表头参数：

| 名称        | 描述                                                         | 是否必填   |
| ----------- | ------------------------------------------------------------ | ---------- |
| title       | 标题名                                                       | 必填       |
| value       | 字段名                                                       | 必填       |
| align       | 对齐方式[left,center,right]                                  | 默认center |
| fixed       | 固定表格                                                     | 否         |
| sortable    | 是否排序[true, false, 'custom'] custom为后台排序             | 否         |
| filters     | 列条件查询   [{ text: '名称', value: '值' }] 值要对应表头value | 否         |
| transitions | 数据转换   [{ key: '100', value: '一百' }]                   | 否         |
| width       | 单元格宽度 '180'                                             | 否         |


    注：等同于使用管道过滤 如 if(params == '100') reutn '一百' else '无数据'



## How to start?

```
#安装包
npm install

#启动项目
npm run serve
```





