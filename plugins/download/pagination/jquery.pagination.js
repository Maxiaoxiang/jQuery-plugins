/**
 * pagination分页插件
 * @version 1.3.0
 * @author mss
 * @url http://maxiaoxiang.com/jQuery-plugins/plugins/pagination.html
 *
 * @调用方法
 * $(selector).pagination();
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
		totalData: 0,			//数据总条数
		showData: 0,			//每页显示的条数
		pageCount: 9,			//总页数,默认为9
		current: 1,				//当前第几页
		prevCls: 'prev',		//上一页class
		nextCls: 'next',		//下一页class
		prevContent: '<',		//上一页内容
		nextContent: '>',		//下一页内容
		activeCls: 'active',	//当前页选中状态
		coping: false,			//首页和尾页
		isHide: false,			//当前页数为0页或者1页时不显示分页
		homePage: '',			//首页节点内容
		endPage: '',			//尾页节点内容
		keepShowPN: false,		//是否一直显示上一页下一页
		count: 3,				//当前页前后分页个数
		jump: false,			//跳转到指定页数
		jumpIptCls: 'jump-ipt',	//文本框内容
		jumpBtnCls: 'jump-btn',	//跳转按钮
		jumpBtn: '跳转',		//跳转按钮文本
		callback: function(){}	//回调
	};

	var Pagination = function(element,options){
		//全局变量
		var opts = options,//配置
			current,//当前页
			$document = $(document),
			$obj = $(element);//容器

		/**
		 * 设置总页数
		 * @param int page 页码
		 * @return opts.pageCount 总页数配置
		 */
		this.setPageCount = function(page){
			return opts.pageCount = page;
		};

		/**
		 * 获取总页数
		 * 如果配置了总条数和每页显示条数，将会自动计算总页数并略过总页数配置，反之
		 * @return int p 总页数
		 */
		this.getPageCount = function(){
			return opts.totalData || opts.showData ? Math.ceil(parseInt(opts.totalData) / opts.showData) : opts.pageCount;
		};

		/**
		 * 获取当前页
		 * @return int current 当前第几页
		 */
		this.getCurrent = function(){
			return current;
		};

		/**
		 * 填充数据
		 * @param int index 页码
		 */
		this.filling = function(index){
			var html = '';
			current = index || opts.current;//当前页码
			var pageCount = this.getPageCount();//获取的总页数
			if(opts.keepShowPN || current > 1){//上一页
				html += '<a href="javascript:;" class="'+opts.prevCls+'">'+opts.prevContent+'</a>';
			}else{
				if(opts.keepShowPN == false){
					$obj.find('.'+opts.prevCls) && $obj.find('.'+opts.prevCls).remove();
				}
			}
			if(current >= opts.count + 2 && current != 1 && pageCount != opts.count){
				var home = opts.coping && opts.homePage ? opts.homePage : '1';
				html += opts.coping ? '<a href="javascript:;" data-page="1">'+home+'</a>' : '';
			}
			var end = current + opts.count;
			var start = '';
			//修复到最后一页时比第一页少显示两页
			if(current === pageCount){
				start = current - opts.count - 2;
			}else{
				start = current - opts.count;
			}
			((start > 1 && current < opts.count) || current == 1) && end++;
			(current > pageCount - opts.count && current >= pageCount) && start++;
			for (;start <= end; start++) {
				if(start <= pageCount && start >= 1){
					if(start != current){
						html += '<a href="javascript:;" data-page="'+start+'">'+ start +'</a>';
					}else{
						html += '<span class="'+opts.activeCls+'">'+start+'</span>';
					}
				}
			}
			if(current + opts.count < pageCount && current >= 1 && pageCount > opts.count){
				var end = opts.coping && opts.endPage ? opts.endPage : pageCount;
				html += opts.coping ? '<span>...</span><a href="javascript:;" data-page="'+pageCount+'">'+end+'</a>' : '';
			}
			if(opts.keepShowPN || current < pageCount){//下一页
				html += '<a href="javascript:;" class="'+opts.nextCls+'">'+opts.nextContent+'</a>'
			}else{
				if(opts.keepShowPN == false){
					$obj.find('.'+opts.nextCls) && $obj.find('.'+opts.nextCls).remove();
				}
			}

			html += opts.jump ? '<input type="text" class="'+opts.jumpIptCls+'"><a href="javascript:;" class="'+opts.jumpBtnCls+'">'+opts.jumpBtn+'</a>' : '';

			$obj.empty().html(html);
		};

		//绑定事件
		this.eventBind = function(){
			var self = this;
			var pageCount = this.getPageCount();//总页数
			var index = 1;
			$obj.off().on('click','a',function(){
				if($(this).hasClass(opts.nextCls)){
					if($obj.find('.'+opts.activeCls).text() >= pageCount){
						$(this).addClass('disabled');
						return false;
					}else{
						index = parseInt($obj.find('.'+opts.activeCls).text()) + 1;
					}
				}else if($(this).hasClass(opts.prevCls)){
					if($obj.find('.'+opts.activeCls).text() <= 1){
						$(this).addClass('disabled');
						return false;
					}else{
						index = parseInt($obj.find('.'+opts.activeCls).text()) - 1;
					}
				}else if($(this).hasClass(opts.jumpBtnCls)){
					if($obj.find('.'+opts.jumpIptCls).val() !== ''){
						index = parseInt($obj.find('.'+opts.jumpIptCls).val());
					}else{
						return;
					}
				}else{
					index = parseInt($(this).data('page'));
				}
				self.filling(index);
				typeof opts.callback === 'function' && opts.callback(self);
			});
			//输入跳转的页码
			$obj.on('input propertychange','.'+opts.jumpIptCls,function(){
				var $this = $(this);
				var val = $this.val();
				var reg = /[^\d]/g;
	            if (reg.test(val)) {
	                $this.val(val.replace(reg, ''));
	            }
	            (parseInt(val) > pageCount) && $this.val(pageCount);
	            if(parseInt(val) === 0){//最小值为1
	            	$this.val(1);
	            }
			});
			//回车跳转指定页码
			$document.keydown(function(e){
		        if(e.keyCode == 13 && $obj.find('.'+opts.jumpIptCls).val()){
		        	var index = parseInt($obj.find('.'+opts.jumpIptCls).val());
		            self.filling(index);
					typeof opts.callback === 'function' && opts.callback(self);
		        }
		    });
		};

		//初始化
		this.init = function(){
			this.filling(opts.current);
			this.eventBind();
			if(opts.isHide && this.getPageCount() == '1' || this.getPageCount() == '0') $obj.hide();
		};
		this.init();
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
			var pagination = new Pagination(this, options);
			callback(pagination);
		});
	};

}));