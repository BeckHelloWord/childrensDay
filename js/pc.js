layui.define(["layer", "laytpl", "layer_mobile/layer", "interface"], function(
    exports
  ) {
    var layer = layui.layer,
      laytpl = layui.laytpl,
      interface = layui.interface,
      layer_mobile = layui["layer_mobile/layer"];
  
    //layer 全局设置
    layer.config({
    //   skin: "childrensDay",
      title: false, //标题
      shadeClose: true, //开启遮罩关闭
      closeBtn: 1 //不显示关闭按钮
    });
  
    //初始化内容
    interface.initData().then(function(res) {
      console.log(res)
      //游戏地图渲染
      laytpl(document.getElementById("mapTemplate").innerHTML).render(
        res,
        function(html) {
          document.getElementById("gameMapDom").innerHTML = html;
        }
      );
  
      //奖品名单渲染
      laytpl(document.getElementById("winningTempalte").innerHTML).render(
        res,
        function(html) {
          document.getElementById("winningDom").innerHTML = html;
          if (res.winList.length > 3) {
            //获奖名单滚动
            var firstDom = $(".js-winning-list p:first");

            function scrollDom() {
              $(".js-winning-list").animate(
                {
                  marginTop: -firstDom.height()
                },
                1000,
                function() {
                  $(this).css("margin-top", 0);
                  firstDom.appendTo($(this));
                }
              );
            }
            setInterval(scrollDom, 2000);
  
      
          }
        }
      );
    });
  
    //看规则弹框
    $(".js-rule").on("click", function() {
      var index = layer.open({
        skin: "childrensDay",
        type: 1,
        area: ["88%", "auto"],
        content: $(".js-layer-rule")
      });
  
      $(".js-layer-rule-closed").on("click", function() {
        layer.close(index);
      });
    });
  
    //我的奖品弹框
    $(".js-reward").on("click", function() {
      interface.myGifts().then(function(res) {
        if (res.issuccess) {
          laytpl(
            document.getElementById("layer-reward-tempalte").innerHTML
          ).render(res, function(html) {
            var index = layer.open({
                skin: "childrensDay",
              type: 1,
              area: ["88%", "auto"],
              content: html
            });
  
            $(".js-layer-reward-closed").on("click", function() {
              layer.close(index);
            });
          });
        }
      });
    });
  
    //我知道了
    $(document).on("click", ".common_imgs_btn_left", function() {
      layer.closeAll();
      var firstFun = arrList.shift();
      if (typeof firstFun == "function") {
        firstFun();
      }
    });
  
    // 继续投掷
    $(document).on("click", ".common_imgs_btn_right", function() {
      layer.closeAll();
      $(".big_btn").trigger("click");
    });
  
    //提交地址
    $(document).on("click", ".common_imgs_btn_left", function() {
        //保存地址
        
        var addressVal = $(".js-info-address")
          .val()
          .trim();
    
        if (addressVal == "") {
          layer.msg("地址不能为空");
        } else if (addressVal.length > 25) {
          layer.msg("收货地址不能超过25个字符");
        } else {
          interface.saveAddress().then(function(res) {
            layer.closeAll();
            var firstFun = arrList.shift();
            if (typeof firstFun == "function") {
              firstFun();
            }
          });
        }
      });
  
    // 显示中奖结果
    var getResult = function(obj, layerDom) {
      return function() {
        laytpl(layerDom).render(obj, function(html) {
          var index = layer.open({
            skin: "childrensDay",
            type: 1,
            area: ["auto", "auto"],
            content: html
          });
        });
      };
    };
  
    //弹框列表
    var arrList = [];
  
      //前进或者后退
      var moveStep = function(obj, flg) {
        var num = 0,
            startPoint= obj.originalGift.pos+obj.point; //上次位置+本次骰子点数
        return function() {
          var moveInt = setInterval(function() {
            if (++num <= obj.sourceGift.distance) {
              if (flg) {
                //前进
                var addNum = ++startPoint;
              } else {
                //后退
                var addNum = --startPoint;
              }
              $(".product-item").eq(addNum - 1).addClass("current").siblings().removeClass("current");
            } else {
              arrList.shift()();
              clearInterval(moveInt);
            }
          }, 300);
        };
      };
  
    
      //添加弹框队列
    function addLayers(obj){
          //走完一圈
          if (obj.overRound) {
            arrList.push(getResult(obj,document.getElementById("extraResultTemplate").innerHTML));
          }
          //前进一步
          if (obj.mode == 1) {
            arrList.push(getResult(obj,document.getElementById("progressResultTemplate").innerHTML));
            arrList.push(moveStep(obj, true));
            if(obj.targetGift.isGood){
              //实物
              arrList.push(getResult(obj,document.getElementById("commodityTemplate").innerHTML));
              arrList.push(getResult(obj,document.getElementById("deliveryTemplate").innerHTML));
            }else{
              // 非实物
              arrList.push(getResult(obj,document.getElementById("giftResultTemplate").innerHTML));
            }
          }
          //后退一步
          if (obj.mode == -1) {
            arrList.push(getResult(obj,document.getElementById("retreatResultTemplate").innerHTML));
            arrList.push(moveStep(obj, false));
            if(obj.targetGift.isGood){
              //实物
              arrList.push(getResult(obj,document.getElementById("commodityTemplate").innerHTML));
              arrList.push(getResult(obj,document.getElementById("deliveryTemplate").innerHTML));
            }else{
              // 非实物
              arrList.push(getResult(obj,document.getElementById("giftResultTemplate").innerHTML));
            }
           
          }
           //中奖了
          if (obj.mode == 0) {
            arrList.push(getResult(obj,document.getElementById("giftResultTemplate").innerHTML));
          }
          //再丢一次
          if (obj.mode == 2) {
             arrList.push(getResult(obj,document.getElementById("retryResultTemplate").innerHTML));
          }
          //未抽中奖品
          if (obj.mode == 3) {
            // arrList.push(getResult(obj,document.getElementById("retryResultTemplate").innerHTML));
          }
    }

    
  //掷骰子
  function getDice(res, _this) {
    var dice = $(".dice");
    dice.attr("class", "dice"); //清除上次动画后的点数
    var num = Math.floor(Math.random() * 6 + 1); //产生随机数1-6
    dice
      .animate(
        {
          left: "1%"
        },
        100,
        function() {
          dice.addClass("dice_t");
        }
      )
      .delay(200)
      .animate(
        {
          top: "-1%"
        },
        100,
        function() {
          dice.removeClass("dice_t").addClass("dice_s");
        }
      )
      .delay(200)
      .animate(
        {
          opacity: "show"
        },
        600,
        function() {
          dice.removeClass("dice_s").addClass("dice_e");
        }
      )
      .delay(100)
      .animate(
        {
          left: "-1%",
          top: "1%"
        },
        100,
        function() {
          dice.removeClass("dice_e").addClass("dice_" + num);
          $(".js-mascot").hide();
          movePiece(res, _this);
        }
      );
  }

  // 移动棋子
  function movePiece(obj, _this) {
    var counter = 0, //计步器
      itemLength = $(".product-item").length, //棋子个数
      outset = obj.originalGift.pos, //上一次的位置
      point = obj.point; //本次投掷的点数

    //跑路
    function animation() {
      counter++;

      if (counter <= point) {
        //跑完一圈
        if (++outset == itemLength) {
          outset = 0;
        }
        $(".product-item")
          .eq(outset - 1)
          .addClass("current")
          .siblings()
          .removeClass("current");
      } else {
        clearInterval(intervalID);
        arrList.shift()();
        _this.removeClass("btn-disabled");
      }
    }

    clearInterval(intervalID);
    var intervalID = setInterval(animation, 300);
  }

  //投掷
  $(".js-game-btn").on("click", function() {
    var _this = $(this);

    _this.addClass("btn-disabled");

    interface.lottery().then(function(res) {
      //剩余抽奖次数
      if (res.avlTimes > 0) {
        addLayers(res);
        $(".js-game-number").text(res.avlTimes);
        getDice(res, _this);
      } else {
        //没有机会了
        var index = layer.open({
            skin: "childrensDay",
          type: 1,
          area: ["88%", "auto"],
          content: $(".js-layer-nochance")
        });

        $(".js-nochance-closed").on("click", function() {
          layer.close(index);
          _this.removeClass("btn-disabled");
        });
      }
    });
  });
  
  
    // 移动棋子
    function movePiece(obj, _this) {
      var counter = 0, //计步器
          itemLength=$(".product-item").length, //棋子个数
          outset = obj.originalGift.pos,//上一次的位置
          point=obj.point;  //本次投掷的点数
  
      //跑路
      function animation() {
        counter++;
  
        if (counter <= point) {
          //跑完一圈
          if (++outset == itemLength) {
            outset = 0;
          }
          $(".product-item").eq(outset - 1).addClass("addStyle").siblings().removeClass("addStyle");
        } else {
          clearInterval(intervalID);
          arrList.shift()();
          _this.removeClass("btn-disabled");
        }
      }
  
      clearInterval(intervalID);
      var intervalID = setInterval(animation, 300);
    }
  
    //投掷
    $(".big_btn").on("click", function() {
      var _this = $(this);
  
      _this.addClass("btn-disabled");
  
      interface.lottery().then(function(res) {
        //剩余抽奖次数
        if(res.avlTimes>0){
          addLayers(res);
          $('.js-mascot').hide();
          movePiece(res, _this);
        }else{
          //没有机会了
          var index = layer.open({
            skin: "childrensDay",
            type: 1,
            area: ["88%", "auto"],
            content: $(".common_imgs_changs")
          });
      
          $(".js-nochance-closed").on("click", function() {
            layer.close(index);
            _this.removeClass("btn-disabled");
          });
        }
      });
    });

      // 点击小象规则弹框层
      $('.active').on('click', function () {
   
        layer.open({
            skin: "childrensDay",
            type: 1,
            area: ['790px', '510px'],
            title: false,
            shadeClose: true, //点击遮罩关闭
            content: $(".insert_imgs")
        });
    });


    
    // 模拟中奖弹框效果

 
    $('.win').on('click', function () {
   
        layer.open({
            skin: "childrensDay",
            type: 1,
            area: ['521px', '321px'],
            title: false,
            shadeClose: true, //点击遮罩关闭
            content: $(".common_imgs")
        });
    });


  
    exports('pc', {});
  });
  

    
  








    

