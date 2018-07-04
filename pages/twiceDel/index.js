// pages/leftSwiperDel/index.js
import ListItemModel from '../../common/ListItemModel.js';
const DEL_TEXT = ['删除','确认删除'];
var that;

Page({
  data:{
    delText: DEL_TEXT[0],
    vehicleLengths: ['1米', '2米'],
    delBtnWidth: 300//删除按钮宽度单位（rpx）
  },
  onLoad:function(options){
    // 页面初始化
    that = this;
    that.initEleWidth();
    that.tempData();
  },

  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  clickToClose(e){
    let _list = that.data.list;
    if (_list.filter(_item => { return _item.count === 5 }).length > 0) {
      return;
    }

    _list.map(_item => {
      _item.txtStyle = '';
      _item.left = 0;
      _item.count = 0;
    });

    this.setData({
      list: _list
    });
  },
  touchS: function (e) {
    console.log('------touchS=>', e);
    if(e.touches.length==1){
      that.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
      let _list = that.data.list;
      for (var i = 0; i < _list.length; i++){
        // 重置确认删除
        if (_list[i].txtStyle && !_list[i] === 5){
          _list[i].txtStyle = '';
          _list[i].left = 0;
          _list[i].count = 1;
          that.setData({ list: _list});
        }
      }
    }
  },
  touchM: function (e) {
    console.log('------touchM=>', e);
    if(e.touches.length==1){
      //手指移动时水平方向位置
      let _moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      let _disX = this.data.startX - _moveX;
      let _delBtnWidth = this.data.delBtnWidth;
      let _txtStyle = "",_offset = 0;
      if (_disX == 0 || _disX < 0){//如果移动距离小于等于0，文本层位置不变
        _offset = 0;
        _txtStyle = "left:0px";
      } else if (_disX > 0 ){//移动距离大于0，文本层left值等于手指移动距离
        _offset = -_disX;
        _txtStyle = "left:-" + _disX+"px";
        if (_disX >= _delBtnWidth){
          _offset = -_delBtnWidth;
          //控制手指移动距离最大值为删除按钮的宽度
          _txtStyle = "left:-" + _delBtnWidth+"px";
          //获取手指触摸的是哪一项
          let _index = e.target.dataset.index;
          if (_index >= 0 && _disX / 0.5){
            that.resetData(_index, _offset, _txtStyle);
          }
        }
      }
    }
  },
  resetData(index, os, txtStyle) {
    let _list = this.data.list;
    _list.map(_item => {
      _item.left = 0;
      _item.count = 0;
      _item.txtStyle = '';
    });
    _list[index].left = os;
    _list[index].txtStyle = txtStyle;
    //更新列表的状态
    this.setData({
      list: _list
    });
  },
  touchE: function (e) {
    console.log('------touchE=>', e);
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      let _endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      let _disX = this.data.startX - _endX;
      let _delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      let _os = _disX > _delBtnWidth / 2 ? -_delBtnWidth : 0;

      let txtStyle = _disX > _delBtnWidth / 2 ? "left:-" + _delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      let _index = e.target.dataset.index;
      if (_index >=0) {
        that.resetData(_index, _os, txtStyle);
        //更新列表的状态
        this.setData({
          delText: DEL_TEXT[0]
        });
      }
    }
  },
  //点击删除按钮事件
  delItem: function (e) {
    console.log('del=>', e);
    //获取列表中要删除项的下标
    let _index = e.target.dataset.index;
    let _list = this.data.list;
    if (_list[_index].count === 5) {
      //移除列表中下标为index的项
      _list.splice(_index, 1);
      //更新列表的状态
      this.setData({
        list: _list,
        delText: DEL_TEXT[0]
      });
    } else {
      _list[_index].count = 5;
      this.setData({
        list: _list,
        delText: DEL_TEXT[1]
      });
    }
  },
  

  //获取元素自适应后的实际宽度
  getEleWidth:function(width){
    let _real = 0;
    try {
      let _res = wx.getSystemInfoSync().windowWidth;
      let _scale = (750 / 2) / (width / 2);//以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      _real = Math.floor(_res / _scale);
      return _real;
    } catch (e) {
      return false;
     // Do something when catch error
    }
  },
  initEleWidth:function(){
    this.setData({
      delBtnWidth: this.getEleWidth(this.data.delBtnWidth)
    });
  },
  //测试临时数据
  tempData:function(){
    that.setData({
      list: ListItemModel.List
    });
  }
  
});