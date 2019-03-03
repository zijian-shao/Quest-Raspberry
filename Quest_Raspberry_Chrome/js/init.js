var baseURL, currURL, options, configs;

var initReady = false;

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