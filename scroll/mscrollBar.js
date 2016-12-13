;(function(){
/* 
 *
 *	作者:   老可 
 *	时间:   2015.05.22 
 *	版本:  	v1.5
 *  QQ  :   279662403
 *  兼容:   IE7+
 *	
*/
 
var EventUtil = EventUtil || {}; 
EventUtil.EU = {
	addHandler: function(ele, type, handler) {
		if (ele.addEventListener) {
			ele.addEventListener(type, handler, false)
		} else if (ele.attachEvent) {
			ele.attachEvent("on" + type, handler)
		} else {
			ele["on" + type] = handler;
		}
	},
	removeHandler: function(element, type, handler) {
		if (element.removeEventListener) {
			element.removeEventListener(type, handler, false);
		} else if (element.detachEvent) {
			element.detachEvent("on" + type, handler);
		} else {
			element["on" + type] = null;
		}
	},
	getEvent: function(event) {
		return event ? event : window.event;
	},
	getTarget: function(event) {
		return event.target || event.srcElement;
	},
	preventDefault: function(event) {
		if (event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false; 
		}
	},
	stopPropagation: function(event){
        if (event.stopPropagation){
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },
	getId: function(id) {
		return document.getElementById(id);
	}
}





function MxScrollBar(id) {
	this.oScrBar = EventUtil.EU.getId(id);  
	this.settings = {
		Anim	 : true,			//	是否动画  			默认 true
		Rang     : 50, 				//	滚动距离 			默认 50
		scrH     : "auto",  		//	滚动条高 			默认 auto , eg: 100
		scrPos   : "auto",			//  滚动条定位			默认 auto , eg: 100
		callbacks: function (){}	//	参数返回滚动top值
	} 
	
}
MxScrollBar.prototype = {
	constructor: MxScrollBar,

	init: function(options) {  
		var _this = this;  

		_this.obj = _this.extendDeep(options, _this.settings);

		/*options = options || {};
		for(var def in _this.settings){

			if (typeof options[def] === 'undefined') {   
				options[def] = _this.settings[def]; 
			}else{  
				_this.settings[def] = options[def]; 
			}

		}*/

		_this.addScrEle();  	
		_this.dragHFn();
		

		//删除、添加事件
		if (_this.oMaxH < 0) {

			_this.dragDropFn().removedragEvt(); 
			_this.clickFn().removeclickEvt();  
			_this.scrollEFn().removeScrollEvt(); 
			_this.oDragMain.style.cssText = "display:none;";

		}else{ 

			_this.dragDropFn().dragEvent(); 
			_this.clickFn().clickEvt(); 
			_this.scrollEFn().scrollEvt(); 
			_this.oDragMain.style.cssText = "display:block;";
			_this.setScrollT(); 	

		}
	},

	

	// 添加滚动条 , 完善 demo结构
	addScrEle: function(){

		var _this = this,
			oFrag = document.createDocumentFragment(), //创建一个文档碎片，优化DOM回流操作
			oDragM = document.createElement('div'),
			_scrollHtml = '',
			_dragHtml = '',
			nNum = Math.random() * 100,  
		 	newHtml = _this.oScrBar.innerHTML;

		_scrollHtml = '<div class="mx-ScrollBox" style="position:relative; height:100%; overflow:hidden; max-width:100%;"><div class="mx_container" style="position: absolute;top: 0;left: 0;width: 100%;height: auto;overflow: hidden;">'+ newHtml +'</div></div>';

		_dragHtml = '<div class="mx-draggerCon"><div class="mx-draggerCn Draggable' + nNum + '"></div></div>'; 

		_this.tardrag = "Draggable" + nNum; 

		oDragM.innerHTML = _dragHtml; 
		_this.oScrBar.innerHTML = _scrollHtml;

		_this.oScrBox = _this.oScrBar.children[0]; 
		_this.oScrCn = _this.oScrBox.getElementsByTagName('div')[0];  
		_this.oMaxH = _this.oScrCn.offsetHeight - _this.oScrBox.offsetHeight;

		_this.oDragMain = oDragM.children[0];
		_this.oDragCn = _this.oDragMain.getElementsByTagName('div')[0]; 

		oFrag.appendChild(oDragM); 
		_this.oScrBar.appendChild(oFrag);  

	},

	// 设置默认滚动条高度 
	dragHFn: function(){	
		var _this = this, 
			oDraPer = Math.round(_this.oScrBox.offsetHeight / _this.oScrCn.offsetHeight * 10000) / 100.00; //+ "%"
			// eg: 2/3
		var settingsH = _this.obj.scrH,
			dragCn = _this.oDragCn;

		if (typeof  settingsH == "string" && settingsH === "auto") {  

			if (oDraPer <= 5) {  

				dragCn.style.height = 5 + "%";

			}else if (oDraPer >= 100) { 

				dragCn.style.height = 98 + "%";

			}else{ 

				dragCn.style.height = oDraPer + "%"; 

			} 

		}else if(typeof settingsH == 'number'){

			if (settingsH < 1) { 

				dragCn.style.height = 2 + "px";

			}else if(settingsH >= parseInt(_this.oScrBox.offsetHeight)){

				dragCn.style.height = (_this.oScrBox.offsetHeight - 10) + "px"; 

			}else{

				dragCn.style.height = settingsH + "px"; 

			}

		}else{
			throw new Error("options.scrH 参数不对")
		}  

	},

	// 滚动事件监听
	scrollEFn: function() {
        var _this = this,
        	oDetail,
            _B = true;

        function handleEvent(event){

	        event = EventUtil.EU.getEvent(event); 
	        oDetail = event.wheelDelta ? event.wheelDelta : (-event.detail * 40);
	        _B = oDetail > 0 ? true : false;  

	        if (_B) {
	        	_this.setTop(_this.oDragCn.offsetTop - _this.obj.Rang)
	        }else{
	        	_this.setTop(_this.oDragCn.offsetTop + _this.obj.Rang)
	        }

	        EventUtil.EU.preventDefault(event); 
        }
        return{

        	scrollEvt: function(){

        		EventUtil.EU.addHandler(_this.oScrBox, "mousewheel",handleEvent);
		        EventUtil.EU.addHandler(_this.oScrBox, "DOMMouseScroll",handleEvent);
		        EventUtil.EU.addHandler(_this.oDragMain, "mousewheel",handleEvent);
		        EventUtil.EU.addHandler(_this.oDragMain, "DOMMouseScroll",handleEvent);

        	},

        	removeScrollEvt: function(){

        		EventUtil.EU.removeHandler(_this.oScrBox, "mousewheel",handleEvent);
		        EventUtil.EU.removeHandler(_this.oScrBox, "DOMMouseScroll",handleEvent);
		        EventUtil.EU.removeHandler(_this.oDragMain, "mousewheel",handleEvent);
		        EventUtil.EU.removeHandler(_this.oDragMain, "DOMMouseScroll",handleEvent);

        	}

        }

    },

    // 单击事件监听
    clickFn: function() {
    	var _this = this; 

    	function handleEvent(event){
    		event = EventUtil.EU.getEvent(event);

    		var target = EventUtil.EU.getTarget(event),
    			_WinScrT = document.documentElement.scrollTop || document.body.scrollTop,
    			_DisY = event.clientY + _WinScrT - (_this.oDragMain.getBoundingClientRect().top + _WinScrT),
    			_S = (_DisY - _this.oDragCn.offsetHeight/2).toFixed(0); 

    		target.className.indexOf(_this.tardrag) > -1 ? EventUtil.EU.stopPropagation(event) : _this.setTop(_S); 
    		 
    	}

    	return{

    		clickEvt: function() {

    			EventUtil.EU.addHandler(_this.oDragMain,"click",handleEvent);

    		},

    		removeclickEvt: function(){
    			 EventUtil.EU.removeHandler(_this.oDragMain,"click",handleEvent); 
    		}

    	}
    	
    }, 

    // 拖动事件监听
	dragDropFn: function() {
		var _this = this,
			dragging = null,
			DiffY = 0;

		function handleEvent(event) { 
			event = EventUtil.EU.getEvent(event);

			var target = EventUtil.EU.getTarget(event),
			_WinScrTop = document.documentElement.scrollTop || document.body.scrollTop; 
 
			switch (event.type) {

				case "mousedown": 

					if (target.className.indexOf(_this.tardrag) > -1) {  

						dragging = target; 
						EventUtil.EU.preventDefault(event) 
						EventUtil.EU.stopPropagation(event)
						DiffY = event.clientY + _WinScrTop - dragging.offsetTop; 

						if (dragging.setCapture) {
							dragging.setCapture();
						}
					}
					break;

				case "mousemove":
 
					if (dragging !== null) {

						var _T = event.clientY + _WinScrTop - DiffY; 
						_this.setTop(_T);

					}
					break;
				case "mouseup": 

					if (_this.oDragCn.setCapture) {

						_this.oDragCn.releaseCapture();

					}
					dragging = null;
					break;
			}

		}
		return {
			dragEvent: function() {

				EventUtil.EU.addHandler(document, "mousedown", handleEvent);
				EventUtil.EU.addHandler(document, "mousemove", handleEvent);
				EventUtil.EU.addHandler(document, "mouseup", handleEvent);

			},

			removedragEvt: function() {

				EventUtil.EU.removeHandler(document, "mousedown", handleEvent);
				EventUtil.EU.removeHandler(document, "mousemove", handleEvent);
				EventUtil.EU.removeHandler(document, "mouseup", handleEvent);

			}

		}

	},

	// 设置滚动条位置默认值
	setScrollT: function(){
		var _this = this,
		setScrPos = _this.obj.scrPos; 

		if (typeof setScrPos == "string" && setScrPos === "auto") {
			return;
		}
		else if (typeof setScrPos == "number"){

			var _abs = - (Math.abs(setScrPos));

			if (-_abs >= _this.oScrCn.offsetHeight - _this.oScrBox.offsetHeight) { 
				_abs = -(_this.oScrCn.offsetHeight - _this.oScrBox.offsetHeight); 
			}

			var	_sca = _abs/(_this.oScrCn.offsetHeight - _this.oScrBox.offsetHeight),
				_n = - (_sca * (_this.oDragMain.offsetHeight - _this.oDragCn.offsetHeight)).toFixed(0),
				_f = -_n;

			if (_this.obj.Anim) {

				_this.buttur(_this.oScrCn, {top:_abs}); 
				_this.buttur(_this.oDragCn, {top:_n}); 

			}else{

				_this.oScrCn.style.top = _abs + "px"; 
				_this.oDragCn.style.top = _n + "px";

			}

			_this.obj.callbacks.call(_this,_abs);  

		}else{

			throw new error("error")

		} 

	},

	// 滚动核心
	setTop: function(t) {
		var _this = this;   

		if (t <= 0) {

			t = 0;

		}else if(t >= _this.oDragMain.offsetHeight - _this.oDragCn.offsetHeight) {

			t = _this.oDragMain.offsetHeight - _this.oDragCn.offsetHeight;
		}  

 		var scale = t / (_this.oDragMain.offsetHeight - _this.oDragCn.offsetHeight), 
			nwe = -scale * _this.oMaxH,
			Nscale = nwe.toFixed(0);   

		if (_this.obj.Anim) {

			_this.buttur(_this.oDragCn, {top:t});
			_this.buttur(_this.oScrCn, {top:Nscale})

		}else{

			_this.oDragCn.style.top = t + "px"; 
			_this.oScrCn.style.top = Nscale + "px";

		};

		_this.obj.callbacks.call(_this,Nscale)  
		 
	}, 

	// ANIM
    buttur: function(ele, obj) {

        window.clearTimeout(ele.timer);

        var _this = this,
            end = null;

        for (direc in obj) {

            var direc1 = direc.toLowerCase(),
                strOffset = "offset" + direc1.substr(0, 1).toUpperCase() + direc1.substring(1).toLowerCase(),
                target = obj[direc],
                nSpeed = (target - ele[strOffset]) / 8; 
                
            nSpeed = nSpeed >= 0 ? Math.ceil(nSpeed) : Math.floor(nSpeed);
            ele.style[direc1] = ele[strOffset] + nSpeed + "px";
            end += nSpeed;

        }

        if (end)

            if (typeof fnCallback == "function") {
                fnCallback.call(ele);
            } else {

                ele.timer = window.setTimeout(function() {
                    _this.buttur(ele, obj)
                }, 20);

            }
    }, 

    // 深复制
	extendDeep: function(parent,child){
		var i,
			toStr = Object.prototype.toString(),
			astr = "[Object Array]";

		child = child || {};

		for(i in parent){

			if (parent.hasOwnProperty(i)) {

				if (typeof parent[i] === "Object") {

					child[i] = (toStr.call(parent[i]) === astr) ? [] : {};
					extendDeep(parent[i], child[i]);

				} else {

					child[i] = parent[i];
				}
			}

		}

		return child;
	}

}

window['MxScrollBar'] = function(id){
	return new MxScrollBar(id);
}

})()