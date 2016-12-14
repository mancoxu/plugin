
# 插件说明
## ajax => ajax

```javascript
// 使用方法在 waterfall 里有用到

var Ajax = Request(); 
Ajax.jsonp({
    url:请求地址, 
    type:"get",      //post
    dataType:"json", // jsonp
    success:function(data){   
        //请求成功
    }
}) 
```
## carousel => 图片轮播
```javascript
ScrollImg({
    wrap:"scrollImgWrap",					//	插件ID - 必写
    liWidth: 320,							//	li 宽  - 必写
    liMarRight: 10,							//	li 右边距 - 必写
    showNum: 4,	   							//  显示数目 - 可写  【默认4】
    scrollNum: 4,							//	滚动数目 - 可写	 【默认4】		
    loops: true, 							//  是否循环 - 可写  【默认循环】
    autoPlay: true, 						//  是否自动播放 - 可写 【默认自动播放】
    delay: 3000,							//  多久切换一次 - 可写  【默认3s】
    duration: 1000,							//  动画运行一次所需时间 - 可写
    effect: 4, 								//  切换效果 （1、2、3、4） - 可写
    showBtn: true, 						    //  是否显示左右按钮 - 可写
    showPage: true,						    //  是否显示页数 - 可写
    pageIndexClass:"on"						//  索引页类名 - 可写
});
```
## enlargement => 图片放大镜
## player => 音乐播放器
## scroll => 自定义滚动条
```javascript
MxScrollBar({
    tag		 : elementId, 		//  目标ID
    Anim	 : true,			//	是否动画  			默认 true
    Rang     : 50, 				//	滚动距离 			默认 50
    scrH     : "auto",  		//	滚动条高 			默认 auto , eg: 100
    scrPos   : "auto",			//  滚动条定位			  默认 auto , eg: 100
    callbacks: function (){}	//	参数返回滚动top值
})
```
## waterfall => 瀑布流
