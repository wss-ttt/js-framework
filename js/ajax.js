// 添加静态方法
$.extend({
    ajaxSettings: {
        url: location.href,    // 默认的url为本地地址
        type: 'get',           // 默认的请求方式为get
        async: true,           // 默认为异步请求
        // post请求 需要设置请求头
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',// post请求时设置
        dataType: 'JSON',   // 默认认为请求的数据为JSON
        timeout: null,     // 设置超时时间
        success: function () { },
        error: function () { },
        complete: function () { }
    },
    // 将对象转换成url参数的形式 eg:name=xxx&age=18&sex=xx
    urlStringify: function (data) {
        var result = '';
        // 如果传入的不是一个对象
        if (!jQuery.isObject(data)) {
            return result;
        }
        // 循环这个对象
        for (var key in data) {
            // result += key + '=' + data[key] + '&';
            // 为了防止ie乱码需要转码处理
            result += window.encodeURIComponent(key) + '=' + window.encodeURIComponent(data[key]) + '&';
        }
        // 从0截取到倒数第一个字符(包左不包右)
        return result.slice(0, -1);// 截取掉最后的 '&'
    },
    processOptions: function (options) {
        var newOptions = {};
        // 合并参数配置
        jQuery.extend(newOptions, jQuery.ajaxSettings, options);
        newOptions.data = jQuery.urlStringify(newOptions.data);
        // 把type统一转换为大写
        newOptions.type = newOptions.type.toUpperCase();
        if (newOptions.type === 'GET') {
            newOptions.url += '?' + newOptions.data;
            newOptions.data = null;
        }
        // 返回加工后的参数配置
        return newOptions;
    },
    ajax: function (options) {
        var result, xhr, newOptions, timer;
        newOptions = jQuery.processOptions(options);
        // 创建xhr对象
        xhr = new XMLHttpRequest();
        xhr.open(newOptions.type, newOptions.url, newOptions.async);
        // 如果是post请求 需要设置请求头
        if (newOptions.type === 'POST') {
            xhr.setRequestHeader('Content-type', newOptions.contentType);
        }
        xhr.onreadystatechange = function () {
            // 表示请求完成
            if (xhr.readyState === 4) {
                // 如果在指定的时间内完成了请求,那么清楚定时器
                clearTimeout(timer);
                newOptions.complete();
                // status是200-299之间都算成功
                // 304走缓存也算成功
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                    // 根据预期的dataType对范湖的数据进行处理
                    // 注意:返回的数据都是字符串
                    switch (newOptions.dataType) {
                        case 'JSON':
                            result = JSON.parse(xhr.responseText);
                            break;
                        case 'script':
                            eval(xhr.responseText);
                            result = xhr.responseText;
                            break;
                        case 'style':
                            $('<style></style>').html(xhr.responseText).appendTo('head');
                            result = xhr.responseText;
                        default:
                            result = xhr.responseText;
                    }
                    newOptions.success(result);
                } else {
                    newOptions.error(xhr.status);
                }
            }
        };
        // 如果设置了超时时间,那么就开启一个定时器
        if (newOptions.timeout) {
            timer = setTimeout(function () {
                // 执行error回调函数
                newOptions.error('超时');
                // 同时 清空回调函数
                xhr.onreadystatechange = null;
            }, newOptions.timeout);
        }
        // 发送请求
        xhr.send(newOptions.data);
    },
    get: function (url, data, fn) {
        // 如果没有传入fn,那么data参数就是回调函数,
        // 如果连data参数都没传入,手动给fn赋值一个函数
        fn = fn || data || function () { }
        jQuery.ajax({
            url: url,
            data: data,
            success: fn
        });
    },
    post: function (url, data, fn) {
        // 如果没有传入fn,那么data参数就是回调函数,
        // 如果连data参数都没传入,手动给fn赋值一个函数
        fn = fn || data || function () { }
        jQuery.ajax({
            type: 'POST',
            url: url,
            data: data,
            success: fn
        })
    },
    // 加载JSON数据
    getJSON: function (url, data, fn) {
        // 如果没有传入fn,那么data参数就是回调函数,
        // 如果连data参数都没传入,手动给fn赋值一个函数
        fn = fn || data || function () { }
        jQuery.ajax({
            dataType: 'JSON',
            url: url,
            data: data,
            success: fn
        })
    },
    // 加载js脚本
    getScript: function (url, data, fn) {
        // 如果没有传入fn,那么data参数就是回调函数,
        // 如果连data参数都没传入,手动给fn赋值一个函数
        jQuery.ajax({
            dataType: 'script',
            url: url,
            data: data,
            success: fn
        })
    }
});