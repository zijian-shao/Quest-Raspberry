var baseURL, currURL, options, configs;

var initReady = false;

function injectCSS(src, tag, type, callback) {
    var style;
    var id = 'raspberry-css-' + Math.floor(Math.random() * 90000 + 10000);
    if (type === 'text') {
        style = $('<style/>', {
            id: id
        });
        style.text(src);
    } else {
        style = $('<link/>', {
            id: id,
            rel: 'stylesheet',
            type: 'text/css',
            href: src
        });
    }
    style.appendTo($(tag));
    if (typeof callback === typeof function () {
    }) {
        callback(id);
    }
    return id;
}

function injectJS(src, tag, type, callback) {
    var id = 'raspberry-js-' + Math.floor(Math.random() * 90000 + 10000);
    var script = $('<script/>', {
        id: id,
        type: 'text/javascript'
    });
    if (type === 'text') {
        script.text(src);
    } else {
        script.attr('src', src);
    }
    script.appendTo($(tag));
    if (typeof callback === typeof function () {
    }) {
        callback(id);
    }
    return id;
}

function isBrowser(name) {
    name = name.toLowerCase();
    if (name == 'opera')
        return (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    else if (name == 'firefox')
        return typeof InstallTrigger !== 'undefined';
    else if (name == 'safari')
        return /constructor/i.test(window.HTMLElement) || (function (p) {
            return p.toString() === "[object SafariRemoteNotification]";
        })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
    else if (name == 'ie')
        return /*@cc_on!@*/false || !!document.documentMode;
    else if (name == 'edge')
        return !isIE && !!window.StyleMedia;
    else if (name == 'chrome')
        return /chrome/.test(navigator.userAgent.toLowerCase());
    else
        return false;
}

function scrollToUtil(pos, time, offset) {

    if ($.type(offset) !== 'number')
        offset = 0;

    if ($.type(pos) === 'object')
        pos = pos.offset().top;
    else if ($.type(pos) === 'string')
        pos = $(pos).first().offset().top;

    $('html').animate({scrollTop: pos - offset}, time);

}

function isOnScreen(element) {

    if ($.type(element) === 'object')
        return ($('html').scrollTop() < element.offset().top);
    else if ($.type(element) === 'number')
        return ($('html').scrollTop() < element);

    return true;
}

function getQueryString(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(currURL);
    return results == null ? null : results[1];
}

function addBackToTopButton() {

    $(window).on('scroll', function () {

        if ($(this).scrollTop() < 10)
            $('#raspberry-back-to-top').addClass('raspberry-back-to-top-hidden').delay(200);
        else
            $('#raspberry-back-to-top').removeClass('raspberry-back-to-top-hidden');

    });

    $('<div/>', {
        id: 'raspberry-back-to-top',
        class: 'raspberry-back-to-top raspberry-back-to-top-hidden'
    }).on('click', function (e) {
        e.preventDefault();
        scrollToUtil(0, 400);
    }).appendTo('body');

}

function scrollToUtil(pos, time, offset) {

    if ($.type(offset) !== 'number')
        offset = 0;

    if ($.type(pos) === 'object')
        pos = pos.offset().top;
    else if ($.type(pos) === 'string')
        pos = $(pos).first().offset().top;

    $('html').animate({scrollTop: pos - offset}, time);

}

function initRaspberry() {

    function init() {
        if (!options.GLB_Enabled) {
            document.getElementById('raspberry-hide-body').remove();
            return;
        }

        var cover = document.createElement('div');
        cover.id = 'raspberry-load-cover';
        cover.className = 'raspberry-load-cover';
        document.documentElement.appendChild(cover);

        initReady = true;

    }

    var style = document.createElement('style');
    style.id = 'raspberry-hide-body';
    style.textContent = 'body{opacity:0!important}';
    document.documentElement.appendChild(style);

    baseURL = chrome.runtime.getURL('');
    currURL = window.location.href;
    configs = getOptionListDefault();
    chrome.storage.sync.get(configs, function (e) {
        options = e;
        init();
    });
}

initRaspberry();