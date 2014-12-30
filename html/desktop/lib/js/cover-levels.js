(function() {
    var numberbuttons = $(".number-button"),
        activearrow = $(".active-arrow"),
        _similarlinks = [];
    //get all links with same hrefs excluding number buttons and attatch click to them
    for (var i = 0; i < numberbuttons.length; i++) {
        var potentiallink = $('a[href="' + $(numberbuttons[i]).attr("href") + '"]:not(.number-button)');
        if (potentiallink.length > 0) {
            for (var j = 0; j < potentiallink.length; j++) {
                _similarlinks.push(potentiallink[j]);
            }
        }
    }
    if (numberbuttons.length == 4) {
        activearrow.css('left', '13%');
    }

    var isMediumAndUp = function() {
            return matchMedia(Foundation.media_queries['medium']).matches && matchMedia(Foundation.media_queries.large).matches;
        },
        levelNumbersContainerOffset = isMediumAndUp() ? $('.top-bar').height() : $("#menu-wrapper-mobile").height(),
        coverlevelsnumberscontainer = $('#cover-levels-numbers-container'),
        featurelistend = $('.feature-list-end'),
        numbersplaceholder = function(h) {
            var _id = "cover-levels-numbers-placeholder",
                _item = document.getElementById(_id) || document.createElement("div");
            if (_item.id !== _id) {
                _item.setAttribute("id", _id);
            }
            if (typeof(h) !== "undefined") {
                _item.setAttribute("height", h);
            }
            return $(_item);
        };
    coverlevelsnumberscontainer.waypoint(function(direction) {
        try {
            coverlevelsnumberscontainer.stop().attr('style', '');
            //window is passed visible features list end
            if (direction === 'down' && $(window).scrollTop() < featurelistend.filter(':visible').offset().top) {
                var height = $(this).height();
                var placeHolder = numbersplaceholder(height)
                $(this).before(placeHolder);
                coverlevelsnumberscontainer.css({
                    'top': levelNumbersContainerOffset,
                    'z-index': 101
                });
                $(this).addClass('fixed');
                $(this).removeClass('bring-to-top');
                $('.breadcrumb-wrapper').addClass('bring-to-top');
            } else if (direction === 'up') {
                var placeHolder = numbersplaceholder();
                placeHolder.remove();
                $(this).removeClass('fixed');
                $(this).addClass('bring-to-top');
                $('.breadcrumb-wrapper').removeClass('bring-to-top');
            }
        } catch (ex) {
            console.log(ex);
        }

    }, {
        offset: levelNumbersContainerOffset + 'px'
    });

    featurelistend.waypoint(function(direction) {
        try {
            if (direction === 'down' && coverlevelsnumberscontainer.hasClass('fixed')) {
                var height = "-" + (coverlevelsnumberscontainer.height() * 1.3) + "px";
                coverlevelsnumberscontainer.animate({
                    'marginTop': height
                }, 500, function() {
                    var clitem = document.getElementById("cover-levels-numbers-placeholder");
                    if (clitem) {
                        coverlevelsnumberscontainer.detach();
                        $(clitem).replaceWith(coverlevelsnumberscontainer);
                    }
                    coverlevelsnumberscontainer.removeClass('fixed');
                    coverlevelsnumberscontainer.css('marginTop', 0);
                })
            }
        } catch (ex) {
            console.log(ex);
        }

    }, {
        offset: (coverlevelsnumberscontainer.height() * 1.8) + 'px'
    });
    var relaceButtonTexts = function(b) {
        var txt = b.innerHTML;
        if (txt.indexOf("more") > -1) {
            txt = txt.replace("more", "less").replace("»", "«");
        } else if (txt.indexOf("less") > -1) {
            txt = txt.replace("less", "more").replace("«", "»");
        }
        b.innerHTML = txt;
    }


    $(".feature-list.hover a.scroll").click(function(e) {
        e.preventDefault();

        if (!$(this).closest('li').hasClass('crossed')) {
            var $readMore = $(this).closest('article').find('button.show-cover-info').first();
            if ($(this).closest("article").find("section .hidden-info").is(":hidden")) {
                $readMore.click();
            }

            var linkRef = $($(this).attr('href'));
            if (linkRef.length > 0) {
                var linkposition = linkRef.offset().top,
                    linkparent = linkRef.parent();
                $('html, body').animate({
                    scrollTop: linkposition - levelNumbersContainerOffset //will not work on mobile as height isnt always 80
                }, 500, function() {
                    //remove callback if highlited content isnt liked
                    linkparent.addClass("highlight").delay(2000).queue(function() {
                        $(this).removeClass("highlight").dequeue();
                    });
                });
            }
        }
    });
    $('article .show-cover-info').click(function(e) {
        var _this = $(this),
            hiddeninfo = $('section .hidden-info'); //open all so waypoint can still be used to compair content
        /*if (_this.hasClass('open')) {
            _this.removeClass('open');
        } else {
            _this.addClass('open');
        }*/
        //$(_this).closest('section').find('.hidden-info').first();
        //change text on button if content toggled
        hiddeninfo.slideToggle(500, function() {
            var btn = $(this).parents("article").find("button.show-cover-info");
            if (btn.length > 0) {
                relaceButtonTexts(btn[0]);
            }
        });
    });
    $("button.btn-read-more, a.btn-read-more").click(function(e) {
        var _this = this,
            readmoreinfo = $(_this).parent().siblings('.btn-read-more.init-hidden').first();
        readmoreinfo.slideToggle(500, function() {
            relaceButtonTexts(_this);
        });
    });
    /*written by emily*/
    $("a.read-more").click(function(e) {
        var _this = this,
            readmoreinfo = $(_this).parent().siblings('.read-more.init-hidden').first();
        readmoreinfo.slideToggle(500, function() {
            relaceButtonTexts(_this);
        });
    });
    numberbuttons.add(_similarlinks).click(function(e) {
        //e.preventDefault();
        var _button = $(this),
            _isnumberedlink = false,
            //number of buttons divided by 100% position calculated as middle
            //of buttons e.g. 3 buttons array of 3 items at 33% each so 16.5, 50, 83.5 percent
            calcpos = function() {
                //determine if another button on page was clicked
                if (numberbuttons.index(_button) === -1) {
                    _button = numberbuttons.filter('a[href="' + _button.attr("href") + '"]');
                    _isnumberedlink = true;
                }
                var buttonCount = numberbuttons.length;
                var pos = [];
                if (buttonCount == 4) {
                    pos = ['13%', '38%', '62%', '88%'];
                } else if (buttonCount == 3) {
                    pos = ['16.6666%', '50%', '83.3333%']
                } else if (buttonCount == 5) {
                    pos = ['16.6666%', '33.3%', '50%', '66.6666%', '83.3333%']
                } else {
                    pos = ['16.6666%', '50%']
                }
                // var nth = numberbuttons.length,
                //     _width = parseFloat(nth !== 0 ? (100 / nth) : 100),
                //     iterator = parseFloat((_width / 2)),
                //     pos = [];
                // for (var i = 0; i < nth; i++) {
                //     //removed toFixed for accurate math
                //     pos.push(((i * _width) + iterator).toFixed(2) + "%");
                // };

                return pos;
            },
            positions = calcpos(),
            position = numberbuttons.index(_button),
            optionalextras = $(".optional-extras"),
            speed = 400,
            targetclass = _button.attr("href").substr(_button.attr("href").indexOf('#') + 1),
            htmlcontentanchor = $("a#" + targetclass),
            animatecoverlevel = function() {
                var articles = $("article"),
                    livearticles = $("article." + targetclass);
                articles.fadeTo(speed, 0, function() {
                    articles.hide();
                    livearticles.show();
                }).fadeTo(speed, 1, function() {
                    //focus on cover levels container
                    //only if another hash link was clicked
                    if (_isnumberedlink) {
                        $('html, body').animate({
                            scrollTop: coverlevelsnumberscontainer.offset().top - levelNumbersContainerOffset
                        }, speed);
                    }
                });
            };

        //instantly hide #id anchors before animation finishes
        //this stops normal page jump / focus on named anchors
        if (htmlcontentanchor.is("hidden") == false) {
            htmlcontentanchor.hide();
        }
        //make clicked button active
        numberbuttons.removeClass('active');
        _button.addClass('active');

        //animate active arrow
        activearrow.animate({
            left: positions[position]
        }, speed * 2);

        //fade in and fade out all relevant articles
        animatecoverlevel();
    });
    //When page is Loaded from external link
    var loc = (location.href.indexOf('#') > -1 ? location.href.substr(location.href.indexOf('#') + 1) : ""),
        PageRefreshed = function() {
            var visit = document.getElementById("visit");
            if (visit.value == "") {
                visit.value = "1";
                return false;
            } else {
                return true;
            }
        },
        elem = loc.length > 0 ? $("#" + loc) : null;
    //scroll top first if page isn't refreshed
    if (PageRefreshed() === false) {
        $(document).scrollTop(0);
    }

    //get the button that corresponds to hash
    for (var i = 0; i < numberbuttons.length; i++) {
        if (numberbuttons[i].href.substr(location.href.indexOf('#') + 1) === loc) {
            $(numberbuttons[i]).click();
        }
    }

    //finally if hash loc is an element scroll to it
    if (elem !== null && elem.length > 0) {
        $(document).scrollTop(elem.offset().top - levelNumbersContainerOffset);
    }

})();
