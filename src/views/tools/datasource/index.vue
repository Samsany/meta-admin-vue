<template>
  <div class="app-container">
    <!--  搜索栏  -->
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="100px">
      <el-form-item label="关键字搜索" prop="name">
        <el-input v-model="queryParams.keyword" placeholder="请输入关键字搜索" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--操作栏-->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button v-permission="['tools:datasource:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-permission="['tools:datasource:remove']"
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          >删除
        </el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>
    <!--数据表格-->
    <el-table v-loading="loading" :data="tableList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="55"></el-table-column>
      <el-table-column label="编号" type="index" width="50" align="center" prop="id" />
      <el-table-column label="名称" align="center" prop="name" :show-overflow-tooltip="true" width="120" />
      <el-table-column label="数据库类型" align="center" prop="dbType" :show-overflow-tooltip="true" width="120">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.db_type" :value="scope.row.dbType" />
        </template>
      </el-table-column>
      <!--      <el-table-column label="驱动类型" align="center" prop="driverClass" :show-overflow-tooltip="true" width="120" />-->
      <el-table-column label="连接地址" align="center" prop="url" :show-overflow-tooltip="true" min-width="200" />
      <el-table-column label="端口号" align="center" prop="port" min-width="100" />
      <el-table-column label="数据库" align="center" prop="databaseName" min-width="120" />
      <el-table-column label="JDBC连接参数" align="center" prop="jdbcParams" :show-overflow-tooltip="true" min-width="120" />
      <el-table-column label="状态" align="center" prop="status" min-width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" min-width="200" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" align="center" prop="updateTime" min-width="200" />
      <el-table-column label="操作" align="center" fixed="right" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-permission="['tools:datasource:edit']"
            type="text"
            size="small"
            icon="el-icon-edit"
            @click="handleEditTable(scope.row)"
            >编辑
          </el-button>
          <el-button
            v-permission="['tools:datasource:remove']"
            type="text"
            size="small"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--  分页组件  -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog v-el-drag-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="数据库类型" prop="dbType">
          <el-select v-model="form.dbType" clearable placeholder="请输入选择数据库类型" :disabled="editFlag">
            <el-option v-for="item in dict.type.db_type" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入数据源名称" :disabled="editFlag" />
        </el-form-item>
        <!--        <el-form-item label="驱动类型" prop="driverClass">-->
        <!--          <el-input v-model="form.driverClass" placeholder="请输入驱动类型" />-->
        <!--        </el-form-item>-->
        <el-form-item label="连接地址" prop="url">
          <el-input v-model.trim="form.url" placeholder="请输入连接地址" />
        </el-form-item>
        <el-form-item label="端口号" prop="port">
          <el-input v-model.number="form.port" placeholder="请输入端口号" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-tooltip v-model="capsTooltip" content="大写锁定" placement="right" manual>
          <el-form-item label="密码" prop="password">
            <el-input
              ref="password"
              v-model="form.password"
              :type="passwordType"
              placeholder="请输入密码"
              tabindex="2"
              autocomplete="on"
              :suffix-icon="passwordType === 'password' ? 'eye' : 'eye-open'"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
            >
              <svg-icon slot="suffix" :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" @click="showPwd" />
            </el-input>
          </el-form-item>
        </el-tooltip>
        <el-form-item label="数据库名称" prop="databaseName">
          <el-input v-model="form.databaseName" placeholder="请输入数据库名称" />
        </el-form-item>
        <el-form-item label="Jdbc连接参数" prop="jdbcParams">
          <el-input
            v-model="form.jdbcParams"
            type="textarea"
            placeholder="请输入Jdbc连接参数,例： {'key1': 'value1', 'key2': 'value2'}"
            :autosize="{ minRows: 3 }"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="Number(dict.value)">
              {{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="显示排序" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
            maxlength="225"
            show-word-limit
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button type="success" @click="connectDataSourceTest">连接测试</el-button>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addDataSource, connectDataSource, delDataSource, getDataSource, listDataSource, updateDataSource } from '@/api/tools/datasource'

export default {
  components: {},
  dicts: ['sys_normal_disable', 'db_type'],
  // 定义属性
  data() {
    return {
      // 遮罩层
      loading: true,
      // 唯一标识符
      uniqueId: '',
      // 选中数组
      ids: [],
      // 选中表数组
      tableNames: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表数据
      tableList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 编辑标识
      editFlag: true,
      // 日期范围
      dateRange: '',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        keyword: undefined
      },
      // 表单参数
      form: {},
      passwordType: 'password',
      capsTooltip: false,
      // 表单校验
      rules: {
        name: [{ required: true, message: '数据源名称不能为空', trigger: 'blur' }],
        dbType: [{ required: true, message: '数据库类型不能为空', trigger: 'blur' }],
        // driverClass: [{ required: true, message: '驱动类型不能为空', trigger: 'blur' }],
        username: [{ required: true, message: '数据源名称不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '连接地址不能为空', trigger: 'blur' }],
        port: [{ required: true, message: '端口号不能为空', trigger: 'blur' }],
        databaseName: [{ required: true, message: '数据库名称不能为空', trigger: 'blur' }]
      }
    }
  },
  // 计算属性，会监听依赖属性值随之变化
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getList()
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {}, // 如果页面有keep-alive缓存功能，这个函数会触发
  // 方法集合
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    /** 查询表集合 */
    getList() {
      this.loading = true
      listDataSource(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        const { list, totalCount } = res.data
        this.tableList = list
        this.total = totalCount
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加数据源'
      this.editFlag = false
    },
    /** 复制代码成功 */
    clipboardSuccess() {
      this.$modal.msgSuccess('复制成功')
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.tableNames = selection.map(item => item.name)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleEditTable(row) {
      this.reset()
      getDataSource(row.id).then(res => {
        this.form = res.data
        this.open = true
        this.title = '修改菜单'
        this.editFlag = true
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id ? [row.id] : this.ids
      this.$modal
        .confirm('是否确认删除表编号为"' + ids + '"的数据项？')
        .then(function () {
          return delDataSource(ids)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
    /** 数据源连接测试 */
    connectDataSourceTest() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          connectDataSource(this.form).then(res => {
            if (res.data) {
              this.$modal.msgSuccess('连接成功')
            } else {
              this.$modal.msgError('连接失败,请检查配置')
            }
          })
        }
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateDataSource(this.form).then(res => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addDataSource(this.form).then(res => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
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
        id: undefined,
        name: undefined,
        dbType: undefined,
        driverClass: undefined,
        url: undefined,
        port: undefined,
        username: undefined,
        password: undefined,
        databaseName: undefined,
        jdbcParams: undefined,
        sort: 0,
        status: 1,
        remark: undefined
      }
      this.resetForm('form')
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
