/**
 * tips提示插件
 * @version 1.0.0
 * @author mss
 *
 * @调用方法
 * $('.tips').tips();
 */
;
(function (factory) {
    if (typeof define === "function" && (define.amd || define.cmd) && !jQuery) {
        // AMD或CMD
        define(["jquery"], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function (root, jQuery) {
            if (jQuery === undefined) {
                if (typeof window !== 'undefined') {
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
        tipsCls: 'tips', //框体class
        node: '', //显示的节点
        triggerMode: 'hover', //触发方式:hover,click
        delayTime: 0, //延迟触发时间
        destroyTime: 0, //存在时间
        position: ['ct', 'cb'], //方位
        offset: [0, 0], //偏移量（px）
        followMouse: false //是否跟随鼠标移动
    };

    var Tips = function (element, options) {
        //全局变量
        var opts = options, //配置
            _ = this,
            $d = $(document),
            $w = $(window),
            $b = $('body'),
            isShow = false,
            $obj = $(element); //容器

        /**
         * 创建
         */
        _.create = function () {
            if (isShow) return;
            var content = $obj.data('tips');
            _.$box = $('<span class="' + opts.tipsCls + '">' + content + '</span>');
            $obj.append(_.$box);
            _.position(_.$box);
            isShow = true;
        };

        /**
         * 触发方式
         */
        _.trigger = function () {
            switch (opts.triggerMode) {
                case 'hover':
                    $obj.hover(function () {
                        _.create();
                    }, function () {
                        // _.destroy(_.$box);
                    });
                    break;
                case 'click':
                    $obj.click(function () {
                        _.create();
                    });
                    break;
            }
        };

        /**
         * 定位
         */
        _.position = function (obj) {
            var points = {
                'l': 0,
                't': 0,
                'c': 0.5,
                'r': 1,
                'b': 1
            };
        };

        /**
         * 销毁
         * @param obj 销毁对象
         */
        _.destroy = function (obj) {
            if (opts.destroyTime === 0) {
                obj.remove();
                isShow = false;
            } else {
                clearTimeout(time);
                var time = setTimeout(function () {
                    obj.remove();
                    isShow = false;
                }, opts.destroyTime);
            }
        };

        /**
         * 初始化
         */
        _.init = function () {
            _.trigger();
        };

        _.init();
    };

    $.fn.tips = function (parameter, callback) {
        if (typeof parameter == 'function') { //重载
            callback = parameter;
            parameter = {};
        } else {
            parameter = parameter || {};
            callback = callback || function () {};
        }
        var options = $.extend({}, defaults, parameter);
        return this.each(function () {
            var tips = new Tips(this, options);
            callback(tips);
        });
    };

}));