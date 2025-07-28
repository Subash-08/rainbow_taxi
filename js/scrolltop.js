
//scroll reveal
const sr= ScrollReveal({
  origin: "bottom",
  distance: "40px",
  duration: 1000,
  delay: 400,
  easing: "ease-in-out",
});

sr.reveal(".about");
sr.reveal(".about h1", {  delay: "500" });
sr.reveal(".about p", { delay:"700"});
sr.reveal(".about-info", {delay:"800"});
sr.reveal(".collection h1");
sr.reveal(".collection-container", {delay:"900"});
sr.reveal(".revview h1");
sr.reveal(".review-container", {delay:"800"});
sr.reveal(".callout");
sr.reveal(".contact");


// Spinner
var spinner = function () {
  setTimeout(function () {
      if ($('#spinner').length > 0) {
          $('#spinner').removeClass('show');
      }
  }, 1);
};
spinner(0);

// Back to top button
$(window).scroll(function () {
  if ($(this).scrollTop() > 300) {
      $('.back-to-top').fadeIn('slow');
  } else {
      $('.back-to-top').fadeOut('slow');
  }
  });
  $('.back-to-top').click(function () {
      $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
      return false;
})(jQuery);

 // Nav-Bar Dropdown
document.addEventListener('DOMContentLoaded', function () {
  const dropdowns = document.querySelectorAll('.nav-item.dropdown, .dropdown-submenu');
  dropdowns.forEach(function (dropdown) {
      dropdown.addEventListener('click', function (e) {
          e.stopPropagation();
          const submenu = this.querySelector('.dropdown-menu');
          if (submenu) {
              submenu.classList.toggle('show');
          }
      });
  });
});

// Initiate the wowjs
new WOW().init();



