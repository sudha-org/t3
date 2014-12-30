$('.life-date-content-container').hide();

$('.life-date-button').on('click', function(){
	$('.content').stop();
	if(!$(this).hasClass('open')) {
		$(this).closest('.content').animate({'padding-bottom': '85px'}, 200);
	}
	$(this).addClass('open');

});

$('.life-date-choice').on('click', function(){
	var id = $(this).attr('id');
	var optionId = '#' + id.replace('dt-', '').replace('dev-', '').replace('-option', '');
	$('.life-date-content-container').hide();
	$(optionId).show();
	$('.life-date-menu').hide();
	if($('.close-reveal-modal').is(':visible')) {
		$('.close-reveal-modal').click();
	}
	$(this).closest('.content').animate({'padding-bottom': '0'}, 200);
});