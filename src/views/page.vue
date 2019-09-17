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
