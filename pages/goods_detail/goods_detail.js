import {
  request
} from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    isCollect:false,
  },
  GoodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length-1];
    let options = currentPage.options;
    const goods_id=options.goods_id;
    this.getGoodsDetail(goods_id);
  },
  async getGoodsDetail(goods_id){
    console.log(goods_id)
    const goodsObj = await request({ url: "/goods/detail",data:{goods_id}});
    this.GoodsInfo=goodsObj;
    let collect = wx.getStorageSync("collect")||[];
    let isCollect = collect.some(v=>v.goods_id===this.GoodsInfo.goods_id);
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics,
      },
      isCollect,
    })
  },
  //点击轮播图预览
  handlePreviewImage(e){
    const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);
    const current=e.currentTarget.dataset.url;
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls, // 需要预览的图片http链接列表
    })
  },
  //加入购物车
  handleCartAdd(){
    let cart=wx.getStorageSync("cart")||[];
    console.log(cart)
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo)
    }else{
      cart[index].num++;
    }
    wx.setStorageSync("cart",cart);
    wx.showToast({
      title:'加入成功',
      icon:'success',
      mask:true,
    })
  },
  handleCollect(){
    let isCollect = false;
    let collect = wx.getStorageSync("collect")||[];
    let index = collect.findIndex(v=>v.goods_id === this.GoodsInfo.goods_id);
    if(index !== -1){
      collect.splice(index,1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true,
      });
    }else{
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      });
    }
    wx.setStorageSync("collect",collect);
    this.setData({
      isCollect,
    })
  }
})