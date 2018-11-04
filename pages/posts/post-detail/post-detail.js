var postsData = require("../../../data/posts-data.js")
var app = getApp();

Page({
  data: {
    isPlayingMusic: false
  },

  onLoad: function(option) {
    var postId = option.id;
    // console.log(postId);
    var postData = postsData.postList[postId];
    this.setData({
      postData: postData,
      currentPostId: postId
    });

    var postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      var postCollected = postsCollected[postId];
      if (postCollected == null) {
        postCollected = false;
      }

      this.setData({
        collected: postCollected
      })
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected);
      this.setData({
        collected: false
      })
    }

    // console.log(app.globalData.g_isPlayingMusic);
    if(app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId == postId) {
      this.setData({
        isPlayingMusic: true
      })
    };
    this.setMusicMonitor();
  },

  setMusicMonitor() {
    var that = this;
    wx.onBackgroundAudioPlay(function() {
      that.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = that.data.currentPostId;
    });

    wx.onBackgroundAudioPause(function() {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    });
  },


  onCollectionTap: function(event) {
    this.getPostsCollectedSyc();
    // this.getPostsCollectedAsy();
  },

  getPostsCollectedAsy: function() {
    var that = this;
    wx.getStorage({
      key: 'posts_collected',
      success: function(res) {
        var postsCollected = res.data;
        var postCollected = postsCollected[that.data.currentPostId];
        postCollected = !postCollected;
        postsCollected[that.data.currentPostId] = postCollected;
        that.showToast(postsCollected, postCollected);
      },
    })
  },

  getPostsCollectedSyc: function() {
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.postId];
    postCollected = !postCollected;
    postsCollected[this.data.postId] = postCollected;
    this.showToast(postsCollected, postCollected);
  },


  showModal: function(postsCollected, postCollected) {
    var that = this;
    wx.showModal({
      title: '收藏',
      content: postCollected ? '是否收藏该文章?' : '取消收藏该文章?',
      showCancel: 'true',
      cancelText: '取消',
      cancelColor: '#333',
      confirmText: '确认',
      confirmColor: '#405f80',
      success: function(res) {
        if (res.confirm) {
          wx.setStorageSync('posts_collected', postsCollected);
          that.setData({
            collected: postCollected
          })
        }
      }
    })
  },

  showToast: function(postsCollected, postCollected) {
    wx.setStorageSync('posts_collected', postsCollected);

    this.setData({
      collected: postCollected
    })

    wx.showToast({
      title: postCollected ? '收藏成功' : '取消成功',
      duration: 1000
    })
  },

  onShareTap: function(event) {
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function(res) {
        wx.showModal({
          title: "用户 " + itemList[res.tapIndex],
          content: "用户是否取消？" + res.cancel + "现在无法实现分享功能，什么时候能支持呢"
        })
      }
    });
  },

  onMusicTap: function(event) {
    var currentPostId = this.data.currentPostId;
    var postData = postsData.postList[currentPostId];
    var isPlayingMusic = this.data.isPlayingMusic;
    // console.log(postData);
    // console.log(postData.music);
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        "isPlayingMusic": false
      });
      // app.globalData.g_isPlayingMusic = false;

    } else {
      wx.playBackgroundAudio({
        dataUrl: postData.music.dataUrl,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg
      });

      this.setData({
        "isPlayingMusic": true
      });
      // app.globalData.g_isPlayingMusic = true;
    }



  }

})