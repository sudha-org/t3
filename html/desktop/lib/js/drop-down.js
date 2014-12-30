//dropdown menu js
$('.dropdown-button').click(function(){
	if($(this).next().is(':visible')) {
		$(this).next().hide();
	} else {
		$(this).next().show();
	}
});

$(document).mouseup(function (e) {
    var ignoreContainer1 = $(".dropdown-menu");
    if (!ignoreContainer1.is(e.target) && ignoreContainer1.has(e.target).length === 0)  {
        ignoreContainer1.hide();
    }
});
