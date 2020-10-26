  
const boeken     = document.getElementById('boeken');
const xhr        = new XMLHttpRequest();
const taalkeuze  = document.querySelectorAll('.filter__cb');
const selectSort = document.querySelector('.filter__select');

xhr.onreadystatechange = () => {
    if(xhr.readyState == 4 && xhr.status == 200) {
        let resultaat = JSON.parse(xhr.responseText);
        boekObject.filteren( resultaat );
        boekObject.uitvoeren();
    }
}

xhr.open('GET', 'boeken.json', true);
xhr.send();

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
    datumOmzetten(datumString) {
        let datum = new Date(datumString);
        let jaar  = datum.getFullYear();
        let maand = this.getMaandnaam(datum.getMonth());
        return `${maand} ${jaar}`;
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
            htmlUitvoer += `<h3 class="boek__titel">${titel}</h3>`;
            htmlUitvoer += `<p class="boek__auteurs">${auteurs}</p>`
            htmlUitvoer += `<span class="boek__uitgave">Datum van uitgave: ${this.datumOmzetten(boek.uitgave)}</span>`
            htmlUitvoer += `<span class="boek__ean"> EAN: ${boek.ean}</span>`
            htmlUitvoer += `<span class="boek__taal"> Taal: ${boek.taal}</span>`
            htmlUitvoer += `<span class="boek__pagina">Pagina's: ${boek.paginas}</span>`
            htmlUitvoer += `<div class="boek__prijs"> ${boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'})}</div>`
            htmlUitvoer += `</section>`;
        });
        boeken.innerHTML = htmlUitvoer;
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

document.querySelectorAll('.filteren__rb').forEach( rb => rb.addEventListener('change', () => {
    boekObject.oplopend = rb.value;
    boekObject.uitvoeren();
}))