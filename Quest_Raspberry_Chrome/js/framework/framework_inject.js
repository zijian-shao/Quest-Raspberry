var rbApp = {

    keepLogin: function () {
        setInterval(function () {
            var xhttp1 = new XMLHttpRequest();
            xhttp1.open("GET", "/psc/SS/ACADEMIC/SA/c/?cmd=ping", true);
            xhttp1.send();
            var xhttp2 = new XMLHttpRequest();
            xhttp2.open("GET", "/psc/SS/ACADEMIC/SA/c/?cmd=resettimeout", true);
            xhttp2.send();

            if (typeof resetAutoSave === typeof function () {
            }) {
                resetAutoSave();
            }
        }, 7 * 60 * 1000);
    },

    init: function () {
        if (options.GLB_KeepSessionAlive)
            rbApp.keepLogin();
    }

};

rbApp.init();