layui.define(['layer', 'laytpl', 'layer_mobile/layer'], function (exports) {

    var layer = layui.layer,
        laytpl = layui.laytpl,
        layer_mobile = layui['layer_mobile/layer'];

    var host = "http://10.0.3.25:8000";
    // var host="";

    // 接口定义
    var interface = {
        address: '',
        isApp: /baoxiang/.test(navigator.userAgent),
        getLoginInfo: _ajax(host + '/secure/get-login-info.html'), // 登录
        //我的奖品
        myGifts: _ajax(host + '/act-millionaire/my-gifts.html', false),
        //初始化信息
        initData: _ajax(host + '/act-millionaire/index.html', true),
        //保存地址
        saveAddress: _ajax(host + '/act-millionaire/save-address.html', false),
        //掷骰子
        lottery: _ajax(host + '/act-millionaire/lottery.html', false, true)


        // // 我的中奖记录
        // myGifts: _ajax(host + './js/my-gifts.json', true),
        // //初始化信息
        // initData: _ajax(host + './js/index.json', true),
        // //保存地址
        // saveAddress: _ajax(host + './js/save-address.json'),
        // //掷骰子
        // lottery: _ajax(host + './js/lottery.json', false)
    }



    exports('interface', interface);
    /**
     * 
     * @param {String} url
     * @param {Boolean} noNeedLogin // 不需要登录 true
     */
    function _ajax(url, noNeedLogin, noNeedMessage) {

        return function (data) {
            return $.ajax({
                url: url,
                data: data
            }).then(function (result, status, xhr) {

                if (!noNeedLogin) {
                    if (result.isLogin === false || result.success === false) {
                        // PC 登录
                        if (!layui.device().weixin && !layui.device().android && !layui.device().ios && !interface.isApp) {
                            layer.open({
                                type: 2,
                                area: ['489px', '454px'],
                                shade: [0.6, '#000'],
                                closeBtn: true,
                                title: false, //不显示标题
                                content: host + '/index/login-layer.html' //捕获的元素
                            });
                        } else {
                            // h5登陆
                            layer_mobile.open({
                                content: '您还没有登录，马上去登录？',
                                btn: ['确定', '取消'],
                                yes: function (index) {

                                    if (interface.isApp) {
                                        // APP
                                        location.href = "baoxiang://APPLogin";
                                    } else {
                                        // 浏览器
                                        location.href = host + "/login/index.html?redirect=" + location.href;
                                    }

                                }
                            });
                        }
                        return result;
                    }
                }
                if (!noNeedMessage) {
                    if (result.type == false) {
                        layer.msg(result.message)
                    }
                }
                return result
            })
        }
    }
});

function loginSuccess() {
    location.reload();
}

