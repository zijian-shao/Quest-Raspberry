function initOptions() {

    function getFeedbackLink() {
        function _getOS() {
            var OSName = "Unknown";
            if (window.navigator.userAgent.indexOf("Windows NT 10.0") != -1) OSName = "Windows 10";
            if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1) OSName = "Windows 8";
            if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1) OSName = "Windows 7";
            if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1) OSName = "Windows Vista";
            if (window.navigator.userAgent.indexOf("Windows NT 5.1") != -1) OSName = "Windows XP";
            if (window.navigator.userAgent.indexOf("Windows NT 5.0") != -1) OSName = "Windows 2000";
            if (window.navigator.userAgent.indexOf("Mac") != -1) OSName = "Mac/iOS";
            if (window.navigator.userAgent.indexOf("X11") != -1) OSName = "UNIX";
            if (window.navigator.userAgent.indexOf("Linux") != -1) OSName = "Linux";
            return OSName;
        }

        function _getBrowser() {
            var ua = navigator.userAgent, tem,
                M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return {name: 'IE ', version: (tem[1] || '')};
            }
            if (M[1] === 'Chrome') {
                tem = ua.match(/\bOPR\/(\d+)/);
                if (tem != null) return {name: 'Opera', version: tem[1]};
            }
            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
            if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
            return {name: M[0], version: M[1]};
        }

        var urlTpl = getLink('feedback');
        urlTpl = urlTpl.replace('@@extVersion@@', encodeURI(browser.runtime.getManifest().version));
        urlTpl = urlTpl.replace('@@browser@@', encodeURI(_getBrowser().name + ' ' + _getBrowser().version));
        urlTpl = urlTpl.replace('@@os@@', encodeURI(_getOS()));

        return urlTpl;
    }

    function restoreOptions() {

        var configs = getOptionListDefault();

        browser.storage.sync.get(configs, function (items) {

            var optionElem;
            for (var key in items) {
                optionElem = $('input[data-option-name="' + key + '"]');
                if (optionElem.attr('type') === 'radio') {
                    optionElem = $('input[data-option-name="' + key + '"][value="' + items[key] + '"]');
                    optionElem.prop('checked', items[key]);
                } else if (optionElem.attr('type') === 'checkbox') {
                    optionElem.prop('checked', items[key]);
                }

                switch (key) {
                    case 'GLB_HighlightColor':
                        optionElem.closest('.color-item').addClass('selected');
                        break;
                    default:
                }
            }

            bindEvents();
        });

    }

    function saveOption(obj) {

        browser.storage.sync.set(obj, function () {

            $('#raspberry-toast').removeClass('raspberry-toast-hidden');

            window.clearTimeout(timeoutHandle);
            timeoutHandle = setTimeout(function () {
                $('#raspberry-toast').addClass('raspberry-toast-hidden');
            }, 1000);

        });
    }

    function bindEvents() {

        $('input').on('change', function () {

            var inputType = $(this).attr('type');
            var optType = $(this).attr('data-option-type');
            var optName = $(this).attr('data-option-name');

            if (inputType == 'checkbox') {

                switch (optType) {

                    // simple switch, save as boolean
                    case 'switch':

                        var obj = {};
                        obj[optName] = $(this).is(':checked');
                        saveOption(obj);

                        break;

                    // list of items, save as array string
                    case 'item':

                        var contentArr = [];

                        $('input[data-option-name="' + optName + '"]').each(function (index, element) {
                            if ($(element).is(':checked')) {
                                contentArr.push($(element).attr('name'));
                            }
                        });

                        var obj = {};
                        // obj[optName] = JSON.stringify(contentArr);
                        obj[optName] = contentArr;
                        saveOption(obj);

                        break;
                }
            }

            else if (inputType == 'radio') {

                switch (optType) {
                    // save "value" attr of the radio
                    case 'enum':

                        var obj = {};
                        obj[optName] = $(this).attr('value');
                        saveOption(obj);

                        break;
                }
            }
        });

        $('input[id^=color-item-]').on('change', function () {
            $('input[id^=color-item-]').closest('.color-item').removeClass('selected');
            $(this).closest('.color-item').addClass('selected');
        });

    }

    function loadColorList() {
        var list = getHighlightColorList();
        var elTxt = '';
        for (var i in list) {
            elTxt += '<div class="color-item">';
            elTxt += '<input type="radio" ' +
                'id="color-item-' + i + '"' +
                'name="GLB_HighlightColor" ' +
                'value="' + list[i].color + '" ' +
                'data-option-name="GLB_HighlightColor" ' +
                'data-option-type="enum">';
            elTxt += '<label for="color-item-' + i + '" class="color-circle" title="' + list[i].name + '" style="background:' + list[i].color + '"></label>';
            elTxt += '</div>';
        }
        $('#color-list').html(elTxt);
    }

    function getSearchParameters() {

        // stack overflow 5448545
        function _transformToAssocArray(prmstr) {
            var paramsO = {};
            var prmarr = prmstr.split("&");
            for (var i = 0; i < prmarr.length; i++) {
                var tmparr = prmarr[i].split("=");
                paramsO[tmparr[0]] = tmparr[1];
            }
            return paramsO;
        }

        var prmstr = window.location.search.substr(1);
        return prmstr != null && prmstr != "" ? _transformToAssocArray(prmstr) : {};
    }

    function removeSearchParameters(sParam, keepHash, fromString) {

        var hash = window.location.hash;

        var url = window.location.href.split('?')[0] + '?';
        if (typeof fromString !== typeof undefined) url = fromString.split('?')[0] + '?';

        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (Array.isArray(sParam)) {
                var matched = false;
                sParam.forEach(function (pr) {
                    if (sParameterName[0] == pr) {
                        matched = true;
                    }
                });
                if (!matched) {
                    url = url + sParameterName[0] + '=' + sParameterName[1] + '&';
                }
            } else {
                if (sParameterName[0] != sParam) {
                    url = url + sParameterName[0] + '=' + sParameterName[1] + '&';
                }
            }
        }

        if (keepHash !== true) {
            return url.substring(0, url.length - 1);
        } else {
            return url.substring(0, url.length - 1) + hash;
        }
    }

    function processSearchParameters() {
        if (params['whatsnew'] !== undefined) {
            newFeatureGuide();
        }
        if (params['welcome'] !== undefined) {
            welcomeGuide();
        }
    }

    function newFeatureGuide() {
        var newCont = $('#whatsnew');
        newCont.removeClass('hidden');
        newCont.find('.whatsnew-btn').on('click', function (e) {
            e.preventDefault();
            window.location.href = removeSearchParameters('whatsnew');
        });
    }

    function welcomeGuide() {
        var welcomeCont = $('#welcome');
        welcomeCont.removeClass('hidden');
        welcomeCont.find('.welcome-btn').on('click', function (e) {
            e.preventDefault();
            window.location.href = removeSearchParameters('welcome');
        });
    }

    var params = getSearchParameters();

    $(window).on('load', function () {

        $('*[data-href]').each(function (idx, elem) {
            $(elem).attr('href', getLink($(elem).attr('data-href')));
        });

        processSearchParameters();

        loadColorList();

        restoreOptions();

        // version #
        $('#ext-version').text('Version ' + browser.runtime.getManifest().version);

        // feedback
        $('#feedback-link').attr('href', getFeedbackLink());

    });

    var timeoutHandle = setTimeout(function () {

    }, 0);

}

initOptions();