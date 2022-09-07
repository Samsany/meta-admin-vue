<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeName">
        <!--    基本信息      -->
        <el-tab-pane label="基本信息" name="columnInfo">
          <el-form ref="basicInfoForm" :model="info" :rules="rules" label-width="100px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="表名称" prop="tableName">
                  <el-input v-model="info.tableName" placeholder="请输入仓库名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="表描述" prop="tableComment">
                  <el-input v-model="info.tableComment" placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实体类名称" prop="className">
                  <el-input v-model="info.className" placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="作者" prop="functionAuthor">
                  <el-input v-model="info.functionAuthor" placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="info.remark" type="textarea" :rows="2"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <!--    字段表格      -->
          <el-table ref="dragTable" v-el-table-height-adaptive="{ bottomOffset: 120 }" height="300px" :data="columns" row-key="id" border>
            <el-table-column label="序号" prop="id" min-width="5%" class-name="allowDrag" />
            <el-table-column label="字段列名" prop="columnName" min-width="10%" :show-overflow-tooltip="true" />
            <el-table-column label="字段描述" min-width="10%">
              <template slot-scope="scope">
                <el-input v-model="scope.row.columnComment"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="物理类型" prop="columnType" min-width="10%" :show-overflow-tooltip="true" />
            <el-table-column label="Java类型" min-width="11%">
              <template slot-scope="scope">
                <el-select v-model="scope.row.javaType">
                  <el-option label="Long" value="Long" />
                  <el-option label="String" value="String" />
                  <el-option label="Integer" value="Integer" />
                  <el-option label="Double" value="Double" />
                  <el-option label="BigDecimal" value="BigDecimal" />
                  <el-option label="Date" value="Date" />
                  <el-option label="Boolean" value="Boolean" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="java属性" min-width="10%">
              <template slot-scope="scope">
                <el-input v-model="scope.row.javaField"></el-input>
              </template>
            </el-table-column>

            <el-table-column label="插入" min-width="5%">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.isInsert" :true-label="1" :false-label="0" />
              </template>
            </el-table-column>
            <el-table-column label="编辑" min-width="5%">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.isEdit" :true-label="1" :false-label="0" />
              </template>
            </el-table-column>
            <el-table-column label="列表" min-width="5%">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.isList" :true-label="1" :false-label="0" />
              </template>
            </el-table-column>
            <el-table-column label="查询" min-width="5%">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.isQuery" :true-label="1" :false-label="0" />
              </template>
            </el-table-column>
            <el-table-column label="查询方式" min-width="10%">
              <template slot-scope="scope">
                <el-select v-model="scope.row.queryType">
                  <el-option label="=" value="EQ" />
                  <el-option label="!=" value="NE" />
                  <el-option label=">" value="GT" />
                  <el-option label=">=" value="GTE" />
                  <el-option label="<" value="LT" />
                  <el-option label="<=" value="LTE" />
                  <el-option label="LIKE" value="LIKE" />
                  <el-option label="BETWEEN" value="BETWEEN" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="必填" min-width="5%">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.isRequired" :true-label="1" :false-label="0" />
              </template>
            </el-table-column>
            <el-table-column label="显示类型" min-width="12%">
              <template slot-scope="scope">
                <el-select v-model="scope.row.htmlType">
                  <el-option label="文本框" value="input" />
                  <el-option label="文本域" value="textarea" />
                  <el-option label="下拉框" value="select" />
                  <el-option label="单选框" value="radio" />
                  <el-option label="复选框" value="checkbox" />
                  <el-option label="日期控件" value="datetime" />
                  <el-option label="图片上传" value="imageUpload" />
                  <el-option label="文件上传" value="fileUpload" />
                  <el-option label="富文本控件" value="editor" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="字典类型" min-width="12%">
              <template slot-scope="scope">
                <el-select v-model="scope.row.dictType" clearable filterable placeholder="请选择">
                  <el-option v-for="dict in dictOptions" :key="dict.dictType" :label="dict.dictName" :value="dict.dictType">
                    <span style="float: left">{{ dict.dictName }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ dict.dictType }}</span>
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="排序" width="80" prop="sort" align="center" />
            <el-table-column label="拖动排序" width="80" prop="id" align="center" class-name="allowDrag">
              <template>
                <i class="el-icon-rank f18 poi" />
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!--    生成信息    -->
        <el-tab-pane label="生成信息" name="genInfo">
          <gen-info-form ref="genInfo" :info="info" :tables="tables" :menus="menus" />
        </el-tab-pane>
      </el-tabs>
      <el-form label-width="100px">
        <el-form-item style="text-align: center; margin-left: -100px; margin-top: 10px">
          <el-button type="primary" @click="submitForm()">提交</el-button>
          <el-button @click="close()">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getGenTable, updateGenTable } from '@/api/tools/gen'
import { optionSelect as getDictOptionSelect } from '@/api/system/dict/type'
import { treeMenuList } from '@/api/system/menu'
import genInfoForm from './genInfoForm'
import Sortable from 'sortablejs'

export default {
  name: 'GenEdit',
  components: {
    genInfoForm
  },
  data() {
    return {
      // 选中选项卡的 name
      activeName: 'columnInfo',
      // 表信息
      tables: [],
      // 表列信息
      columns: [],
      // 字典信息
      dictOptions: [],
      // 菜单信息
      menus: [],
      // 表详细信息
      info: {},
      rules: {
        tableName: [{ required: true, message: '请输入表名称', trigger: 'blur' }],
        tableComment: [{ required: true, message: '请输入表描述', trigger: 'blur' }],
        className: [{ required: true, message: '请输入实体类名称', trigger: 'blur' }],
        functionAuthor: [{ required: true, message: '请输入作者', trigger: 'blur' }]
      }
    }
  },
  watch: {},
  created() {
    const tableId = this.$route.params && this.$route.params.id
    if (tableId) {
      // 获取表详细信息
      getGenTable(tableId).then(res => {
        const { info, tables, tableColumns } = res.data
        this.info = info
        this.tables = tables
        this.columns = tableColumns
      })
      /** 查询字典下拉列表 */
      getDictOptionSelect().then(res => {
        this.dictOptions = res.data
      })
      /** 查询菜单下拉列表 */
      treeMenuList().then(res => {
        this.menus = res.data
      })
    }
  },
  mounted() {
    const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
    Sortable.create(el, {
      ghostClass: 'sortable-ghost', // 拖拽样式
      animation: 60, // 拖拽延时，效果更好看
      handle: '.allowDrag',
      onEnd: evt => {
        const targetRow = this.columns.splice(evt.oldIndex, 1)[0]
        this.columns.splice(evt.newIndex, 0, targetRow)
        for (const index in this.columns) {
          this.columns[index].sort = parseInt(index) + 1
        }
      }
    })
  },
  methods: {
    /** 提交按钮 */
    submitForm() {
      const basicForm = this.$refs.basicInfoForm
      const genForm = this.$refs.genInfo.$refs.genInfoForm
      Promise.all([basicForm, genForm].map(this.getFormPromise)).then(res => {
        const validateResult = res.every(item => !!item)
        if (validateResult) {
          const genTable = Object.assign({}, basicForm.model, genForm.model)
          // console.log(this.columns)
          genTable.columns = this.columns
          const params = {
            treeCode: genTable.treeCode,
            treeName: genTable.treeName,
            treeParentCode: genTable.treeParentCode,
            parentMenuId: genTable.parentMenuId,
            superEntityClass: genTable.superEntityClass,
            enableSwagger: genTable.enableSwagger
          }
          genTable.options = JSON.stringify(params)
          updateGenTable(genTable).then(res => {
            this.$modal.msgSuccess(res.message)
            this.close()
          })
        } else {
          this.$modal.msgError('表单校验未通过，请重新检查提交内容')
        }
      })
    },
    getFormPromise(form) {
      return new Promise(resolve => {
        form.validate(res => {
          resolve(res)
        })
      })
    },
    /** 关闭按钮 */
    close() {
      const obj = { path: '/tools/code-gen', query: { t: Date.now(), pageNum: this.$route.query.pageNum } }
      this.$tab.closeOpenPage(obj)
    }
  }
}
</script>
