//zmienne globalne

var table = $('#game tr');
var statek = 4;
var ileZaznaczone = 0;
var polaZaznaczone = [];
// do zapamientania pól wszytkich statków i przekazania do gry
var statki = {41:'',
    31:'', 32:'',
    21:'', 22:'', 23:'',
    11:'', 12:'', 13:'', 14:''};


// panel-cell podświetlane w rzedzie i kolumnie po najechaniu na komórkę
$(function(){       //on document ready - czyli po załadowaniu strony zaczyna działąć

    $('#game td').hover(function () {
        var col = $(this).index();
        var row = $(this).closest('tr').index();

        table.eq(row).find('div').toggleClass('border-red');
        for (var i=0; i<=11; i++){
            table.eq(i).find('td').eq(col).find('div').toggleClass('border-red')
        }
    }, function () {
        var col = $(this).index();
        var row = $(this).closest('tr').index();

        table.eq(row).find('div').toggleClass('border-red');
        for (var i=0; i<=11; i++){
            table.eq(i).find('td').eq(col).find('div').toggleClass('border-red')
        }
    })
});


//sprawdzenie, cjakie pola są wokół zaznaczonego (kolory)
function checkAroud(col, row) {
    var white = 0;
    var yellow = 0;
    var green = 0;

    // wartości dla row i col 0-1 --> nikiedy mogą dac green - col -1

    //sprawdz pola N-E-S-W
    var colors = [];

    if (col > 0) {
        colors.push(table.eq(row).find('td').eq(col-1).find('div').css('background-color'));
    }else {white++}

    if (row >0){
        colors.push(table.eq(row - 1).find('td').eq(col).find('div').css('background-color'));
    }else {white++}

    colors.push(table.eq(row).find('td').eq(col+1).find('div').css('background-color'));
    colors.push(table.eq(row+1).find('td').eq(col).find('div').css('background-color'));


    function check(element) {
        if (element === 'rgb(255, 255, 0)'){
            yellow +=1;
        }
        else if ((element === 'rgb(255, 255, 255)') || (element === undefined)){
            white +=1;
        }
    }
    colors.forEach(check);

    //sprawdz skosy - żeby nie było zielonych
     var colorsSkos = [];

     if (row >0){
         colorsSkos.push(table.eq(row-1).find('td').eq(col+1).find('div').css('background-color'));
     }
     if (col >0){
         colorsSkos.push(table.eq(row+1).find('td').eq(col-1).find('div').css('background-color'));
     }
     if ((col >0) && (row>0)){
         colorsSkos.push(table.eq(row-1).find('td').eq(col-1).find('div').css('background-color'));
     }
    colorsSkos.push(table.eq(row+1).find('td').eq(col+1).find('div').css('background-color'));


    function checkSkos(element) {
        if (element === 'rgb(0, 128, 0)'){
            green +=1;
        }
    }
    colorsSkos.forEach(checkSkos);

    return [white, yellow, green]
}

function ustawStatek(maszty){
    statek = maszty;
    if (ileZaznaczone>0){
        ileZaznaczone = 0;
        for (pole of polaZaznaczone){       //pole[0] = col, pole[1] = row
                table.eq(pole[1]).find('td').eq(pole[0]).find('div').toggleClass('cellYellow');
            }
        polaZaznaczone = []
    }
}

//sprawdzenie, który statek jest zaznaczony
$(function () {
    $('.form-check-input').click(function () {
        if ($('#czteroM').is(':checked')){ustawStatek(4)}
        else if ($('#trzyM').is(':checked')){ustawStatek(3)}
        else if ($('#dwuM').is(':checked')){ustawStatek(2)}
        else if ($('#jednoM').is(':checked')){ustawStatek(1)}
    })
});


//po kliknięciu na pole - zaznaczanie
$(function() {
    $('#game td').click(function () {
        var col = $(this).index();
        var row = $(this).closest('tr').index();
        var around = checkAroud(col, row);    //jakie pola wokoło


        // jesli pole jest białe
        if ((table.eq(row).find('td').eq(col).find('div').css('background-color') === 'rgb(255, 255, 255)')
            && (statek > 0)) {
            if ((ileZaznaczone > 0) && (around[0] === 3) && (around[1] === 1) && (around[2] === 0)) {
                $(this).find('div').toggleClass('cellYellow');
                polaZaznaczone[ileZaznaczone] = [col, row];
                ileZaznaczone += 1;
            }
            else if ((ileZaznaczone === 0) && (around[0] === 4) && (around[2] === 0)) {
                $(this).find('div').toggleClass('cellYellow');
                polaZaznaczone[ileZaznaczone] = [col, row];
                ileZaznaczone += 1;
            }
        }else       //jesli pole jest już zlóte
            if (table.eq(row).find('td').eq(col).find('div').css('background-color') === 'rgb(255, 255, 0)'){
                $(this).find('div').toggleClass('cellYellow');
                ileZaznaczone -= 1;
                // znajdz array in array i usuń
                for (var i =0; i<polaZaznaczone.length; i++){
                    if((polaZaznaczone[i][0] === col) && (polaZaznaczone[i][1] === row)){
                        polaZaznaczone.splice(i, 1);
                    }
                }
            }


        //funkcja zamykająca dla danego statku
        function zamknijStatek(radioID) {

            var pierwszyBialy = $('label[for="'+radioID+'"]').filter(function(){
                return $(this).css('background-color') === "rgb(255, 255, 255)"}).first();
            pierwszyBialy.addClass('cellGreen');

            //sprawdz, czy zostały jeszcze białe labele
            var list = $('label[for="'+radioID+'"]');
            var licznikBialych = 0;
            for (var i  =0; i < list.length; i++){
                if (list.eq(i).css('background-color') === 'rgb(255, 255, 255)'){
                    licznikBialych +=1;
                }
            }
            if (licznikBialych === 0){      //jeśli nie ma białych, wylącz radio
                $('#'+radioID+'').prop('disabled', true);
            }else {
                $('#'+radioID+'').prop('checked', false);
            }
            statki[pierwszyBialy.attr('id')] = polaZaznaczone;  // zapisanie pozycji statku
        }


        if (ileZaznaczone === statek){

            //zmienić kolor całego statku na green
            for (pole of polaZaznaczone){       //pole[0] = col, pole[1] = row
                table.eq(pole[1]).find('td').eq(pole[0]).find('div').addClass('cellGreen');
            }

            if (statek === 4){
                zamknijStatek('czteroM');
                }
            else if(statek === 3){
                zamknijStatek('trzyM');
                }
            else if(statek === 2){
                zamknijStatek('dwuM')
            }
            else if (statek === 1){
                zamknijStatek('jednoM')
            }

            //znajdz pierwszy nieodznaczony, niewyłączony radio-input i zaznacz
            var next = $('.radiolist').find('.form-check-input').not(':disabled').first();
            //var next = $('.radiolist').find('.form-check-input').not(':checked').first();
            next.prop('checked', true);

            //znajdz labele pod tym radio-inputem, ustaw nowy statek=x-masztów
            var idRadio = next.attr('id');
            var lab = $('label[for="'+idRadio+'"]').first().attr('id')
            if (lab){
            statek = parseInt(lab[0])   }    //zmień stringa na int
            else {
                statek = -1;
                }

            polaZaznaczone = [];    //wyzerowanie
            ileZaznaczone = 0;
        }

        if (statek === -1){
                alert('Wszystkie statki ułożone')
            }

    })
})


