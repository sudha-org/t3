/*
 *LOAD SCRIPTS FUNCTION
 *Minify using http://jscompress.com/ and added to s_code in DTM
 */
(function() {
    window.responseStartTimeStamp = +new Date();
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(obj, start) {
            for (var i = (start || 0), j = this.length; i < j; i++) {
                if (this[i] === obj) {
                    return i;
                }
            }
            return -1;
        };
    }
    if (typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        };
    };
    /*FAQs logic*/
    window._FAQS = {
        _key: "FAQs",
        _isLocalStorage: function() {
            try {
                return 'localStorage' in window && window['localStorage'] !== null;
            } catch (e) {
                return false;
            }
        },
        _get: function() {
            return _FAQS._isLocalStorage() ? (localStorage.getItem(_FAQS._key) || "") : _satellite.readCookie(_FAQS._key);
        },
        _set: function(obj) {
            if (_FAQS._isLocalStorage()) {
                localStorage.setItem(_FAQS._key, obj)
            } else {
                _satellite.setCookie(_FAQS._key, obj, 365);
            }
        },
        _remove: function() {
            if (_FAQS._isLocalStorage()) {
                localStorage.removeItem(_FAQS._key)
            } else {
                _satellite.removeCookie(_FAQS._key);
            }
        },
        _faqlinkclick: function(e) {
            try {
                var _this = $(e),
                    _delimiter = ";",
                    _pn = _satellite.getVar("Page Name"),
                    _question = _this.find("div:nth-child(2)"),
                    _faqslistitem = _pn + "|" + "Q" + ($("dd.accordion-navigation>a").index(_this) + 1) + " " + _question.text().replace(/;/g, '').trim(),
                    _faqslist = _FAQS._get().split(_delimiter);
                if (_this.parent("dd.accordion-navigation.active").length == 0) {
                    (_faqslist.length == 1 && _faqslist[0] == "") ? _faqslist[0] = _faqslistitem: _faqslist.push(_faqslistitem);
                    s.list2 = _faqslist.join(_delimiter);
                    _FAQS._set(s.list2);
                }
                if (typeof(window.EXTERNALLINKCLICKED) == "undefined") {
                    _FAQS._initialize();
                }
            } catch (ex) {
                //console.log(ex);
            }
        },
        _initialize: function() {
            var faqelements = _FAQS._get();
            /*non blocking scripts*/
            if (faqelements !== null && faqelements.length > 0) {
                (function() {
                    window.EXTERNALLINKCLICKED = true;
                    $(document).delegate('a', 'click', function() {
                        var webprotocol = ["http:", "https:"].indexOf(this.protocol) > -1,
                            samehost = this.host == location.host,
                            sameurl = samehost && (this.pathname == location.pathname);
                        window.EXTERNALLINKCLICKED = sameurl ? sameurl : (webprotocol && !samehost);
                    });

                    window.onbeforeunload = function(e) {
                        var _f = _FAQS._get(),
                            _ex = window.EXTERNALLINKCLICKED,
                            _setDelay = function(ms) {
                                ms += new Date().getTime();
                                while (new Date() < ms) {}
                            };
                        if ((_f !== null && _f.length > 0) && _ex) {
                            delete s.prop16;
                            delete s.eVar16;
                            delete s.eVar18;
                            s.linkTrackVars = "events";
                            s.linkTrackEvents = "event14";
                            s.events = "event14";
                            s.list2 = _f;
                            s.tl();
                            _FAQS._remove();
                            _setDelay(500);
                        }
                    }
                })();
            }
        }
    };

    _FAQS._initialize();

    /*
    Below Code used for local storage and link tracking
    */
    window.DLR_EventDataMgr = {
        STORENAME: "eventdata",
        init: function() {
            this.data = {};
        },
        setProperty: function(a, b) {
            if (this.data == null) {
                this.init();
            }
            this.data[a] = b;
        },
        getProperty: function(a) {
            if (this.data == null) {
                this.init();
            }
            return this.data[a];
        }
    };

    window.DLR_StoreRegistry = {
        allStroes: {
            eventdata: DLR_EventDataMgr
        },
        getStore: function(name) {
            return DLR_StoreRegistry.allStroes[name]
        },
        getStores: function() {
            return DLR_StoreRegistry.allStroes
        }
    }


    window.DLR_Sitecatalyst = {
        stores: DLR_StoreRegistry.getStores(),
        convertToArray: function(a, b) {
            return [a, b]
        },
        collect: function() {
            var dataElements = $("input.uci-record-data[type='hidden']");
            var evnts = {};
            var eventdata = DLR_EventDataMgr;
            dataElements.each(function(i) {
                var trackres = eval("DLR_Sitecatalyst.convertToArray(" + this.value + ")");
                var event = trackres[0];
                evnts[event] = event;
                var data = trackres[1];
                for (var j in data) {
                    var store = eventdata;
                    var prop = j.split(".");
                    store.setProperty(prop, data[j])
                }
            });

            var myevents = [];
            for (i in evnts) {
                myevents.push(i);
            }
            eventdata.setProperty("events", myevents.join("\u2026"));
            dataElements.remove();
        },

        hasEvent: function(eventName) {
            var st = DLR_StoreRegistry.getStore("eventdata");
            var e = st.getProperty("events").split("\u2026");
            var l = e.length;
            while (l--) {
                if (e[l] === eventName) {
                    return true
                }
            }
            return false
        },

        setEvar: function(evar, value) {
            if (evar.match(/^eventdata\.events\./)) {
                if (this.hasEvent(evar.replace(/.+\./, ""))) {
                    s.events = s.events + "," + value;
                    s.linkTrackEvents = s.linkTrackEvents + "," + value;
                }
            } else {
                if (value != "") {
                    for (var store in this.stores) {
                        try {
                            eval("var " + store + "=this.stores[store].data")
                        } catch (e) {
                            console.log(e)
                        }
                        try {
                            if (eval(value) != null && eval(value) != "") {
                                s[evar] = eval(value);
                            }
                        } catch (e) {
                            console.log("Could not set " + evar + ": " + e)
                        }
                    }
                }

            }
        },

        updateEvars: function() {
            var mapping = [];
            mapping.push({
                scVar: "eVar16",
                cqVar: "eventdata.customLinkTrackingValue"
            });
            mapping.push({
                scVar: "prop16",
                cqVar: "eventdata.customLinkTrackingValue"
            });
            mapping.push({
                scVar: "eventdata.events.customLinkTrackingClick",
                cqVar: "event16"
            });
            mapping.push({
                scVar: "eventdata.events.quoteRetrieval",
                cqVar: "event9"
            });
            mapping.push({
                scVar: "eVar13",
                cqVar: "eventdata.carouselLinkTrackingValue"
            });
            mapping.push({
                scVar: "prop13",
                cqVar: "eventdata.carouselLinkTrackingValue"
            });
            mapping.push({
                scVar: "eventdata.events.carouselLinkTrackingClick",
                cqVar: "event18"
            });
            mapping.push({
                scVar: "eVar10",
                cqVar: "eventdata.socialLinkValue"
            });
            mapping.push({
                scVar: "eventdata.events.socialLinkClick",
                cqVar: "event33"
            });
            mapping.push({
                scVar: "prop10",
                cqVar: "eventdata.socialLinkValue"
            });
            mapping.push({
                scVar: "eventdata.events.phoneLinkTrackingClick",
                cqVar: "event32"
            });
            mapping.push({
                scVar: "prop19",
                cqVar: "eventdata.phoneLinkTrackingValue"
            });
            mapping.push({
                scVar: "eVar19",
                cqVar: "eventdata.phoneLinkTrackingValue"
            });
            for (var i = 0; i < mapping.length; i++) {
                var m = mapping[i];
                this.setEvar(m.scVar, m.cqVar);
            }
        }

    };

    window._Dlg = {
        _sessionStartDate: "sessionStartDate",
        _analyticsStore: "analyticsStore",

        _isLocalStorageValid: function(timeStamp) {
            return timeStamp && timeStamp < new Date().getTime();
        },

        _isLocalStorage: function() {
            try {
                return 'localStorage' in window && window['localStorage'] !== null;
            } catch (e) {
                return false;
            }
        },

        _clearLocalStorage: function() {
            var i, key, length = localStorage.length;
            for (i = 0; i < length; i++) {
                key = localStorage.key(i);
                if (key.indexOf(_Dlg._analyticsStore) === 0) {
                    localStorage.removeItem(key);
                }
            }
        },

        _clearStorage: function() {
            if (_Dlg._isLocalStorage()) {
                _Dlg._clearLocalStorage();
            } else {
                delete window[_Dlg._analyticsStore];
            }
        },

        _getObjectFromLocalStorage: function(timeStamp) {
            var storeName = _Dlg._analyticsStore + "-" + timeStamp,
                object;
            if (_Dlg._isLocalStorage()) {
                object = localStorage.getItem(storeName);
            } else {
                object = window[_Dlg._analyticsStore];
            }

            return object ? JSON.parse(object) : {};
        },

        _setObjectToLocalStorage: function(timeStamp, data) {
            var storeName = _Dlg._analyticsStore + "-" + timeStamp;

            if (_Dlg._isLocalStorage()) {
                localStorage.setItem(storeName, data);
            } else {
                window[_Dlg._analyticsStore] = data;
            }
        },


        _addItemToLocalStoreage: function(key, value) {
            var timeStamp = _satellite.readCookie(_Dlg._sessionStartDate);
            if (!_Dlg._isLocalStorageValid(timeStamp)) {
                _Dlg._clearStorage();
                timeStamp = new Date().getTime();
                _satellite.setCookie(_Dlg._sessionStartDate, timeStamp);
            }
            var data = _Dlg._getObjectFromLocalStorage(timeStamp) || {};
            data[key] = value;

            _Dlg._setObjectToLocalStorage(timeStamp, JSON.stringify(data));
        },

        _getItemFromLocalStorage: function(key) {
            var timeStamp = _satellite.readCookie(_Dlg._sessionStartDate);
            if (!_Dlg._isLocalStorageValid(timeStamp)) {
                _Dlg._clearStorage();
            }
            var data = _Dlg._getObjectFromLocalStorage(timeStamp),
                item = null;
            if (data && data[key]) {
                item = data[key];
            }
            return item;
        },

        _removeItemFromLocalStorage: function(key) {
            var timeStamp = _satellite.readCookie(_Dlg._sessionStartDate);
            if (!_Dlg._isLocalStorageValid(timeStamp)) {
                _Dlg._clearStorage();
            }
            var data = _Dlg._getObjectFromLocalStorage(timeStamp)
            if (data) {
                delete data[key];
                _Dlg._setObjectToLocalStorage(timeStamp, JSON.stringify(data));
            }
        },
        /*_satellite.setVar('clickedText', jQuery(this).text());
        _Dlg._trackOnNextPageForCutomLink('customLinkTrackingClick', 'customLinkTrackingValue', eVarValue);
        return true;*/
        _trackOnNextPageForCutomLink: function(ev, evar, value) {
            var data = {
                event: ev,
                eVarName: evar,
                eVarValue: value
            };
            customSpan = "'" + ev + "',{'" + evar + "': '" + value + "'}";
            _satellite.setCookie('dlg.customLinkTracker', customSpan, 1);
            _Dlg._addItemToLocalStoreage('customLinkTracking', data);
        },

        _addRecordElement: function(recordVal) {
            $('<input />', {
                type: "hidden",
                value: recordVal
            }).addClass("uci-record-data").appendTo("body");
        },

        _addLinkTrackingElement: function(key) {
            var data = _Dlg._getItemFromLocalStorage(key),
                CookieDataCustomLinkTracker = _satellite.readCookie('dlg.customLinkTracker'),
                recordVal;
            if (data) {
                recordVal = "'" + data.event + "', {'" + data.eVarName + "': '" + data.eVarValue + "'}";
                _Dlg._addRecordElement(recordVal)
                _Dlg._removeItemFromLocalStorage(key);
            } else {
                if (CookieDataCustomLinkTracker) {
                    _Dlg._addRecordElement(CookieDataCustomLinkTracker);
                }
            }
            _satellite.removeCookie('dlg.customLinkTracker');

        },

        _initialize: function() {
            _Dlg._addLinkTrackingElement('customLinkTracking');
            DLR_Sitecatalyst.collect();
            DLR_Sitecatalyst.updateEvars();
        }
    };

    _Dlg._initialize();


    window.dlganalytics = {
        utility: {
            loadclientscript: function(src, async) {
                try {
                    var _m = document.createElement("script");
                    _m.type = "text/javascript";
                    _m.charset = "utf-8";
                    _m.src = src;
                    if (async) {
                        _m.async = true;
                    }
                    document.body.appendChild(_m);
                } catch (ex) {
                    console.log(ex);
                }
            },
            localstorage: function() {
                try {
                    return 'localStorage' in window && window['localStorage'] !== null;
                } catch (e) {
                    return false;
                }
            },
            internallinks: function() {
                var exl = [],
                    links = document.getElementsByTagName("a");
                for (var z = 0; z < links.length; z++) {
                    var ispagelink = links[z].protocol === window.location.protocol,
                        issamedomain = links[z].hostname === window.location.hostname,
                        isurl = ["http:", "https:"].indexOf(links[z].protocol) > -1,
                        issamepage = ispagelink && issamedomain && isurl && links[z].pathname === window.location.pathname;
                    if (ispagelink && issamedomain && isurl && !issamepage) {
                        exl.push(links[z]);
                    }
                }
                return exl;
            },
            internalforms: function() {
                var exl = [],
                    forms = document.getElementsByTagName("form"),
                    domain = window.location.protocol + "//" + window.location.hostname,
                    url = domain + window.location.pathname;
                for (var z = 0; z < forms.length; z++) {
                    var issamedomain = forms[z].action.indexOf(domain) > -1,
                        isurl = forms[z].action.indexOf("http:") === 0 || forms[z].action.indexOf("https:") === 0,
                        issamepage = forms[z].action.indexOf(domain + url) > -1;
                    if (issamedomain && isurl && !issamepage) {
                        exl.push(forms[z]);
                    }
                }
                return exl;
            },
            initialize: function() {
                /*
                window.EXTERNALNAVIGATION = true;
                var il = this.internallinks(),
                    ifo = this.internalforms(),
                    falsify = function() {
                        window.EXTERNALNAVIGATION = false;
                    };

                $(il).click(function(e) {
                    falsify();
                });
                $(ifo).submit(function(e) {
                    falsify();
                    this.submit();
                });
                */
            }
        },
        setVistitorID: function() {
            if (_satellite.readCookie('s_vi')) {
                var _v_id = _satellite.getVar("Visitor ID(mid)");
                s.eVar4 = _v_id;
                s.prop4 = _v_id;
            }
            s.events = (typeof(s.events) !== "undefined" ? s.events + "," : "") + "event25=" + _satellite.getVar("Page Load Time");
        },
        trackVideoClicks: function() {
            if (typeof(wistiaEmbed) !== "undefined") {
                wistiaEmbed.bind('play', function() {
                    if (this.time() < 2) {
                        var comp = _satellite.getVar("Page Name") + " | " + wistiaEmbed.data.media.name;
                        s.linkTrackVars = "events,eVar40,prop40";
                        s.linkTrackEvents = "event40";
                        s.events = "event40";
                        s.eVar40 = s.prop40 = comp;
                        s.tl(this, "o", "Video Tracking");
                    }
                });
            }
        },
        trackSearch: function() {
            var googleinput = $("#gsc-i-id1"),
                searchquery = function() {
                    var query = window.location.hash.split("&"),
                        _sq = "";
                    for (var i = 0; i < query.length; i++) {
                        if (query[i].indexOf("gsc.q") > -1) {
                            _sq = query[i].split("=")[1];
                        }
                    }
                    return googleinput.text() || _sq;
                },
                trackgoogle = function() {
                    delete s.prop16;
                    delete s.eVar16;
                    s.linkTrackVars = "events,eVar39,prop39";
                    s.linkTrackEvents = "event39";
                    s.prop39 = s.eVar39 = searchquery();
                    s.events = "event39";
                    s.t();
                    delete s.events;
                    delete s.prop39;
                    delete s.eVar39;
                    var glinks = "table.gsc-table-result a.gs-title";
                    var googlelinktrack = function(e) {
                        s.linkTrackVars = "events";
                        s.linkTrackEvents = "event38";
                        s.events = "event38";
                        s.tl(this, "o", "Search Result Clicked");
                        $(document).off("click", glinks, googlelinktrack);
                    };
                    $(document).on("click", glinks, googlelinktrack);
                };
            $(document).on("keyup", googleinput, function(e) {
                var p = e.which;
                if (p == 13) {
                    trackgoogle();
                }
            });
            $(document).on("click", "input.gsc-search-button", function(e) {
                trackgoogle();
            });
            /*On page load*/
            if (searchquery().length > 0) {
                trackgoogle();
            }
        },
        setEvar2: function() {
            var loc = window.location.pathname.toLowerCase(),
                retval = null;
            if (loc.indexOf("/car-insurance/") > -1) {
                retval = "Motor";
            } else if (loc.indexOf("/home-insurance/") > -1) {
                retval = "Home";
            } else if (loc.indexOf("/pet-insurance/") > -1) {
                retval = "Pet";
            } else if (loc.indexOf("/travel-insurance/") > -1) {
                retval = "Travel";
            } else if (loc.indexOf("/life-insurance/") > -1) {
                retval = "Life";
            } else if (loc.indexOf("/breakdown-cover/") > -1) {
                retval = "Rescue/Breakdown";
            } else if (loc.indexOf("/select-premier/") > -1) {
                retval = "SelectPremier";
            }
            if (retval !== null) {
                s.eVar2 = retval
            };
        },
        trackHomePage: function(me) {
            try {
                var _this = $(me),
                    _parent1 = _this.parent().parent().find("h2"),
                    _parent2 = _this.parent().parent().parent().find("h2"),
                    _parent = _parent1.length > 0 ? _parent1 : _parent2,
                    component = _satellite.getVar("Page Name") + " | HOMEPAGE-SECTION : ",
                    linktext = _this.text().replace(/\r?\n|\r/g, ' ').replace(/ /g, ''),
                    section = _this.parent("h2").length > 0 ? linktext :
                    _parent.text().replace(/\r?\n|\r/g, ' ').replace(/ /g, '') + " : " + linktext;
                if (linktext.toLowerCase().indexOf("quote") > -1 && _this.attr("href").indexOf("/quote/car/") == -1) {
                    window.dlganalytics.trackCustomLink(me, component + section);
                } else {
                    _Dlg._trackOnNextPageForCutomLink('customLinkTrackingClick', 'customLinkTrackingValue', component + section);
                }
            } catch (ex) {

            }
        },
        mainNavigationClick: function(me) {
            try {
                var _this = $(me),
                    parentnav = _this.parents('*[data-analytics-uci]'),
                    navcomponent = _satellite.getVar("Page Name") + " | " + _this.attr("id").replace(/\//g, ':');
                if (_this.attr("href").indexOf("css.directline.com") > -1) {
                    window.dlganalytics.trackCustomLink(me, navcomponent);
                } else {
                    _Dlg._trackOnNextPageForCutomLink('customLinkTrackingClick', 'customLinkTrackingValue', navcomponent);
                }

            } catch (ex) {

            }
        },
        trackCustomLink: function(me, component) {
            s.linkTrackVars = "events,eVar16,prop16";
            s.linkTrackEvents = "event16";
            s.events = "event16";
            s.eVar16 = s.prop16 = component;
            s.tl(me, "o", component);
        },
        trackContentGetQuotes: function() {
            var getquotes = $("a:contains('quote')");
            if (getquotes.length > 0) {
                /*carousel, slick carousel*/
                var alreadytrackedlinks = $(".carousel div a, .carousel div button, .cover-levels-overview .cover-type a, " + "#homepage_container a, div#menu-wrapper-mobile-up a[href], #menu-wrapper-mobile a[href], " +
                    "aside.off-canvas-navigation.hide-for-large-up a[href], #footer a[href]");

                var headertext = function(me) {
                    var _txt = $(me).parents("section").find(':header').first();
                    if (_txt.length > 0) {
                        return _txt.text().replace(/\r?\n|\r/g, ' ').replace(/'/g, '\'').trim();/*.replace(/ /g, '')*/
                    }
                    return undefined;
                };

                getquotes.not(alreadytrackedlinks).click(function(e) {
                    var _hdr = headertext(this),
                        _this = $(this),
                        _pgn = _satellite.getVar("Page Name"),
                        _component = _pgn + " | " + (typeof(_hdr) !== "undefined" ? (_hdr + " : ") : "") + _this.text();
                    if (_this.attr("href").indexOf("/quote/car/") > -1) {
                        _Dlg._trackOnNextPageForCutomLink('customLinkTrackingClick', 'customLinkTrackingValue', _component);
                    } else {
                        window.dlganalytics.trackCustomLink(this, _component);
                    }
                });
            }
        },
        trackSlickCarouselLinks: function(me) {
            var slickslides = $("div.slick-slide:not(.slick-cloned)"),
                _this = $(me),
                _parent = _this.parents("div.slick-slide.slick-active"),
                _slickindex = slickslides.index(_parent),
                _txt = _parent.find(':header').first(),
                _headertext = "";
            if (_txt.length > 0) {
                _headertext = _txt.text().replace(/\r?\n|\r/g, ' ').trim();
            }
            _linkvar = _satellite.getVar("Page Name") + " | Carousel : " + (_slickindex + 1) + " : " + _headertext + " : " + _this.text();
            _Dlg._trackOnNextPageForCutomLink('carouselLinkTrackingClick', 'carouselLinkTrackingValue', _linkvar);
        },
        trackCoverlLevelsCarousel: function(me) {
            var covers = $(".cover-type"),
                _this = $(me),
                _parent = _this.parents("div.cover-type"),
                _coverindex = covers.index(_parent),
                _txt = _parent.find(':header').first(),
                _headertext = "";
            if (_txt.length > 0) {
                _headertext = _txt.text().replace(/\r?\n|\r/g, ' ').trim();
            }
            _linkvar = _satellite.getVar("Page Name") + " | Carousel : " + (_coverindex + 1) + " : " + _headertext + " : " + _this.text();
            _Dlg._trackOnNextPageForCutomLink('carouselLinkTrackingClick', 'carouselLinkTrackingValue', _linkvar);
        },
        /*IJENTO*/
        IJENTO: function() {
            window.SITEINTEL = {};
            window.IJENTO = {};
            SITEINTEL.config = {
                taggingServer: "analytics.directlinegroup.com",
                cookieName: "SIVISITOR",
                tracerCookieName: "SITRACER",
                linkAttribute: "id",
                searchTracerPath: "/search",
                cookieQPName: "simigvis",
                cookiePath: "/",
                cookieTimeout: 315360000000,
                cookiePreferenceCallback: null,
                cookiePreferenceCookieName: "ijCookieCookie",
                cookieValueCallback: null,
                tracerTimeout: 1000,
                domainList: [".co.uk", ".com", ".org", ".net", ".org.uk"],
                centralCookie: false,
                centralReqName: "req",
                centralRefName: "refer",
                centralURL: "",
                trackerUrl: "/si/track-test.gif",
                determineTrackingBase: null,
                determineTrackingScript: null
            };
            IJENTO.configure = {
                untrackedExtensions: ['pdf', 'doc'],
                // File extensions that count as external links.
                knownDomainParts: ['diginf.privilege', 'diginf.churchill', 'diginf.directline'],
                // List of the known parts of domains before the TLD.
                knownTLDs: ['com'],
                // List of TLDs used on the sites.
                // Will be cross joined with the knownDomainParts list to match internal urls.
                debug: true
                    // Debug mode. Send extra tags showing what the form tracking is doing.
            };


            /* Compressed javascript code follows */
            eval(function(p, a, c, k, e, r) {
                e = function(c) {
                    return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
                };
                if (!''.replace(/^/, String)) {
                    while (c--) r[e(c)] = k[c] || e(c);
                    k = [function(e) {
                        return r[e]
                    }];
                    e = function() {
                        return '\\w+'
                    };
                    c = 1
                };
                while (c--)
                    if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
                return p
            }('5 1v;1j{19.21=5G;19.21("2g")}1i(e){19.21=6q}1j{19.2A=5F;19.2A("2g")}1i(5o){19.2A=50}19.1s={3t:13(a){14(1o(a)==="1J")?a.1F.1k().1H(/5y/i)!==1d||a.1c!==1v:1h},3y:13(a){14(1o(a)==="3v")?1f:(1o(a)==="1J")?a.1F.1k().1H(/3v/i)!==1d:1h},4D:13(a){14(1o(a)==="4A")?1f:(1o(a)==="1J")?a.1F.1k().1H(/4A/i)!==1d:1h},4y:13(a){14(1o(a)==="13")?a.1F.1k().1H(/2p/)!==1d:1h},4s:13(a){14(1o(a)==="1J")?a.1F.1k().1H(/6B/i)!==1d:1h},4k:13(a){14 a===1d},4f:13(a){14(1o(a)==="6h")?1f:(1o(a)==="1J")?a.1F.1k().1H(/31/)!==1d:1h},44:13(a){14(a===1d||a===1v)},38:13(a){14(1o(a)==="37")?1f:(1o(a)==="1J")?a.1F.1k().1H(/37/i)!==1d:1h},3S:13(a){14 a===1v},43:13(a){14(1o(a)==="1J")?a.1F.1k().1H(/1J/i)!==1d:1h},3N:13(a){14(1o(a)==="13")?a.1F.1k().1H(/5A/i)!==1d:1h},5x:13(e){11(e){5 s=[],3r=13(b,a){s[s.1c]=19.21(b)+"="+19.21(a)};11(19.1s.3t(e)){1l(5 i=e.1c-1;i>=0;i--){5 c=e[i];3r(c.1n,c.1D)}}1e{11(19.1s.38(e)){s[s.1c]=e}1e{1l(5 d 2M e){11(e.76(d)){3r(d,e[d])}}}}14 s.4I("&").4G(/%20/g,"+")}1e{14""}}};19.1E={3m:19.1s.4k,6P:19.1s.3S,6M:19.1s.44,2p:19.1s.4y,4v:19.1s.38,4r:19.1s.3t,6E:19.1s.3y,1K:19.1s.4D,6z:19.1s.4s,31:19.1s.4f,6w:19.1s.43,6u:19.1s.3N};19.6p={6n:13(a){1l(5 i 2M 19.1E){11(19.1E[i](a)){14 i.1R()}}}};19.1I=13(d){5 b=[];5 c=0;1a.1b=13(a){b[b.1c]=a;c+=a.1c;14 1a};1a.1k=13(){14 b.4I("")};1a.1c=13(){14 c};11(d){1a.1b(d)}};19.39=13(S){5 T="N";5 U=1d;5 V="t"+(1m 1K()).2c()+"h"+1t.34.1c;5 W="";5 D=0;5 E=[];5 F=17.3d;5 G=17.1Z;5 I="1W:5c";5 J=1d;5 K=1;5 L=1h;5 M=1d;5 N=[];5 15=19.1S;5 2V=1h;5 2U=1h;5 2T=1h;5 2Q=1h;5 2P=1h;5 Y=4T;5 Z=0;5 1L=1d;5 2d="4N+/";5 1C=19.21;5 2L=19.2A;5 4K=13(){};5 4J=13(a){11(a==1d){14""}5 b=71;1l(5 i=0;i<a.1c;i++){b+=(b<<1)+(b<<4)+(b<<7)+(b<<8)+(b<<24);b^=a.2r(i)}14 31(b&6W).1k(16)};5 3o=13(a){5 b=a.1O;5 c=a.2b("6R");11(!c||c=="6O"){14 13(){1g.1O=b}}1e{11(c.1c>0&&c.1q(0,1)=="2e"){14 1d}1e{5 d=6J.6G[c];11(d){14 13(){d.1g.1O=b}}1e{14 1d}}}};5 4q=13(b,c){14 13(){5 a=1d;11(c&&c.1n){a=17.2n("1V");a.1N("1n",c.1n);a.1N("1D",c.1D);b.2F(a)}b.2x();11(a){1t.4l(13(){b.6y(a)},6v)}}};5 4j=13(d){11(!d){14""}5 a=1m 19.1I();1l(5 i=0;i<d.1c;i+=3){5 b=d.1c-i;5 c=0;c=(d.2r(i)<<16)&6t;c|=(b>1)?(d.2r(i+1)<<8)&6o:0;c|=(b>2)?d.2r(i+2)&6m:0;a.1b(2d.2i((c&6g)>>18));a.1b(2d.2i((c&6c)>>12));a.1b((b>1)?2d.2i((c&68)>>6):"2e");a.1b((b>2)?2d.2i((c&63)):"2e")}14 a.1k()};5 30=13(a,b){5 c=1m 19.1I();1l(5 i=0;i<a.1c;i++){5 d;66(a.2i(i)){1x"r":d=F;1y;1x"p":d=G;1y;1x"d":d=28.5Z+"x"+28.5W+"x"+28.3X+"."+2m.3U();11(2m.3Z){d+="."+2m.3Z.1c}1y;1x"c":11(!19.1E.2p(15.2z)){d=U}1e{d=15.2z()}1y;1x"u":d=1t.34.1c+"."+(5N.5L()*5I)+"."+(1m 1K()).2c()+"."+4J(17.1g.1O+17.3d);1y;1x"t":11(1o b.2y!="1v"){d=b.2y}1e{d=V}1y;1x"f":d=b.1G;1y;1x"q":d=b.22;1y;1x"g":d=3L(b);1y;1x"w":d=T;1y;1x"y":d=b.1w;1y;1x"o":d=(K++).1k();1y}c.1b(4j(d)+"*")}14 c.1k()};5 2X=13(b){5 c=17.2k.2b(I);11(!c){5 a=I.1u(":");11(a>-1){c=17.2k.2b(I.1q(a+1))}11(!c&&b){c=17.2k.2b("2W")}}14 c};5 3L=13(b){5 c=1m 19.1I();c.1b("5s=").1b(1t.28.3X);c.1b("&5r=").1b(1t.28.5q).1b("x").1b(1t.28.5p);c.1b("&5n="+3D(1m 1K()));11(2m.3U()){c.1b("&4t=1")}1e{c.1b("&4t=0")}11(1d!==J){c.1b("&5i=").1b(J)}c.1b(3C());11(17.2k){5 a=2X(1h);11(a){c.1b("&5g="+a)}}11(b.29){c.1b("&5d="+b.29)}11(b.3p){c.1b("&5a="+b.3p)}14 c.1k()};5 3C=13(){5 a="";11(2V){a+="&1Y:56"}11(2U){a+="&1Y:55"}11(2T){a+="&1Y:x-53"}11(2Q){a+="&1Y:52"}11(2P){a+="&1Y:51"}14 a};5 3D=13(a){5 b=1m 19.1I();b.1b(a.4Z());b.1b("-");b.1b(u(a.4Y()+1));b.1b("-");b.1b(u(a.4X()));b.1b("T");b.1b(u(a.4W()));b.1b(":");b.1b(u(a.4V()));b.1b(":");b.1b(u(a.4U()));14 b.1k()};5 u=13(n){11(n<1){14"2f"}14(n>9?"":"0")+n};5 v=13(a){5 b;11(/37/.2g(1o(a))){b=a}1e{b=a.2b(15.2S);11(!b){5 c=15.2S.1u(":");11(c>-1){b=a.2b(15.2S.1q(c+1))}}}14 b};5 p=13(a){q(r,a)};5 s=13(a){q(t,a)};5 y=13(a){q(z,a)};5 A=13(a){q(B,a)};5 w=13(a,b,c){11(!c){5 d=b.26.1R();11(d=="a"){c=3o(b)}1e{11((d=="1V"||d=="3a")&&(b.1r=="2x"||b.1r=="2O")){c=13(){b.4S();b.2N=1h};11(b.2N){14 1f}1e{b.2N=1f}}1e{3x 1m 3w("4R 4Q 4P 4O 4M 4L 3u");}}}q(t,a,c,15.2C);14(c==1d)};5 q=13(a,b,c,d){b.3p=V;b.1G="1M://"+17.1g.1z+"/1W/3u";a("75","74",b,c,d)};5 x=13(){5 a=P(15.2s,17.1Z,"&");11(a!==1d){J=Q(15.1X);R(15.1X,a,15.4H);11(15.4F){5 b=P(15.4E,17.1Z,"&");11(b!==1d){F=2L(b)}b=P(15.4C,17.1Z,"&");11(b!==1d){G=2L(b)}}}1e{a=Q(15.1X);11(a===1d){a=30("u");T="Y";R(15.1X,a,15.4H);11(15.4F){a=Q(15.1X);11(a!==1d){5 d=15.6Z;5 c;11(d.1q(0,4)!="1M"){d=17.1g.1B+"//"+d;c=1f}1e{c=(d.1q(0,d.1u(":")+1)==17.1g.1B)}11(c){11(d.1u("?")==-1){d+="?"}1e{d+="&"}d+=15.4C+"="+1C(17.1Z)+"&"+15.4E+"="+1C(17.3d);11(1o 1t.4B!="1v"){1t.4B=1h}17.1g=d;14{3q:1f}}}}}}a=Q(15.1X);14 a};5 Q=13(a){14 P(a,17.1T,";")};5 P=13(g,a,b){5 c=g+"=";5 d=1d;5 e=a.1u(c);11((e!=-1)&&(g.1c>0)){5 f=a.1u(b,e);11(f==-1){f=a.1c}d=a.1q(e+c.1c,f)}14 d};5 H=13(a,b,c,d){5 e=(U===1d)?b:a;5 g="f="+e+"&d="+30(e,c);5 f="&c="+X(g);5 h=15.1U+15.6V+"?"+g+f;d(h)};5 X=13(c){5 a=1;5 b=0;1l(5 i=0;i<c.1c;i++){a+=c.2r(i);b+=a}a%=4z;b%=4z;5 d=(b*6T)+a;14 d.1k(16)};5 6S=13(d,a,b){5 c=17.2n("1V");c.1N("1n",a);c.1N("1D",b);d.2F(c);14 c};5 z=13(c,e,f){5 d=13(a){5 b=1m 3n();b.2a=a;E[E.1c]=b};H(c,e,f,d)};5 B=13(a,b,c){z(a,b,c);o(15.2C)};5 t=13(j,k,l,g,h){5 i=13(b){5 c=1m 3n();11(g){1L=g;11(h){5 d=13(){11(1L){5 a=1L;1L=1d;a()}};d.1k=13(){14"5 4x = 4w; 4w = 1d; 4x();"};5 e=1t.4l(d,h)}}5 f=13(){11(c.2q&&--Z===0&&1L){11(e){1t.6N(e)}5 a=1L;1L=1d;a()}};1j{11(c.2J){c.2J("6L",f,1h)}1e{c.6K("2I",f)}}1i(6I){}++Z;c.2a=b;E[E.1c]=c};H(j,k,l,i)};5 o=13(a){5 b=1m 1K().2c();2H(1m 1K().2c()-b<a){}};5 r=13(c,d,e){11(D<25){5 f=13(a){11(D>0){11(Q(15.23+(D-1))===1d){D=0}}5 b=15.23+D++;R(b,a,6F)};H(c,d,e,f)}};5 O=13(){11(1a.1n&&((1a.1r=="4p"||1a.1r=="2R")?(1a.3l!=1a.6D):(1a.1D!=1a.6C))){5 b=1a.1P.4n;1l(5 i=0;i<b.1c;i++){11(1a.1n==b[i]){14}}5 a="6A:"+1a.1n;5 c={1G:"1M://"+17.1g.1z+"/1W/4m",22:1C(a)+"=Y",1w:"4m"};z("2j","2h",c);b[b.1c]=1a.1n}};5 C=13(k,a,c,d){11(k.1A&&(k.1A.1c>0)){5 f=1h;5 g=1m 19.1I();1l(5 i=0;i<k.1A.1c;i++){5 h=k.1A[i];11(h.1n){5 b=(!d);11(d){1l(5 j=0;!b&&(j<d.1c);j++){11(h.1n==d[j]){b=1f}}}11(h.1r=="6x"){b=1h}1e{11((h.26.1R()=="1V"||h.26.1R()=="3a")&&(h.1r=="2x"||h.1r=="2O")){b=(h==k.2w)}1e{11(b&&(h.1r=="4p")){b=h.3l}}}11(b){5 e=3i(h)+"="+4i(h);11(g.1c()+e.1c>Y){a.22=g.1k();c();g=1m 19.1I();f=1h}11(f){g.1b("&")}g.1b(e);f=1f}}}a.22=g.1k();c()}};5 3A=13(c,d){5 b=[];1l(5 j=0;j<c.1c;j++){5 a=c[j];11(d==a.1n){b.4h(a)}}14 b};5 3i=13(a){5 b=1h;11(a.1r=="2R"){11(3A(a.1P.1A,a.1n).1c>1){b=1f}}11(b){14 1C(a.1n.4G(/:/g,"::")+":"+a.1D)}1e{14 1C(a.1n)}};5 4i=13(b){11(b.1r=="2R"){14(b.3l)?"1f":"1h"}1e{11(b.2u&&b.6s){5 c=1f;5 d=1m 19.1I();5 a=3i(b);1l(5 i=0;i<b.2u.1c;i++){11(b.2u[i].6r){11(c){c=1h}1e{d.1b("&").1b(a).1b("=")}d.1b(1C(b.2u[i].1D))}}14 d.1k()}1e{14 1C(b.1D)}}};5 3g=13(a,b,d){11(a.1q(0,1)=="/"){a=17.1g.1B+"//"+17.1g.1z+a}5 c={1G:a,22:b,1w:d};z("2j","2h",c)};5 4e=13(){5 i=0;5 b=15.23+i++;5 c=Q(b);2H(c){11(c.1q(0,c.1u(":")+1)==17.1g.1B){5 a=1m 3n();a.2a=c;E[E.1c]=a}19.3f(b);b=15.23+i++;c=Q(b)}};5 1p=13(e){14 1f};11(15.6l){1a.6k=13(){5 a=[];1l(5 i=0;i<E.1c;i++){a[i]=E[i].2a}14 a}}1a.6j=13(){2U=1f};1a.6i=13(){2V=1f};1a.6f=13(){2T=1f};1a.6e=13(){2Q=1f};1a.6d=13(){2P=1f};19.39.4b.69=13(a){17.2k.1N(I,a)};1a.4a=13(){11(!19.1E.2p(15.3H)){14 1f}5 a=Q(15.2v);11(19.1E.3m(a)){17.1T=2B(15.2v,"49");11("49"==Q(15.2v)){5 b=15.3H();17.1T=2B(15.2v,b);14 b}1e{14 1h}}1e{14(a=="1f")}};5 48=1a.4a;1a.47=13(c,a){5 b=19.3b();14 c+"="+a+((19.1S.2Z)?"; 1G="+19.1S.2Z:"")+((b)?"; 46="+b:"")};5 2B=1a.47;1a.45=13(a,b,c){11(48()){5 d=1m 1K();d.65(d.2c()+c);5 e=2B(a,b);17.1T=e+"; 32="+d.64();11(Q(a)!=b){17.1T=e;11(Q(a)!=b){17.1T=e+"; 32=42, 1 41 4g 2f:2f:40 3T"}}}};5 R=1a.45;1a.62=13(a){1j{5 b={29:v(a),1w:"2l"};p(b);14 1f}1i(e){14 1p(e)}};1a.61=13(a){1j{5 b={29:v(a),1w:"2l"};y(b)}1i(e){1p(e)}};1a.60=13(a,b){1j{5 c={29:v(a),1w:"2l"};14 w(c,a,b)}1i(e){14 1p(e)}};1a.5Y=13(a){1j{5 b={29:v(a),1w:"2l"};s(b);5 c=a.1O;11(c.1u("://")==-1){11(c.1q(0,1)!="/"){5 d=17.1g.3Y.36("/");5 f=17.1g.3Y.1q(0,d+1);c=f+c}11(c.1q(0,2)!="//"){c="//"+17.1g.1z+c}c=17.1g.1B+c}5 g=3o(a);5 h={1w:"1Y",2y:"t"+(1m 1K()).2c()+"h"+1t.34.1c};G=c;t("5X","5V",h,g,15.2C);14(g==1d)}1i(e){14 1p(e)}};1a.3V=13(a){5 b={1G:"1M://"+17.1g.1z+"/1W/5U",22:a,1w:"35"};z("2j","2h",b)};1a.5T=13(a,b){1j{11(W!==""){W+="&"}W+=1C(a)+"="+1C(b);11(W.1c>=5S){1a.3W()}}1i(e){1p(e)}};1a.3W=13(){1j{11(W!==""){1a.3V(W);W=""}}1i(e){1p(e)}};1a.5R=13(b){1j{5 c=Q(15.1X);11(c!==1d){11(b.26.1R()=="a"){b.1O=b.1O+((b.1O.1u("?")>0)?"&":"?")+15.2s+"="+c}1e{11(b.26.1R()=="1P"){11(b.5Q.5P()=="5O"){1j{5 a=17.2n("<1V 1n=\\""+15.2s+"\\" 1r=\\"3R\\" 1D=\\""+c+"\\" />")}1i(3Q){a=17.2n("1V");a.1N("1n",15.2s);a.1N("1r","3R");a.1N("1D",c)}b.2F(a)}1e{b.3c=b.3c+((b.3c.1u("?")>0)?"&":"?")+15.2s+"="+c}}1e{3x 1m 3w("5M 67");}}}14 1f}1i(e){14 1p(e)}};1a.5K=13(f,c,a){1j{5 d={1G:"1M://"+17.1g.1z+"/1W/1P",1w:"35"};11(!a){a=4q(f,f.2w)}5 b=13(){t("2j","2h",d,a,15.2C)};C(f,d,b,c);14 1h}1i(e){14 1p(e)}};1a.5J=13(b,a,c){1j{5 d={1G:"1M://"+17.1g.1z+(c?c:"/1W/1P"),1w:"35"};C(b,d,13(){r("2j","2h",d)},a);14 1f}1i(e){14 1p(e)}};1a.6a=13(){1j{5 i=0;5 a=15.23+i++;5 b=Q(a);2H(b){19.3f(a);a=15.23+i++;b=Q(a)}D=0;14 1f}1i(e){14 1p(e)}};1a.6b=13(h,c){1j{11(h.1A&&(h.1A.1c>0)){h.4n=[];1l(5 i=0;i<h.1A.1c;i++){5 g=h.1A[i];11(g.1n){5 d=(1o(c)=="1v"||c===1d);11(!d){1l(5 j=0;!d&&(j<c.1c);j++){11(g.1n==c[j]){d=1f}}}11(d){5 f=g.2Y;11(f){(13(){5 a=f;5 b=g;g.2Y=13(e){O();14 a.3P(b,e)}})()}1e{g.2Y=O}}}g=1d}}}1i(e){1p(e)}};1a.5H=13(b,c,d){5 a=1m 19.1I();a.1b("q=").1b(b);11(c!==1v){a.1b("&n=").1b(c)}11(d){1l(5 f 2M d){11(f.1u(".")!=-1){a.1b("&").1b(f).1b("=").1b(d[f])}}}5 e=a.1k();1a.3O(19.1S.5E,e)};1a.5D=13(a,b){1j{3g(a,b,1d)}1i(e){1p(e)}};1a.3O=13(a,b){1j{3g(a,b,"2l")}1i(e){1p(e)}};1a.3M=13(a){1j{11(L){4K()}11(a!==1v){11(a.1u("://")==-1){11(a.1q(0,1)!="/"){a="/"+a}a=17.1g.1B+"//"+17.1g.1z+a}G=a.1u("?")==-1?a+1t.1g.4c:a+"&"+1t.1g.4c.1q(1)}z("5C","5B",{1w:"1Y"});L=1f}1i(e){1p(e)}};1a.4d=13(){11(2E.2D.2o){14}2E.2D.2o=1f;5 g=13(){1a.1P.2w=1a};1l(5 i=0;i<17.3K.1c;i++){5 h=17.3K[i];1l(5 j=0;j<h.1A.1c;j++){5 f=h.1A[j];5 c=f.26.1R();11((c=="1V"||c=="3a")&&(f.1r=="2x"||f.1r=="2O")){5 d=f.3e;11(d){(13(){5 a=d;5 b=f;f.3e=13(e){1a.1P.2w=1a;14 a.3P(b,e)}})()}1e{f.3e=g}}}}};5 33=13(a){5 b=N[a];11(b){5 c;2H((c=b.5z())!=1v){c()}}};5 3J=13(a,b){5 c=N[a];11(!c){c=[];N[a]=c}c.4h(b)};5 3k=13(f,b,g){5 h=1h;5 e=17.5w("5v")[0];5 c=17.3I(b);11(!c){h=1f;c=17.2n("3h");c.2a=f;c.2W=b;c.1r="5u/5t"}11(g){3J(b,g)}11(h){11(g){5 d=13(a){11(c.27=="3j"||c.27=="2q"||a){c.2t=1d;c.2I=1d;33(b)}};c.2t=13(){d(1f)};c.2I=13(){d(1h)}}e.2F(c)}1e{11(c.27=="3j"||c.27=="2q"){33(b)}}};5 3G=13(a){5 b;11(a){b=a}1e{b=2X(1f);11(!b){b=17.1Z}}14 b};5 m=13(a){5 b;11(15.1Q&&15.3F&&a){11(15.1Q.1q(0,4)=="1M"){b=15.1Q+"/"+a}1e{11(15.1Q.1q(0,1)=="/"){b=17.1g.1B+"//"+17.1g.1z;5 d=17.1g.4o;11(d!==1v&&d!==""){b+=":"+d}b+=15.1Q+"/"+a}1e{5 c=15.1Q.1u("/");11(c>-1){b=17.1g.1B+"//"+15.1Q+"/"+a}}}}11(15.6H){b+="?2y="+V}14 b};5 2G=13(b,a){11(b){11(19.1E.2p(b)){2G(b(a),a)}11(19.1E.4r(b)){1l(5 i=b.1c-1;i>=0;i--){2G(b[i],a)}}11(19.1E.4v(b)){5 c=m(b);3k(c,"5m"+V+"2e"+c)}}};5 3E=13(a){5 c=3G(a);11(c&&M){5 b=M[c];11(!b){b=M["1W:5l"]}2G(b,c)}};5 4u=13(c){5 a=m(15.3F);11(a){5 b=13(){3E(c)};3k(a,"5k"+V+"2e"+a,b)}};1a.5j=13(a){19.3s(13(){1j{4u(a);14 1f}1i(e){14 1p(e)}})};1a.6Q=13(a){M=a};1j{11(!15.1U){5 2K=17.1g.4o;11(2K!==1v&&2K!==""){15.1U=17.1g.1B+"//"+17.1g.1z+":"+2K}1e{15.1U=17.1g.1B+"//"+17.1g.1z}}1e{11(15.1U.1q(0,4)!="1M"){15.1U=17.1g.1B+"//"+15.1U}}11(19.1E.3m(15.2z)){U=x()}1e{U=15.2z()}11(U&&1o U.3q!="1v!"&&U.3q){14}4e();19.3s(1a.4d);11(S){1a.3M()}}1i(e){1p(e)}};19.39.4b.5h="12.0.5f";(13(){5 j=[];5 k=13(){1j{11(2E.2D.2o){14}2E.2D.2o=1f;11(l){6U(l)}1l(5 i=0;i<j.1c;i++){1j{j[i]()}1i(3Q){}}}1i(e){}};19.3b=13(){5 b=1d;5 d;5 e;5 f;5 g=17.1g.1z;11(g){5 h;1l(h=0;(h<19.1S.3B.1c)&&(b===1d);h++){5 a=g.36(19.1S.3B[h]);11(a>0){5 c=g.36(".",a-1);11(c>=0){b=g.1q(c)}1e{b="."+g}}}}14 b};19.3f=13(d,b,a){11(!b){b=19.1S.2Z}11(!a){a=19.3b()}5 c=d+"=1d"+((b)?"; 1G="+b:"")+((a)?"; 46="+a:"");17.1T=c+"; 32=42, 1 41 4g 2f:2f:40 3T"};19.3s=13(a){1j{11(k.2o){a()}1e{j[j.1c]=a}}1i(e){}};11(17.2J){17.2J("5e",k,1h)}/*@6X@*//*@11(@6Y)17.5b("<3h 2W=3z 59 2a=//70:58></3h>");5 m=17.3I("3z");m.2I=13(){11(1a.27=="2q"){k()}};@57;@*/11(/72/i.2g(2m.73)){5 l=54(13(){11(/3j|2q/.2g(17.27)){k()}},10)}5 n=1t.2t;1t.2t=13(){11(n){n()}k()}})();', 62, 441, '|||||var||||||||||||||||||||||||||||||||||||||||||||||||||||||||||if||function|return|bk||document||SITEINTEL|this|append|length|null|else|true|location|false|catch|try|toString|for|new|name|typeof|bs|substring|type|UTILS|window|indexOf|undefined|tagType|case|break|hostname|elements|protocol|bd|value|is|constructor|path|match|StringBuilder|object|Date|ba|http|setAttribute|href|form|determineTrackingBase|toLowerCase|config|cookie|taggingServer|input|si|cookieName|page|URL||encode|query|tracerCookieName|||nodeName|readyState|screen|clickedLinkID|src|getAttribute|getTime|bc|_|00|test|fqdtyuo|charAt|fqctyuo|body|trace|navigator|createElement|done|Function|complete|charCodeAt|cookieQPName|onload|options|cookiePreferenceCookieName|siActivatedSubmit|submit|extClickID|cookieValueCallback|decode|bF|tracerTimeout|callee|arguments|appendChild|bH|while|onreadystatechange|addEventListener|bt|be|in|siOutstandingTracer|image|bq|bp|checkbox|linkAttribute|bo|bm|bl|id|bA|onblur|cookiePath|bI|Number|expires|bn|history|extra|lastIndexOf|string|isString|SiteTracker|button|getDomain|action|referrer|onclick|deleteCookie|bw|script|bh|loaded|bC|checked|Null|Image|bx|refClickID|redirecting|_f|runWhenDOMLoaded|isArray|link|boolean|Error|throw|isBoolean|si_ie_onload|bj|domainList|bE|bD|bJ|determineTrackingScript|by|cookiePreferenceCallback|getElementById|bB|forms|bz|trackPage|isRegExp|sendAdditionalTracer|call|exception|hidden|isUndefined|GMT|javaEnabled|trackData|sendTrackParams|colorDepth|pathname|plugins|01|Jan|Thu|isObject|isNT|setCookie|domain|buildCookieText|bG|tempValue|shouldCreateCookie|prototype|search|registerForms|br|isNumber|1970|push|bi|bv|isNull|setTimeout|formfield|siFilledFields|port|radio|bu|Array|isHTML|jv|bK|String|m_syncFinishedAction|exec|isFunction|65521|date|siAutoTracer|centralReqName|isDate|centralRefName|centralCookie|replace|cookieTimeout|join|bg|bf|track|internal|ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789|to|supplied|element|Unknown|click|1200|getSeconds|getMinutes|getHours|getDate|getMonth|getFullYear|unescape|popup|redir|frame|setInterval|menu|fset|end|blank|defer|rcid|write|pageID|rl|DOMContentLoaded|386|req|version|mc|determineTracking|siDetermination_|default|siDetermined_|lt|err|height|width|sr|co|javascript|text|head|getElementsByTagName|processToParamString|array|pop|regexp|pdrtgyuo|pcrtgyuo|trackTracer|searchTracerPath|decodeURIComponent|encodeURIComponent|trackInternalSearch|1000|trackFormData|trackExternalFormData|random|Illegal|Math|GET|toUpperCase|method|migrateCookie|512|addTrackParam|data|pdtgyuo|availHeight|pctgyuo|trackLinkToUntagged|availWidth|trackExternalLink|trackEvent|trackLink||toGMTString|setTime|switch|argument|4032|setPageID|clearDeferredTracers|activeTrackForm|258048|markAsPopup|markAsRedirection|markAsExtraFrame|16515072|number|markAsFrameset|markAsMenu|getQueuedTracers|visibleTracers|255|of|65280|getType|escape|selected|multiple|16711680|RegExp|100|Object|file|removeChild|HTML|siform|html|defaultValue|defaultChecked|Boolean|1800000|frames|determineTrackingScriptsDefeatCaching|ignore|top|attachEvent|load|nt|clearTimeout|_self|Undefined|setDetermineTrackingControl|target|bb|65536|clearInterval|trackerUrl|4294967295|cc_on|_win32|centralURL|about|2166136261|WebKit|userAgent|fdtgyuo|fctgyuo|hasOwnProperty'.split('|'), 0, {}));

            sitracker = new SITEINTEL.SiteTracker(true);

            //---------------------------------------------------------------------------------------------
            // Parameters that control banner tracking
            //---------------------------------------------------------------------------------------------
            var bannerCookieName = 'SIBANNER';
            var bannerTagServer = 'http://rbsi.youmetrix.co.uk';
            var vbisCookieParam = 'sivis';
            var forceTPCCheckParam = 'dotpccheck';
            var forceTPCCheck = 'true';
            var campaignIDParam = 'campid';
            var bannerLandingCamp = 'sitevisit';
            var externalTPCCheckSvr = 'http://www.example.com';
            var vbisSiteSessCookie = 'SISESS';
            //---------------------------------------------------------------------------------------------

            var useTagSvr = bannerTagServer;
            if (bannerTagServer.indexOf(location.hostname.substr(location.hostname.indexOf('.') + 1)) > -1) {
                //we're running a 1st party banner cookie server
                if (!(readCookie(bannerCookieName))) {
                    if (forceTPCCheck == 'true') {
                        //make the request to the additional 3rd party banner checking server
                        useTagSvr = externalTPCCheckSvr;
                    }
                } else {
                    forceTPCCheck = 'false';
                }
            }

            if (!(readCookie(vbisSiteSessCookie))) {
                var vbisCookie = '';
                if (typeof SITEINTEL == "undefined") {
                    vbisCookie = readCookie(siCookieName);
                } else {
                    vbisCookie = readCookie(SITEINTEL.config.cookieName);
                }
                bannertag = new Image();
                bannertag.src = useTagSvr + '/bannertracker.php?' + campaignIDParam + '=' + bannerLandingCamp + '&' + forceTPCCheckParam + '=' + forceTPCCheck + '&' + vbisCookieParam + '=' + vbisCookie;
                document.cookie = 'SISESS=true';
            }

            function readCookie(name) {
                var nameEQ = name + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
                }
                return null;
            }

            sitracker.determineTracking('');
        },
        /*OPTILEAD*/
        OPTILEAD: function() {
            var pro = "https:",
                home = "//analytics.optilead.co.uk/webscrape/dlhome.js",
                motor = "//analytics.optilead.co.uk/webscrape/dlmotor.js",
                rescue = "//analytics.optilead.co.uk/webscrape/dlrescue.js";
            dlganalytics.utility.loadclientscript(pro + home);
        },
        /*DOUBLECLICK*/
        DOUBLECLICK: function() {
            try {
                var axel = Math.random() + "";
                var a = axel * 10000000000000;
                var _frame = document.createElement("iframe");
                _frame.setAttribute("frameborder", "0");
                _frame.setAttribute("style", "height:1px;width:1px;display:none;");
                _frame.setAttribute("src", "//3535200.fls.doubleclick.net/activityi;src=3535200;type=Telem0;cat=Direc00;ord=1;num=" + a + "?");
                document.body.appendChild(_frame);
            } catch (ex) {
                console.log(ex);
            }
        },
        /*SESSIONCAM*/
        SESSIONCAM: function() {
            dlganalytics.utility.loadclientscript("//d2oh4tlt9mrke9.cloudfront.net/Record/js/sessioncam.recorder.js", true);
        },
        /*WEBCHAT*/
        WEBCHAT: function() {
            try {
                window.inqCustData = {
                    'productType': 'BrochureWare'
                };
                var cdiv = function(id, style) {
                    var _d = document.createElement('div');
                    _d.setAttribute("id", id);
                    _d.setAttribute("style", style);
                    return document.body.appendChild(_d);
                };
                var div1 = cdiv("inqC2CImgContainer", "position: fixed; left:0px; top: 50%;");
                var div2 = cdiv("inqC2CTabletImgContainer", "position: fixed; bottom: 0px; left: 0px;");
                dlganalytics.utility.loadclientscript("//directline.inq.com/chatskins/launch/inqChatLaunch10003729.js");
            } catch (ex) {
                console.log(ex);
            }
        }
    };
})();
