$(document).ready(function () {

    var gifLoader = function() {

      var $input              = $( '#search' ),
          $introWrapper       = $( '.landing__wrapper' ),
          $searchForm         = $( '#search-form' ),
          $gifList            = $( '.gif-list' ),
          $gifTag             = $( '.meta__tag' ),
          $gifCount           = $( '.meta__count' ),
          $loadMore           = $( '.load-more' ),
          bodyBlock           = 'body--block',
          loadMoreDisplay     = 'load-more--display',
          introWrapperHide    = 'landing__wrapper--reduce',
          proxyUrl            = 'https://query.yahooapis.com/v1/public/yql',
          loadCount           = 2;

      // Update meta values
      function setMeta( gifTag, gifCount ) {
        $gifTag.text( gifTag );
        $gifCount.text( gifCount );
      }

      // Empty image listing
      function emptyList() {
        $gifList.empty();          
      }

      // Populate image listing
      function populateGifs( gifArray ) {
        for ( var i = 0; i < 8; i++ ) {
          var gif = gifArray[i];
          $gifList.append( 
            '<div class="gif"><div class="gif__image"><img src="' + gif.url + '"></div><a target="_blank" href="' + gif.url + '" class="gif__url"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 482.8 482.8"><path d="M255.2 209.3c-5.3 5.3-5.3 13.8 0 19.1 21.9 21.9 21.9 57.5 0 79.4l-115 115c-21.9 21.9-57.5 21.9-79.4 0l-17.3-17.3c-21.9-21.9-21.9-57.5 0-79.4l115-115c5.3-5.3 5.3-13.8 0-19.1s-13.8-5.3-19.1 0l-115 115C8.7 322.7 0 343.6 0 365.8c0 22.2 8.6 43.1 24.4 58.8l17.3 17.3c16.2 16.2 37.5 24.3 58.8 24.3s42.6-8.1 58.8-24.3l115-115c32.4-32.4 32.4-85.2 0-117.6-5.2-5.3-13.8-5.3-19.1 0z"/><path d="M458.5 58.2l-17.3-17.3c-32.4-32.4-85.2-32.4-117.6 0l-115 115c-32.4 32.4-32.4 85.2 0 117.6 5.3 5.3 13.8 5.3 19.1 0s5.3-13.8 0-19.1c-21.9-21.9-21.9-57.5 0-79.4l115-115c21.9-21.9 57.5-21.9 79.4 0l17.3 17.3c21.9 21.9 21.9 57.5 0 79.4l-115 115c-5.3 5.3-5.3 13.8 0 19.1 2.6 2.6 6.1 4 9.5 4s6.9-1.3 9.5-4l115-115c15.7-15.7 24.4-36.6 24.4-58.8 0-22.2-8.6-43.1-24.3-58.8z"/></svg></a></div>' 
          );
        }
      }

      // Search images
      function searchGifs() {
        var inputValue        = $input.val(),
            gifBase           = 'http://gifbase.com/tag/' + inputValue + '?format=json';
        
        emptyList();
        gifCollect( inputValue, gifBase );
      }

      // Load more images
      function loadMoreGifs() {
        var inputValue        = $input.val(),
            gifBase           = 'http://gifbase.com/tag/' + inputValue + '?p=' + loadCount + '&format=json';

        gifCollect( inputValue, gifBase )
        loadCount++;
      }

      function loadMoreButton( pageCount ) {
        if ( pageCount > 1 ) {
          $loadMore.addClass( loadMoreDisplay );
        } else {
          $loadMore.removeClass( loadMoreDisplay );
        }
      }

      // Grab images
      function gifCollect( inputValue, gifBase ) {

        // Process via proxyURL to avoid CORS errors
        $.ajax({
          'url': proxyUrl,
          'data': {
            'q': 'SELECT * FROM json WHERE url="' + gifBase + '"',
            'format': 'json',
            'jsonCompat': 'new',
           },

          'dataType': 'jsonp',

          'success': function(response) {

            // Set response vars
            var response      = response['query']['results']['json'];
                gifArray      = response['gifs'],
                gifTag        = response['tag'],
                gifCount      = response['gif_count'],
                pageCount     = response['page_count'];

            // Update meta
            setMeta( gifTag, gifCount );

            // Populate image list
            populateGifs( gifArray );

            // Show/hide load more button
            loadMoreButton( pageCount );

            $introWrapper.addClass( introWrapperHide );
            $( 'body' ).addClass( bodyBlock );
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

    gifLoader();
});
