import {
  request
} from "../../request/index.js";
// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"全部",
        isActive:true
      },
      {
        id:1,
        value:"待付款",
        isActive:false
      },
      {
        id:2,
        value:"待发货",
        isActive:false
      },
      {
        id:3,
        value:"退款/退货",
        isActive:false
      },
    ],
    token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo",
  },
  onShow(options){
    wx.getStorageSync("token",this.data.token)
    const token = wx.getStorageSync("token");
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/auth',
      });
      return;
    }
    let pages =  getCurrentPages();
    let currentPage = pages[pages.length-1];
    console.log(currentPage.options);
    const {type} = currentPage.options;
    this.changeTitleByIndex(type-1);
    this.getOrders(type);
  },
  async getOrders(type){
    const res = await request ({url:"/my/orders/all",data:{type}});
    // this.setData({
    //   order: res.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    // })
  },
  changeTitleByIndex(index){
    let { tabs } = this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    // 赋值到data中
    this.setData({
      tabs
    }) 
  },
  handleTabsItemChange(e){
    //获取被点击的标题索引
    const index=e.detail.index;
    this.changeTitleByIndex(index);
    this.getOrders(index+1);
  },
})