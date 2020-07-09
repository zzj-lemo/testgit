import {
  request
} from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    TimeId: -1,
    isFocus: false,
    inpValue:""
  },

  handleInput(e) {
    const {
      value
    } = e.detail;
    if (!value.trim()) {
      this.setData({
        goods: [],
        isFocus: false
      })
      return;
    }
    this.setData({
      goods: [],
      isFocus: true,
    })
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.qsearch(value);
    }, 1000);
  },
  handleCancel(){
    this.setData({
      inpValue:"",
      isFocus: false,
      goods: [],
    })
  },
  async qsearch(query) {
    const res = await request({
      url: "/goods/qsearch",
      data: {
        query
      }
    });
    this.setData({
      goods: res
    })
  }
})