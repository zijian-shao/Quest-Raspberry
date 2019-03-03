function extensionUpdate() {

    var oldVer = options.EXT_Version, newVer;

    console.log('Quest Raspberry (V' + oldVer + ')');

    chrome.runtime.sendMessage({action: 'getDetails'}, function (response) {

        newVer = response.version;

        // update storage
        chrome.storage.sync.set({
            'EXT_Version': newVer
        });

        // return on install
        if (oldVer == '0.0.0')
            return;

        if (versionCompare(oldVer, newVer) >= 0)
            return;

        console.log('New version updated (V' + newVer + ')');

        if (newVer.match(/1\.0\./) && !oldVer.match(/1\.0\./)) {
            chrome.runtime.sendMessage({
                action: 'createTab',
                data: {url: chrome.extension.getURL('/html/options.html') + '?whatsnew=' + newVer}
            });
        }
        console.log('Extension update script executed!');
    });
}

/**
 * Compare Versions
 * @param v1
 * @param v2
 * @param options
 * @returns {*}
 *  0 if the versions are equal
 *  a negative integer iff v1 < v2
 *  a positive integer iff v1 > v2
 * NaN if either version string is in the wrong format
 */
function versionCompare(v1, v2, options) {
    var lexicographical = options && options.lexicographical,
        zeroExtend = options && options.zeroExtend,
        v1parts = v1.split('.'),
        v2parts = v2.split('.');

    function isValidPart(x) {
        return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
    }

    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
        return NaN;
    }

    if (zeroExtend) {
        while (v1parts.length < v2parts.length) v1parts.push("0");
        while (v2parts.length < v1parts.length) v2parts.push("0");
    }

    if (!lexicographical) {
        v1parts = v1parts.map(Number);
        v2parts = v2parts.map(Number);
    }

    for (var i = 0; i < v1parts.length; ++i) {
        if (v2parts.length == i) {
            return 1;
        }

        if (v1parts[i] == v2parts[i]) {
            continue;
        }
        else if (v1parts[i] > v2parts[i]) {
            return 1;
        }
        else {
            return -1;
        }
    }

    if (v1parts.length != v2parts.length) {
        return -1;
    }

    return 0;
}

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

function userCSS(targetFrame, name, dir, callback, isJS) {

    function _insertCSS(data) {
        var action = (isJS === true) ? 'executeScript' : 'insertCSS';
        chrome.runtime.sendMessage({
            action: action,
            data: data
        }, callback);
    }

    function _getDataObject(str) {
        if (isJS === true)
            return {file: 'js/' + dir + '/' + str + '.js', frameId: targetFrame};
        else
            return {file: 'css/' + dir + '/' + str + '.css', frameId: targetFrame};
    }

    if (typeof dir === typeof undefined)
        dir = 'common';

    if (Array.isArray(name)) {
        var arr = [];
        for (var i in name) {
            arr.push(_getDataObject(name[i]));
        }
        _insertCSS(arr);
    } else {
        _insertCSS(_getDataObject(name));
    }

}

function userJS(targetFrame, name, dir, callback) {
    userCSS(targetFrame, name, dir, callback, true);
}

function domCSS(name, dir, callback, isJS) {

    function _insertCSS(str) {
        if (isJS === true)
            injectJS(baseURL + 'js/' + dir + '/' + str + '.js', 'body', 'file', callback);
        else
            injectCSS(baseURL + 'css/' + dir + '/' + str + '.css', 'body', 'file', callback);
    }

    if (typeof dir === typeof undefined)
        dir = 'page';

    if (Array.isArray(name)) {
        for (var i in name) {
            _insertCSS(name[i]);
        }
    } else {
        _insertCSS(name);
    }
}

function domJS(name, dir, callback) {
    domCSS(name, dir, callback, true);
}

function removeOverlay(forcible) {
    if (forcible === true) {
        $('#raspberry-hide-body').remove();
        $('#raspberry-load-cover').remove();
        if ($('#raspberry-hide-body').length || $('#raspberry-load-cover').length)
            removeOverlay(true);
    } else {
        $('#raspberry-hide-body').remove();
        setTimeout(function () {
            $('#raspberry-load-cover').addClass('raspberry-load-cover-hide');
            setTimeout(function () {
                $('#raspberry-load-cover').remove();
            }, 600);
        }, 300);
    }
}

function analyzePageURL() {

    function _getDefaultPage(mod) {
        if (typeof relation[mod] !== typeof undefined) {
            for (var p in relation[mod]) {
                if (relation[mod][p]['default'] === true) {
                    return p;
                }
            }
        }
        return false;
    }

    function _getPageFromURL(searchParams) {
        var pairs = searchParams.split('&');
        var key, data;
        for (var p in pairs) {
            key = pairs[p].split('=');
            data = key[1];
            key = key[0];
            if (key.match(/^Page$/)) {
                return data;
            }
        }
        return false;
    }

    var module, page, relation = getPageRelation();

    var url = currURL.split('/psc/SS/ACADEMIC/SA/c/');
    if (url.length > 1)
        url = url[1];
    else
        return false;

    url = url.split('?');
    module = url[0];
    // get page
    if (url.length > 1) { // length = 2
        if (url[1] === '') {
            // has ?, but no actual params in url
            page = _getDefaultPage(module);
        } else {
            // has params, get page from params
            page = _getPageFromURL(url[1]);
            // if page not in params, try to get default page
            if (page === false) page = _getDefaultPage(module);
        }
    } else if (url.length === 1) { // length = 1
        // no params in url
        page = _getDefaultPage(module);
    }

    if (page === false) return false;

    return {module: module, page: page};

}

function loginFunc() {

    // favicon
    if (options.GLB_RaspberryFavicon) {
        $('head link[rel="shortcut icon"]').attr('href', baseURL + 'icon/icon32.png').attr('type', 'image/png');
    }

    // auto redirect
    if (options.GLB_AutoRedirectToLogin) {
        injectJS("(function(){getIdPLink();})();", 'body', 'text');
        return;
    }

    if (!options.GLB_RaspberryWelcomePage) return;

    // remove style
    $('head link[rel="stylesheet"]').remove();

    // find elems
    var help = $('.ps_signinentry .ps_box-info a:contains(Help)'),
        intervalCounter = 0;

    var interval = setInterval(function () {
        if (!help.length) {
            help = $('.ps_signinentry .ps_box-info a:contains(Help)');
        } else {
            clearInterval(interval);

            $('.ps_signinentry .ps_box-info a').each(function (i, e) {
                var self = $(e);
                if (self.text().match(/Sign In/i)) {
                    self.addClass('btn btn-signin');
                    self.closest('.ps_box-info').addClass('raspberry-buttons');
                    var imgBg = baseURL + 'img/logo.png';
                    self.html('<div class="btn-img" style="background-image:url(' + imgBg + ')"></div>' +
                        '<div class="btn-text">Click to Sign In</div>');
                    self.closest('.ps_box-info').append('<div class="raspberry-buttons-group"></div>');
                } else if (self.text().match(/Help/i)) {
                    self.attr('target', '_blank').addClass('btn btn-help').appendTo('.raspberry-buttons-group');
                } else if (self.text().match(/Feedback/i)) {
                    self.attr('target', '_blank').addClass('btn btn-feedback').appendTo('.raspberry-buttons-group');
                } else if (self.text().match(/Privacy Policy/i)) {
                    self.attr('target', '_blank').addClass('btn btn-privacy').appendTo('.raspberry-buttons-group');
                }
            });

            $('.raspberry-buttons').after('<div class="copyright">&copy; University of Waterloo</div>');

            $('.ps_signinentry .ps_box-info:not(.raspberry-buttons)').remove();

            injectCSS(baseURL + 'css/common/font.css', 'body');
            injectCSS(baseURL + 'css/login/login.css', 'body');
            removeOverlay();
        }

        intervalCounter++;
        if (intervalCounter > 50) {
            removeOverlay();
            clearInterval(interval);
        }

    }, 100);

}

function frameworkFunc() {

    // avoid multiple execution
    var body = $('body');
    if (body.hasClass('raspberry-init')) return;
    body.addClass('raspberry-init');

    // update script
    extensionUpdate();

    // favicon
    if (options.GLB_RaspberryFavicon) {
        $('head link[rel="apple-touch-icon"]').attr('href', baseURL + 'icon/icon128.png');
        $('head link[rel="icon"]').attr('href', baseURL + 'icon/icon32.png').attr('type', 'image/png');
    }

    // css
    userCSS(0, ['font', 'page'], 'common');
    domCSS('framework', 'framework');

    // js
    chrome.runtime.sendMessage({
        action: 'executeScript',
        data: {
            allFrames: false,
            file: 'js/framework/framework.js'
        }
    });

    injectJS(baseURL + 'js/framework/framework_inject.js', 'head');

    removeOverlay();

}

function contentFunc2() {

    function _initContentPage() {
        var pageInfo = getPageRelation(urlInfo.module, urlInfo.page);

        if (pageInfo === false) {
            removeOverlay();
            return;
        }

        // detect course selection
        if (urlInfo.module === 'UW_CEM.UW_CEM_BYPASS.GBL') {
            var title = $('#DERIVED_REGFRM1_SS_TRANSACT_TITLE'),
                content = $('table[id^="ACE_UW_DERIVED_CEM_GROUP_BOX_"]');
            if (title.length && title.text().match(/Course Selection/i)
                && content.length && content.text().match(/will be considered during course enrollment/i)) {
                removeOverlay();
                return;
            }
        }

        // insert css and execute js
        var userCSSList = [], domCSSList = [], pageCSSList = [], cssList = getCommonAssetList('css');
        for (var c in pageInfo.css) {
            if (typeof cssList[pageInfo.css[c]] !== typeof undefined) {
                if (cssList[pageInfo.css[c]].method === 'user')
                    userCSSList.push(pageInfo.css[c]);
                else if (cssList[pageInfo.css[c]].method === 'dom')
                    domCSSList.push(pageInfo.css[c]);
            } else {
                pageCSSList.push(pageInfo.css[c]);
            }
        }
        userCSS(frameId, userCSSList, 'common');
        domCSS(domCSSList, 'common');
        domCSS(pageCSSList, 'page');

        var userJSList = [], domJSList = [], pageJSList = [], jsList = getCommonAssetList('js');
        for (var j in pageInfo.js) {
            if (typeof jsList[pageInfo.js[j]] !== typeof undefined) {
                if (jsList[pageInfo.js[j]].method === 'user')
                    userJSList.push(pageInfo.js[j]);
                else if (jsList[pageInfo.js[j]].method === 'dom')
                    domJSList.push(pageInfo.js[j]);
            } else {
                pageJSList.push(pageInfo.js[j]);
            }
        }
        userJS(frameId, userJSList, 'common');
        domJS(domJSList, 'common');
        userJS(frameId, pageJSList, 'page');

        removeOverlay();
    }

    var frameId = -1, allFrames;

    var urlInfo = analyzePageURL();
    if (urlInfo === false) return;
    // console.log(urlInfo);

    injectJS(baseURL + 'js/common/page_inject.js', 'head');

    chrome.runtime.sendMessage({
        action: 'getAllFrames'
    });

    chrome.runtime.onMessage.addListener(function (response) {

        if (response.action == 'getAllFramesResponse') {
            allFrames = response.data;
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].url.match(/\/psc\/SS\/ACADEMIC\/SA\/c\//)
                    && response.data[i].url.includes(urlInfo.module)
                    && !response.data[i].url.match(/NUI_FRAMEWORK/)) {

                    frameId = response.data[i].frameId;
                    _initContentPage();

                    break;
                }
            }
        }
    });


    if (currURL.match(/ICAJAX=1/)) {
        $('body').addClass('raspberry-modal-content');
    } else if (options.GLB_BackToTopButton) {
        // back to top button
        addBackToTopButton();
    }
}

function initRaspberryIdle() {

    // console.log(currURL);

    if (!options.GLB_Enabled) return;

    if ($('body').hasClass('raspberry-init-idle')) return;
    else $('body').addClass('raspberry-init-idle');

    var jsText = '';
    jsText += 'var baseURL = "' + baseURL + '";';
    jsText += 'var options = ' + JSON.stringify(options) + ';';
    jsText += 'var currURL = "' + currURL + '";';
    injectJS(jsText, 'head', 'text');

    if (currURL.match(/cmd=login/)) {
        // login page
        loginFunc();
    } else if (currURL.match(/cmd=expire/)) {
        // do nothing, wait for auto redirect
    } else if (currURL.match(/cmd=/)) {
        removeOverlay(true);
    } else if (currURL.match(/NUI_FRAMEWORK/)) {
        // nui framework
        frameworkFunc();
    } else {
        // iframe content
        contentFunc2();
    }

    // if nothing matched, remove overlay after 2 sec
    setTimeout(function () {
        removeOverlay(true);
    }, 2000);

}

if (initReady) {
    initRaspberryIdle();
} else {
    var initIntvCnt = 0;
    var initIntv = setInterval(function () {
        if (initReady) {
            clearInterval(initIntv);
            initRaspberryIdle();
        } else {
            initIntvCnt++;
            if (initIntvCnt > 50) {
                clearInterval(initIntv);
                removeOverlay(true);
            }
        }
    }, 100);
}
