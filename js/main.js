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
});

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

// Initialize WOW animations
if (typeof WOW !== 'undefined') {
    new WOW().init();
}

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    let hasAnimated = false;

    const animateNumber = (element, target) => {
        const duration = 2000;
        const start = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(target * easeOutQuart);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target;
            }
        };

        requestAnimationFrame(animate);
    };

    const checkCounters = () => {
        if (hasAnimated) return;

        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) {
            const rect = heroStats.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-count'));
                    animateNumber(counter, target);
                });
                hasAnimated = true;
            }
        }
    };

    window.addEventListener('scroll', checkCounters);
    checkCounters(); // Check on load
}

// Initialize counter animation
document.addEventListener('DOMContentLoaded', animateCounters);