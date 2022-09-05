// import axios from 'axios'
import { Loading, Message } from 'element-ui'
import { saveAs } from 'file-saver'
import { blobValidate } from '@/utils'
import request from '@/utils/request'

let downloadLoadingInstance

export default {
  get(url, params, name) {
    downloadLoadingInstance = Loading.service({
      text: '正在下载数据，请稍候',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    request({
      method: 'get',
      url,
      params,
      responseType: 'blob'
    })
      .then(async res => {
        const isLogin = await blobValidate(res.data)
        if (isLogin) {
          const blob = new Blob([res.data])
          // 提取文件名
          const fileName = res.headers['content-disposition'].match(/filename=(.*)/)[1]
          this.saveAs(blob, name || fileName)
        } else {
          await this.printErrMsg(res.data)
        }
        downloadLoadingInstance.close()
      })
      .catch(r => {
        console.error(r)
        Message.error('下载文件出现错误，请重新尝试！')
        downloadLoadingInstance.close()
      })
  },
  post(url, data, name) {
    downloadLoadingInstance = Loading.service({
      text: '正在下载数据，请稍候',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    request({
      method: 'post',
      url,
      data,
      responseType: 'blob'
    })
      .then(async res => {
        // console.log(res)
        const isLogin = await blobValidate(res.data)
        if (isLogin) {
          const blob = new Blob([res.data])
          // 提取文件名
          const fileName = res.headers['content-disposition'].match(/filename=(.*)/)[1]
          // console.log(fileName)
          this.saveAs(blob, name || fileName)
        } else {
          await this.printErrMsg(res.data)
        }
        downloadLoadingInstance.close()
      })
      .catch(r => {
        console.error(r)
        Message.error('下载文件出现错误，请重新尝试！')
        downloadLoadingInstance.close()
      })
  },
  saveAs(text, name, opts) {
    saveAs(text, name, opts)
  },
  async printErrMsg(data) {
    const resText = await data.text()
    const rspObj = JSON.parse(resText)
    const errMsg = rspObj.message || 'Error'
    Message.error(errMsg)
  }
}
