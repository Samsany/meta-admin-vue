import Vue from 'vue'
// 分页组件
import Pagination from '@/components/Pagination'
// 自定义表格工具组件
import RightToolbar from '@/components/RightToolbar'
// 字典标签组件
import DictTag from '@/components/DictTag'
// 字典数据组件
import DictData from '@/components/DictData'
import Tab from './Plugins/tab'
import Cache from './Plugins/cache'
import Modal from './Plugins/modal'
import { getDictDataList } from '@/api/system/dict/data'
import { addDateRange, handleTree, resetForm, selectDictLabel, selectDictLabels } from '@/utils'
import download from '@/components/Plugins/download'

Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('DictTag', DictTag)

// 全局方法挂载
Vue.prototype.getDicts = getDictDataList
// Vue.prototype.getConfigKey = getConfigKey;
// Vue.prototype.parseTime = parseTime;
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.handleTree = handleTree
Vue.prototype.$download = download
// 页签操作
Vue.prototype.$tab = Tab
// 缓存对象
Vue.prototype.$cache = Cache
// 模态框对象
Vue.prototype.$modal = Modal

DictData.install()
