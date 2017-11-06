$(document).ready(() => {
  var errorBlock = $('.error');
  errorBlock.on('click', function(){
    errorBlock.fadeOut();
  });
  $(".button-collapse").sideNav();
  $('select').material_select();
  CKEDITOR.replace('body');
});