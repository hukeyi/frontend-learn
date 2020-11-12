// 得到app全局数据
const app = getApp();
// 用于初始化一个页面示例
Page({
    data: {
        items: ['事项A', '事项B', '事项C']
    },
    inputHandler(event){
        this.setData({
            inputValue: event.detail.value || ''
        });
    },
    buttonHandler(event){
        wx.navigateTo({
            url: '../second/second'
        });
        // if (!event.detail.userInfo) return;
        // this.setData({
        //     name: event.detail.userInfo.nickName
        // })
        // const that = this;
        // wx.showModal({
        //     title: '操作确认',
        //     content: '你确认要修改吗？',
        //     success (res) {
        //         if (res.confirm) {
        //             that.setData({
        //                 name: '李四'
        //             }, function(){
        //                 wx.showToast({
        //                     title: '操作完成',
        //                     duration: 700
        //                 });
        //             });
        //         }else if(res.cancel){
        //             console.log('用户点击取消');
        //         }
        //     }
        // });
    },
    onLoad(){
        const that = this;
        wx.request({
            url: 'http://localhost:3000/items',
            success(res){
                that.setData({ items: res.data });
            }
        })
    }
});