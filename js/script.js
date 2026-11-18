// ChaleChalo - shared page scripts

document.addEventListener('DOMContentLoaded', function () {

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
});
