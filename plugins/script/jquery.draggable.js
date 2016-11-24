/**
 * draggable拖动插件
 * @version 1.0.2
 * @url http://maxiaoxiang.com
 * @E-mail 251445460@qq.com
 */
;(function($,window,document,undefined){

	var defaults = {
		handleCls:'',//拖动把手
		axis:'',//拖动方向
		rangeCls:'',//拖动范围
		clone:false,//克隆拖动
		cloneCls:'clone',//克隆元素样式名
		animateTime:0,//动画
		startDrag:function(){},//开始拖动事件
		moveDrag:function(){},//拖动时事件
		stopDrag:function(){}//停止拖动事件
	};

	var Draggable = function(element,options){
		var _ = this;
		var isDraging = false;//拖动开关
		var $this = $(element);
		var $body = $('body');
		var $window = $(window);
		var $document = $(document);
		var coordinate = {iX : '',iY : '',mX : '',mY : ''};//鼠标坐标
		var $handle = options.handleCls ? $('.' + options.handleCls) : $this;//拖动把手
		var $range = options.rangeCls ? $('.' + options.rangeCls) : $body;//拖动范围
		var $clone = options.clone ? $('<div class="'+ options.cloneCls +'"></div>') : '';//克隆对象
		var $dragClone = options.clone ? $clone : $this;
		if(typeof $clone == 'object'){
			$clone.css({
				'position':'absolute',
				'top':$this.position().top,
				'left':$this.position().left,
				'width':$this.outerWidth(),
				'height':$this.outerHeight(),
				'cursor':'move',
				'z-index':$this.css('z-index')
			});
		}
		//开始
		_.start = function(e,func){
			if(options.startDrag(_,e) != false){
				(func || function(){})();
				isDraging = true;
				coordinate.iX = _.getMouseCoords(e).x - $this.position().left;
				coordinate.iY = _.getMouseCoords(e).y - $this.position().top;
				$this.css({'position':'absolute'});
				if(options.clone) $clone.appendTo($range);
			}
		};
		//拖动中
		var drap = function(e,clone){
			if(isDraging && options.moveDrag(_,e) != false){
				e.stopPropagation();
				e.preventDefault();
				var domScrollTop = document.body.scrollTop;
				coordinate.mX = _.getMouseCoords(e).x - coordinate.iX;
				coordinate.mY = _.getMouseCoords(e).y - coordinate.iY;
				switch (options.axis){//拖动方向
					case 'x':
						clone.css({'left':coordinate.mX});
						break;
					case 'y':
						clone.css({'top':coordinate.mY});
						break;
					default:
						clone.css({'left':coordinate.mX,'top':coordinate.mY});	
				}
				if(options.rangeCls){
					if(clone.position().left < 0){
						clone.css({'left':'0'});
					}
					if(clone.position().left > $range.width() - clone.width()){
						clone.css({'left':$range.width() - clone.width()});
					}
					if(clone.position().top < 0){
						clone.css({'top':'0'});
					}
					if(clone.position().top > $range.height() - clone.height()){
						clone.css({'top': $range.height() - clone.height()});
					}
				}else{
					if(clone.position().left < 0){
						clone.css({'left':'0'});
					}
					if(clone.position().left > $window.width() - clone.width()){
						clone.css({'left':$window.width() - clone.width()});
					}
					if(clone.position().top < domScrollTop){
						clone.css({'top':domScrollTop});
					}
					if(clone.position().top > $window.height() - clone.height() + domScrollTop){
						clone.css({'top': $window.height() - clone.height() + domScrollTop});
					}
				}
			}
		};
		//停止
		_.stop = function(e,clone){
			if(isDraging){
				if(options.clone){
					$this.css({
						'top':clone.position().top,
						'left':clone.position().left
					});
					clone.remove();
				}
				isDraging = false;
				options.stopDrag(_,e);	
			}
		};
		//拖动状态
		_.getDraging = function(){
			return isDraging;
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
		//初始
		var init = function(){
			$handle.css({'cursor':'move'}).on('mousedown',function(e){
				_.start(e);
			});
			$document.on({
				'mousemove':function(e){
					drap(e,$dragClone);
				},
				'mouseup':function(e){
					_.stop(e,$dragClone);
				}
			});
		};
		init();
	};
	
	$.fn.draggable = function(parameter,callback){
		if(typeof parameter == 'function'){//重载
			callback = parameter;
			parameter = {};
		}else{
			parameter = parameter || {};
			callback = callback || function(){};
		}
		var options = $.extend({},defaults,parameter);
		return this.each(function(){
			var draggable = new Draggable(this,options);
			callback(draggable);
		});
	};

	return $;

})(jQuery,window,document);