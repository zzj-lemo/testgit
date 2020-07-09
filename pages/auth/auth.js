import {
  request
} from "../../request/index.js";
import {
  login,
  showToast,
} from "../../utils/asyncWx.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  async hindleGetUser(e) {
    try {
      const {
        encryptedData,
        iv,
        rawData,
        signature
      } = e.detail;
      const {
        code
      } = await login();
      const loginParams = {
        encryptedData,
        iv,
        rawData,
        signature
      };
      const res = await request({
        url: "/users/wxlogin",
        data: loginParams,
        method: "post"
      })
      wx.setStorageSync("token", this.data.token);
      wx.navigateBack({
        delta: 1
      });
    } catch (e) {
      console.log(e);
      await showToast({
        title: "无法获取用户信息"
      })
      wx.switchTab({
        url: '/pages/shop/shop'
      })
    }

  }
})