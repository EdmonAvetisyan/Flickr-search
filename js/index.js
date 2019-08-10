$(function() {

	$('#searchImageForm').on('submit', getImages);

	let tag;

	function getImages(e) {
		e.preventDefault(); 
		tag = $(e.target.searchinput)
			.val()
			.trim()
			.toLowerCase();

		if ( !tag.length ) {
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

		if ( !window.navigator.onLine ) {
			invalidFeedback.text('No internet connection . . .').show();
			resultContain.html('');
			return;
		}

		resultContain.html(spinner);

		if ( whatToRender && whatToRender.items.length === 0 ) {
			invalidFeedback.text('Image not found . . . ').show();
			resultContain.html('');
			return;
		}

		if ( whatToRender && whatToRender != 'error' ) {
			invalidFeedback.hide();
			resultContain.html('');

			const imagesCount = 5;

			$.each( whatToRender.items, (i, item) => {
				if ( i === imagesCount ) { return false; }

				$('<img>')
					.attr({
						'class': 'img-thumbnail',
						'src': item.media.m,
						'alt': item.title,
						'data-categorie': _makeImageCategorie(item.tags)[i]
					})
					.appendTo('#result-contain');
			} );
			
			createBaskets(tag);
			dragAndDrop();
			$('#selected-contain').html('');
			
		} else if ( whatToRender == 'error' ) {
			invalidFeedback.text('Error ...  Please try again').show();
			resultContain.html('');
		}
	}

	function jqxhr(tag) {
		const API_URL = 'https://www.flickr.com/services/feeds/photos_public.gne?jsoncallback=?';

		$.getJSON (
			API_URL, 
			{
				format: 'json',
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

	function _makeImageCategorie (imageTags) {
		const searchWords = tag.split(' ');

		for ( let i=0; i<searchWords.length; i++ ) {

			if ( imageTags.includes(searchWords[i]) ) {
				imageCategories.push( searchWords[i] ); 
			}
			
		}
		return imageCategories;
	}

	function createBaskets (tag) {
		tag = tag.split(' ');

		$.each( tag, (i, item) => {
			$(`<div>${item}</div>`)
				.attr({
					'class': 'basket',
					'data-categorie': item
				})
				.appendTo('#basket-contain');
		} );
	}
	
	function dragAndDrop(){
		$('#result-contain img').addClass('draggable');
		$('#basket-contain .basket').addClass('droppable');
		$('.draggable').draggable({ revert: true });

		$('.droppable').droppable({
			accept: ".draggable",
			classes: {
        "ui-droppable-active": "active-basket",
        "ui-droppable-hover": "hover-basket"
      },
			drop: function (event, ui) {
				const dragCategorie = ui.draggable[0].getAttribute('data-categorie');
				const dropCategorie = event.target.getAttribute('data-categorie');

				if ( dragCategorie === dropCategorie ) {
					$('#result-contain').find(ui.draggable[0]).remove();
					
					selectImage(ui.draggable[0].src);
					showMessage();

				} else {
					$('.draggable').draggable({ revert: true });
					$( this ).removeClass('dropped-basket');
				}
			}
		});
	}

	function selectImage (imgSrc) {
		$('#selected-contain')
			.append(`
				<img 
					src="${imgSrc}" 
					class="img-thumbnail" 
					data-toggle="modal" 
					data-target="#modal"
				>
			`);

		shiwmodal();
	}
	
	function shiwmodal () {		
    $('#selected-contain img').on("click", function(){
      $('#modal img').attr( 'src', $(this).attr('src') );
    });
	}
	
	function showMessage () {
		const isImages = $('#result-contain img').length;

		if( ! isImages){
			$('#result-contain').html(`
				<div class="alert alert-primary" role="alert">
					sorting completed !
				</div>
			`);
		}
	}
	
});