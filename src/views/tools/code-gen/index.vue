<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="表名称" prop="tableName">
        <el-input v-model="queryParams.tableName" placeholder="请输入表名称" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="表描述" prop="tableComment">
        <el-input v-model="queryParams.tableComment" placeholder="请输入表描述" clearable size="small" @keyup.enter.native="handleQuery" />
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button v-permission="['tool:gen:code']" type="primary" plain icon="el-icon-download" size="mini" @click="handleGenTable"
          >生成
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-permission="['tool:gen:remove']"
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          >删除
        </el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="tableList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="55"></el-table-column>
      <el-table-column label="序号" prop="id" width="50" align="center" />
      <el-table-column label="表名称" align="center" prop="tableName" :show-overflow-tooltip="true" width="200" />
      <el-table-column label="表描述" align="center" prop="tableComment" :show-overflow-tooltip="true" width="200" />
      <el-table-column label="实体" align="center" prop="className" :show-overflow-tooltip="true" width="120" />
      <el-table-column label="创建时间" align="center" prop="createTime" min-width="220" />
      <el-table-column label="更新时间" align="center" prop="updateTime" width="220" />
      <el-table-column label="操作" align="center" fixed="right" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['tool:gen:preview']" type="text" size="small" icon="el-icon-view" @click="handlePreview(scope.row)"
            >预览
          </el-button>
          <el-button v-permission="['tool:gen:edit']" type="text" size="small" icon="el-icon-edit" @click="handleEditTable(scope.row)"
            >编辑
          </el-button>
          <el-button v-permission="['tool:gen:remove']" type="text" size="small" icon="el-icon-delete" @click="handleDelete(scope.row)"
            >删除
          </el-button>
          <!--            <el-button v-permission="['tool:gen:edit']" type="text" size="small" icon="el-icon-refresh" @click="handleSynchDb(scope.row)"-->
          <!--              >同步-->
          <!--            </el-button>-->
          <el-button v-permission="['tool:gen:code']" type="text" size="small" icon="el-icon-download" @click="handleGenTable(scope.row)"
            >生成代码
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
    <!-- 预览界面 -->
    <el-dialog v-el-drag-dialog :title="preview.title" :visible.sync="preview.open" width="80%" top="5vh" append-to-body class="scrollbar">
      <el-tabs v-model="preview.activeName">
        <el-tab-pane
          v-for="(value, key) in preview.data"
          :key="key"
          :label="key.substring(key.lastIndexOf('/') + 1, key.indexOf('.vm'))"
          :name="key"
        >
          <el-link
            v-clipboard:copy="value"
            v-clipboard:success="clipboardSuccess"
            :underline="false"
            icon="el-icon-document-copy"
            style="float: right"
            >复制
          </el-link>
          <!--          <pre><code class='hljs' v-html='highlightedCode(value, key)'></code></pre>-->
          <div class="code-mirror">
            <codemirror ref="myCodeMirror" v-model="code" :options="cmOptions" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
// base style
import 'codemirror/lib/codemirror.css'
// theme css
import 'codemirror/theme/monokai.css'
// language
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/vue/vue.js'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/css/css.js'
import 'codemirror/mode/sql/sql.js'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/mode/yaml/yaml.js'
// active-line.js
import 'codemirror/addon/selection/active-line.js'
// styleSelectedText
import 'codemirror/addon/selection/mark-selection.js'
import 'codemirror/addon/search/searchcursor.js'
// highlightSelectionMatches
import 'codemirror/addon/scroll/annotatescrollbar.js'
import 'codemirror/addon/search/matchesonscrollbar.js'
import 'codemirror/addon/search/match-highlighter.js'
// 提示弹窗
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'
// 滚动条
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/scroll/simplescrollbars.js'
// 代码高亮
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/javascript-hint.js'
import 'codemirror/addon/hint/xml-hint.js'
import 'codemirror/addon/hint/anyword-hint.js'
import 'codemirror/addon/hint/html-hint.js'
import 'codemirror/addon/hint/css-hint.js'
import 'codemirror/addon/hint/sql-hint'
// 全屏
import 'codemirror/addon/display/fullscreen.js'
import 'codemirror/addon/display/fullscreen.css'

import { listGenTable, previewTable } from '@/api/tools/gen'

export default {
  name: 'CodeGen',
  components: {
    codemirror
  },
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
      // 日期范围
      dateRange: '',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        tableName: undefined,
        tableComment: undefined
      },
      // 预览参数
      preview: {
        open: false,
        title: '代码预览',
        data: {},
        activeName: 'domain.java'
      },
      code: undefined,
      cmOptions: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        styleSelectedText: true,
        mode: 'text/x-java',
        readonly: 'nocursor',
        lineWrapping: true, // 自动换行
        // scrollbarStyle: 'overlay',
        // keyMap: 'sublime',
        matchBrackets: true,
        showCursorWhenSelecting: true,
        theme: 'monokai',
        extraKeys: {
          Ctrl: 'autocomplete'
        },
        indentWithSpaces: true,
        hintOptions: {
          completeSingle: false
        }
      }
    }
  },
  // 计算属性，会监听依赖属性值随之变化
  computed: {},
  // 监控data中的数据变化
  watch: {
    'preview.activeName': function (val, oldVal) {
      this.selectCmOptionsMode(val)
      this.setCodeMirrorValue(val)
    }
  },
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
    /** 查询表集合 */
    getList() {
      this.loading = true
      listGenTable(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
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
    /** 复制代码成功 */
    clipboardSuccess() {
      this.$modal.msgSuccess('复制成功')
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.tableNames = selection.map(item => item.tableName)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleEditTable(row) {
      const tableId = row.id
      this.$router.push({
        path: '/tools/gen-edit/index/' + tableId,
        query: { pageNum: this.queryParams.pageNum }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const tableIds = row.tableId || this.ids
      this.$modal
        .confirm('是否确认删除表编号为"' + tableIds + '"的数据项？')
        .then(function () {
          // return delTable(tableIds)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
    /** 预览按钮 */
    handlePreview(row) {
      previewTable(row.id).then(res => {
        this.preview.data = res.data
        this.preview.open = true
        this.preview.activeName = 'vm/java/domain.java.vm'
      })
    },
    selectCmOptionsMode(val) {
      // 处理mode值，根据文件名后缀
      console.log(val)
      val = val.substring(val.lastIndexOf('/') + 1, val.indexOf('.vm'))
      if (val.endsWith('.xml') || val.endsWith('.XML') || val.endsWith('.html')) {
        this.cmOptions.mode = 'text/html'
      } else if (val.endsWith('.js') || val.endsWith('.JS')) {
        this.cmOptions.mode = 'text/javascript'
      } else if (val.endsWith('.vue') || val.endsWith('.VUE')) {
        this.cmOptions.mode = 'text/x-vue'
      } else if (val.endsWith('.css') || val.endsWith('.CSS')) {
        this.cmOptions.mode = 'text/css'
      } else if (val.endsWith('.py') || val.endsWith('.PY')) {
        this.cmOptions.mode = 'text/x-python'
      } else if (val.endsWith('.go') || val.endsWith('.GO')) {
        this.cmOptions.mode = 'text/x-go'
      } else if (val.endsWith('.cpp') || val.endsWith('.CPP')) {
        this.cmOptions.mode = 'text/x-c++src'
      } else if (val.endsWith('.sql') || val.endsWith('.SQL') || val.endsWith('sql')) {
        this.cmOptions.mode = 'text/x-sql'
      } else if (val.endsWith('.sh') || val.endsWith('.SH')) {
        this.cmOptions.mode = 'text/x-sh'
      } else {
        this.cmOptions.mode = 'text/x-java'
      }
    },
    setCodeMirrorValue(val) {
      this.code = this.preview.data[val]
    },
    handleGenTable() {}
  }
}
</script>

<style scoped>
.code-mirror {
  height: 600px;
  overflow-y: scroll !important;
}

.code-mirror >>> .CodeMirror {
  border: 1px solid #eee;
  height: auto;
  overflow-y: hidden;
  overflow-x: hidden;
}

.code-mirror >>> .CodeMirror-scroll {
  height: auto;
  overflow-y: scroll !important;
  overflow-x: scroll !important;
}
</style>
