/**
 * Created by jiangqian on 2017/3/18.
 */

/**计算rem**/
(function(win){
    var remCalc = {};
    var docEl = win.document.documentElement,
        tid,
        hasRem = true;
    hasZoom = true;
    designWidth = 750;
    function refresh(){
        var width = docEl.getBoundingClientRect().width;
        if(hasRem){
            var rem = width/10;
            docEl.style.fontSize = rem + "px";
            remCalc.rem = rem;
            var actualSize = parseFloat(window.getComputedStyle(document.documentElement)["font-size"]);
            if(actualSize!== rem && actualSize>0 && Math.abs(actualSize-rem)>1){
                var remScaled = rem*rem/actualSize;
                docEl.style.fontSize = remScaled + "px";
            }
        }
        if(hasZoom){
            var style = document.getElementById('y_style');
            if(!style){
                style = document.createElement('style');
                style.id = 'y_style';
            }
            style.innerHTML = '._z{zoom:'+ width/designWidth + '}';
            document.getElementsByTagName('head')[0].appendChild(style);
        }
    }
    function dbcRefresh(){
        clearTimeout(tid);
        tid = setTimeout(refresh,100);
    }
    win.addEventListener("resize",function(){
        dbcRefresh()
    },false);
    win.addEventListener("pageshow",function(e){
        if(e.persisted){
            dbcRefresh()
        }
    },false);
    refresh();
    if(hasRem){
        remCalc.refresh = refresh;
        remCalc.rem2px = function(d){
            var val = parseFloat(d)/this.rem;
            if(typeof d==="string" && d.match(/px$/)){
                val+="rem";
            }
            return val
        };
        win.remCalc = remCalc;
    }
})(window);

function pingFun(){

    //自动播放音乐
    $('#page01').bind('touchmove',function(e){
        e.preventDefault();
    });

    function puzzleStart(moveID,puzzleID){
        $('#'+moveID).unbind('touchmove').bind('touchmove',function(e){
            e.preventDefault();
            var touch = e.originalEvent.targetTouches[0];
            var x = touch.pageX;
            var y = touch.pageY;
            var w = parseFloat($(this).css('width'));
            var h = parseFloat($(this).css('height'));
            var bgw = parseFloat($('#page01').css('width'));
            var bgh = parseFloat($('#page01').css('height'));
            var windowW = window.innerWidth;
            var windowH = window.innerHeight;
            var lw =x-(windowW-bgw)/2;
            var lh =y-(windowH-bgh)/2;
            var puzzleX = parseFloat($('#'+puzzleID).css('left'));
            var puzzleY = parseFloat($('#'+puzzleID).css('top'));
            var puzzleW = parseFloat($('#'+puzzleID).css('width'));
            var puzzleH = parseFloat($('#'+puzzleID).css('height'));
            var bgW = parseFloat($('#bgpuzzle').css('width'));
            var bgH = parseFloat($('#bgpuzzle').css('height'));
            var bgX = parseFloat($('#bgpuzzle').css('left'));
            var bgY = parseFloat($('#bgpuzzle').css('top'));
            if(moveID=='moveicon01'){
                $(this).attr('src','img/p-1.png');
            }else if(moveID=='moveicon02'){
                $(this).attr('src','img/p-2.png');
            }else if(moveID=='moveicon03'){
                $(this).attr('src','img/p-3.png');
            }
            $('.hand').fadeOut();
            var musicGame = document.getElementById('musicGame');
            if(lw<=(bgX+bgW)&&lw>=(bgX-bgW)&&lh<=(bgY+bgH)&&lh>=(bgY-bgH-50)){
                $(this).css({'left':puzzleX,'top':puzzleY,'width':puzzleW,"height":puzzleH,"transition":'all 0.5s ease'});
                var timer = setTimeout(function(){
                    $('#'+puzzleID).hide();
                    $('#'+moveID).hide();
                    clearTimeout(timer);
                },500);
                total++;
                musicGame.volume=1;
                musicGame.muted=false;
                if(total==1){
                    if (musicGame.paused) { //判读是否播放
                        musicGame.pause();
                        musicGame.currentTime = 0;
                        musicGame.play();
                    }
                    var timer11 = setTimeout(function(){
                        $('#page-title').addClass('move-title');
                        clearTimeout(timer11);
                    },500);
                }else if(total==2){
                    console.log(musicGame.currentTime);
                    musicGame.pause();
                    musicGame.currentTime = 0;
                    musicGame.play();
                }else if(total==3){
                    musicGame.pause();
                    musicGame.currentTime = 0;
                    musicGame.play();
                    $('.p-left-01').addClass('left01');
                    $('.p-left-02').addClass('left02');
                    $('.p-right-01').addClass('right01');
                    var timer03 = setTimeout(function(){
                        $('.p-left-no01').fadeOut();
                        $('.p-left-no02').fadeOut();
                        $('.p-right-no01').fadeOut();
                        clearTimeout(timer03);
                        var timer02 = setTimeout(function(){
                            $('.ending').fadeIn(400);
                            $('#page01').fadeOut(400);
                            $('.btn-music').fadeOut(400);
                            musicStar.pause();
                            clearTimeout(timer02);
                        },520);
                    },300);
                }
                $(this).unbind('touchmove');
            }else{
                if(lw>windowW-w/2-(windowW-bgw)/2){
                    $(this).css({'left':windowW-w-(windowW-bgw)/2});
                }else if(lw<w-(windowW-bgw)/2){
                    $(this).css({'left':-(windowW-bgw)/2});
                }else{
                    $(this).css({'left':lw-w/2});
                }

                if(lh>windowH-h/2-(windowH-bgh)/2){
                    $(this).css({'top':windowH-h-(windowH-bgh)/2});
                }else if(lh<h-(windowH-bgh)/2){
                    $(this).css({'top':-(windowH-bgh)/2});
                }else{
                    $(this).css({'top':lh-h/2});
                }
            }
        });
    }
    var total = 0;
    puzzleStart('moveicon01','puzzle01');
    puzzleStart('moveicon02','puzzle02');
    puzzleStart('moveicon03','puzzle03');
};
function ImgLoadingByFile(imgArray,loadPageID,loadTxtID,showpageID){
    function complete(long){
        var timer = setTimeout(function(){
            $('#'+loadPageID).hide();
            $('#'+showpageID).show();
            $('.btn-music').show();
            //musicStar.load();
            musicStar.pause();
            musicStar.play();
            musicGame.load();
            //音乐
            clearTimeout(timer);
        },long);
    }
    if(sessionStorage.getItem("pageloaded")){
        $('#'+loadTxtID).html('100%');
        complete(2000);
    }else{
        var imgLoad = 0;
        var btime = new Date();
        if(imgArray.length>0){
            var imgTotal = imgArray.length;
            var percent = 0;
            var img = [];
            for(var i = 0;i<imgArray.length;i++){
                img[i] = new Image();
                img[i].src=imgArray[i];
                img[i].onload = function(){
                    imgLoad++;
                    percent = parseInt(imgLoad/imgTotal*100);
                    $('#'+loadTxtID).html(percent+'%');
                    console.log(percent);

                    if(percent>=100){
                        var etime = new Date();
                        console.log(etime-btime);
                        if(etime-1000>btime){
                            complete(100);
                        }else{
                            complete(1800);
                        }

                        sessionStorage.setItem("pageloaded", "true");

                    }
                }
            }
        }
    }
}

//横屏
function landscape(){
    var w = window.Utils.windowW();
    var h = window.Utils.windowH();
    $("body").css({"width":w,"height":h});
    $('#page-landscape').css({"width":w,"height":h}).show();
    $('#page-portrait').css({"width":w,"height":h});

}
var firstInit = true;
//竖屏
function portrait(){

    var w = window.Utils.windowW();
    var h = window.Utils.windowH();
    //初始化加载
    if(firstInit){
        $("body").css({"width":w,"height":h});
        $('#page-portrait').css({"width":w,'height':h}).show();
        $('#page-landscape').hide();

        var imgFile = [
            './img/123.jpg',
            './img/b-bg01.png',
            './img/b-bg02.png',
            './img/b-bg03.png',
            './img/hand.png',
            './img/icon1.png',
            './img/icon2.png',
            './img/icon3.png',
            './img/load.gif',
            './img/music-close.png',
            './img/music-open.png',
            './img/X2.png',
            './img/p-1.png',
            './img/p-2.png',
            './img/p-3.png',
            './img/share.jpg'
        ];
        ImgLoadingByFile(imgFile,'loadingPage','loadTxt','pageContainer');
        pingFun();
        firstInit = false;
    }else {
        $("body").css({"width":w,"height":h});
        $('#page-portrait').css({"width":w,'height':h}).show();
        $('#page-landscape').hide();
    }
    $('.btn-music').click(function(){
        if(musicStar.paused){
            musicStar.play();
            $('.open').show();
            $('.clock').hide();
        }else{
            musicStar.pause();
            $('.open').hide();
            $('.clock').show();
        }
    });

}

(function() {
    "use strict";

    function Utils() {
    }

    Utils.isWeiXin = function(){
        return navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/);
    };
    Utils.isQQ = function(){
        return navigator.userAgent.ua.match(/QQ\/([\d\.]+)/);
    };
    Utils.isQZone = function(){
        return navigator.userAgent.ua.indexOf("Qzone/") !== -1;
    };

    Utils.isIos = function() {
        return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    };
    Utils.isIPhone = function() {
        return navigator.userAgent.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1;
    };
    Utils.isIpad = function() {
        return navigator.userAgent.indexOf('iPad') > -1;
    };
    Utils.isAndroid = function() {
        var u = navigator.userAgent;
        return navigator.userAgent.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
    };
    Utils.isMobile = function() {
        // var u = navigator.userAgent;
        return navigator.userAgent.match(/(iPhone|iPod|Android|ios|SymbianOS)/i) != null;
    };

    // ## 屏幕方向
    Utils.isPortrait = function() {
        if (!Utils.isMobile()) {
            //alert(111);
            return true;

        }
        // 安卓版 微信里面 只用判断 width 和 height
        if (Utils.isAndroid() && Utils.isWeiXin()) {
            if (Utils.windowW() < Utils.windowH()) {
                //alert(22);
                return true;

            } else {
                //alert(331);
                return false;

            }
        }
        var orientation = window['orientation'];
        if (orientation||orientation==0) {
            if (orientation == 90 || orientation == -90) {
                //alert(4442);
                return false;

            }else{
                //alert(555111);
                return true;

            }
        } else {
            if (Utils.windowW() < Utils.windowH()) {
                //alert(666111);
                return true;

            } else {
                //alert(777111);
                return false;

            }
        }
    };
    // ## jquery 获取 window 的宽度
    Utils.windowW = function() {
        // var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        return $(window).width();
    };
    // ## jquery 获取 window 的高度
    Utils.windowH = function() {
        return $(window).height();
    };
    window.Utils = Utils;
}());
$(function(){
    onResize();
    if (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", onResize, false);
    }else{
        window.addEventListener( "resize", onResize, false);
    }
});

function  onResize() {

    if(Utils.isPortrait()){
        if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){

            var timer = setTimeout(function(){
                portrait();

                clearTimeout(timer);
            },100);
        }else{
            portrait();
        }
    } else {
        if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
            var timer = setTimeout(function(){
                landscape();
                clearTimeout(timer);
            },100);
        }else{
            landscape();
        }
    }
}