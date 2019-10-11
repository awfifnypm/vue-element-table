import tableCmp from '@/views/Table.vue'
const Table = {
  install: function (Vue) {
    Vue.component('v-table', tableCmp)
  }
}
export default Table
