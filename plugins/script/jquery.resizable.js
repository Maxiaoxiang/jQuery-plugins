/**
 * resizable缩放插件
 * @version 1.0.1
 * @url http://maxiaoxiang.com
 * @E-mail 251445460@qq.com
 */
;(function($,window,document,undefined){

	var defaults = {
		rangeCls:'',//最大范围
		startResize:function(){},//开始缩放事件
		resizeing:function(){},//缩放时事件
		stopResize:function(){}//停止缩放事件
	};

	var Resizable = function(element,options){
		var _ = this;
		var $this = $(element);
		var isReszeing = false;//标识
		var $body = $('body');
		var $window = $(window);
		var $document = $(document);
		var $e = $('<div class="e-resize" data-type="e-resize"></div>');
		var $s = $('<div class="s-resize" data-type="s-resize"></div>');
		var $se = $('<div class="se-resize" data-type="se-resize"></div>');
		var $range = options.rangeCls ? $('.' + options.rangeCls) : $window;
		//开始
		_.start = function(handle,e,func){
			if(options.startResize(_) != false){
				(func || function(){})();
				isReszeing = true;
				this.handle = handle;
			}
		};
		//缩放
		_.resizeing = function(handle,e){
			if(isReszeing && options.resizeing(_) != false){
				var type = this.handle.data('type');//缩放方向
				var m = _.getMouseCoords(e);//鼠标坐标
				var offset = $this.offset();
				$body.css({
					'cursor':type
				});
				switch (type){
					case 'e-resize':
						if(m.x - offset.left < $range.width()){
							$this.css({'width':m.x - offset.left + 'px'});
						}else{
							$this.css({'width':$range.width() + 'px'});
						}
						$s.css({'width':$this.width()});
						break;
					case 's-resize':
						if(m.y - offset.top < $range.height()){
							$this.css({'height':m.y - offset.top + 'px'});
						}else{
							$this.css({'height':$range.height() + 'px'});
						}
						$e.css({'height':$this.height()});
						break;
					default:
						if(m.y - offset.top < $range.height()){
							$this.css({'height':m.y - offset.top + 'px'});
						}else{
							$this.css({'height':$range.height() + 'px'});
						}
						if(m.x - offset.left < $range.width()){
							$this.css({'width':m.x - offset.left + 'px'});
						}else{
							$this.css({'width':$range.width() + 'px'});
						}
						$e.css({'height':$this.height()});
						$s.css({'width':$this.width()});
				}
			}
		};
		//停止
		_.stop = function(handle,e){
			if(isReszeing){
				isReszeing = false;
				$body.css({
					'overflow':'auto',
					'cursor':'auto'
				});
				options.stopResize(_);
			}
		};
		_.getFlag = function(){
			return isReszeing;
		};
		//返回当前鼠标坐标
		_.getMouseCoords = function(e){
			if(e.pageX || e.pageY){
				return {x : e.pageX , y : e.pageY};
			}
			return {
				x : e.clientX + document.body.scrollLeft - document.body.clientLeft,
				y : e.clientY + document.body.scrollTop - document.body.clientTop
			};
		};
		var init = function(){
			var rb = parseInt($this.css('border-right-width')) || 0;
			var bb = parseInt($this.css('border-bottom-width')) || 0;
			var zIndex = $this.css('z-index') == 'auto' ? 'auto' : $this.css('z-index');
			$e.css({
				'position': 'absolute',
				'top':0 - rb,
				'right':'-4px',
				'height': $this.outerHeight(),
				'width':'8px',
				'z-index': zIndex,
				'cursor': 'e-resize'
			}).appendTo($this);
			$s.css({
				'position': 'absolute',
				'left':0 - bb,
				'bottom':'-4px',
				'height': '8px',
				'width':$this.outerWidth(),
				'z-index': zIndex,
				'cursor': 's-resize'
			}).appendTo($this);
			$se.css({
				'position': 'absolute',
				'right':'-1px',
				'bottom':'-1px',
				'height': '16px',
				'width': '16px',
				'z-index': zIndex,
				'cursor': 'se-resize'
			}).appendTo($this);
			var arr = [$e,$s,$se];
			for(var i in arr){
				arr[i].on('mousedown',function(e){
					_.start($(this),e);
				});
			}
			$document.on({
				'mousemove':function(e){
					_.resizeing(this.handle,e);
				},
				'mouseup':function(e){
					_.stop(e);
				}
			});
		};
		init();
	};
	
	$.fn.resizable = function(parameter,callback){
		if(typeof parameter == 'function'){//重载
			callback = parameter;
			parameter = {};
		}else{
			parameter = parameter || {};
			callback = callback || function(){};
		}
		var options = $.extend({},defaults,parameter);
		return this.each(function(){
			var resizable = new Resizable(this,options);
			callback(resizable);
		});
	};

	return $;

})(jQuery,window,document);