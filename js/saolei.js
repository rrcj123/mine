
var button_Array ={"jiandan":"简单","zhongdeng":"中等","kunnan":"困难","zidingyi":"自定义","guize":"规则"};
for(var item in button_Array){
    $("#button").append(`<button id=${item}>${button_Array[item]}</button>`)
}

$("#xianshiqi").append(`<span id="shijian"></span>`);
$("#xianshiqi").append(`<span id="shengyu"></span>`);
var $game = $("#game"); //获取游戏区域
var $jiandan = $("#jiandan");//几种模式
var $zhongdeng = $("#zhongdeng");
var $kunnan = $("#kunnan");
var $zidingyi = $("#zidingyi");
var $tanchu_box = $("#tanchu_box");//自定义窗口
$tanchu_box.hide();  //默认关闭自定义窗口

var $queding = null; //获取确定按钮
var $quxiao = null;  //取消按钮
var hang = null;    //声明行,列,雷
var lie = null;
var lei = null;
var leiNum = null;
var yx_Time = '00:00';
var dingshi = null;

$("#zidingyi").click(function () {
    $tanchu_box.show()
    $("#tanchu_box").empty();
    $("#tanchu_box").append(`
<div id="tanchu">
    请输入行数(10~30):<input type="text" id="hang" size="1"><br>
    请输入列数(10~30):<input type="text" id="lie" size="1"><br>
    请输入地雷的数量(最小为10,最大为行数*列数的一半):<input type="text" id="lei" size="1"><br>
    <button id="queding">确定</button>
    <button id="quxiao">取消</button>
</div>`);
    $queding = $("#queding");
    $quxiao = $("#quxiao");
    $queding.click(function(){

        hang=$("#hang").val();    //获取用户输入的行,列.雷数
        lie=$("#lie").val();
        lei=$("#lei").val();
        if(jianyan(hang,30)||jianyan(lie,30)||jianyan(lei,hang*lie*0.5)){
            alert("范围不对,请重新输入");
            return;
        }
        $tanchu_box.hide();
        youxi(hang,lie,lei);
    });
    $quxiao.click(function () {
        $tanchu_box.hide();
    });
});

$("#guize").click(function () {
    $tanchu_box.show();
    $("#tanchu_box").empty();
    $("#tanchu_box").append(`
<div id="tanchu">
    <div>1.打开游戏或重新来过都重新计时</div>
    <div>1.鼠标左键翻开草地,右键插上或取消小旗</div>
    <div>2.翻开空白表示安全,数字表示该方块周围有几个雷</div>
    <div>3.如果感觉某个方块是雷,使用小旗标记</div>
    <div>4.如果翻开是空白,会自动检测周围,不是雷则自动翻开</div>
    <div>5.当翻开雷或者所有的雷都被找出来.游戏结束</div>
    <div>6.祝好运</div>
    <button id="queding">哦哦,我明白了</button>
</div>`);
    $queding = $("#queding");
    $queding.click(function(){

        $tanchu_box.hide();
    });
});

var leiArray = new Array(); //声明一个数组放雷
var leiArray_num = new Array();
var lei_Array_num = function (){
    for ( var i = 0; i < hang; i++) {
        leiArray_num [i] = new Array();
        for ( var j = 0; j < lie; j++) {
            leiArray_num [i][j] = 0;    //默认没有雷
        }
    }
};
var lei_Array = function (){
    for ( var i = 0; i < hang; i++) {
        leiArray[i] = new Array();
        for ( var j = 0; j < lie; j++) {
            leiArray[i][j] = 0;    //默认没有雷
        }
    }
};
var guize = function (a,b) {
    if(a<0||a==lie||b<0||b==hang) return 0;
    else return leiArray[a][b];
};
var num = function(num){    //声明生成随机数的函数
    return Math.floor(Math.random()*num);
};
var lei_zuobiao = function(){         //生成雷
    for(var k = 0;k < lei;){
        var x = num(hang);
        var y = num(lie);
        if(leiArray[x][y] != 1){
            leiArray[x][y] = 1;
            k++;
        }
    }
    for(var x = 0; x<lie; x++){
         for(var y = 0; y<lie; y++){
            if(leiArray[x][y]!=1){
               leiArray_num[x][y]=guize(x-1,y-1)+guize(x-1,y)+guize(x-1,y+1)+guize(x,y-1)+guize(x,y+1)+guize(x+1,y-1)+guize(x+1,y)+guize(x+1,y+1);
            }
        }
    }
    for(var i = 0;i < hang; i++){
        var $trTemp = $("<tr></tr>");
        for(var j = 0;j< lie; j++){
            $trTemp.append(`<td lei="${leiArray[i][j]}" num="${leiArray_num[i][j]}" qizhi="0" x="${i}" y="${j}" id="${i}_${j}" aria-disabled="true">&nbsp;</td>>`);
        }
        $game.append($trTemp);
    }
};
var shengyushuliang = function (num) {              //显示雷剩余数量
    $("#shengyu").empty();
    $("#shengyu").append(`剩余数量:${num}`);
};
var shijian = function () {              //显示时间
    $("#shijian").empty();
    $("#shijian").append(`游戏时间:${yx_Time}`);
};
var buling = function (num, length) {
    return (Array(length).join('0') + num).slice(-length);
};
var game_dingshi = function () {
    clearInterval(dingshi);
    var fen = 0;
    var miao = -1;
    dingshi = setInterval(() => {
        if(miao < 60)miao++;
        else {
            miao =0 ;fen++;
        }
        yx_Time = buling(fen,2)+":"+ buling(miao,2);
        shijian()
    },1000)
};
var jianyan=function(num,max) {    //检验自定义的时候输入的数据
    var number = /^[1-9][0-9]{1,}$/;
    if (!number.test(num)||num>max) {
        return true;
    }
};
var fankai_zhouwei = function (str) {
    $(str).css("background","#ffffff");
    if($(str).attr("num")!=0){
        $(str).html($(str).attr("num"))
    }
};
var fankai = function ($td) {    //翻开一个地板  检测周围是否有雷
    $td.css("background","#ffffff");
    if($td.attr("num")!=0){
        $td.html($td.attr("num"))
    }else{
        if(x-1<0||x+1==lie||y-1<0||y+1==hang){
                return;
        }else {
            var x = $td.attr("x");
            var y = $td.attr("y");
            var str=[];
            str[0]='#'+(parseInt(x)-1).toString()+'_'+(parseInt(y)-1);
            str[1]='#'+(parseInt(x)-1).toString()+'_'+y;
            str[2]='#'+(parseInt(x)-1).toString()+'_'+(parseInt(y)+1);
            str[3]='#'+x.toString()+'_'+(parseInt(y)-1);
            str[4]='#'+x.toString()+'_'+(parseInt(y)+1);
            str[5]='#'+(parseInt(x)+1).toString()+'_'+(parseInt(y)-1);
            str[6]='#'+(parseInt(x)+1).toString()+'_'+y;
            str[7]='#'+(parseInt(x)+1).toString()+'_'+(parseInt(y)+1);
            for(var i=0;i<8;i++){
                fankai_zhouwei(str[i]);
            }
        }
    }
};
var jieshu = function () {
    clearInterval(dingshi);
    var a=0;
    for (var x = 0;x<lie;x++){
         for(var y = 0;y < hang; y++){
              if(leiArray[x][y]!=0){
                  var str='#'+x.toString()+"_"+y;
                  if($(str).attr("qizhi")>0){
                      a++;
                  }
              }
          }
    }
    if(a==10){ 
		setTimeout(()=>{
			alert("厉害啊,大侠!","耗时:",yx_Time);
            youxi(hang,lie,lei);
        },100)
    }else {
		setTimeout(()=>{
			alert("不行啊,小老弟要仔细啊");
			youxi(hang,lie,lei);
		},100)
    }
};
var dianji = function(){    //检测鼠标点击事件
    $("td").mousedown(function(e) {         //鼠标点击
        //右键为3
        if (3 == e.which) {    //右键---小旗子
            if($(e.target).attr('qizhi')==0){
                $(e.target).attr('qizhi',1);
                $(e.target).css("background-image","url(./img/hongqi.jpg)");
                leiNum--;
            }else {
                $(e.target).attr('qizhi',0);
                $(e.target).css("background-image","url()");
                leiNum++;
            }
            shengyushuliang(leiNum);
            if(leiNum==0)jieshu();
        }else if (1 == e.which) {    //左键
            //左键为1
            if($(e.target).attr("lei")==1){   //点到的是雷
                $(e.target).css("background-image","url(./img/dilei.png)");
                setTimeout(()=>{
                    alert('大侠重新来过');
                    youxi(hang,lie,lei);
                },100)
            }
            else {
                fankai($(e.target));
            }
        }
    });
};

var youxi = function(hang_num,lie_num,lei_num){   //生成游戏
    $game.empty(); //清空游戏区域
    hang = hang_num;
    lie = lie_num;
    leiNum = lei = lei_num;
    shijian();
    lei_Array();
    lei_Array_num();
    lei_zuobiao();
    shengyushuliang(lei);
    game_dingshi();
    dianji();
};

youxi(10,10,10);  //默认难度

$jiandan.click(function () {  //生成简单模式
  youxi(10,10,10);
});
$zhongdeng.click(function () {//生成中等模式
   youxi(20,20,50);
});
$kunnan.click(function () {  //生成困难模式
   youxi(30,30,300);
});



$("#game").bind("contextmenu", function(){  //在游戏区域取消默认鼠标右击事件
    return false;
});





