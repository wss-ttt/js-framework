// 沙箱模式
(function (window) {
    var version = '1.0.0';
    // 工厂函数
    function jQuery(selector) {
        // 真正的构造函数
        return new jQuery.fn.init(selector);
    }
    // 添加fn属性(相当于给prototype起了一个别名简称fn) 替换原型对象
    jQuery.fn = jQuery.prototype = {
        constructor: jQuery,
        jquery: version,
        selector: '',
        length: 0,
        toArray: function () {
            return [].slice.call(this);
        },
        get: function (num) {
            // 1.如果传递是null或undefined,则转换为数组进行返回
            // 2.如果传递是正数,则按照下标进行返回即可
            // 3.如果传递是负数,则按照下标倒叙返回 this.length+负数即可
            // if (!num) {   // 这个地方不能这样写 是有问题的
            if (num == null) {   // 这个地方使用 == 就能过滤掉 null和undefined
                return [].slice.call(this);// 和toArray方法一样
                // 或者这样写
                // return this.toArray();  // 一样的
            }
            if (num >= 0) {
                return this[0];  // 返回的是原生的dom元素
            } else {
                return this[this.length + num]; // 从后面开发返回元素
            }

        },
        _get: function (num) {
            // 优化版:
            return num == null ? this.toArray() : (num > 0 ? this[i] : this[this.length + nul]);  // 一行代码搞定
        },
        // 因为是实例对象调用 所以只要传递回调函数fn
        each: function (fn) {
            // 调用静态的each方法
            return jQuery.each(this, fn);
        },
        // 同理each:因为是实例对象调用 所以只要传递回调函数fn
        map: function (fn) {
            return jQuery.map(this, fn);
            // jQuery中是下面这样实现的,返回的是一个jQuery实例对象
            // return jQuery(jQuery.map(this,fn)); 
        },
        // 参数个数不定 所以在函数内部直接使用arguments对象
        slice: function () {
            var nodes = [].slice.apply(this, arguments);// 此时nodes已经是一个数组了
            return jQuery(nodes); // 需要包装一次

            // 优化版
            // return jQuery([].slice.apply(this,arguments));
        },
        // _slice:[].slice,  // 这样写是不行的 因为返回的是这个数组
        eq: function (num) {
            // 1.如果传入的是null或undefined,返回一个新的实例
            // 2.如果传递是正数,按照指定下标获取元素,再包装成新的实例返回
            // 3.如果是负数,按照下标倒着(this.length + num)获取元素,再包装成新的实例返回
            // if(!num){   // 这个地方不能直接 !num 这样 否则会到 num=0的 也会执行这个代码
            // 过滤掉 null和undefined 不能写成 === 而要写成 ==
            if (num == null) {
                return jQuery();
            }
            if (num >= 0) {
                return jQuery(this[num]);
            } else {
                return jQuery(this[this.length + num]);
            }
        },
        _eq: function (num) {
            // 优化版
            // return num == null ? jQuery() : (num >= 0 ? jQuery(this[num]) : jQuery(this[this.length + num]));
            // 进一步优化
            return num == null ? jQuery() : jQuery(this.get(num));
        },
        first: function () {
            // 获取jQuery实例中的第一个元素 是一个jQuery实例
            return this.eq(0);
        },
        last: function () {
            // 获取jQuery实例中的最后一个元素 是一个jQuery实例
            return this.eq(-1);
        },
        // 原型上的方法供实例调用
        // 即是 实例对象.push,在调用的过程中,push内部的this指向了实例
        // 所以就不需要通过call和apply方法改变this的指向,即可借用数组的方法
        push: [].push,
        // 相当于下面这种写法:
        _push: function () {
            return [].push.apply(this, arguments);
        },
        sort: [].sort,
        splice: [].splice
    };
    // 给jQuery和原型对象分别添加extend方法
    /* jQuery.extend = jQuery.fn.extend = function (obj) {

        // 注意: 
        //     1.当调用 jQuery.extend()方法的时候,方法里的this === jQuery
        //     2.当调用的是jQuery.fn.extend()方法的时候,方法里的this === jQuery.prototype

        for (var key in obj) {
            // 注意这个this的指向是谁!!!看上面的解释
            this[key] = obj[key]
        }
    } */

    // 对extedn方法进行升级
    /*
    需求:
        1.传入一个参数,谁调用给谁混入内容
        2.传入多个参数,把后面对象的内容混入到第一个对象中去 
    */
    jQuery.extend = jQuery.fn.extend = function () {
        // 被混入的目标
        var target = null;

        // 当传入一个参数
        if (arguments.length === 1) {
            // 此时被混入的目标为this
            target = this;
            for (var key in arguments[0]) {
                target[key] = arguments[0][key];
            }
        }
        // 传入多个参数,把后面对象的内容混入到第一个对象中去 
        else if (arguments.length >= 2) {
            // 此时被 混入的目标是 arguments[0]
            target = arguments[0];
            // 遍历参数中(除了第一个参数)后面所有的对象
            // 所以我们的循环从1开始遍历
            for (var i = 1, len = arguments.length; i < len; i++) {
                // 遍历每个对象的所有属性
                for (var key in arguments[i]) {
                    target[key] = arguments[i][key];
                }
            }
        }
        // 给谁混入就返回谁
        return target;
    }
    jQuery.extend({
        each: function (obj, fn) {
            // 把要使用的变量都定义在上面
            var i, len, key;
            // 1.需要判断obj是真数组或伪数组,还是对象
            // 2.如果是真数组或是伪数组,通过for循环遍历这个对象
            // 3.如果是对象,则通过for in 方式遍历这个对象
            if (jQuery.isLikeArray(obj)) {
                // 说明是数组 或是伪数组
                for (i = 0, len = obj.length; i < len; i++) {
                    // fn(i, obj[i]);
                    // 修改this的指向 指向 -> val(obj[i])
                    if (fn.call(obj[i], i, obj[i]) === false) {
                        break;
                    }
                }
            } else {
                // 说明就是对象
                for (key in obj) {
                    // fn(key, obj[key]);
                    // 修改this的指向 指向 -> val(obj[key])
                    if (fn.call(obj[key], key, obj[key]) === false) {
                        break;
                    }
                }
            }
            // 当然这里可以遍历完成以后,return obj这个返回值
            return obj;  // 遍历谁,就返回谁
        },
        map: function (obj, fn) {
            var i, len, key;
            var result = [];  // 保存返回值进行返回
            // 1.如果是数组或是伪数组
            if (jQuery.isLikeArray(obj)) {
                for (i = 0, len = obj.length; i < len; i++) {
                    result.push(fn.call(obj[i], obj[i], i));
                }
            } else {
                // 2.如果是对象 使用for in进行遍历
                for (key in obj) {
                    result.push(fn.call(obj[key], obj[key], key));
                }
            }
            return result;
        },
        // trim方法的兼容
        trim: function (str) {
            if (typeof str !== 'string') {
                return str;
            }
            if (str.trim) {
                return str.trim();
            }
            return str.replace(/^\s+|\s+$/g, '');  //  /^\s*|\s*$/g 
        },
        /***************判断是否是字符串***************/
        isString: function (str) {
            if (typeof str === 'string') {
                return true;
            }
            return false;
        },
        // 优化版
        _isString: function (str) {
            return typeof str === 'string';
        },
        /***************判断是否是字符串******************/
        /***************该方法用于判断是否是html片段**********/
        isHtml: function (html) {
            if (!html) {
                return false;
            }
            // 说明是html片段 eg: <spaj></spaj>
            if (html.charAt(0) === '<' && html.charAt(html.length - 1) && html.length >= 3) {
                return true;
            }
            return false;
        },
        // 优化版
        _isHTML: function (html) {
            return !!html &&
                html.charAt(0) === '<' &&
                html.charAt(html.length - 1) &&
                html.length >= 3;
        },
        /***************该方法用于判断是否是html片段**********/
        /***************判断是否是函数********************/
        isFunction: function (fn) {
            if (typeof fn === 'function') {
                return true;
            }
            return false;
        },
        // 优化版
        _isFunction: function (fn) {
            return typeof fn === 'function';
        },
        /***************判断是否是函数*****************/
        /***************判断是否window对象************/
        isWindow: function (w) {
            // 这里要加过滤条件,否则后面的代码会报错
            // null undefined NaN 0 false ''
            // 如果传递的是 '' ,''.window就会报错
            if (!w) {
                return false;
            }
            if (w.window === window) {
                return true;
            }
            return false;
        },
        // 优化版
        _isWindow: function (w) {
            // 注意双 ! 的使用. !!'' -> false
            return !!w && w.window === window;
        },
        /***************判断是否window对象************/
        /*****************判断是不是对象**************/
        isObject: function (obj) {
            if (obj === null) {
                return false;
            }
            // 不明白后面后面为什么要 typeof obj === 'function'
            if (typeof obj === 'object' || typeof obj === 'function') {
                return true;
            }
            return false;
        },
        /*****************判断是不是对象*************/
        // 判断是否真数组或伪数组
        isLikeArray: function (arr) {
            // 过滤掉函数和window对象
            if (jQuery.isFunction(arr) || jQuery.isWindow(arr) || !jQuery.isObject(arr)) {
                return false;
            }
            // 判断是不是真数组  是真数组 返回true
            if (({}).toString.call(arr) === '[object Array]') {
                return true;
            }
            // 判断是不是伪数组 是伪数组 返回true
            // 实现思路:
            // 1.先看看这个对象有没有length属性,
            // 2.如果有,如果length为0,则为伪数组
            // 3.如果length属性不为0,看看这个数据有没有length-1这个属性,如果有,则是伪数组
            if (('length' in arr) && (arr.length === 0 || arr.length - 1 in arr)) {
                return true;
            }
            return false;
        },
        ready: function (fn) {
            // 判断dom是否构造完毕,如果构造完毕,可以直接运行fn
            if (document.readyState === 'complete') {
                fn();
            } else if (document.addEventListener) {
                // 如果dom没有构造完毕,判断addEventListener是否兼容
                document.addEventListener('DOMContentLoaded', fn);
            } else {
                // ie8下的处理方式
                document.attachEvent('onreadystatechange', function () {
                    // 还学要判断状态
                    if (document.readyState === 'complete') {
                        fn();
                    }
                });
            }
        }
    });
    // 构造函数
    var init = jQuery.fn.init = function (selector) {
        if (!selector) return this;

        // 判断是否是function
        if (jQuery.isFunction(selector)) {
            // 打包给静态方法ready
            jQuery.ready(selector);
        }

        if (jQuery.isString(selector)) {
            // 去掉首位的空白字符
            selector = jQuery.trim(selector);
            if (jQuery.isHtml(selector)) {
                // 实现思路:
                // 1.先创建一个div元素
                // 2.设置这个div的innerHTML为该html片段
                // notice:这些片段就会自动转换为div的子元素
                // 3. 然后遍历div的子元素分别添加到this身上去,同时添加length属性
                // tips:可以使用数组的push方法,同时使用apply方法来简化遍历的过程
                var div = document.createElement('div');
                div.innerHTML = selector;
                // 注意这个地方只能使用apply方法,不能使用call方法
                [].push.apply(this, div.children);
            } else {
                // 实现思路:
                // 1.使用querySelectorAll获取页面的元素
                // 2.然后遍历获取到的所有元素分别添加到this身上去,记住添加lengths属性
                // notice:可以使用数组的push方法来添加,同时使用apply方法简化遍历过程
                // 捕捉异常
                // 为什么这里要捕捉异常了?
                // 原因:1.如果传递不是符合选择器的格式 eg: ##eis+dfa,这样就会报错
                try {
                    // 注意 ie567 不支持querySelectorAll这个方法
                    // 所以最终就导致我们这个core.js文件不支持ie7(含)以下版本了,只支持
                    // ie8(含)以上版本了
                    var nodes = document.querySelectorAll(selector);
                    [].push.apply(this, nodes);
                } catch (e) {
                    // 如果报错了,手动添加length = 0,代表没有获取到任何的元素
                    this.length = 0;
                }
            }
        } else if (jQuery.isLikeArray(selector)) {
            // ie8中apply存在问题:
            // apply只能平铺真数组或内置的伪数组,我们自定的伪数组会报错
            // [].push.apply(this, selector); // 该代码在ie8中会报错
            // 解决办法:
            // [].slice.apply(selector)通过这个代码将selector
            // 转换成真数组,
            // 然后再把真数组中的数据push到this实例身上去
            [].push.apply(this, [].slice.apply(selector));
        } else {
            this[0] = selector;
            this.length = 1;
        }


    }
    // 替换init的原型为工厂函数jQuery的原型
    init.prototype = jQuery.fn;
    // 暴露接口
    window.jQuery = window.$ = jQuery;
}(window));
