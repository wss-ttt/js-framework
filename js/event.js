// 添加静态方法 
$.extend({
    // 注册事件
    addEvent: function (target, type, fn) {
        // 对参数进行判断
        // target必须是DOM
        // type 必须是字符串
        // fn必须是函数
        if (!target.nodeType || !jQuery.isString(type) || !jQuery.isFunction(fn)) {
            return;
        }
        if (target.addEventListener) {
            target.addEventListener(type, fn);
        } else {
            // target.attachEvent('on' + type, fn);
            // 统一this的指向(ie8(含)以下版本)
            target.attachEvent('on' + type,function(){
                fn.call(target);
            });
        }
    },
    // 解绑事件
    removeEvent: function (target, type, fn) {
        // 对参数进行判断
        // target必须是DOM
        // type 必须是字符串
        // fn必须是函数
        if (!target.nodeType || !jQuery.isString(type) || !jQuery.isFunction(fn)) {
            return;
        }
        if (target.removeEventListener) {
            target.removeEventListener(type, fn);
        } else {
            target.detachEvent('on' + type, fn);
        }
    }
});

// 添加实例方法
$.fn.extend({
    on: function (type, fn) {
        /*
        实现思路:
            1.遍历所有的元素
            2.判断每一个元素有没有$_event_cache这个属性值
            3.如果有,则继续使用,没有则初始化一个对象
            4.在继续判断这个对象有没有对应的事件类型的数组
            5.如果没有,说明是第一次绑定
                5-1.那么需要给$_event_cache这个对象以type为key添加一个数组
                5-2.然后把传入的回到函数fn,push进去
                5-3.最后还得绑定对应的事件(调用静态的addEvaent方法)
                5-4.这个事件回调里面去遍历事件类型数组,并依次执行
                5-5.执行时,需要改变内部的this,还需要把事件对象传递出去
            6.如果有,直接把传入的回调函数push到对应事件的数组里面去就可以了
            7.return this
        */
        // 1.
        this.each(function () {
            var self = this; // 保存每一个元素
            // 2.3步骤
            this.$_event_cache = this.$_event_cache || {};
            // 4.步骤  如果没有说明是第一次绑定
            if (!this.$_event_cache[type]) {
                // 5-1.步骤
                this.$_event_cache[type] = [];
                // 5-2.步骤
                this.$_event_cache[type].push(fn);
                // 5-3.步骤 
                // 要明白:事件回调函数执行的时机是在事件被触发的时候才会执行
                jQuery.addEvent(self, type, function (e) {
                    // 5-4.步骤
                    for (var i = 0, len = self.$_event_cache[type].length; i < len; i++) {
                        // 5-5.步骤  ->1.需要改变this的指向,2.传递事件对象
                        self.$_event_cache[type][i].call(self, e);
                    }
                })
            } else {
                // 6.步骤
                // tips:这个时候就不要再绑定事件了,只需要数组中push fn就行了
                this.$_event_cache[type].push(fn);
            }
        })
        return this;
    },
    // 优化版: 使用静态的each方法
    _on: function (type, fn) {
        /*
        实现思路:
            1.遍历所有的元素
            2.判断每一个元素有没有$_event_cache这个属性值
            3.如果有,则继续使用,没有则初始化一个对象
            4.在继续判断这个对象有没有对应的事件类型的数组
            5.如果没有,说明是第一次绑定
                5-1.那么需要给$_event_cache这个对象以type为key添加一个数组
                5-2.然后把传入的回到函数fn,push进去
                5-3.最后还得绑定对应的事件(调用静态的addEvaent方法)
                5-4.这个事件回调里面去遍历事件类型数组,并依次执行
                5-5.执行时,需要改变内部的this(需要执行dom元素),还需要把事件对象传递出去
            6.如果有,直接把传入的回调函数push到对应事件的数组里面去就可以了
            7.return this
        */
        // 1.
        this.each(function () {
            var self = this; // 保存每一个元素
            // 2.3步骤
            this.$_event_cache = this.$_event_cache || {};
            // 4.步骤
            if (!this.$_event_cache[type]) {
                // 5-1.步骤
                this.$_event_cache[type] = [];
                // 5-2.步骤
                this.$_event_cache[type].push(fn);
                // 5-3.步骤 
                // 要明白:事件回调函数执行的时机是在事件被触发的时候才会执行
                jQuery.addEvent(self, type, function (e) {
                    // 5-4.步骤
                    // 使用静态的each方法
                    jQuery.each(self.$_event_cache[type], function () {
                        this.call(self, e);
                    });
                })
            } else {
                // 6.步骤
                // tips:这个时候就不要再绑定事件了,只需要数组中push fn就行了
                this.$_event_cache[type].push(fn);
            }
        })
        return this;
    },
    off: function (type, fn) {
        /*
        实现思路:
            1.遍历所有的元素
            2.判断每个元素有没有$_event_cache这个对象
            3.如果没有$_event_cache这个属性,说明之前是没有绑定任何的事件,不用做任何的处理;
                如果有这个属性,继续判断
            4.先判断有没有参数,如果没有传参,遍历$_event_cache中存储的数组,并分别清空
            5.如果传了1个参数,指定事件类型的数组清空
            6.如果传了2个参数,删除指定事件类型的指定回调函数

        */
        var argLen = arguments.length;
        this.each(function () {
            if (!this.$_event_cache) {
                // 直接跳出循环,进入下一次循环
                return;   // 不能return false,因为使用return false就直接跳出循环了
            } else {
                if (argLen === 0) {
                    for (var key in this.$_event_cache) {
                        this.$_event_cache[key] = []; // 清空
                    }
                    // notice:
                    // 如果直接将整个对象置为空对象,也是能清空的,但是再重新绑定事件的时候,就会
                    // 出现问题,会绑定两次
                    // this.$_event_cache = {};
                } else if (argLen === 1) {
                    this.$_event_cache[type] = [];  // 清空
                } else {
                    var arr = this.$_event_cache[type];
                    // 此处就不能使用下面这种方式进行遍历了
                    /* jQuery.each(arr, function (i, val) {
                        if (this === fn) {
                            arr.splice(i, 1);  // 删除
                            return false;
                        }
                    }) */
                    // 如果存在同名的回调函数,删除的时候就会有遗留
                    // 此时就需要倒着遍历进行删除,那么这个时候就不能使用each方法了
                    for (var i = arr.length - 1; i >= 0; i--) {
                        if (arr[i] === fn) {
                            arr.splice(i, 1);  // 删除 
                            // 此处不需要中断
                        }
                    }
                }
            }
        })
        return this;
    }
    /* // 单独添加单击事件
    click:function(fn){
        return this.on('click',fn);
    },
    // 单独添加鼠标移出事件
    mouseout:function(fn){
        return this.on('mouseout',fn);
    } */
});
// 单独一个一个的添加 太麻烦了
/* $.fn.click = function(fn){
    return this.on('click',fn);
} */
// 批量添加绑定事件的方法
var events = 'click mouseout mousedown blur change mouseenter mouseleave'.split(' ');
// 通过遍历变量添加绑定事件的方法
jQuery.each(events, function (index, val) {
    jQuery.fn[val] = function (fn) {
        return this.on(val, fn);
    }
})
// 在原型上添加hover方法
jQuery.fn.extend({
    hover: function (fnOver, fnOut) {
        return this.on('mouseenter', fnOver).on('mouseleave', fnOut);
    }
})