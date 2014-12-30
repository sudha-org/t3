$(document).ready(function() {
	$(".video-player").fadeTo(0, 0);
	// Video for Car Overview
	$(".play-icon").click(function() {
		if($(window).width() < 860) {
			window.open("//youtube.com", "_blank");
		} else {
			$(this).fadeOut();
			$(".video-left-panel").removeClass("video-arrow");
			$(".text-wrapper").find(".white").fadeTo(200, 0);
			$(".video-left-panel, .video-arrow").animate({width:'0%'}, 1000);
			$(".video-placeholder").animate({
				"width":'100%'
			}, 1000, 
			function() {
				$(".video-placeholder").css('background', 'black');
				$(".video-player").css("z-index", "9998");
				$(".video-player").fadeTo(1000, 1, 
				function() {
					$(".wistia_romulus_control").click();
				});
			});
		}
	});

	// Video for DrivePlus
	$(".play-video").click(function() {
		if($(window).width() < 860) {
			window.open("//youtube.com", "_blank");
		} else {
			$(".driveplus-video-container").animate({"height": "675px"}, 1000);
		}
	});
	// Video for Home Explore
});