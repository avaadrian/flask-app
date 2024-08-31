$(document).ready(function(){
    // Verificăm dacă există rezultate salvate
    if (sessionStorage.getItem('searchResults')) {
        $('#results-container').html(sessionStorage.getItem('searchResults'));
        $('#nume_unitate').val(sessionStorage.getItem('searchQuery')); // Restaurăm valoarea căutării
    }

    $('#nume_unitate').on('input', function() {
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

    $(document).on('click', '.autocomplete-item', function() {
        var selectedText = $(this).text();
        $('#nume_unitate').val(selectedText);
        $('#autocomplete-list').empty();
    });

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
                url: '/',
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
