import {
  request
} from "../../request/index.js";
Page({
  data: {
    //轮播图数组
    swiperList: [],
    //导航数组
    catesList: [],
    //楼层数据
    floList: [],
  },
  onLoad() {
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success:(res)=> {
    //     //console.log(res)
    //     this.setData({
    //       swiperList:res
    //     })
    //   }
    // });
    this.getSwiperList();
    this.getCatesList();
    this.getFloList();
  },
  //获取轮播图数据
  getSwiperList() {
    request({
        url: "/home/swiperdata"
      })
      .then(result => {
        result.forEach((v, i) => {
            const navigator_url = v.navigator_url.replace(/main/, "goods_detail");
            v.navigator_url = navigator_url;
          }),
          this.setData({
            swiperList: result,
          })
      });
  },
  //获取导航数据
  getCatesList() {
    request({
        url: "/home/catitems"
      })
      .then(result => {
        this.setData({
          catesList: result
        })
      })
  },
  //获取楼层数据
  getFloList() {
    request({
        url: "/home/floordata"
      })
      .then(result => {
        result.forEach((v, i) => {
            v.product_list.forEach((v1, i1) => {
              const navigator_url = v1.navigator_url.replace("goods_list", "goods_list/goods_list");
              v1.navigator_url = navigator_url;
            })
          }),
          this.setData({
            floList: result
          })
      })
  }
})