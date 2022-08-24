<template>
  <!-- 导入表 -->
  <el-dialog v-el-drag-dialog title="导入表" :visible.sync="visible" width="800px" top="5vh" append-to-body>
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="表名称" prop="tableName">
        <el-input v-model="queryParams.tableName" placeholder="请输入表名称" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="表描述" prop="tableComment">
        <el-input v-model="queryParams.tableComment" placeholder="请输入表描述" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-table ref="table" height="260px" border :data="dbTableList" @row-click="clickRow" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="表名称" width="200" :show-overflow-tooltip="true" />
        <el-table-column prop="comment" label="表描述" min-width="200" :show-overflow-tooltip="true" />
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleImportTable">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { importTable, listDbTable } from '@/api/tools/gen'

export default {
  data() {
    return {
      // 遮罩层
      visible: false,
      // 选中数组值
      tables: [],
      // 总条数
      total: 0,
      dsName: undefined,
      // 表数据
      dbTableList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        keyword: undefined,
        tableName: undefined,
        tableComment: undefined
      }
    }
  },
  methods: {
    // 显示弹框
    show(dsName) {
      this.dsName = dsName
      this.getList()
      this.visible = true
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row)
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.tables = selection.map(item => item.name)
    },
    // 查询表数据
    getList() {
      this.queryParams.keyword = this.dsName
      listDbTable(this.queryParams).then(res => {
        const { list, totalCount } = res.data
        this.dbTableList = list
        this.total = totalCount
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 导入按钮操作 */
    handleImportTable() {
      // const tableNames = this.tables.join(',')
      const tables = this.tables
      if (tables.length === 0) {
        this.$modal.msgError('请选择要导入的表')
        return
      }
      importTable({ tables, dsName: this.dsName }).then(res => {
        this.$modal.msgSuccess(res.message)
        this.visible = false
        this.$emit('ok')
      })
    }
  }
}
</script>
