/**
 * dialog弹出层插件
 * @version 1.0.5
 * @url http://www.maxiaoxiang.com
 * @E-mail 251445460@qq.com
 */
;(function($,window,document,undefined){

	//参数
	var defaults = {
		title:'',//标题
		close:'x',//关闭按钮
		content:'',//内容
		zIndex: '9999',//层级
		isMask: true,//遮罩
		clickMask:false,//遮罩关闭
		opacity:'0.5',//透明度
		button:{},//按钮
		type:'dialog',//弹窗类型('dialog':默认为对话框,'message':提示消息)
		followScroll:true,//随屏幕滚动
		time:2000,//显示时间
		isDraggable:false,//拖动
		handleCls:'M-title',//拖动把手
		axis:'',//拖动方向
		rangeCls:'',//范围
		clone:false,//克隆拖动
		cloneCls:'clone',//克隆元素样式名
		isResizable:false,//缩放
		beforeShow:function(){},//显示前事件
		afterHide:function(){},//关闭后事件
		startDrag:function(){},//开始拖动事件
		moveDrag:function(){},//拖动时事件
		stopDrag:function(){},//停止拖动事件
	};

	var Dialog = function(element,options){
		var _ = this;
		var $this = $(element);
		var isOpen = false;//弹窗状态
		var isDraging = false;//拖动开关
		var isReszeing = false;//缩放开关
		var $body = $('body');
		var $window = $(window);
		var $document = $(document);
		var coordinate = {iX : '',iY : '',mX : '',mY : ''};//鼠标坐标
		var $title = $('<div class="M-title">'+options.title+'</div>');//标题
		var $close = $('<div class="M-close">'+options.close+'</div>');//关闭按钮
		var $content = $('<div class="M-content">'+options.content+'</div>');//内容区域
		var $button = $('<div class="M-button"></div>');//按钮
		var $mask = $('.M-mask');//遮罩
		var $range = options.rangeCls ? $('.' + options.rangeCls) : $body;//拖动范围
		var $clone = options.clone ? $('<div class="'+ options.cloneCls +'"></div>') : '';//克隆对象
		var $dragClone = options.clone ? $clone : $this;
		var $e = $('<div class="e-resize" data-type="e-resize"></div>');
		var $s = $('<div class="s-resize" data-type="s-resize"></div>');
		var $se = $('<div class="se-resize" data-type="se-resize"></div>');
		if(typeof $clone == 'object'){
			$clone.css({
				'position':'absolute',
				'top':$this.position().top,
				'left':$this.position().left,
				'width':$this.outerWidth(),
				'height':$this.outerHeight(),
				'cursor':'move',
				'z-index':options.zIndex + 1
			});
		}
		//打开
		_.open = function(func){
			if(options.beforeShow(_) != false){
				(func || function(){})();
				$this.show();
				if(options.isMask) $mask.show();
				if(options.type == 'message'){//信息提示框自动关闭
					setTimeout(_.close,options.time);
				}
				isOpen = true;
			}
		};
		//关闭
		_.close = function(){
			$this.hide();
			if($mask.length !== 0){
				$mask.remove();
			}
			options.afterHide();
			isOpen = false;
			$document.off('mousemove mouseup');
		};
		//窗口变化居中
		_.resize = function(){
			$this.css({
				'top': ($window.height() - $this.outerHeight()) / 2 + $document.scrollTop() + 'px',
				'left': ($window.width() - $this.outerWidth()) / 2 + 'px'
			});
		};
		//滚动时居中
		_.scroll = function(){
			$this.css({
				'top':($window.height() - $this.outerHeight()) / 2 + $document.scrollTop()
			});
		};
		//弹窗状态
		_.getOpen = function(){
			return isOpen;
		};
		//返回当前鼠标坐标
		_.mouseCoords = function(e){
			if(e.pageX || e.pageY){
				return {x : e.pageX , y : e.pageY};
			}
			return {
				x : e.clientX + document.body.scrollLeft - document.body.clientLeft,
				y : e.clientY + document.body.scrollTop - document.body.clientTop
			};
		};
		//拖动开始
		_.start = function(e,func){
			if(options.startDrag(_,e) != false){
				(func || function(){})();
				isDraging = true;
				coordinate.iX = _.mouseCoords(e).x - $this.position().left;
				coordinate.iY = _.mouseCoords(e).y - $this.position().top;
				$this.css({'position':'absolute'});
				if(options.clone) $clone.css({'left':coordinate.mX,'top':coordinate.mY}).appendTo($range);
			}
		};
		//拖动中
		_.drag = function(e,clone){
			if(isDraging && options.moveDrag(_,e) != false){
				e.stopPropagation();
				e.preventDefault();
				var domScrollTop = document.body.scrollTop;
				coordinate.mX = _.mouseCoords(e).x - coordinate.iX;
				coordinate.mY = _.mouseCoords(e).y - coordinate.iY;
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
		//拖动结束
		_.stop = function(e,clone){
			if(isDraging){
				if(options.clone){
					$this.css({
						'top':clone.position().top,
						'left':clone.position().left,
						'width':clone.outerWidth(),
						'height':clone.outerHeight()
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
		//缩放开始
		_.resizeStart = function(handle,e){
			isReszeing = true;
			this.handle = handle;
		};
		//缩放中
		_.resizeing = function(handle,e){
			if(isReszeing){
				var type = this.handle.data('type');//缩放方向
				var m = _.mouseCoords(e);//鼠标坐标
				var offset = $this.offset();
				$body.css({
					'overflow':'hidden',
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
		//缩放结束
		_.resizeStop = function(handle,e){
			if(isReszeing){
				isReszeing = false;
				if(options.clone){
					$clone.css({
						'top':$this.position().top,
						'left':$this.position().left,
						'width':$this.outerWidth(),
						'height':$this.outerHeight()
					});
				}
				$body.css({'cursor':'auto'});
			}
		};
		//缩放状态
		_.getReszeing = function(){
			return isReszeing;
		};
		//初始
		var init = function(){
			if(options.type == 'message'){//弹窗类型为message不加载title,button,close
				$this.css({
					'display':'none',
					'position':'absolute',
					'top':($window.height() - $this.outerHeight()) / 2 + $document.scrollTop() + 'px',
					'left':($window.width() - $this.outerWidth()) / 2 + 'px',
					'z-index':options.zIndex
				}).empty().append($content);
			}else{
				$this.css({
					'display':'none',
					'position':'absolute',
					'top':($window.height() - $this.outerHeight()) / 2 + $document.scrollTop() + 'px',
					'left':($window.width() - $this.outerWidth()) / 2 + 'px',
					'z-index':options.zIndex
				}).empty().append($title).append($close).append($content);
				$button.appendTo($content);
				$close.click(_.close);
				for(name in options.button){//遍历按钮插入弹窗
					(function (name){
						var mss = name.split('|');
						var cls = mss[1] ? mss[1] : 'btn';
						$('<a href="javascript:;" class="M-'+cls+'">'+mss[0]+'</a>').appendTo($button).click(function(){
							options.button[name](_);
						});
					})(name);
				}
			}
			if(options.isMask && $mask.length == 0){//遮罩
				$mask = $('<div class="M-mask"></div>').css({
					'display':'none',
					'position':'fixed',
					'top':'0',
					'left':'0',
					'width':'100%',
					'height':'100%',
					'background':'#000',
					'opacity':options.opacity,
					'z-index':options.zIndex - 1
				}).appendTo($body).before($this);
			}
			$window.resize(_.resize);
			if(options.followScroll) $window.scroll(_.scroll);
			if(options.clickMask) $mask.click(_.close);
			if(options.isDraggable){
				var $handle = options.handleCls ? $('.' + options.handleCls) : $this;//拖动把手
				$handle.css({'cursor':'move'}).on('mousedown',function(e){
					_.start(e);
				});
				$document.on({
					'mousemove':function(e){
						_.drag(e,$dragClone);
					},
					'mouseup':function(e){
						_.stop(e,$dragClone);
					}
				});
				_.drag();
			}
			if(options.isResizable){
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
					arr[i].mousedown(function(e){
						_.resizeStart($(this),e);
					});
				}
				$document.on({
					'mousemove':function(e){
						_.resizeing(this.handle,e);
					},
					'mouseup':function(e){
						_.resizeStop(this.handle,e);
					}
				});
			}
			_.open();
		};
		init();
	};

	$.fn.dialog = function(parameter,callback){
		if(typeof parameter == 'function'){//重载
			callback = parameter;
			parameter = {};
		}else{
			parameter = parameter || {};
			callback = callback || function(){};
		}
		var options = $.extend({},defaults,parameter);
		return this.each(function(){
			var dialog = new Dialog(this,options);
			callback(dialog);
		});
	};

	return $;

})(jQuery,window,document);