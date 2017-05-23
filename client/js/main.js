var main = function () {

	function samplesConstructor (value) {
		var samples = [];  //Creating local arrey for samples
		$.ajax({
			url: '/samples',
			async: false,
			dataType: 'json',
			success: function (samplesJSON) {
				samplesJSON.forEach(function (elem) {
					samples.push({'sample': elem.sample, 'id': elem._id});
				});
			}
		});
		return samples
	}

	var arreyOfSamples = samplesConstructor();

	function samplesWriter (action, foundSamples) {
		
		if (action === 'addLastSample') {
			$('.err404').remove();
			arreyOfSamples = samplesConstructor();
			var lastElement = arreyOfSamples[arreyOfSamples.length-1];
			var $sampleParagraph = $('<p>').addClass('samples_paragraph');
			var $newSampleItem = $('<div>').addClass('b-sample__item animated bounceInLeft');
			$('.b-samples').prepend(
				$newSampleItem.attr('id', lastElement.id).append($sampleParagraph.text(lastElement.sample))
				);
		} else if (action === 'addFoundSamples') {
			$('.b-samples').empty();
			foundSamples.forEach( function (element) {
				var $sampleParagraph = $('<p>').addClass('samples_paragraph');
				var $newSampleItem = $('<div>').addClass('b-sample__item animated bounceInLeft');
				$('.b-samples').prepend(
					$newSampleItem.attr('id', element.id).append($sampleParagraph.text(element.sample))
					);
			});
		}	else { // Write all samples on page
			arreyOfSamples.forEach( function (element) {
				var $sampleParagraph = $('<p>').addClass('samples_paragraph');
				var $newSampleItem = $('<div>').addClass('b-sample__item animated bounceInLeft');
				$('.b-samples').prepend(
					$newSampleItem.attr('id', element.id).append($sampleParagraph.text(element.sample))
					);
			});
		}
	}

	function samplesPusher () {
		var $newSample = $('.b-add-sample__input').val();
		if (($newSample != '') & ($newSample != ' ')) {
			arreyOfSamples.push($newSample);
			$('.b-add-sample__input').val('');
			var sample = {"sample": $newSample}
			$.post("/value/", sample, function (response) {});
			samplesWriter('addLastSample');
		} 
	}

	function samplesDeleter (id) {
		$.ajax({
			url: '/sample/'+id+'',
			type: 'DELETE',
			success: function () {
				$('#'+id+'').remove();
			}
		});
	}

	function samplesUpdater (id) {
		var $updatedSample = false;
		var $existedSample = $('#'+id+' .samples_paragraph').text();
		var $textArea = $('<textarea>').addClass('text-area-update');

		$('#'+id+' .samples_paragraph').empty().append($textArea);
		
		$(".text-area-update").val($existedSample);

		$('#'+id+'').append($('<input type="button" class="apply-button action-button '+id+'" value="Apply"/>'));

		function applyChanges () {
			$updatedSample = $(".text-area-update").val();
			$.ajax({
				url: '/update/'+id+'',
				type: 'PUT',
				data: {"sample": $updatedSample},
				success: function () {
					$('.update-button').remove();
					$('.delete-button').remove();
					$('.b-sample__item').removeClass('choosen');
					$('.apply-button').remove();
					$('#'+id+' .samples_paragraph').text($updatedSample);
				}
			});
		}
		
		$('.apply-button').on('click', function () {
			applyChanges();
		});

		$(".text-area-update").on("keypress", function () {
			if (event.keyCode === 13) {
				applyChanges();
			}
		});

		$('.b-sample__item, header, footer').not('#'+id+'').on('click', function () {
			$('.'+id+'').remove();
			if ($updatedSample) {
				$('#'+id+' .samples_paragraph').text($updatedSample);
			} else {
				$('#'+id+' .samples_paragraph').text($existedSample);
			}
		});
	}	

	function error404 () {
		$('.err404').remove();
		$('.b-samples').empty();
		var $contentFor404Error = $('<div>').addClass('err404 animated bounce');
		$contentFor404Error.append($('<p>').text('Error 404 has occurred'));
		$contentFor404Error.append($('<p>').text('Notice, so far search works only with exact matches'));
		$('main').append($contentFor404Error);
	}

	function samplesFinder (sTag) {
		var foundSamples = [];
		$.ajax({
			url: '/search/'+sTag+'',
			async: false,
			dataType: 'json',
			success: function (findResult) {
				if (findResult === null) {
					error404();
				} else {
					if (findResult) {
						$('.err404').remove();
					}
					var local = [findResult];
					local.forEach(function (elem) {
						foundSamples.push({'sample': elem.sample, 'id': elem._id});
					});
				}
			}
		});
		return foundSamples
	}

	function samplesClicker () {
		$('header, footer').on('click', function () {
			$('.delete-button').remove();
			$('.update-button').remove();
			$('.b-sample__item').removeClass('choosen');
		});

		$('.b-samples').on('click', '.b-sample__item', function () {
			var idOfSample = $(this.id).selector;		console.log(idOfSample);
			$('.b-sample__item').removeClass('choosen');
			$(this).addClass('choosen');
			$('.delete-button').remove();
			$('.update-button').remove();
			$(this).append($('<input type="button" class="delete-button action-button" value="delete"/>'));
			$(this).append($('<input type="button" class="update-button action-button" value="update"/>'));
			$('.delete-button').on('click', function () {
				samplesDeleter(idOfSample);
			});
			$('.update-button').on('click', function () {
				samplesUpdater(idOfSample);
			});
		});
	}

	samplesWriter();
	samplesClicker();

	// ADD SAMPLE
	$('#id-add').on('click', function () {
		samplesPusher();
	});

	$(".b-add-sample__input").on("keypress", function () {
		if (event.keyCode === 13) {
			samplesPusher();
		}
	});

	// SEARCH SAMPLE
	$('#id-search').on('click', function () {
		var searchTag = $(".b-search__input").val();
		$(".b-search__input").val('');
		if ((searchTag != '') & (searchTag != ' ')) {
			var foundSamples = samplesFinder(searchTag);
			samplesWriter('addFoundSamples', foundSamples);
		}
	});

	$(".b-search__input").on("keypress", function () {
		if (event.keyCode === 13) {
			var searchTag = $(".b-search__input").val();
			if ((searchTag != '') & (searchTag != ' ')) {
				$(".b-search__input").val('');
				var foundSamples = samplesFinder(searchTag);
				samplesWriter('addFoundSamples', foundSamples);
			}
		}
	});
}

$(document).ready(function () {
	main();	
});