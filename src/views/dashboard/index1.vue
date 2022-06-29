<template>
  <div></div>
</template>

<script>
export default {
  components: {},
  // 定义属性
  data() {
    return {
      // 公式字符串
      formulaStr: '',
      // 公式编辑器最后光标位置
      formulaLastRange: null
    }
  },
  // 计算属性，会监听依赖属性值随之变化
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
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
  methods: {}
}
</script>

<style lang="scss" scoped>
#formulaPage {
  > .tab {
    > ul {
      &:after {
        content: '';
        display: table;
        clear: both;
      }

      > li {
        margin-right: 20px;
        float: left;
        padding: 0 10px;
        height: 25px;
        line-height: 25px;
        border-radius: 5px;
        border: 1px solid #000;
      }
    }
  }

  > .formulaView {
    margin-top: 20px;
    min-height: 100px;
    width: 300px;
    padding: 5px;
    border: 2px solid #000;
    resize: both;
    overflow: auto;
    line-height: 25px;

    span {
      user-select: none;
      display: inline-block;
      margin: 0 3px;
      height: 20px;
      line-height: 20px;
      letter-spacing: 2px;
      background: #aaa;
      border-radius: 3px;
      white-space: nowrap;
      color: red;

      &:first-child {
        margin-left: 0;
      }
    }
  }
}
</style>
