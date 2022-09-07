<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="queryParams.roleName" placeholder="请输入角色名称" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="角色编码" prop="roleCode">
        <el-input v-model="queryParams.roleCode" placeholder="请输入角色编码" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="启用状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择启用状态" clearable size="small">
          <el-option v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="角色类型" prop="builtIn">
        <el-select v-model="queryParams.builtIn" placeholder="请选择内置角色" clearable size="small">
          <el-option v-for="dict in dict.type.sys_show_hide" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button v-permission="['admin:role:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-permission="['admin:role:edit']"
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-permission="['admin:role:remove']"
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button v-permission="['admin:role:export']" type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          >导出
        </el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="角色名称" align="center" prop="roleName" />
      <el-table-column label="角色编码" align="center" prop="roleCode" />
      <el-table-column label="后台用户数量" align="center" prop="adminCount" />
      <el-table-column label="启用状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="内置角色" align="center" prop="builtIn">
        <template slot-scope="scope">
          <span>{{ scope.row.builtIn ? '是' : '否' }}</span>
          <!--          <dict-tag :options="dict.type.sys_show_hide" :value="scope.row.builtIn" />-->
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-if="scope.row.id !== 1" slot-scope="scope">
          <el-button
            v-permission="['admin:role:edit']"
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAssignMenuPermission(scope.row)"
            >菜单权限
          </el-button>
          <el-button v-permission="['admin:role:edit']" size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            >修改
          </el-button>
          <el-button v-permission="['admin:role:remove']" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改系统角色对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="form.roleCode" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="后台用户数量" prop="adminCount">
          <el-input v-model="form.adminCount" placeholder="请输入后台用户数量" disabled />
        </el-form-item>
        <el-form-item label="启用状态">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="parseInt(dict.value) === 1">
              {{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="内置角色">
          <el-radio-group v-model="form.builtIn">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="显示排序" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--  分配系统角色菜单权限对话框  -->
    <assign-menu-permission :role-id="roleId" :title="menuTitle" :open-menu="openMenu" @showDialogChange="showMenuDialogChange" />
  </div>
</template>

<script>
import AssignMenuPermission from './assignMenuPermission'
import { addRole, delRole, getRole, listRole, updateRole } from '@/api/system/role'

export default {
  name: 'Role',
  dicts: ['sys_normal_disable', 'sys_show_hide'],
  components: { AssignMenuPermission },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 系统角色表格数据
      roleList: [],
      // 弹出层标题
      title: '',
      menuTitle: '',
      roleId: '',
      // 是否显示弹出层
      open: false,
      openMenu: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        roleName: [{ require: true, message: '请输入角色名称', trigger: 'blur' }],
        roleCode: [{ require: true, message: '请输入角色编码', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询系统角色列表 */
    getList() {
      this.loading = true
      listRole(this.queryParams).then(res => {
        const { list, totalCount } = res.data
        this.roleList = list
        this.total = totalCount
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        roleName: null,
        roleCode: null,
        adminCount: null,
        status: 0,
        builtIn: 0,
        sort: null,
        createTime: null,
        updateTime: null,
        createBy: null,
        updateBy: null,
        remark: null,
        isDeleted: null
      }
      this.resetForm('form')
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加系统角色'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getRole(id).then(res => {
        this.form = res.data
        this.open = true
        this.title = '修改系统角色'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRole(this.form).then(res => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addRole(this.form).then(res => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 菜单权限分配按钮 */
    handleAssignMenuPermission(row) {
      this.roleId = row.id
      this.menuTitle = `【${row.roleName}】分配菜单权限`
      this.openMenu = true
    },
    /** 菜单权限分配弹窗事件 */
    showMenuDialogChange(val) {
      this.openMenu = val
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id ? [row.id] : this.ids
      this.$modal
        .confirm('是否确认删除系统角色编号为"' + ids + '"的数据项？')
        .then(function () {
          return delRole(ids)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.$download.get(`/meta-admin/role/export`, this.queryParams, `role_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
