<!-- @author zhengjie -->
<template>
  <div class="icon-body">
    <el-input
      v-model="name"
      style="position: relative"
      clearable
      placeholder="请输入图标名称"
      @clear="filterIcons"
      @input.native="filterIcons"
    >
      <i slot="suffix" class="el-icon-search el-input__icon" />
    </el-input>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="Svg-Icons" name="icon">
        <div class="grid">
          <div v-for="item of iconList" :key="item" @click="selectedIcon(item)">
            <div class="icon-item">
              <svg-icon :icon-class="item" class-name="disabled" />
              <span>{{ item }}</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Element-Icons" name="elIcon">
        <div class="grid">
          <div v-for="item of elIconList" :key="item" @click="selectedIcon(item)">
            <div class="icon-item">
              <i :class="item" />
              <span>{{ item.substring(8) }}</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!--    <div class="icon-list">-->
    <!--      <div v-for="(item, index) in iconList" :key="index" @click="selectedIcon(item)">-->
    <!--        <svg-icon :icon-class="item" style="height: 30px; width: 16px" />-->
    <!--        <span>{{ item }}</span>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script>
import elIcons from './element-icons'
import icons from './requireIcons'

export default {
  name: 'IconSelect',
  data() {
    return {
      name: '',
      activeName: 'icon',
      iconList: icons,
      elIconList: elIcons
    }
  },
  methods: {
    filterIcons() {
      // this.iconList = icons
      // if (this.name) {
      //   this.iconList = this.iconList.filter(item => item.includes(this.name))
      // }

      this.iconList = icons
      this.elIconList = elIcons
      if (this.activeName === 'icon') {
        if (this.name) {
          this.iconList = this.iconList.filter(item => item.includes(this.name))
        }
      }
      if (this.activeName === 'elIcon') {
        if (this.name) {
          this.elIconList = this.elIconList.filter(item => item.includes(this.name))
        }
      }
    },
    selectedIcon(name) {
      this.$emit('selected', name)
      document.body.click()
    },
    reset() {
      this.name = ''
      this.iconList = icons
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icon-body {
  width: 100%;
  padding: 10px;

  //.icon-list {
  //  height: 200px;
  //  overflow-y: scroll;
  //
  //  div {
  //    height: 30px;
  //    line-height: 30px;
  //    margin-bottom: -5px;
  //    cursor: pointer;
  //    width: 33%;
  //    float: left;
  //  }
  //
  //  span {
  //    display: inline-block;
  //    vertical-align: -0.15em;
  //    fill: currentColor;
  //    overflow: hidden;
  //  }
  //}

  .grid {
    height: 300px;
    overflow-y: scroll;
    //position: relative;
    //display: grid;
    //grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));

    .icon-item {
      margin: 5px;
      height: 60px;
      width: 60px;
      text-align: center;
      float: left;
      font-size: 20px;
      color: #24292e;
      cursor: pointer;
    }

    span {
      display: block;
      font-size: 10px;
      margin-top: 5px;
    }
  }

  .disabled {
    pointer-events: none;
  }
}
</style>
