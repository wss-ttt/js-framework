// 添加静态方法
$.extend({
    getStyle: function (obj, name) {
        if (obj.currentStyle) {
            // ie浏览器
            return obj.currentStyle[name];
        } else {
            // 火狐 谷歌浏览器
            return getComputedStyle(obj, null)[name];
        }
    },
    _getStyle: function (obj, name) {
        if (window.getComputedStyle) {
            // ie9 获取  谷歌(因为ie9有该属性)
            return getComputedStyle(obj, null)[name];
        } else {
            // ie8(含)以下
            return obj.currentStyle[name];
        }
    }
});
// 给原型添加属性和样式操作方法
$.fn.extend({
    attr: function (attr, val) {
        /*
        实现思路:
            1.判断attr是不是字符串或者对象,不是直接返回this
            2.如果是字符串,那么就判断arguments的length
            3.length为1,则获取第一个元素的属性节点值返回
            4.length>=2,则遍历所有元素,分别给他们设置属性节点值(setAttribute) 
            5.如果是对象,遍历对象,得到所有属性节点值,然后遍历所有的元素,然后进行赋值
        */
        if (!jQuery.isString(attr) && !jQuery.isObject(attr)) {
            return this;
        }
        // 如果是字符串
        if (jQuery.isString(attr)) {
            // arguments.length === 1
            if (arguments.length === 1) {
                // 获取第一个元素的属性值
                return this[0].getAttribute(attr);
            } else if (arguments.length >= 2) {
                // 使用each进行遍历
                this.each(function () {
                    // 设置属性值
                    this.setAttribute(attr, val);
                });
            }
        }
        // 如果是对象
        if (jQuery.isObject(attr)) {
            for (var key in attr) {
                // 使用each进行遍历
                this.each(function () {
                    // 设置属性值
                    this.setAttribute(key, attr[key]);
                });
            }
        }
        // 为了链式编程
        return this;
    },
    // 另一种实现思路
    _attr: function (attr, val) {
        /*
        实现思路:
            1. 判断arguments.length
            2.如果为1
            3.继续判断attr是不是字符串,如果是字符串,则返回第一个元素的属性节点的值
            4.如果不是,判断是不是对象,如果是,遍历这个对象,得到所有的属性值,然后
            遍历所有的元素,然后再进行赋值
            5.如果arguments.length>=2,遍历所有的元素进行赋值操作
            6.return this
        */
        var self = this;
        if (arguments.length === 1) {
            if (jQuery.isString(attr)) {
                // 获取属性值
                return this[0].getAttribute(attr);
            } else if (jQuery.isObject(attr)) {
                // 遍历attr这个对象 使用静态的each方法
                jQuery.each(attr, function (key, val) {
                    // 遍历实例对象 不能直接使用this,因为指向不一样
                    // 同时使用实例的each方法
                    self.each(function () {
                        // 这里面的this指向的是每一个dom元素
                        this.setAttribute(key, val);
                    });
                });
            }
        } else if (arguments.length >= 2) {
            this.each(function () {
                this.setAttribute(attr, val);
            });
        }
        return this;
    },
    prop: function (attr, val) {
        /*
        实现思路和attr方法的实现思路是一样的
        */
        if (!jQuery.isString(attr) && !jQuery.isObject(attr)) {
            return this;
        }
        // 如果是字符串
        if (jQuery.isString(attr)) {
            // arguments.length === 1
            if (arguments.length === 1) {
                // 获取第一个元素的属性值
                return this[0][attr];
            } else if (arguments.length >= 2) {
                // 使用each进行遍历
                this.each(function () {
                    // 设置属性值
                    this[attr] = val;
                });
            }
        }
        // 如果传入的是对象
        if (jQuery.isObject(attr)) {
            for (var key in attr) {
                this.each(function () {
                    this[key] = attr[key];
                });
            }
        }
        return this;
    },
    // 另一种实现思路
    _prop: function (attr, val) {
        var self = this;// 保存this
        // 只有一个参数
        if (arguments.length === 1) {
            // 字符串
            if (jQuery.isString(attr)) {
                // 返回第一个元素的属性值
                return this[0][attr];
            } else if (jQuery.isObject(attr)) {
                // 是对象
                // 使用静态方法 遍历attr
                jQuery.each(attr, function (key, val) {
                    // 使用实例each方法 进行遍历实例对象
                    self.each(function () {
                        this[key] = val;
                    });
                });
            }
        } else if (arguments.length >= 2) {
            // 两个参数
            this.each(function () {
                this[attr] = val;
            });
        }
        return this;
    },
    css: function (styleName, val) {
        /*
        实现思路和attr方法的实现思路是一样的
        */
        var self = this;
        // 如果既不是字符串也不是对象 直接返回对象
        if (!jQuery.isString(styleName) && !jQuery.isObject(styleName)) {
            return this;
        }
        // 如果是字符串
        if (jQuery.isString(styleName)) {
            if (arguments.length === 1) {
                // 只有一个参数 ,获取第一个元素的值
                return jQuery.getStyle(this[0], styleName);
            } else if (arguments.length >= 2) {
                // 如果是2个参数以上,进行设置样式
                this.each(function () {
                    this['style'][styleName] = val;
                });
            }
        }
        // 如果是对象
        if (jQuery.isObject(styleName)) {
            jQuery.each(styleName, function (key, val) {
                self.each(function () {
                    this['style'][key] = val;
                });
            });
        }
        return this;
    },
    // 另一种实现思路
    _css: function (styleName, val) {
        // 只有一个参数
        if (arguments.length === 1) {
            if (jQuery.isString(styleName)) {
                // 返回第一个元素的样式
                return jQuery.getStyle(this[0], styleName);
            } else if (jQuery.isObject(styleName)) {
                for (var key in styleName) {
                    this.each(function () {
                        // 设置样式
                        this['style'][key] = styleName[key];
                    });
                }
            }
        } else if (arguments.length >= 2) { // 两个参数的情况
            this.each(function () {
                // 设置样式
                this['style'][styleName] = val;
            });
        }
        return this;
    },
    val: function (val) {
        if (arguments.length === 0) {
            // 没有传入参数 就是获取值
            return this[0]['value'];
        } else if (arguments.length === 1) {
            // 传入一个参数 就是设置值
            this.each(function () {
                this['value'] = val;
            });
        }
        return this;
    },
    // 优化版: 复用prop方法
    _val: function (val) {
        // 没有传参,返回第一个元数的value属性值
        if (arguments.length === 0) {
            // 复用prop方法
            return this.prop('value');
        } else if (arguments.length === 1) {
            // 复用propo方法
            return this.prop('value', val);
        }
    },
    hasClass: function (className) {
        /*
        实现思路:
            1.遍历所有元素
            2. 依次获取每个元素的className,为了方便判断,前后加上空格
            3.使用indexOf方法进行判断
            4.如果有一个元素的判断结果不为-1,就返回true
            5.否则范湖false
        */
        for (var i = 0, len = this.length; i < len; i++) {
            // 注意这里为什么要在前后添加上空格
            if ((' ' + this[i].className + ' ').indexOf(' ' + className + ' ') !== -1) {
                return true;
            }
        }
        return false;
    },
    // 优化版: 使用each进行遍历
    _hasClass: function (className) {
        var flag = false;
        this.each(function () {
            // 注意这里为什么要在前后添加上空格
            if ((' ' + this.className + ' ').indexOf(' ' + className + ' ') !== -1) {
                flag = true;
                return false;// 中断循环
            }
        });
        return flag;
    },
    // 只能处理单个className 
    // eg: 'item' 这个能添加
    // eg: 'item box'  这个就存在问题了
    addClass: function (className) {
        /*
        实现思路:
            1.遍历所有元素
            2.依次判断每一个元素有没有要添加的className
            3.有则忽略,没有则添加( className += ' ' + className) 
            4.最后可以针对元素.className.tirm() -> 这一步可有可无
            5.return this
        */
        // 1.先去掉收尾空格
        className = jQuery.trim(className);
        // 2.判断是否为空字符串
        if (className.length === 0) {
            return this;
        }
        // 遍历所有的元素
        this.each(function () {
            // 注意:jQuery(this)相当于又创建了一个新的实例
            // 和this是两个不同的对象
            if (!jQuery(this).hasClass(className)) {
                this.className += ' ' + className;
            }
        });
        return this;
    },
    // 升级版本:
    // 添加多个class类型
    // eg:  'aa bb cc'
    _addClass: function (classNames) {
        // 1.去掉classNames收尾的空格
        classNames = jQuery.trim(classNames);
        // 2.判断是不是空字符串
        if (classNames.length === 0) {
            return this;
        }
        // 3.劈成数组
        var arr = classNames.split(' ');
        // 4.去掉空的元素
        arr = arr.filter(function (item) {
            if (!(item === ' ')) {
                return item;
            }
        });
        // 双重循环
        this.each(function () {
            var self = this;
            // 分析一下这个地方为什么是true? 每一个元素都是引用类型
            // console.log($(this)[0] === this);// true
            // 使用静态方法遍历arr
            jQuery.each(arr, function (index, val) {
                if (!jQuery(self).hasClass(val)) {
                    self.className += ' ' + val;
                }
            });
        });
        return this;
    },
    // 功能:1.清空 2.删除单个className
    // 存在问题: 多个className进行删除就会有问题
    // eg: 'aa bb'这种形式的就会有问题
    removeClass: function (className) {
        /*
        实现思路:
            1.判断有没有参数
            2.没有参数,遍历所有的元素,设置他们的className为空
            3.有参数,遍历所有的元素,删除指定的className(元素.className.replace())
            4.retrun this
        */
        if (arguments.length === 0) {
            this.each(function () {
                this.className = '';
            });
        } else {
            // 1.去掉收尾的空格
            className = jQuery.trim(className);
            // 2.判断是否为空字符串
            if (className.length === 0) {
                // 如果是空字符 直接返回this 不做任何的处理
                return this;
            }
            this.each(function () {
                // 使用空格进行替换掉
                // eg: this.className = ' aa bb cc b ';
                var res = (' ' + this.className + ' ').replace(' ' + className + ' ', ' ');
                this.className = res;
            });
        }
        return this;
    },
    // 升级版本:
    // 可以同时删除多个class类名
    // eg:  'aa'  可以删除aa
    // eg:  'aa bb'  也可以同时删除 aa和bb两个class类名
    _removeClass: function (classNames) {
        /*
        实现思路:
            1.判断有没有参数
            2.没有参数,遍历所有的元素,设置他们的classNames为空
            3.有参数,把classNames劈成数组,然后去掉空元素
            4.外层遍历元素
            5.内层遍历所有要删除的class类名
            6.遍历到的每一个元素删除遍历到的class
            7.return this
        */
        if (arguments.length === 0) {
            this.each(function () {
                this.className = '';
            });
        } else {
            // 1.去掉classNames收尾空格
            classNames = jQuery.trim(classNames);
            // 2.如果classNames为空字符串直接返回
            if (classNames.length === 0) {
                return this;
            }
            // 3.将classNames劈成数组
            var arr = classNames.split(' ');
            // 4.去掉数组中的空元素
            arr = arr.filter(function (item) {
                if (!(item === ' ')) {
                    return item;
                }
            });
            this.each(function () {
                // 保存每一个遍历的元素
                var self = this;
                var res = '';
                jQuery.each(arr, function (index, val) {
                    res = (' ' + self.className + ' ').replace(' ' + val + ' ', ' ');
                    // 必须需要重新赋值一次
                    self.className = res;
                });
            });
            return this;
        }
    },
    toggleClass: function (className) {
        /*
        实现思路:
            1.遍历所有的元素
            2.判断每一个元素有没有指定的className
            3.有则删除,没有则添加 
            4.return this
        */
        // 1.去掉收尾空格
        className = jQuery.trim(className);
        // 2.判断是不是为空字符串
        if (className.length === 0) {
            return this;
        }
        this.each(function () {
            var $this = jQuery(this);
            if (jQuery(this).hasClass(className)) {
                // 有 ->  删除
                $this.removeClass(className);
            } else {
                $this.addClass(className);
            }
        });
        return this;
    },
    // 升级版:
    // eg: 'aa bb cc'
    _toggleClass: function (classNames) {
        /*
        实现思路:
            1.先把 classNames劈成数组,然后去掉空元素
            2.外层遍历所有元素
            3.内层遍历class
            4.判断,有则删除,没有则添加
            5.return this;
        */
        // 1.去掉classNames前后的空格字符串
        classNames = jQuery.trim(classNames);
        // 2.判断是不是空字符串
        if (classNames.length === 0) {
            return this;
        }
        // 3.劈成数组
        var arr = classNames.split(' ');
        // 去掉空元素
        arr = arr.filter(function (item) {
            if (!(item === ' ')) {
                return item;
            }
        });
        this.each(function () {
            var $self = jQuery(this);
            jQuery.each(arr, function (index, val) {
                if ($self.hasClass(val)) {
                    $self.removeClass(val);
                } else {
                    $self.addClass(val);
                }
            });
        });
        return this;
    }
});