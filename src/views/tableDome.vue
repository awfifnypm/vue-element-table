<template>
    <div>
       <Table v-bind="tables" @eventAll="tableEvent">
           <!-- v-slot:money => 把money改成对应的表头字段即可获取对应的插糟 -->
           <template v-slot:money="row">
                {{row.money | moneyR}}
           </template>
           <!-- 下面为操作列 operationStatus为true使用 -->
           <template v-slot:operation="row">
                <el-button @click.native="delFuc(row)">删除</el-button>
                <el-button @click.native="delFuc(row)">修改</el-button>
           </template>
       </Table>
    </div>
</template>

<script>
import Table from '@/views/Table.vue'
import { utility } from '@/views/defineApi.js'
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
          index: true, // 是否显示序号
          emptyText: '暂无数据', // 如数据为空的提示语
          sortable: true, // 是否需要行拖拽  注：开启行拖拽后 留意下table的row-key="id"属性，值需要是唯一的，建议ID
          isPage: true // 默认为false
        },
        // 分页参数 除必填项以后，其它可不写
        page: {
          url: 'http://172.103.3.1:10006/provide-web/api/prsBuckle/showBalanceDetails', // 必填
          currentPage: 1, // 当前页 必填
          pageSizes: [10, 20, 30, 40, 50, 100], // 个数选择器 必填
          pageSize: 10, // 显示个数 必填
          pageInfo: {}, // 分页传参 必填 初始值可为{}
          background: true // 是否带有背景色的分页 默认false
          // layout:"total, sizes, prev, pager, next, jumper" //默认为全部
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
          id: 1,
          memberName: '彭一姐',
          memberNumber: '00001',
          money: '100'
        },
        {
          id: 2,
          memberName: '王二姐',
          memberNumber: '00002',
          money: '200'
        },
        {
          id: 3,
          memberName: '李小小',
          memberNumber: '00003',
          money: '300'
        },
        {
          id: 4,
          memberName: '孙二哥',
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
    init (res) {
      if (res.data.code == 200) {
        this.tables.tableData = res.data.data
      } else {
        this.tables.tableData = this.tableDatas
      }
    },
    tableEvent (eventSource) {
      switch (eventSource.key) {
        case 'selection': // 多选
          // console.log(checkAll(eventSource.data, ['memberNumber']))
          console.log(utility.checkAll(eventSource.data, ['memberNumber']))
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
