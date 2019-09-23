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
        ref="multipleTable"
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
            <slot v-for="(item,index) in (tableTitle || [])" :name="item.value" v-bind="item">
                <el-table-column
                        :key="index + 2"
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
                               <!-- 备用，如果调用时没有使用插槽，默认使用的数据 -->
                              {{item.transitions && utility.transitionFunction(scope.row[item.value],item.transitions) || scope.row[item.value]}}
                        </template>
                </el-table-column>
            </slot>
            <el-table-column v-if="borderParams.operationStatus || false" label="操作" align="center" fixed="right" min-width="200">
                <template slot-scope="scope">
                    <slot name="operation" v-bind="scope"></slot>
                </template>
            </el-table-column>
        </el-table>
        <page v-if="borderParams.isPage || false" v-bind="page" @initData="init"></page>
        <dbTable v-bind="{selectionData,borderParams,tableTitle,tableData}" @dbEventAll="dbEventFunction"></dbTable>
    </div>
</template>

<script>
import itemChildren from '@/views/tableChildren.vue'
import dbTable from '@/views/dbTable.vue'
import page from '@/views/page.vue'
import Sortable from 'sortablejs' // 这个用于拖拽表格排序
// 首先需要安装Sortable.js      npm install sortablejs --save
// 然后引用  import Sortable from 'sortablejs'
// 需要注意的是element table务必指定row-key，row-key必须是唯一的，如ID，不然会出现排序不对的情况。
export default {
  components: { itemChildren, page, dbTable },
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
      position: 0,
      defaultCheckAllOnce: true,
      dbTableCheckData: []
    }
  },
  watch: {
    tableData (v) {
      // 获取dbTable页数据
      this.dbTableCheckData = Object.freeze(JSON.parse(sessionStorage.getItem('dbtableData')))
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
      if (this.borderParams.RowDrag || false) {
        this.rowDrop() // 用于拖拽排序进来时加载
      }
      if ((this.borderParams.isDefaultCheckAll || false) && this.defaultCheckAllOnce) {
        this.$nextTick(() => {
          this.pageData.forEach(item => {
            this.$refs.multipleTable.toggleRowSelection(item)
          })
          // 只默认全选一次
          this.defaultCheckAllOnce = false
        })
      } else {
        this.$nextTick(() => {
          this.dbTableCheckData.forEach(item => {
            this.pageData.forEach(items => {
              if (item.id === items.id) {
                this.$refs.multipleTable.toggleRowSelection(items)
              }
            })
          })
        })
      }
    }
  },
  methods: {
    // dbTable回调事件
    dbEventFunction (eventSource) {
      switch (eventSource.key) {
        case 'selection': // dbTable多选
          this.$emit('eventAll', { data: eventSource.data, key: 'dbTableSelection' })
          break
        case 'getingData': // dbTable数据获取
          this.$emit('eventAll', { data: eventSource.data, key: 'getingData' })
          break
        case 'deletedRow': // 删除回调
          let data = eventSource.data
          let selectionData = JSON.parse(JSON.stringify(this.selectionData))
          // 取table的勾选数据和删除的数据对比，然后得出去掉删除后的勾选数据
          selectionData.forEach((item, index) => {
            if (item.id === data.id) {
              selectionData.splice(index, 1)
            }
          })
          // 由于elementUI没有去掉单个勾选，所以在操作前，先把所有勾选去掉，然后下面再对比勾选回来
          this.$refs.multipleTable.clearSelection()
          this.$nextTick(() => {
            this.pageData.forEach(item => {
              selectionData.forEach(items => {
                if (item.id === items.id) {
                  this.$refs.multipleTable.toggleRowSelection(item)
                }
              })
            })
          })
      }
    },
    init (v) {
      this.$emit('eventAll', { data: v, key: 'init' })
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
    // 行合并
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
    // 物理筛选 //可用接口筛选
    filterBtn (value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    // 多选
    handleSelectionChange (arr) {
      this.$emit('eventAll', { data: arr, key: 'selection' })
      this.tableRowClassName(arr)
      this.selectionData = arr
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
