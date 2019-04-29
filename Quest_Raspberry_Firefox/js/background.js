/**
 * Welcome on install
 * @param details
 */
function installWelcome(details) {
    if (details.reason === 'install') {
        browser.tabs.create({
            'url': browser.extension.getURL('/html/options.html?welcome=show')
        });
    }
}

/**
 * Update option
 * @param oldVer
 * @param newVer
 */
function updateOptions(oldVer, newVer) {

    // update storage
    browser.storage.sync.set({
        OPT_Version: newVer
    });

    // scripts
    // ...

    console.log('Option version updated!');
}

/**
 * Toolbar context menu
 * @param id
 * @param title
 * @param contexts
 * @param onClick
 */
function createToolbarContextMenu(id, title, contexts, onClick) {

    browser.contextMenus.remove(id, function () {
        browser.contextMenus.create({
            id: id,
            title: title,
            contexts: contexts
        });
        if (browser.runtime.lastError) {
        }
    });

    browser.contextMenus.onClicked.addListener(function (info, tab) {
        if (info.menuItemId == id) {
            if (typeof onClick === 'function')
                onClick();
        }
    });
}

function catchLastError() {
    if (browser.runtime.lastError) {
        console.log("Error: ", browser.runtime.lastError);
    }
}

function initBackground() {
    console.log('Welcome to Quest Raspberry!');
    browser.runtime.onInstalled.addListener(installWelcome);

    var version = getOptionVersion();
    var configs = getOptionListDefault();
    var options;

    /**
     * Check data updates
     */
    browser.storage.sync.get(configs, function (items) {
        options = items;

        // option version
        if (options.OPT_Version < version)
            updateOptions(options.OPT_Version, version);

        // extension version
        // if (versionCompare(options.EXT_Version, browser.app.getDetails().version) < 0)
        //     extensionUpdated(options.EXT_Version, browser.app.getDetails().version);

    });

    /**
     * Chrome API Calls From Content Scripts
     */
    browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {

        // execute script
        if (request.action == 'executeScript') {

            // request.data = {code:'', allFrames:false, frameId:123};
            function _executeScript(obj, func) {
                if (typeof func === 'function') {
                    browser.tabs.executeScript(sender.tab.id, obj, function () {
                        func();
                        catchLastError();
                        browser.tabs.sendMessage(sender.tab.id, {
                            action: 'executeScriptResponse',
                            data: obj
                        });
                    });
                } else {
                    browser.tabs.executeScript(sender.tab.id, obj, function () {
                        catchLastError();
                        browser.tabs.sendMessage(sender.tab.id, {
                            action: 'executeScriptResponse',
                            data: obj
                        });
                    });
                }
            }

            if (Array.isArray(request.data)) {
                for (var i in request.data) {
                    _executeScript(request.data[i], sendResponse);
                }
            } else {
                _executeScript(request.data, sendResponse);
            }

        }

        // inject css
        else if (request.action == 'insertCSS') {

            function _insertCSS(obj, func) {
                if (typeof func === 'function') {
                    browser.tabs.insertCSS(sender.tab.id, obj, function () {
                        func();
                        catchLastError();
                        browser.tabs.sendMessage(sender.tab.id, {
                            action: 'insertCSSResponse',
                            data: obj
                        });
                    });
                } else {
                    browser.tabs.insertCSS(sender.tab.id, obj, function () {
                        catchLastError();
                        browser.tabs.sendMessage(sender.tab.id, {
                            action: 'insertCSSResponse',
                            data: obj
                        });
                    });
                }
            }

            if (Array.isArray(request.data)) {
                for (var i in request.data) {
                    _insertCSS(request.data[i], sendResponse);
                }
            } else {
                _insertCSS(request.data, sendResponse);
            }

        }

        // app.getDetails
        else if (request.action == 'getDetails' || request.action == 'getManifest') {

            var obj = browser.runtime.getManifest();
            if (typeof sendResponse === 'function') sendResponse(obj);

        }

        // open new tab
        else if (request.action == 'createTab') {

            request.data['index'] = sender.tab.index + 1;
            browser.tabs.create(request.data);

            if (typeof sendResponse === 'function') sendResponse();

        }

        // getAllFrames
        else if (request.action == 'getAllFrames') {
            browser.webNavigation.getAllFrames({tabId: sender.tab.id}, function (response) {
                browser.tabs.sendMessage(sender.tab.id, {
                    'action': 'getAllFramesResponse',
                    'data': response
                });
            });
        }

    });

    /**
     * Add toolbar context menu
     */
    createToolbarContextMenu('dlight-website', 'Official Website', ['browser_action'], function () {
        browser.tabs.create({
            url: getLink('officialWebsite')
        });
    });
    createToolbarContextMenu('dlight-contribute', 'Donate', ['browser_action'], function () {
        browser.tabs.create({
            url: getLink('donate')
        });
    });
    createToolbarContextMenu('dlight-github', 'GitHub', ['browser_action'], function () {
        browser.tabs.create({
            url: getLink('github')
        });
    });
}

initBackground();
