
$(function () {

	$('#searchImageForm').on('submit', getImages);

	let tag;

	function getImages(e) {
		e.preventDefault(); 
		tag = $(e.target.searchinput)
			.val()
			.trim()
			.toLowerCase();

		if(!tag.length){
			$('#result-contain').html('');
			$('#searchImageForm .invalid-feedback')
				.text('Please enter image name . . .')
				.show();
			$('#basket-contain').html('');	
			return;	
		}
		
		renderResult();
		jqxhr(tag);
	}

	function renderResult(whatToRender) {
		const spinner = `
			<div class="spinner-border text-primary" role="status">
				<span class="sr-only">Loading...</span>
			</div>
		`;
		const resultContain = $('#result-contain');
		const invalidFeedback = $('#searchImageForm .invalid-feedback');
		const basketContain = $('#basket-contain');

		invalidFeedback.hide();
		resultContain.html('');
		basketContain.html('');

		if (!window.navigator.onLine) {
			invalidFeedback.text('No internet connection . . .').show();
			resultContain.html('');
			return;
		}

		resultContain.html(spinner);

		if (whatToRender && whatToRender.items.length === 0) {
			invalidFeedback.text('Image not found . . . ').show();
			resultContain.html('');
			return;
		}

		if (whatToRender && whatToRender != 'error') {
			invalidFeedback.hide();
			resultContain.html('');

			const imagesCount = 5;

			$.each(whatToRender.items, (i, item) => {
				if (i === imagesCount) {return false;}

				$(`<img>`)
					.attr({
						'class': 'rounded img-thumbnail img-fluid',
						'src': item.media.m,
						'alt': item.title,
						'data-categorie': _makeImageCategorie(item.tags)[i]
					})
					.appendTo('#result-contain');
			});
			
			createBaskets(tag);

		} else if (whatToRender == 'error') {
			invalidFeedback.text('Error ...  Please try again').show();
			resultContain.html('');
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
			.done( (data) => {
				console.log(data);
				renderResult(data);
			})
			.fail( (jqxhr, textStatus) => {
				renderResult(textStatus);
			});
	}


	let imageCategories = [];

	function _makeImageCategorie(imageTags) {
		const searchWords = tag.split(' ');

		for(let i=0; i<searchWords.length; i++) {

			if( imageTags.includes(searchWords[i]) ) {
				imageCategories.push( searchWords[i] ); 
			}
			
		}
		return imageCategories;
	}

	function createBaskets(tag){
		tag = tag.split(' ');

		$.each(tag, (i, item) => {
			$(`<div class="basket droppable">${item}</div>`)
				.appendTo('#basket-contain');
		});
	}

});