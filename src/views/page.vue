<template>
    <!-- 分页信息 -->
    <div class="block" style="margin:10px 0; float:right">
      <el-pagination class="paging" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNumV" :page-sizes="pageSizes" :page-size="pageSize" :layout="$attrs.layout || 'total, sizes, prev, pager, next, jumper'" :total="total"
      :background="$attrs.background || false"
      >
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
  inheritAttrs: false,
  props: ['url', 'currentPage', 'pageSizes', 'pageSize', 'pageInfo', 'method'],
  created () {
    if (this.url) {
      this.pageURL = this.url
      this.init()
    }
  },
  data () {
    return {
      total: null,
      pageSizeV: null || this.pageSize,
      pageNumV: null || this.currentPage,
      pageURL: ''
    }
  },
  watch: {
    pageInfo () {
      this.pageNumV = 1 // 此处设置为1，只要解决list有筛选功能时，当页码为2时，你筛选的条件结果只有一页，出现的空白列表的BUG
      this.init()
    },
    url () {
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
    init () {
      let obj = Object.assign({ pageNum: this.pageNumV, pageSize: this.pageSizeV }, this.pageInfo)
      this.axios({
        method: this.method || 'get',
        url: this.pageURL,
        data: obj
      })
        .then(res => {
          this.$emit('initData', { res })
        })
    }
  }
}
</script>

<style scoped>
</style>
