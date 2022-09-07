<template>
  <!-- 添加或修改系统角色对话框 -->
  <el-dialog v-el-drag-dialog :title="title" :visible.sync="open" width="1200px" append-to-body @close="closeDialog">
    <!--    <el-form ref="form" :model="form" :rules="rules" label-width="100px">-->
    <!--      <el-form-item label="角色名称" prop="roleName">-->
    <!--        <el-input v-model="form.roleName" placeholder="请输入角色名称" />-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="角色编码" prop="roleCode">-->
    <!--        <el-input v-model="form.roleCode" placeholder="请输入角色编码" />-->
    <!--      </el-form-item>-->
    <!--    </el-form>-->
    <!--    <div slot="footer" class="dialog-footer">-->
    <!--      <el-button type="primary" @click="submitForm">确 定</el-button>-->
    <!--      <el-button @click="cancel">取 消</el-button>-->
    <!--    </div>-->
    <el-row :gutter="10">
      <el-col :span="10">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>菜单权限</span>
            <!--        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
          </div>
          <div>
            <el-form ref="queryForm" :model="queryParams" :inline="true">
              <el-form-item label="菜单名称" prop="keyword">
                <el-input
                  v-model="queryParams.keyword"
                  placeholder="请输入菜单名称"
                  clearable
                  size="mini"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-form>

            <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
            <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event)"> 全选/全不选</el-checkbox>
            <el-checkbox v-model="menuCheckStrictly" @change="handleCheckedTreeConnect($event)">父子联动</el-checkbox>
            <el-tree
              ref="menu"
              class="tree-border"
              :data="menuOptions"
              show-checkbox
              node-key="id"
              empty-text="加载中，请稍候"
              :props="defaultProps"
            ></el-tree>
          </div>
        </el-card>
      </el-col>

      <el-col :span="14">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>接口权限</span>
            <!--        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{ '列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { treeMenuList } from '@/api/system/menu'

export default {
  name: 'AssignMenuPermission',
  dicts: ['sys_show_hide', 'sys_normal_disable'],
  props: {
    title: {
      type: String,
      default: '分配菜单权限'
    },
    openMenu: {
      type: Boolean,
      default: false
    },
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      open: this.openMenu,
      // 菜单列表
      menuOptions: [],
      // 查询参数
      queryParams: {
        keyword: undefined
      },
      menuExpand: false,
      menuNodeAll: false,
      menuCheckStrictly: true,
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  watch: {
    openMenu(val) {
      this.open = val
      if (val) {
        this.getMenuTreeSelect()
      }
    }
  },
  methods: {
    /** 查询菜单数据 */
    getMenuTreeSelect() {
      treeMenuList(this.queryParams).then(res => {
        this.menuOptions = res.data
      })
    },
    /** 所有的菜单节点数据 */
    getMenuAllCheckedKeys() {},
    /** 搜索按钮操作 */
    handleQuery() {
      this.getMenuTreeSelect()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 树权限（展开/折叠） */
    handleCheckedTreeExpand(value) {
      const treeList = this.menuOptions
      for (let i = 0; i < treeList.length; i++) {
        this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value
      }
    },
    /** 树权限（全选/全不选） */
    handleCheckedTreeNodeAll(value) {
      this.$refs.menu.setCheckedNodes(value ? this.menuOptions : [])
    },
    /** 树权限（父子联动）*/
    handleCheckedTreeConnect(value) {
      this.menuCheckStrictly = !!value
    },
    closeDialog() {
      this.$emit('showDialogChange', false)
    }
  }
}
</script>

<style scoped></style>
