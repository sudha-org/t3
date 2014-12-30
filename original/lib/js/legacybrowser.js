var legacybrowser = {
    cookieName: "legacybrowser",
    updateurl: "/update-browser",
    getCookie: (function(e) {
        for (var t = e + "=", n = document.cookie.split(";"), a = 0; a < n.length; a++) {
            for (var i = n[a];
                " " == i.charAt(0);) i = i.substring(1, i.length);
            if (0 === i.indexOf(t)) return i.substring(t.length, i.length)
        }
        return undefined
    }),
    setCookie: (function(e, t, n) {
        var a;
        if (n) {
            var i = new Date;
            i.setTime(i.getTime() + 24 * n * 60 * 60 * 1e3), a = "; expires=" + i.toGMTString()
        } else a = "";
        document.cookie = e + "=" + t + a + "; path=/"
    }),
    Initialize: (function() {
        /*var retval = legacybrowser.getCookie(legacybrowser.cookieName);
        if (retval !== "true") {
            window.location.href = legacybrowser.updateurl;
        }*/
    }),
    saveUsersValue: (function() {
        legacybrowser.setCookie(legacybrowser.cookieName, true, 1);
        window.location.href = document.referrer.host === window.location.host ? document.referrer : "/";
    })
};

if (window.location.pathname !== legacybrowser.updateurl) {
    legacybrowser.Initialize();
}
var getquote = document.getElementById("btnQuote");
var getquotemenu = document.getElementById("menuGetQuote");
getquote.onclick = function (e) {
    getquotemenu.style.display = getquotemenu.style.display == "block" ? "none" : "block";
}