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

  onPostTap: function(event) {
    var postId = event.currentTarget.dataset.postid;
    // console.log("onPostTap");
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  },

  onSwiperTap: function (event) {
    var postId = event.target.dataset.postid;
    // console.log("onPostTap");
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  }
})