<template>
    <div>
       <Table v-bind="tables" @eventAll="tableEvent">
           <!-- #money => 把money改成对应的表头字段即可获取对应的插糟 -->
           <!-- 注:目前只可能获取一级表头插槽，如果对二级以上表头数据，请参照下面例子 -->

           <!-- 一级表头获取插槽使用方法 -->
           <!-- <template #money>
                <el-table-column
                label="余额slot"
                prop = "money"
                align = "right"
                width = "180"
                >
                </el-table-column>
           </template> -->

           <!-- 二级表头获取插槽使用方法，多级以此类推 -->
           <template #yanshi>
             <!--
               此处设置el-table-column会覆盖table组件里默认el-table-column，
               el-table-column操作比el-table官方组件最外层多了一个template
              -->
                <el-table-column
                label="自定义列一演示"
                align = "center"
                width = "180"
                >
                    <!--
                      如果下级数量过多，但又需要在页面操作，此处支持v-for遍历
                      一、template处改为 <template #yanshi="row">
                      二、使用row.children数据源遍历
                      三、通过索引找到要操作项，进行逻辑操作 可使用v-if v-else或其它
                     -->
                    <el-table-column
                    label="自定义列一"
                    prop = "column1"
                    align = "center"
                    width = "180"
                    >
                        <template slot-scope="scope">
                             {{scope.row.column1 + ' Hello'}}
                        </template>
                    </el-table-column>

                    <el-table-column
                    label="自定义列二"
                    prop = "column2"
                    align = "left"
                    width = "180"
                    >
                    </el-table-column>
                </el-table-column>
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
        /* 表头对象参数
           1、title标题名
           2、value字段名
           3、width单元格宽度 '180'
           4、align对齐方式[left,center,right] 默认center
           5、fixed固定表格[left,center,right]
           6、sortable是否排序[true, false, 'custom'] custom为后台排序
           7、filters列条件查询   [{ text: '名称', value: '值' }] 值会对应表头的value
           8、transitions 数据转换   [{ key: '100', value: '一百' }]
                注：等同于使用管道过滤 如 if(params == '100') reutn '一百' else '无数据'
        */
        tableTitle: [
          {
            title: '演示二级插槽',
            align: 'center',
            value: 'yanshi',
            children: [
              {
                title: '列一',
                value: 'column1',
                width: '180'
              },
              {
                title: '列二',
                value: 'column2',
                width: '180'
              }
            ]
          },
          {
            title: '会员管理',
            align: 'center',
            value: 'memberManage',
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
                    filters: [{ text: '金额100', value: '100' }, { text: '金额200', value: '200' }],
                    transitions: [
                      { key: '100', value: '一百' },
                      { key: '200', value: '二百' },
                      { key: '300', value: '三百' },
                      { key: '400', value: '四百' },
                      { key: '500', value: '五百' }
                    ]
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
            filters: [{ text: '金额100', value: '100' }, { text: '金额200', value: '200' }],
            transitions: [
              { key: '100', value: '一百' },
              { key: '200', value: '二百' },
              { key: '300', value: '三百' },
              { key: '400', value: '四百' },
              { key: '500', value: '五百' }
            ]
          }
        ],
        tableData: []
      },
      tableDatas: [
        {
          id: 1,
          memberName: '彭一姐',
          column1: '列一v1',
          column2: '列二v1',
          memberNumber: '00001',
          money: '100'
        },
        {
          id: 2,
          memberName: '王二姐',
          column1: '列一v2',
          column2: '列二v2',
          memberNumber: '00002',
          money: '200'
        },
        {
          id: 3,
          memberName: '李小小',
          column1: '列一v3',
          column2: '列二v3',
          memberNumber: '00003',
          money: '300'
        },
        {
          id: 4,
          memberName: '孙二哥',
          column1: '列一v4',
          column2: '列二v4',
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
          console.log(this.utility.checkAll(eventSource.data, ['memberNumber']))
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
