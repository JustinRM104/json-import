  
const boeken     = document.getElementById('boeken');
const xhr        = new XMLHttpRequest();
const taalkeuze  = document.querySelectorAll('.filter__cb');
const selectSort = document.querySelector('.filter__select');
const aantalInWinkelwagen = document.getElementById('ww__aantal');

xhr.onreadystatechange = () => {
    if(xhr.readyState == 4 && xhr.status == 200) {
        let resultaat = JSON.parse(xhr.responseText);
        boekObject.filteren( resultaat );
        boekObject.uitvoeren();
    }
}

xhr.open('GET', 'boeken.json', true);
xhr.send();

const ww = {
    bestelling: [],

    boekToevoegen(obj) {
        let gevonden = this.bestelling.filter( b => b.ean == obj.ean);

        if (gevonden.length == 0) {
            obj.bestelAantal ++;
            this.bestelling.push(obj);
        } else {
            gevonden[0].bestelAantal ++;  
        }

               

        localStorage.wwBestelling = JSON.stringify(this.bestelling);
        this.uitvoeren();
    },

    dataOphalen() {
        if (localStorage.wwBestelling) {
            this.bestelling = JSON.parse(localStorage.wwBestelling);
        }
        this.uitvoeren()
    },

    uitvoeren() {
        let html = '<table>';
        let totaal = 0;
        let totaalBesteld = 0;
        this.bestelling.forEach( boek => {
            let titel = "";
            if(boek.voortitel) {
                titel += boek.voortitel + " "
            }
            titel += boek.titel; 

            html += '<tr>';
            html += `<td><img src="${boek.cover}" alt="${titel}" class="bestelformulier__cover"><td>`;
            html += `<td>${titel}</td>`
            html += `<td class="bestelformulier__aantal">
            <i class="fas fa-arrow-down bestelformulier__verlaag" data-role="${boek.ean}></i>
            ${boek.bestelAantal }
            <i class="fas fa-arrow-up bestelformulier__verhoog" data-role="${boek.ean}></i></td>`
            html += `<td>${boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'})}</td>`
            html += `<td><i class="fas fa-trash bestelformulier__trash" data-role="${boek.ean}"></i></td>`
            html += '<tr>';
            totaal += boek.prijs * boek.bestelAantal;
            totaalBesteld += boek.bestelAantal;
        });
        html += `
        <tr>
        <td colspan="4">Totaal</td>
        <td>${totaal.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'})}</td>
        </tr>`;
        html += '</table>';
        document.getElementById("uitvoer").innerHTML = html
        aantalInWinkelwagen.innerHTML = totaalBesteld;

        this.trashActiveren();
    },

    trashActiveren() {
        document.querySelectorAll('.bestelformulier__trash').forEach( trash => {
            trash.addEventListener('click', e => {
                let teVerwijderenBoekID = e.target.getAttribute('data-role');
                this.bestelling = this.bestelling.filter( bk => bk.ean != teVerwijderenBoekID);
                localStorage.wwBestelling = JSON.stringify(this.bestelling);
                this.uitvoeren();
            })
        })
    }
}

ww.dataOphalen();
ww.uitvoeren();

const boekObject = {
    taalFilter: ['Engels', 'Duits', 'Nederlands'],
    es: 'titel',
    oplopend: 1,

    filteren( gegevens ) {
        this.data = gegevens.filter( (bk) => {
            let bool = false;
                this.taalFilter.forEach( (taal) => {
                    if(bk.taal == taal) {
                        bool = true;
                    } 
                })
            return bool;
        })
    },

    sorteren() {
        if(this.es == 'titel') {
            this.data.sort( (a,b) => ( a.titel.toUpperCase() > b.titel.toUpperCase() ) ? this.oplopend : -1*this.oplopend);
        } else if (this.es == 'paginas') {
            this.data.sort( (a,b) => ( a.paginas > b.paginas ) ? this.oplopend : -1*this.oplopend);
        } else if (this.es == 'uitgave') {
            this.data.sort( (a,b) => ( a.uitgave > b.uitgave ) ? this.oplopend : -1*this.oplopend);
        } else if (this.es == 'prijs') {
            this.data.sort( (a,b) => ( a.prijs > b.prijs ) ? this.oplopend : -1*this.oplopend);
        } else if (this.es == 'auteur') {
            this.data.sort( (a,b) => ( a.auteurs[0].achternaam > b.auteurs[0].achternaam ) ? this.oplopend : -1*this.oplopend);
        }
    },

    uitvoeren() {
        this.sorteren();
        let htmlUitvoer = "";
        this.data.forEach( boek => {
            boek.bestelAantal = 0;

            let titel = "";
            if(boek.voortitel) {
                titel += boek.voortitel + " "
            }
            titel += boek.titel;
            let auteurs = "";
            boek.auteurs.forEach((auteur, index) => {
                let tv = auteur.tussenvoegsel ? auteur.tussenvoegsel + " " : "";
                let sep = ", ";
                if(index >= boek.auteurs.length - 2) { sep = " en "; }
                if(index >= boek.auteurs.length - 1) { sep = ""; }
                auteurs += auteur.voornaam + " " + tv + auteur.achternaam + sep;
            })

            // HTML variable toevoegen
            htmlUitvoer += `<section class="boek">`;
            htmlUitvoer += `<img class="boek__cover" src="${boek.cover}" alt="${titel}">`;
            htmlUitvoer += `<div class="boek__info">`
            htmlUitvoer += `<h3 class="boek__titel">${titel}</h3>`;
            htmlUitvoer += `<p class="boek__auteurs">${auteurs}</p>`
            htmlUitvoer += `<span class="boek__uitgave">Datum van uitgave: ${this.datumOmzetten(boek.uitgave)}</span>`
            htmlUitvoer += `<span class="boek__ean"> EAN: ${boek.ean}</span>`
            htmlUitvoer += `<span class="boek__taal"> Taal: ${boek.taal}</span>`
            htmlUitvoer += `<span class="boek__pagina">Pagina's: ${boek.paginas}</span>`
            htmlUitvoer += `<div class="boek__prijs"> ${boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'})}
                        <a href="#" class="boek__bestel-knop" data-role="${boek.ean}">Bestellen</a></div>`;
            htmlUitvoer += `</div></section>`;
        });
        boeken.innerHTML = htmlUitvoer;

        document.querySelectorAll('.boek__bestel-knop').forEach(knop => {
            knop.addEventListener('click', e => {
                e.preventDefault();
                let boekID = e.target.getAttribute('data-role');
                let gekliktBoek = this.data.filter( b => b.ean == boekID);
                ww.boekToevoegen(gekliktBoek[0]);

            })
        });
    },

    datumOmzetten(datumString) {
        let datum = new Date(datumString);
        let jaar  = datum.getFullYear();
        let maand = this.getMaandnaam(datum.getMonth());
        return `${maand} ${jaar}`;
    },

    getMaandnaam(m) {
        let maand = "";
        switch(m) {
            case 0 : maand = "januari"; break;
            case 1 : maand = "februari"; break;
            case 2 : maand = "maart"; break;
            case 3 : maand = "april"; break;
            case 4 : maand = "mei"; break;
            case 5 : maand = "juni"; break;
            case 6 : maand = "juli"; break;
            case 7 : maand = "augustus"; break;
            case 8 : maand = "september"; break;
            case 9 : maand = "oktober"; break;
            case 10 : maand = "november"; break;
            case 11 : maand = "december"; break;
            default : maand = m;
        }
        return maand;
    }
}

const changeFilter = () => {
    let checkedFilter = [];
    taalkeuze.forEach( cb => {
        if(cb.checked) checkedFilter.push(cb.value);
    });
    boekObject.taalFilter = checkedFilter;
    boekObject.filteren(JSON.parse(xhr.responseText));
    boekObject.uitvoeren();
}

taalkeuze.forEach( cb => cb.addEventListener('change', changeFilter));

const changeSortOption = () => {
    boekObject.es = selectSort.value;
    boekObject.uitvoeren();
}

selectSort.addEventListener('change', changeSortOption);

document.querySelectorAll('.filter__rb').forEach( rb => rb.addEventListener('change', () => {
    boekObject.oplopend = rb.value;
    boekObject.uitvoeren();
}))