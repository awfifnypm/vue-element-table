<template>
    <div class="dbTable">
        <el-table :data="dbtableData" style="width: 100%"
        :border="borderParams.border || false"
        @selection-change="dbTableSelectionChange"
        :row-class-name="tableRowClassName"
        :max-height="borderParams.maxHeight || 'auto'"
        :stripe="borderParams.stripe || false"
        :show-summary="borderParams.showSummary || false"
        :span-method="borderParams.spanMethod == 'row'?rowMethos: borderParams.spanMethod == 'column'?columnMethos:null"
        :empty-text="borderParams.emptyText || '暂无数据'"
        :row-key="borderParams.rowKey"
        :default-sort = "{prop: 'index', order: 'ascending'}"
        >
            <el-table-column
            type="selection"
            width="55"
            align="center"
            v-if="borderParams.selection || false"
            >
            </el-table-column>
            <el-table-column
            align="center"
            v-if="borderParams.index || false"
            type="index">
            </el-table-column>
                <el-table-column
                v-for="(item,index) in (tableTitle || [])"
                        :key="index + 1001"
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
                              {{item.transitions && utility.transitionFunction(scope.row[item.value],item.transitions) || scope.row[item.value]}}
                        </template>
                </el-table-column>
            <el-table-column v-if="borderParams.operationStatus || false" label="操作" align="center" fixed="right" min-width="100">
                <template slot-scope="scope">
                    <el-button @click.native="delFuc(scope.row,scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-button @click="getingData" class="getingBtn">数据提交</el-button>
    </div>
</template>

<script>
// import itemChildren from '@/views/tableChildren.vue'
import Sortable from 'sortablejs'
export default {
  components: { itemChildren: resolve => { require(['@/views/tableChildren.vue'], resolve) }
  },
  data () {
    return {
      dbtableData: [],
      dbTableSelectionData: [],
      lastCheckData: [] // 记录上一次勾选中的数据
    }
  },
  props: {
    selectionData: Array,
    tableData: Array,
    tableTitle: Array,
    borderParams: {
      type: Object,
      default: () => { return {} }
    }
  },
  created () {
    if (sessionStorage.getItem('dbtableData')) {
      this.dbtableData = JSON.parse(sessionStorage.getItem('dbtableData'))
    }
  },
  watch: {
    selectionData (val) {
      console.log(val, 'val')
      // 判断上一次勾选中的数据是不是为空，如果就把dbtableData数据作为上一次选中的数据
      this.lastCheckData = Object.freeze(this.lastCheckData.length === 0 ? JSON.parse(JSON.stringify(this.dbtableData)) : this.lastCheckData)
      let tableData = JSON.parse(JSON.stringify(this.tableData))
      let selectionData = JSON.parse(JSON.stringify(this.selectionData))

      var status = false
      // 如果勾选中的数据长度大于0即代表有勾选项
      if (selectionData.length > 0) {
        // 第一步，取到tableData数据和本次勾选中的数据对比，不选中项
        tableData.forEach((item, index) => {
          selectionData.forEach(items => {
            if (item.id === items.id) {
              tableData.splice(index, 1)
              index--
            }
          })
        })
      } else {
        // 否则把tableData当成上一次勾选的，即是全部没勾选
        this.lastCheckData = Object.freeze(JSON.parse(JSON.stringify(this.tableData)))
        status = true
      }
      // 第二步，如果是全部都无勾选，即把dbtableData与lastCheckData中对应的全部清空
      if (status) {
        this.lastCheckData.forEach((item) => {
          this.dbtableData.forEach((el, index) => {
            if (item.id === el.id) {
              this.dbtableData.splice(index, 1)
              index--
            }
          })
        })
      } else {
        // 如果有勾选项的，就把dbtableData与刚才得到的没有勾选项对应，并移除
        // 移除原来已有，但勾选数据中没有的项
        tableData.forEach((item) => {
          this.dbtableData.forEach((el, index) => {
            if (item.id === el.id) {
              this.dbtableData.splice(index, 1)
              index--
            }
          })
        })
      }

      // 移除当前拥有的ID项，然后下一步重新合并
      // 移除原来已有，勾选数据中也有的项
      this.selectionData.forEach(vals => {
        this.dbtableData.forEach((el, idx) => {
          if (vals.id === el.id) {
            this.dbtableData.splice(idx, 1)
            idx--
          }
        })
      })

      // 最终数据合并，得到最终数据
      this.dbtableData = this.dbtableData.concat(this.selectionData)
      sessionStorage.setItem('dbtableData', JSON.stringify(this.dbtableData))
      // 记录本次勾选中的数据
      this.lastCheckData = [...val]
    },
    dbtableData (v) {
      if (this.borderParams.spanMethod || false) {
        this.parentIdArr = [] // 这个清空用于有增删改的列表，如果不清空，在操作后，界面会乱
        this.dbtableData.forEach((item, index) => {
          if (index === 0) {
            this.parentIdArr.push(1)
            this.position = 0
            item.sequence = index + 1// 设置序号
          } else {
            if (this.dbtableData[index].id === this.dbtableData[index - 1].id) {
              this.parentIdArr[this.position] += 1// 连续有几行项目名名称相同
              this.parentIdArr.push(0) // 名称相同后往数组里面加一项0
              // 当项目名称相同时，设置当前序号和前一个相同
              this.dbtableData[index].sequence = this.dbtableData[index - 1].sequence
            } else {
              this.parentIdArr.push(1)
              this.position = index
              // 当项目名称不同时，将当前序号设置为前一个序号+1
              this.dbtableData[index].sequence = this.dbtableData[index - 1].sequence + 1
            }
          }
        })
      }
      if (this.borderParams.RowDrag || false) {
        this.rowDrop() // 用于拖拽排序进来时加载
      }
    }
  },
  methods: {
    // 删除
    delFuc (row, index) {
      this.dbtableData.splice(index, 1)
      sessionStorage.setItem('dbtableData', JSON.stringify(this.dbtableData))
      this.$emit('dbEventAll', { data: row, key: 'deletedRow' })
    },
    // 数据提交
    getingData () {
      this.$emit('dbEventAll', { data: { selection: this.dbTableSelectionData, dbtableData: this.dbtableData }, key: 'getingData' })
    },
    // 行拖拽
    rowDrop () {
      const tbody = document.querySelector('.dbTable .el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd ({ newIndex, oldIndex }) {
          const currRow = _this.dbtableData.splice(oldIndex, 1)[0]
          _this.dbtableData.splice(newIndex, 0, currRow)
        }
      })
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
    dbTableSelectionChange (arr) {
      this.$emit('dbEventAll', { data: arr, key: 'selection' })
      this.tableRowClassName(arr)
      this.dbTableSelectionData = arr
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
.dbTable .getingBtn{
  margin-top:10px !important;
  width:100% !important;
  background-color:#f5f7fa !important
}
</style>
