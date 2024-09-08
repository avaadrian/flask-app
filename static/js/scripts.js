$(document).ready(function(){
    // Resetează formularul și rezultatele la începutul unei noi căutări
    $('#nume_unitate').on('input', function() {
        // Resetăm formularul și rezultatele când începe o nouă căutare
        $('#search-form')[0].reset();  // Resetăm formularul
        $('#results-container').empty();  // Ștergem rezultatele anterioare

        var query = $(this).val();
        if (query.length >= 2) {
            $.ajax({
                url: '/autocomplete',
                data: {q: query},
                success: function(data) {
                    $('#autocomplete-list').empty();
                    data.forEach(function(item) {
                        $('#autocomplete-list').append('<div class="autocomplete-item">'+ item +'</div>');
                    });
                }
            });
        } else {
            $('#autocomplete-list').empty();
        }
    });

    // Selectare din lista de autocomplete
    $(document).on('click', '.autocomplete-item', function() {
        var selectedText = $(this).text();
        $('#nume_unitate').val(selectedText);
        $('#autocomplete-list').empty();
    });

    // Selectare rezultat din lista
    $(document).on('click', '.result-row', function() {
        var id = $(this).data('id');

        // Salvăm rezultatele curente și valoarea căutării înainte de redirecționare
        sessionStorage.setItem('searchResults', $('#results-container').html());
        sessionStorage.setItem('searchQuery', $('#nume_unitate').val());

        // Verifică dimensiunea ecranului pentru a decide comportamentul
        if ($(window).width() < 768) {
            // Redirecționează utilizatorul pe o pagină nouă pe mobil
            window.location.href = '/detalii?id=' + id;
        } else {
            // Trimitere cerere pentru detalii unitate pe desktop
            $.ajax({
                type: 'POST',
                url: '/index',
                data: {id: id},
                success: function(response) {
                    var html = $(response).find('.right-panel').html();
                    $('#detalii-container').html(html);
                }
            });
        }
    });

    // Resetare căutare la refresh
    $(window).on('beforeunload', function() {
        sessionStorage.clear();
    });
});
