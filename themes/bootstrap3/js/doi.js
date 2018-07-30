/*global Hunt, VuFind */
VuFind.register('doi', function Doi() {
  function embedDoiLinks(el) {
    var element = $(el);
    var doi = [];
    element.find('.doiLink').each(function extractDoiData(i, doiLinkEl) {
      doi[doi.length] = $(doiLinkEl).data('doi');
    });
    if (doi.length === 0) {
      return;
    }
    var url = VuFind.path + '/AJAX/JSON?' + $.param({
      method: 'doiLookup',
      doi: doi,
    });
    $.ajax({
      dataType: 'json',
      url: url
    })
      .done(function embedDoiLinksDone(response) {
        element.find('.doiLink').each(function populateDoiLinks(i, doiEl) {
          var doi = $(doiEl).data('doi');
          if ("undefined" !== response.data[doi]) {
            var newLink = $('<a />');
            newLink.attr('href', response.data[doi].link);
            newLink.text(response.data[doi].label);
            $(doiEl).empty().append(newLink);
          }
        });
      });
  }

  // Assign actions to the OpenURL links. This can be called with a container e.g. when
  // combined results fetched with AJAX are loaded.
  function init(_container) {
    var container = _container || $('body');
    // assign action to the openUrlWindow link class
    if (typeof Hunt === 'undefined') {
      embedDoiLinks(container)
    } else {
      new Hunt(
        container.find('.doiLink').toArray(),
        { enter: embedDoiLinks }
      );
    }
  }
  return {
    init: init,
    embedDoiLinks: embedDoiLinks
  };
});
