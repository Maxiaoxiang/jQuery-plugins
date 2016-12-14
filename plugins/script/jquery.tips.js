/**
 * tips提示插件
 * @version 1.0.0
 * @author mss
 *
 * @调用方法
 * $('.tips').tips();
 * 
 * @未完成
 * 动画效果，触发方式，超出屏幕自动调整
 */
;(function (factory) {
    if (typeof define === "function" && (define.amd || define.cmd) && !jQuery) {
        // AMD或CMD
        define([ "jquery" ],factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function( root, jQuery ) {
            if ( jQuery === undefined ) {
                if ( typeof window !== 'undefined' ) {
                    jQuery = require('jquery');
                } else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        //Browser globals
        factory(jQuery);
    }
}(function ($) {

	//配置参数
	var defaults = {
		tipsCls: 'mod-tips', //框体class
		triggerMode: 'hover', //触发方式:hover,click,focus
		delayTime: 0, //延迟触发时间
		destroyTime: 1000, //存在时间
		appendTarget: 'body', //插入的目标元素
		position: 'top', //方位
		offset: 10, //偏移量单（px）
		followMouse: false //是否跟随鼠标移动
	};

	var Tips = function(element, options){
		//全局变量
		var opts = options,//配置
			_ = this,
			$d = $(document),
			$w = $(window),
			$b = $('body'),
			isShow = false,
			$obj = $(element);//容器

		/**
		 * 创建
		 * @return {[type]} [description]
		 */
		_.create = function(){
			var content = $obj.data('tips');
			_.$box = $('<span class="'+opts.tipsCls+'">'+content+'</span>');
			if(isShow) return;
			$b.append(_.$box);
			_.position(_.$box);
			isShow = true;
		};

		/**
		 * 触发方式
		 * @return {[type]} [description]
		 */
		_.trigger = function(){
			switch(opts.triggerMode){
				case 'hover':
					$obj.hover(function(){
						_.create();
					}, function(){
						// _.destroy(_.$box);
					});
				break;
				case 'click':
					$obj.click(function(){
						_.create();
					});
				break;
			}
		};

		/**
		 * 定位
		 * @return {[type]} [description]
		 */
		_.position = function(obj){
			
		};

		/**
		 * 销毁
		 * @param obj 销毁对象
		 * @return {[type]} [description]
		 */
		_.destroy = function(obj){
			if(opts.destroyTime === 0){
				obj.remove();
				isShow = false;
			}else{
				clearTimeout(time);
				var time = setTimeout(function(){
					obj.remove();
					isShow = false;
				}, opts.destroyTime);
			}
		};

		/**
		 * 初始化
		 * @return {[type]} [description]
		 */
		_.init = function(){
			_.trigger();
		};

		_.init();
	};

	$.fn.tips = function(parameter, callback){
		if(typeof parameter == 'function'){//重载
			callback = parameter;
			parameter = {};
		}else{
			parameter = parameter || {};
			callback = callback || function(){};
		}
		var options = $.extend({},defaults,parameter);
		return this.each(function(){
			var tips = new Tips(this, options);
			callback(tips);
		});
	};

}));