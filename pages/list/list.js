import {
  request
} from "../../request/index.js";
Page({


      data: {
        leftCon: [],
        rightCon: [],
        currentIndex: 0,
        scrollTop: 0,
      },
      cates: [],
      /**
       * 生命周期函数--监听页面载
       */
      onLoad: function (options) {
        //获取本地存储中的数据
        const cates = wx.getStorageSync("cates");
        if (!cates) {
          this.getCates();
        } else {
          if (Date.now() - cates.time > 1000 * 300) {
            this.getCates();
          } else {
            this.cates = cates.data;
            let leftCon = this.cates.map(v => v.cat_name);
            let rightCon = this.cates[0].children;
            this.setData({
              leftCon,
              rightCon,
              scrollTop: 0,
            })
          }
        }
        },
        async getCates() {
            const result = await request({ url: "/categories" });
            this.cates = result
            //把接口的数据存入到本地存储中
            wx.setStorageSync("cates", {
              time: Date.now(),
              data: this.cates
            });
            //构造左侧的大菜单数据
            let leftCon = this.cates.map(v => v.cat_name);
            //构造右侧的商品数据
            let rightCon = this.cates[0].children;
            this.setData({
              leftCon,
              rightCon,
              scrollTop: 0,
            })
          },
          create(e) {
            const index = e.currentTarget.dataset.index;
            let rightCon = this.cates[index].children;
            this.setData({
              currentIndex: index,
              rightCon,
              scrollTop: 0,
            })
          }

      })