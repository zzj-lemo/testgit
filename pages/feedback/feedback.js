// pages/feedback/feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"体验问题",
        isActive:true
      },
      {
        id:1,
        value:"商品、商家投诉",
        isActive:false
      },
    ],
    chooseImgs:[],
    textVal:"",
  },
  UpLoadImgs:[],

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

  handleChooseImg(){
    wx.chooseImage({
      count: 9,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (result)=>{
        console.log(result)
        this.setData({
          chooseImgs:[...this.data.chooseImgs,...result.tempFilePaths],
        })
      },
    });
  },
  handleRemoveImg(e){
    const {index}=e.currentTarget.dataset;
    let {chooseImgs}=this.data;
    chooseImgs.splice(index,1);
    this.setData({
      chooseImgs
    })
  },
  handleTextInput(e){
      this.setData({
        textVal:e.detail.value,
      })
  },
  handleFormSubmit(){
    const {textVal,chooseImgs} = this.data;
    if(!textVal.trim()){
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true,
      });
      return;
    };
    wx.showLoading({
      title: "正在上传中",
      mask: true,
    });
    if(chooseImgs.length != 0){
      chooseImgs.forEach((v,i)=>{
        wx.uploadFile({
          url: 'https://clubajax.autohome.com.cn/Upload/UpImageOfBase64New?dir=image&cros=autohome.com.cn',
          filePath: v,
          name: "file",
          formData: {},
          success: (result)=>{
            console.log(result);
            let url = JSON.parse(result.data).message;
            this.UpLoadImgs.push(url);
            if(i===chooseImgs.length-1){
              wx.hideLoading();
              console.log("把文本的内容和外网的图片数组 提交到后台中");
              this.setData({
                textVal:"",
                chooseImage:[]
              })
              wx.navigateBack({
                delta: 1
              });
            }
          }
        });
        
      })
    }else{
      wx.hideLoading();
      console.log("只是提交了文本");
      wx.navigateBack({
        delta: 1
      });
    }
  },
})