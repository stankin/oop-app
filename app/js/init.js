(function($){
  $(function(){

    $('.sidenav').sidenav();

  }); // end of document ready
})(jQuery); // end of jQuery name space

particlesJS.load('particles-js', 'p.json', function() {
  console.log('callback - particles.js config loaded');
});