import {
  request
} from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      },
    ],
    goods_list:[],

  },
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  totalPages:1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid=options.cid||"";
    this.QueryParams.query=options.query||"";
    this.getGoodsList();
  },
  async getGoodsList(){
    const res=await request({url:"/goods/search",data:this.QueryParams})
    const total=res.total;
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
    console.log(res)
    console.log(this.totalPages)
    this.setData({
      goods_list:[...this.data.goods_list,...res.goods],
    })
    wx.stopPullDownRefresh();
  },

  handleTabsItemChange(e){
    //获取被点击的标题索引
    const index=e.detail.index;
    //修改源数据
    let tabs=this.data.tabs;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    // 赋值到data中
    this.setData({
      tabs
    }) 
  },
  //加载下一页数据
  onReachBottom(){
    if(this.QueryParams.pagenum>=this.totalPages){
      wx.showToast({
        title: '没有下一页数据'
      });
    }else{
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  //下拉刷新事件
  onPullDownRefresh(){
    this.setData({
      goods_list:[],
    })
    this.QueryParams.pagenum=1;
    this.getGoodsList();

  }

  
})