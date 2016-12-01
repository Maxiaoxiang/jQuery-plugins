/**
 * tips提示插件
 * @version 1.0.0
 * @author mss
 *
 * @调用方法
 * $('.tips').tips();
 * @未完成
 * xss
 */
(function($,window,document,undefined){

	//配置参数
	var defaults = {
		tipsCls: 'mod-tips', //框体class
		triggerMode: 'hover', //触发方式:hover,click,focus
		delayTime: 0, //延迟触发时间
		destroyTime: 3000, //存在时间
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
			var $box = $('<div class="'+opts.tipsCls+'">'+content+'</div>');
			if(isShow) return;
			$obj.click(function(){
			console.log(1);
				$b.append($box);
				isShow = true;
				_.destroy($box);
			});
		};

		/**
		 * 销毁
		 * @param obj 销毁对象
		 * @return {[type]} [description]
		 */
		_.destroy = function(obj){
			clearTimeout(time);
			var time = setTimeout(function(){
				obj.remove();
			}, opts.destroyTime);
		};

		/**
		 * 初始化
		 * @return {[type]} [description]
		 */
		_.init = function(){
			_.create();
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

})(jQuery,window,document);