＃VUE table表格+分页
在日常开发中，需要大量用到table组件，所以闲时就整合下

＃tableDome
<template>
    <div>
       <Table v-bind="tables" @eventAll="tableEvent">
           <template v-slot:money="row">
                {{row.money | moneyR}}
           </template>
           <template v-slot:operation="row">
                <el-button @click.native="delFuc(row)">删除</el-button>
                <el-button @click.native="delFuc(row)">修改</el-button>
           </template>
       </Table>
    </div>
</template>

<script>
import Table from '@/views/Table.vue'
export default {
  components: { Table },
  data () {
    return {
      tables: {
        // 表格参数，不需要可以直接不写,默认为false或null,需要建borderParams空对象
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
          isPage: true // 默认为false
        },
        // 分页参数
        page: {
          url: 'http://localhost:8080/api/prsBuckle/showBalanceDetails',
          currentPage: 1, // 当前页
          pageSizes: [10, 20, 30, 40, 50, 100], // 个数选择器
          pageSize: 10, // 显示个数
          pageInfo: {
          }
        },
        // 表头对象参数
        // title标题名
        // value字段名
        // width单元格宽度 '180'
        // align对齐方式[left,center,right] 默认center
        // fixed固定表格[left,center,right]
        // sortable是否排序[true, false, 'custom'] custom为后台排序
        // filters列条件查询   [{ text: '名称', value: '值' }] 值会对应表头的value

        tableTitle: [
          {
            title: '会员管理',
            align: 'center',
            children: [
              {
                title: '会员姓名',
                value: 'memberName',
                width: '180'
              },
              {
                title: '会员编号',
                value: 'memberNumber',
                width: '180',
                children: [
                  {
                    title: '会员姓名',
                    value: 'memberName',
                    width: '180'
                  },
                  {
                    title: '会员编号',
                    value: 'memberNumber',
                    width: '180'
                  },
                  {
                    title: '金额',
                    value: 'money',
                    width: '180',
                    sortable: 'custom',
                    filters: [{ text: '金额100', value: '100' }, { text: '金额200', value: '200' }]
                  }
                ]
              },
              {
                title: '金额',
                value: 'money',
                width: '180',
                sortable: 'custom',
                filters: [{ text: '金额100', value: '100' }, { text: '金额200', value: '200' }]
              }
            ]
          },
          {
            title: '会员姓名',
            value: 'memberName',
            width: '180',
            align: 'center'
            // fixed: 'left'
          },
          {
            title: '会员编号',
            value: 'memberNumber',
            width: '180',
            align: 'center',
            sortable: 'custom'
          },
          {
            title: '金额',
            value: 'money',
            width: '180',
            align: 'center',
            sortable: true,
            filters: [{ text: '金额100', value: '100' }, { text: '金额200', value: '200' }]
          }
        ],
        tableData: []
      },
      tableDatas: [
        {
          memberName: '彭宇平',
          memberNumber: '00001',
          money: '100'
        },
        {
          memberName: '王小升',
          memberNumber: '00002',
          money: '200'
        },
        {
          memberName: '李晓玲',
          memberNumber: '00003',
          money: '300'
        },
        {
          memberName: '冼妙腾',
          memberNumber: '00004',
          money: '400'
        }
      ]
    }
  },
  methods: {
    delFuc (row) {
      console.log(row)
    },
    // 数据初始化
    init (obj) {
      this.tables.tableData = this.tableDatas
      // this.tables.tableData = obj
    },
    tableEvent (eventSource) {
      switch (eventSource.key) {
        case 'selection': // 多选
          console.log(eventSource.data)
          break
        case 'radioButton':// 单选
          console.log(eventSource.data)
          break
        case 'sort':// 拖拽
          console.log(eventSource.data)
          break
        case 'custom':// 后台排序
          console.log(eventSource.data)
          break
        case 'init':// 数据初始化
          this.init(eventSource.data)
          break
      }
    }
  },
  filters: {
    moneyR (v) {
      switch (v) {
        case '100':
          return '一百'
          break
        case '200':
          return '二百'
          break
        case '300':
          return '三百'
          break
        case '400':
          return '四百'
          break
        default:
          return '五百'
          break
      }
    }
  }
}
</script>

<style>

</style>


＃Table
<template>
    <div class="tableCom">
        <el-table :data="pageData" style="width: 100%"
        :border="borderParams.border || false"
        @selection-change="handleSelectionChange"
        :max-height="borderParams.maxHeight || 'auto'"
        :stripe="borderParams.stripe || false"
        :row-class-name="tableRowClassName"
        :highlight-current-row="borderParams.highlightCurrentRow || false"
        @current-change="handleCurrentChange"
        :show-summary="borderParams.showSummary || false"
        ref="table"
        :span-method="borderParams.spanMethod == 'row'?rowMethos: borderParams.spanMethod == 'column'?columnMethos:null"
        :empty-text="borderParams.emptyText || '暂无数据'"
        row-key="id"
        :default-sort = "{prop: 'index', order: 'ascending'}"
        @sort-change="sortChange"
        >
            <el-table-column
            type="selection"
            width="55"
            align="center"
            v-if="borderParams.selection || false"
            key="1"
            >
            </el-table-column>
            <el-table-column
            align="center"
            v-if="borderParams.index || false"
            type="index">
            </el-table-column>
            <template>
                <el-table-column
                        v-for="(item,index) in (tableTitle || [])" :key="index + 2"
                        :prop="item.value || null"
                        :label="item.title || null"
                        :width="item.width || null"
                        :align="item.align || 'center'"
                        :fixed="item.fixed || null"
                        :sortable="item.sortable || false"
                        :filters="item.filters"
                        :filter-method="item.filters?filterBtn:null">
                        <itemChildren v-if="item.children"  :children="item.children"></itemChildren>
                        <template slot-scope="scope">
                            <slot v-bind="scope.row" :name="item.value">{{scope.row[item.value]}}</slot>
                        </template>
                </el-table-column>
            </template>
            <el-table-column v-if="borderParams.operationStatus || false" label="操作" align="center" fixed="right" min-width="200">
                <template slot-scope="scope">
                    <slot name="operation" v-bind="scope.row"></slot>
                </template>
            </el-table-column>
        </el-table>
        <page v-if="borderParams.isPage || false" v-bind="page" @initData="init"></page>
    </div>
</template>

<script>
import itemChildren from '@/views/tableChildren.vue'
import page from '@/views/page.vue'
import Sortable from 'sortablejs' // 这个用于拖拽表格排序
// 首先需要安装Sortable.js      npm install sortablejs --save
// 然后引用  import Sortable from 'sortablejs'
// 需要注意的是element table务必指定row-key，row-key必须是唯一的，如ID，不然会出现排序不对的情况。
export default {
  components: { itemChildren, page },
  props: {
    tableData: Array,
    tableTitle: Array,
    borderParams: {
      type: Object,
      default: () => { return {} }
    },
    page: {
      type: Object,
      default: () => { return {} }
    }
  },
  data () {
    return {
      selectionData: [],
      pageData: [],
      parentIdArr: [],
      position: 0
    }
  },
  watch: {
    tableData (v) {
    //   这里需要使用深拷贝，要不拖拽后，数据一直覆盖
      this.pageData = JSON.parse(JSON.stringify(this.tableData))
      if (this.borderParams.spanMethod || false) {
        this.parentIdArr = [] // 这个清空用于有增删改的列表，如果不清空，在操作后，界面会乱
        this.pageData.forEach((item, index) => {
          if (index === 0) {
            this.parentIdArr.push(1)
            this.position = 0
            item.sequence = index + 1// 设置序号
          } else {
            if (this.pageData[index].id === this.pageData[index - 1].id) {
              this.parentIdArr[this.position] += 1// 连续有几行项目名名称相同
              this.parentIdArr.push(0) // 名称相同后往数组里面加一项0
              // 当项目名称相同时，设置当前序号和前一个相同
              this.pageData[index].sequence = this.pageData[index - 1].sequence
            } else {
              this.parentIdArr.push(1)
              this.position = index
              // 当项目名称不同时，将当前序号设置为前一个序号+1
              this.pageData[index].sequence = this.pageData[index - 1].sequence + 1
            }
          }
        })
      }
      if (this.borderParams.sortable || false) {
        this.rowDrop() // 用于拖拽排序进来时加载
      }
    }
  },
  methods: {
    init (v) {
      if (v.data.code == 200) {
        this.$emit('eventAll', { data: v.data.data, key: 'init' })
      }
    },
    // 排序点击后返回参数
    sortChange (v) {
      if (v.column.sortable === 'custom') {
        this.$emit('eventAll', { data: v, key: 'custom' })
      }
    },
    // 行拖拽
    rowDrop () {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd ({ newIndex, oldIndex }) {
          const currRow = _this.pageData.splice(oldIndex, 1)[0]
          _this.pageData.splice(newIndex, 0, currRow)
          _this.changeTableSort({ newIndex, oldIndex }, _this.pageData)
        }
      })
    },
    changeTableSort (v, d) {
      this.$emit('eventAll', {
        data: {
          index: v,
          data: d
        },
        key: 'sort' })
    },
    //   行合并
    rowMethos ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return [1, 2] // 一行 合并 三列
      } else if (columnIndex === 1) {
        return [0, 0]
      }
    },
    // 列合并
    columnMethos ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) { // 序号列也进行合并(第一列)
        // this.parentIdArr这个数组里面存的是table里面连续的有几条数据相同
        // 例如:[1,1,2,0,2,0]
        // 1 代表的没有连续的相同的
        // 2 代表连续的两个相同
        // 0 代表是和上一条内容相同
        const _row = this.parentIdArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row, // 行  需要合并的行数
          colspan: _col // 列    需要合并的列数  当此处是0时，就不再合并，因为上面的逻辑写了，如果当前和上一条内容相同的话，在上一行就+1了，就已经把当前这行合并了，所以后面这行就不需要再合并了
        }
      }
    },
    //   物理筛选
    filterBtn (value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    //   多选
    handleSelectionChange (row) {
      this.$emit('eventAll', { data: row, key: 'selection' })
      this.tableRowClassName(row)
      this.selectionData = row
    },
    // 单选
    handleCurrentChange (val) {
      if (this.borderParams.highlightCurrentRow) {
        this.$emit('eventAll', { data: val, key: 'radioButton' })
      }
    },
    // 多选勾选后当前背景高亮
    tableRowClassName ({ row, rowIndex }) {
      let color = ''
      this.selectionData.forEach((item, i) => {
        if (item === row) {
          color = 'warning-row'
        }
      })
      return color
    }
  }
}
</script>

<style>
.tableCom .el-table .warning-row {
      background-color: #f7e6ea !important;
}
.tableCom .el-table th.gutter{
          display: table-cell!important;
}
</style>

＃itemChildren
<template>
    <div>
        <el-table-column
                v-for="(item,index) in (childrenData)"
                :key="index+1"
                :prop="item.value || null"
                :label="item.title || null"
                :width="item.width || null"
                :align="item.align || 'center'"
                :fixed="item.fixed || null"
                :sortable="item.sortable || false"
                :filters="item.filters"
                :filter-method="item.filters?filterBtn:null"
                >
                <itemChildren :children="item.children"  v-if="item.children"></itemChildren>
                <template slot-scope="scope">
                      <slot v-bind="scope.row" :name="item.value">{{scope.row[item.value]}}</slot>
                </template>
        </el-table-column>
    </div>
</template>

<script>
export default {
  name: 'itemChildren',
  props: ['children'],
  data () {
    return {
      childrenData: []
    }
  },
  created () {
    this.childrenData = this.children
    // 由于v-for出现小BUG，二维数组遍历会出现第一项永远跑到最后面，所以这里使用把第一项放到前面，并删掉最后一项
    this.childrenData.unshift(this.childrenData[this.childrenData.length - 1])
    this.childrenData.splice(this.childrenData.length - 1, 1)
  },
  methods: {
    //   物理筛选
    filterBtn (value, row, column) {
      const property = column['property']
      return row[property] === value
    }
  }
}
</script>

#page
<template>
    <!-- 分页信息 -->
    <div class="block" style="margin:10px 0; float:right">
      <el-pagination class="paging" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNumV" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- <div></div> -->
    <!-- page-sizes 每页显示个数选择器 -->
    <!-- page-size 每页个数 -->
    <!-- current-page 当前页数 -->
    <!-- 分页信息 -->
</template>

<script>
export default {
  props: ['url', 'currentPage', 'pageSizes', 'pageSize', 'pageInfo'],
  created () {
    if (this.url) {
      this.pageURL = this.url
    }
    if (this.pageInfo) {
      this.pageInfos = this.pageInfo
    }
    this.init()
  },
  data () {
    return {
      total: null,
      pageSizeV: null || this.pageSize,
      pageNumV: null || this.currentPage,
      pageInfos: {},
      pageURL: ''
    }
  },
  watch: {
    pageInfo () {
      this.pageInfos = this.pageInfo
      this.pageNumV = 1
      this.init()
    },
    requestUrl () {
      this.pageURL = this.url
      this.init()
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageSizeV = val
      this.init()
    },
    handleCurrentChange (val) {
      this.pageNumV = val
      this.init()
    },
    async init () {
      let obj = Object.assign({ pageNum: this.pageNumV, pageSize: this.pageSizeV }, this.pageInfos)
      let res = await this.axios.post(this.pageURL, obj)
      if (res.data.code == 200) {
        this.total = res.data.totalShow
      }
      this.$emit('initData', res)
    }
  }
}
</script>

<style scoped>
</style>
