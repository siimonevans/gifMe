var gifLoader = function() {

  var $input              = $( '.landing__search' ),
      $searchForm         = $( '.landing__form' ),
      $introWrapper       = $( '.landing__wrapper' ),
      $noResults          = $( '.landing__no-results' ),
      $gifWrapper         = $( '.gif' ),
      $gifList            = $( '.gif-list' ),
      $gifTag             = $( '.meta__tag' ),
      $gifCount           = $( '.meta__count' ),
      $loadMore           = $( '.load-more' ),
      noResultsDisplay    = 'landing__no-results--display'
      bodyBlock           = 'body--block',
      loadMoreDisplay     = 'load-more--display',
      introWrapperHide    = 'landing__wrapper--reduce',
      proxyUrl            = 'https://query.yahooapis.com/v1/public/yql',
      loadCount           = 2,
      gifCount            = 0;          

  // Update meta values
  function setMeta( gifTag, gifCount ) {
    $gifTag.text( gifTag );
    $gifCount.text( gifCount );
  }

  // Empty image listing
  function emptyList() {
    $gifList.empty();          
  }

  // Find broken links and remove container
  function removeBrokenGif() {
    $( 'img' ).on( 'error', function(){
      $(this).parents( ':eq(1)' ).remove();
    });
  }

  // Populate image listing
  function populateGifs( gifArray ) {
    if ( gifArray.length >= 8 ) {
      gifCount = 8;
    } else {
      gifCount = gifArray.length;
    }

    for ( var i = 0; i < gifCount; i++ ) {
      var gif = gifArray[i];
      $gifList.append( 
        '<div class="gif"><div class="gif__image"><img src="' + gif.url + '"></div><a target="_blank" href="' + gif.url + '" class="gif__url"><svg xmlns="http://www.w3.org/2000/svg" width="511.626" height="511.627" viewBox="0 0 511.626 511.627"><path d="M392.857 292.354h-18.274c-2.67 0-4.86.855-6.563 2.573-1.718 1.708-2.573 3.897-2.573 6.563v91.36c0 12.564-4.47 23.316-13.415 32.263-8.945 8.945-19.7 13.414-32.264 13.414H82.224c-12.562 0-23.317-4.47-32.264-13.414-8.945-8.946-13.417-19.698-13.417-32.262V155.31c0-12.562 4.47-23.313 13.417-32.26 8.947-8.946 19.702-13.417 32.264-13.417h200.994c2.67 0 4.86-.86 6.57-2.57 1.71-1.713 2.566-3.9 2.566-6.567V82.22c0-2.66-.855-4.852-2.566-6.562-1.71-1.713-3.9-2.568-6.57-2.568H82.224c-22.648 0-42.016 8.042-58.102 24.125C8.042 113.297 0 132.665 0 155.313v237.542c0 22.647 8.042 42.018 24.123 58.095 16.086 16.084 35.454 24.13 58.102 24.13h237.543c22.647 0 42.017-8.046 58.1-24.13 16.086-16.077 24.128-35.447 24.128-58.095v-91.358c0-2.67-.856-4.86-2.574-6.57-1.713-1.718-3.903-2.573-6.565-2.573z"/><path d="M506.2 41.97c-3.618-3.616-7.906-5.423-12.85-5.423H347.17c-4.947 0-9.232 1.807-12.846 5.424-3.617 3.616-5.428 7.9-5.428 12.848s1.81 9.233 5.428 12.85l50.247 50.248-186.146 186.15c-1.906 1.904-2.856 4.094-2.856 6.564 0 2.48.953 4.668 2.856 6.57l32.548 32.545c1.903 1.903 4.093 2.852 6.567 2.852s4.664-.948 6.566-2.852l186.148-186.148 50.25 50.248c3.615 3.617 7.9 5.426 12.848 5.426s9.233-1.808 12.85-5.425c3.618-3.616 5.425-7.898 5.425-12.847V54.818c0-4.952-1.814-9.232-5.428-12.847z"/></svg></a></div>' 
      );
    }

    // Remove any broken links
    removeBrokenGif()

  }

  // Search images
  function searchGifs() {
    var rawValue          = $input.val(),
        inputValue        = rawValue.replace(/\s/g, ""),
        gifBase           = 'http://gifbase.com/tag/' + inputValue + '?format=json';

    if ( inputValue.trim().length == 0 ) {
      $noResults.addClass( noResultsDisplay );
      $loadMore.removeClass( loadMoreDisplay );
    } else {
      gifCollect( inputValue, gifBase );
      $noResults.removeClass( noResultsDisplay );
    }

    emptyList();
    
  }

  // Load more images
  function loadMoreGifs() {
    var rawValue          = $input.val(),
        inputValue        = rawValue.replace(/\s/g, ""),
        gifBase           = 'http://gifbase.com/tag/' + inputValue + '?p=' + loadCount + '&format=json';

    gifCollect( inputValue, gifBase )
    loadCount++;
  }

  // Show 'Load more' button if there are 
  // more results available
  function loadMoreButton( pageCount ) {
    if ( pageCount > 1 ) {
      $loadMore.addClass( loadMoreDisplay );
    } else {
      $loadMore.removeClass( loadMoreDisplay );
    }
  }

  // Update DOM elements
  function updateUI( pageCount ) {
    loadMoreButton( pageCount );
    $introWrapper.addClass( introWrapperHide );
    $( 'body' ).addClass( bodyBlock );
  }

  // Grab images
  function gifCollect( inputValue, gifBase ) {

    // Process via proxy to avoid CORS errors
    $.ajax({
      'url': proxyUrl,
      'data': {
        'q': 'SELECT * FROM json WHERE url="' + gifBase + '"',
        'format': 'json',
        'jsonCompat': 'new',
       },

      'dataType': 'jsonp',

      'success': function(response) {

        // Catch queries with no results
        if ( response['query']['results']['error'] ) {
          $noResults.addClass( noResultsDisplay );
        } else {

          // Set response vars
          var response      = response['query']['results']['json'];
              gifArray      = response['gifs'],
              gifTag        = response['tag'],
              gifCount      = response['gif_count'],
              pageCount     = response['page_count'];

          // Hide error/load more
          $noResults.removeClass( noResultsDisplay );
          $loadMore.removeClass( loadMoreDisplay );

          // Update meta
          setMeta( gifTag, gifCount );

          // Populate image list
          populateGifs( gifArray );

          // Update UI
          updateUI( pageCount );

          // Update modal
          modal();
        }            
      },
    });
  }

  function bindEvents() {

    // Initial search
    $searchForm.on( 'submit', function () {
      searchGifs();
      return false;
    });

    // Load more
    $loadMore.on( 'click', function() {
      loadMoreGifs();
    });
  }

  bindEvents();

};

var modal = function() {

  var $gifLink            = $( '.gif__url' ),
      $modalOverlay       = $( '.overlay' ),
      $modal              = $( '.modal' ),
      $modalContent       = $( '.modal__content' );
      $modalClose         = $( '.modal__close' );

  function modalFocus() {
    $( $modalContent ).select();
  }

  function populateModal( link ) {
    $modalContent.text( link );
    $modalContent.val( link );
  }

  function displayModal() {
    $modalOverlay.fadeIn(300);
  }

  function hideModal() {
    $modalOverlay.fadeOut(300);
  }

  function bindEvents() {

    // Populate and display modal
    $gifLink.on( 'click', function(e) {
      var link = $(this).attr('href');
      populateModal( link );
      displayModal();
      e.preventDefault();
    });
    
    // Select modal content
    $modalContent.on( 'focus', function() {
      modalFocus();
    });

    // Close modal
    $modalClose.on( 'click', function() {
      hideModal();
    });
  }

  bindEvents();

};

$(document).ready(function () {
  gifLoader();
  modal();
});
