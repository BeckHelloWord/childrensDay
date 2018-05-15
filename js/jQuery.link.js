/**
 * Created by yy on 2016/1/20.
 */

//对应参考表
/*  "/web/lc/invest/list.html": "baoxiang://APPProjectList", //我要投资
    "/lc/invest/list.html": "baoxiang://APPProjectList", //我要投资
    "/center/message/index": "baoxiang://APPMessage",    //消息界面
    "/center/recommend/index?controller=recommend&amp%3Bformat=html&amp%3Baction=index&format=html&action=index": "baoxiang://APPInviteFriendPage",//邀请好友
    "/center/invite/index": "baoxiang://APPInviteFriendPage",    //好友邀请
    "/center/invest/receipt-plan": "baoxiang://APPCalendarPayBack",  //回款
    "/center/recharge/index": "baoxiang://APPTopUp", //充值界面
    "/center/money/statistics": "baoxiang://APPMyWealth", //我的财富
    "/center/invest/index": "baoxiang://APPMyInvestingRecord",    //投资记录
    "/center/home/index": "baoxiang://APPBaoxiangCoin",	//每日签到
    "/center/packet/list": "baoxiang://APPRedPacketList",    //红包列表
    "/topic/201604/CCFP/": "//m.bxjr.com/topic/recommend/"    //好友推荐活动*/

    $(function () {
        (function link(elements) {
            
            if (/baoxiang/.test(navigator.userAgent)) {
                // console.log(2)
                $('a.appUrl').each(function () {
                    var appUrl = $(this).data().appUrl;
                    if (appUrl) {
                        $(this).attr('href', appUrl);
                    }
                })
            }
        })();
    })
    