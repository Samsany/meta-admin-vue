import Clipboard from './clipboard'
import Drag from './el-drag-dialog'
import dialogDragWidth from './el-drag-dialog/dragWidth'
import dialogDragHeight from './el-drag-dialog/dragHeight'
import Adaptive from './el-table/adaptive'
import Permission from './permission'
import Waves from './waves'
import Sticky from './sticky'

const install = function (Vue) {
  Vue.directive('Clipboard', Clipboard)
  Vue.directive('el-drag-dialog', Drag)
  Vue.directive('dialog-drag-width', dialogDragWidth)
  Vue.directive('dialog-drag-height', dialogDragHeight)
  Vue.directive('el-table-height-adaptive', Adaptive)
  Vue.directive('permission', Permission)
  Vue.directive('waves', Waves)
  Vue.directive('sticky', Sticky)
}

if (window.Vue) {
  window.clipboard = Clipboard
  window['el-drag-dialog'] = Drag
  window['el-table-height-adaptive'] = Adaptive
  window['permission'] = Permission
  window['sticky'] = Sticky
  window.waves = Waves
  Vue.use(install) // eslint-disable-line
}

export default install
