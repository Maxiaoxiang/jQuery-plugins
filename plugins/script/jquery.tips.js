/**
 * tips提示插件
 * @version 1.0.0
 * @author mss
 * @url http://maxiaoxiang.com/plugin/pagination.html
 * @E-mail 251445460@qq.com
 *
 * @调用方法
 * ...
 */
(function($,window,document,undefined){

	//配置参数
	var defaults = {
		
	};

	var Tips = function(element,options){
		//全局变量
		var opts = options,//配置
			$document = $(document),
			$obj = $(element);//容器
	};

	$.fn.pagination = function(parameter,callback){
		if(typeof parameter == 'function'){//重载
			callback = parameter;
			parameter = {};
		}else{
			parameter = parameter || {};
			callback = callback || function(){};
		}
		var options = $.extend({},defaults,parameter);
		return this.each(function(){
			var pagination = new Tips(this, options);
			callback(pagination);
		});
	};

})(jQuery,window,document);