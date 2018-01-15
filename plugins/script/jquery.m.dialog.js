/**
 * dialog.js - 移动端弹窗插件
 * @version 1.0.0
 * @author Mss
 */
;
(function ($, window, document, undefined) {

    //默认配置
    var options = {
        dialogCls: 'mod-dialog', //弹框class
        shadeCls: 'mod-shade', //遮罩class
        title: '', //标题
        content: '', //内容
        button: {
            '取消|cancel': function () {
                alert('点击了取消')
            },
            '确定|yes': function () {
                alert('点击了确定')
            }
        }, //按钮
        hasShade: true, //是否有遮罩
        clickShadeHide: false //是否可以点击遮罩关闭
    };

    window.dialog = {
        //打开
        open: function (options) {
            new Dialog(options);
        },
        //关闭
        close: function () {
            var $box = $('#dialog');
            var $shade = $('#shade');
            if ($box.length < 1) return;
            $box.remove();
            $shade.remove();
        }
    };

    var Dialog = function (parameter) {
        dialog.close();
        var opts = $.extend({}, options, parameter);
        var $body = $('body');
        var $box = $('<div id="dialog" class="' + opts.dialogCls + '"></div>');
        var $shade = opts.hasShade ? $('<div id="shade" class="' + opts.shadeCls + '"></div>') : '';
        var title = opts.title !== '' ? '<div class="dialog-title">' + opts.title + '</div>' : '';
        var html = '<div id="inner" class="dialog-inner">\
						<div class="dialog-main">\
							' + title + '\
							<div class="dialog-content">' + opts.content + '</div>\
							<div class="dialog-btns"></div>\
						</div>\
					</div>';
        $box.html(html);
        for (name in opts.button) { //遍历按钮插入弹窗
            (function (name) {
                var mss = name.split('|');
                var cls = mss[1] ? mss[1] : 'btn';
                $('<a href="javascript:;" class="' + cls + '">' + mss[0] + '</a>').appendTo($box.find('.dialog-btns')).click(function () {
                    opts.button[name](this);
                });
            })(name);
        }
        $body.append($box).append($shade);
        if (opts.hasShade && opts.clickShadeHide && $('#shade').length) {
            $('#dialog').on('click', function (e) {
                e.target.id === 'inner' && dialog.close();
            });
        }
    };

})(jQuery, window, document);