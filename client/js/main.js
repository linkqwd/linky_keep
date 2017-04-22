var main = function () {

	function samplesConstructor (value) {
		var samples = [];
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
	//console.log(arreyOfSamples)

	function samplesWriter (action, foundSamples) {
		if (action === 'addLastSample') {
			$('.err404').remove();
			arreyOfSamples = samplesConstructor();
			var lastElement = arreyOfSamples[arreyOfSamples.length-1];
			var $newSampleItem = $('<div>').addClass('b-sample__item animated bounceInLeft');
			$('.b-samples').prepend($newSampleItem.attr('id', lastElement.id).text(lastElement.sample));
		} else if (action === 'addFoundSamples') {
			$('.b-samples').empty();
			foundSamples.forEach( function (element) {
				var $newSampleItem = $('<div>').addClass('b-sample__item animated bounceInLeft');
				$('.b-samples').prepend($newSampleItem.attr('id', element.id).text(element.sample));
			});
		}	else {
			arreyOfSamples.forEach( function (element) {
				var $newSampleItem = $('<div>').addClass('b-sample__item animated bounceInLeft');
				$('.b-samples').prepend($newSampleItem.attr('id', element.id).text(element.sample));
			});
		}
	}

	function samplesPusher () {
		var $newSample = $('.b-add-sample__input').val();
		if (($newSample != '') & ($newSample != ' ')) {
			arreyOfSamples.push($newSample);
			$('.b-add-sample__input').val('');
			var sample = {"sample": $newSample}
			$.post("/value", sample, function (response) {
				// этот обратный вызов выполняется при ответе сервера
				//console.log('Ответ сервера:'); console.log(sample);
			});
			samplesWriter('addLastSample');
		} 
	}

	function samplesDeleter (id) {
		$.ajax({
			url: '/sample/'+id+'',
			type: 'DELETE',
			success: function (result) {
				$('#'+id+'').remove();
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
		$('.b-samples').on('click', '.b-sample__item', function () {
			var idOfSample = $(this.id).selector;
			console.log(idOfSample);
			$('.b-sample__item').removeClass('choosen');
			$(this).addClass('choosen');
			$('.delete-button').remove();
			$(this).append($('<input type="button" class="delete-button" value="x"/>'));
			$('.delete-button').on('click', function () {
				samplesDeleter(idOfSample);
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
			//console.log(foundSamples);
			samplesWriter('addFoundSamples', foundSamples);
		}
	});

	$(".b-search__input").on("keypress", function () {
		if (event.keyCode === 13) {
			var searchTag = $(".b-search__input").val();
			if ((searchTag != '') & (searchTag != ' ')) {
				$(".b-search__input").val('');
				var foundSamples = samplesFinder(searchTag);
				//console.log(foundSamples);
				samplesWriter('addFoundSamples', foundSamples);
			}
		}
	});
}


$(document).ready(function () {
	main();	
});