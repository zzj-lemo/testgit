// pages/shop/shop.js
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
  // requestPayment,
} from "../../utils/asyncWx.js"
import {
  request
} from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    const address = wx.getStorageSync("address");
    let cart = wx.getStorageSync("cart")||[];
    cart=cart.filter(v=>v.checked);
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
    })
    this.setData({
      address,
      cart,
      totalPrice,
      totalNum
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //点击支付
  async handleOrderPay(){
    try {
      const token=wx.getStorageSync("token");
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/auth',
      });
      return;
    }
    const header = { Authorization: token };
    const order_price = this.data.totalPrice;
    const consignee_addr = this.data.address.all;
    const cart = this.data.cart;
    let goods=[];
    cart.forEach(v=>goods.push({
      goods_id:v.goods_id,
      goods_number:v.num,
      goods_price:v.goods_price
    }))
    const orderParams={order_price,consignee_addr,goods}
    const {order_number}=await request({url:"/my/orders/create",method:"POST",data:orderParams,header})
    const {pay}=await request({url:"/my/orders/req_unifiedorder",method:"POST",data:order_number,header})
    // await requestPayment(pay);
    const res = request({url:"/my/orders/req_unifiedorder",method:"POST",data:order_number,header});
    await showToast({title:"支付成功"});
    let newCart=wx.getStorageSync("cart");
    newCart=newCart.filter(v=>!v.checked);
    wx.setStorageSync("cart", newCart);
    wx.navigateTo({
      url: '/pages/shop/shop'
    });
    } catch (e) {
      await showToast({title:"支付失败"});
      console.log(e)
    } 
    }


})
