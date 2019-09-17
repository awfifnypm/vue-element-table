＃VUE table表格+分页</br>
在日常开发中，需要大量用到table组件，所以闲时就整合下</br>

本组件集成了下列东西</br>
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
</br>
列条件查询</br>
列-本地或后端排序</br>

npm install -g</br>
npm run serve</br>
