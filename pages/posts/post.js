var postsData = require('../../data/posts-data.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
 

    this.setData({
      posts_key: postsData.postList
    });

  },

})