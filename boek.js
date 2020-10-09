const boeken = document.getElementById('boeken');
const xhr    = new XMLHttpRequest();

xhr.onreadystatechange = () => {
    if(xhr.readyState == 4 && xhr.status == 200) {
        let resultaat = JSON.parse(xhr.responseText);
        boekenObject.data = resultaat;
        boekenObject.uitvoeren();
    }
}

xhr.open('GET', 'boeken.json', true);
xhr.send();

const boekenObject = {
    uitvoeren() {
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
