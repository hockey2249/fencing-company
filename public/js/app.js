jQuery(document).ready(function($) {



$('.upload-btn').on('click', function (){
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

$('#upload-input').on('change', function(){

  var files = $(this).get(0).files;

  if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name);
    }

    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          console.log('upload successful!\n' + data);
      },
      xhr: function() {
        // create an XMLHttpRequest
        var xhr = new XMLHttpRequest();

        // listen to the 'progress' event
        xhr.upload.addEventListener('progress', function(evt) {

          if (evt.lengthComputable) {
            // calculate the percentage of upload completed
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);

            // update the Bootstrap progress bar with the new percentage
            $('.progress-bar').text(percentComplete + '%');
            $('.progress-bar').width(percentComplete + '%');

            // once the upload reaches 100%, set the progress bar text to done
            if (percentComplete === 100) {
              $('.progress-bar').html('Done');
            }

          }

        }, false);

        return xhr;
      }
    });

  }
});



$(window).scroll(function() {
  if ($(document).scrollTop() > 40) {
    $('nav').addClass('shrink');
  } else {
    $('nav').removeClass('shrink');
  }
});

// $(window).scroll(function() {
//   if ($(document).scrollTop() > 40) {
//     $('nav').addClass('shrink');
//   } else {
//     $('nav').removeClass('margin-class');
//   }
// });

// $('#myCarousel').carousel({
//         interval: 5000
// });

//Handles the carousel thumbnails
$('[id^=carousel-selector-]').click(function () {
var id_selector = $(this).attr("id");
try {
    var id = /-(\d+)$/.exec(id_selector)[1];
    console.log(id_selector, id);
    jQuery('#myCarousel').carousel(parseInt(id));
} catch (e) {
    console.log('Regex failed!', e);
}
});
// When the carousel slides, auto update the text
$('#myCarousel').on('slid.bs.carousel', function (e) {
         var id = $('.item.active').data('slide-number');
        $('#carousel-text').html($('#slide-content-'+id).html());
});
});