$(function () {

	$('#searchImageForm').on('submit', getImages);

	function getImages(e) {
		e.preventDefault();
		const tag = $(e.target.searchinput)
			.val()
			.trim()
			.toLowerCase();

		if(!tag.length){
			$('#result-contain').html('');
			$('#searchImageForm .invalid-feedback')
				.text('Please enter image name . . .')
				.show();
			return;	
		}
		
		renderResult();
		jqxhr(tag);
	}

	function renderResult(whatToRender) {

		const spinner = $('.spinner-border');
		const resultContain = $('#result-contain');
		const invalidFeedback = $('#searchImageForm .invalid-feedback');

		invalidFeedback.hide();
		resultContain.html('');
		spinner.hide();

		if (!window.navigator.onLine) {
			invalidFeedback.text('No internet connection . . .').show();
			resultContain.html('');
			return;
		}

		invalidFeedback.hide();
		resultContain.html('');
		spinner.show();

		if (whatToRender && whatToRender.items.length === 0) {
			invalidFeedback.text('Image not found . . . ').show();
			resultContain.html('');
			spinner.hide();
			return;
		}

		if (whatToRender && whatToRender != 'error') {
			invalidFeedback.hide();
			resultContain.html('');
			spinner.hide();

			$.each(whatToRender.items, function (i, item) {
				$("<img />").attr("src", item.media.m).appendTo('#result-contain');
				if (i === 3) {
					return false;
				}
			});
		} else if (whatToRender == 'error') {
			invalidFeedback.text('Error ...  Please try again').show();
			resultContain.html('');
			spinner.hide();
		}
	}

	function jqxhr(tag) {
		const API_URL = "https://www.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";

		$.getJSON (
			API_URL, 
			{
				format: "json",
				tags: tag
			}
		)
			.done(function (data) {
				console.log(data);
				renderResult(data);
			})
			.fail(function (jqxhr, textStatus) {
				renderResult(textStatus);
			});
	}

});