// ChaleChalo - shared page scripts

document.addEventListener('DOMContentLoaded', function () {

    // ---- Scroll reveal animations ----
    var revealEls = document.querySelectorAll(
        '.cc-feature, .cc-place-card, .cc-package-card, .cc-deal-card, .cc-dest-card, .cc-booking-card, .cc-summary-card'
    );

    if (revealEls.length && 'IntersectionObserver' in window) {
        revealEls.forEach(function (el, i) {
            // stagger siblings within the same parent
            var siblings = el.parentElement ? el.parentElement.children : [];
            var idx = Array.prototype.indexOf.call(siblings, el.closest('.col') || el);
            el.classList.add('cc-reveal');
            el.style.setProperty('--cc-delay', (Math.max(idx, 0) % 3) * 0.12 + 's');
        });

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('cc-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealEls.forEach(function (el) { io.observe(el); });
    }

    // ---- Region filter chips (destination page) ----
    var chips = document.querySelectorAll('.cc-chip[data-filter]');
    var cards = document.querySelectorAll('#destinationGrid .cc-place-card');
    var noResults = document.getElementById('noResults');

    if (chips.length && cards.length) {
        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                chips.forEach(function (c) { c.classList.remove('active'); });
                chip.classList.add('active');

                var filter = chip.getAttribute('data-filter');
                var visible = 0;

                cards.forEach(function (card) {
                    var show = filter === 'all' || card.getAttribute('data-region') === filter;
                    card.closest('.col').classList.toggle('d-none', !show);
                    if (show) visible++;
                });

                if (noResults) {
                    noResults.classList.toggle('d-none', visible > 0);
                }
            });
        });
    }

    // ---- Package type filter chips (packages page) ----
    var pkgChips = document.querySelectorAll('.cc-chip[data-pkg-filter]');
    var pkgCards = document.querySelectorAll('#packageGrid .cc-deal-card');
    var noPackages = document.getElementById('noPackages');

    if (pkgChips.length && pkgCards.length) {
        pkgChips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                pkgChips.forEach(function (c) { c.classList.remove('active'); });
                chip.classList.add('active');

                var filter = chip.getAttribute('data-pkg-filter');
                var visible = 0;

                pkgCards.forEach(function (card) {
                    var show = filter === 'all' || card.getAttribute('data-type') === filter;
                    card.closest('.col').classList.toggle('d-none', !show);
                    if (show) visible++;
                });

                if (noPackages) {
                    noPackages.classList.toggle('d-none', visible > 0);
                }
            });
        });
    }

    // ---- Booking page: live summary + submit ----
    var bookingForm = document.getElementById('bookingForm');

    if (bookingForm) {
        var pkgSelect = document.getElementById('bkPackage');
        var destSelect = document.getElementById('bkDestination');
        var dateInput = document.getElementById('bkDate');
        var travelersInput = document.getElementById('bkTravelers');

        var sumPackage = document.getElementById('sumPackage');
        var sumDestination = document.getElementById('sumDestination');
        var sumDate = document.getElementById('sumDate');
        var sumTravelers = document.getElementById('sumTravelers');
        var sumPerPerson = document.getElementById('sumPerPerson');
        var sumTotal = document.getElementById('sumTotal');

        function inr(n) {
            return '₹' + n.toLocaleString('en-IN');
        }

        function updateSummary() {
            var opt = pkgSelect.options[pkgSelect.selectedIndex];
            var price = parseInt(pkgSelect.value, 10) || 0;
            var travelers = parseInt(travelersInput.value, 10) || 1;

            sumPackage.textContent = price ? (opt.getAttribute('data-name') || opt.text) : '—';
            sumDestination.textContent = destSelect.value || '—';
            sumDate.textContent = dateInput.value || '—';
            sumTravelers.textContent = travelers;
            sumPerPerson.textContent = price ? inr(price) : '—';
            sumTotal.textContent = price ? inr(price * travelers) : '₹0';
        }

        [pkgSelect, destSelect, dateInput, travelersInput].forEach(function (el) {
            el.addEventListener('input', updateSummary);
            el.addEventListener('change', updateSummary);
        });
        travelersInput.value = 2;
        updateSummary();

        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!bookingForm.checkValidity()) {
                bookingForm.reportValidity();
                return;
            }

            var ref = 'CC-' + Math.floor(100000 + Math.random() * 900000);
            document.getElementById('bookingRef').textContent = ref;

            bookingForm.classList.add('d-none');
            document.getElementById('bookingSuccess').classList.remove('d-none');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---- Contact page: send message ----
    var contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }
            contactForm.classList.add('d-none');
            document.getElementById('contactSuccess').classList.remove('d-none');
        });

        var againBtn = document.getElementById('contactAgain');
        if (againBtn) {
            againBtn.addEventListener('click', function () {
                contactForm.reset();
                contactForm.classList.remove('d-none');
                document.getElementById('contactSuccess').classList.add('d-none');
            });
        }
    }

    // ---- Login page: sign in ----
    var loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!loginForm.checkValidity()) {
                loginForm.reportValidity();
                return;
            }
            loginForm.classList.add('d-none');
            document.getElementById('loginSuccess').classList.remove('d-none');
        });
    }

    // ---- Signup page: create account ----
    var signupForm = document.getElementById('signupForm');

    if (signupForm) {
        var suPassword = document.getElementById('suPassword');
        var suConfirm = document.getElementById('suConfirm');
        var suMatchError = document.getElementById('suMatchError');

        function checkMatch() {
            var mismatch = suPassword.value !== suConfirm.value;
            suMatchError.classList.toggle('d-none', !mismatch || !suConfirm.value);
            suConfirm.setCustomValidity(mismatch ? 'mismatch' : '');
        }

        suPassword.addEventListener('input', checkMatch);
        suConfirm.addEventListener('input', checkMatch);

        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            checkMatch();
            if (!signupForm.checkValidity()) {
                signupForm.reportValidity();
                return;
            }
            signupForm.classList.add('d-none');
            document.getElementById('signupSuccess').classList.remove('d-none');
        });
    }
});
