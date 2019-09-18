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
                      {{item.transitions && utility.transitionFunction(scope.row[item.value],item.transitions) || scope.row[item.value]}}
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
    this.childrenData.unshift(this.childrenData.pop())
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
