const fs = require('fs');
const http = require('http');
const url = require('url');
const querystring = require('querystring');
let artikli = [
    {
        "id": 1,
        "naziv": "Pica",
        "cena": 340.00,
        "kompanija": "Caribic"
    },
    {
        "id": 2,
        "naziv": "Koka kola",
        "cena": 125.00,
        "kompanija": "Coca-cola"
    },
    {
        "id": 3,
        "naziv": "Labelo",
        "cena": 140.00,
        "kompanija": "Rimmel"
    }
];

http.createServer(function (req, res){    
    let urlObj = url.parse(req.url,true,false);
    if (req.method == "GET"){
        if (urlObj.pathname == "/sviArtikli"){ 
            let query=urlObj.query;
            response = sviArtikli(query.kompanija);

            res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Svi Artikli</title>
                </head>
                <body>
            `);
            for(let a of response){
                res.write(`
                        <p>${a.id}</p>
                        <p>${a.naziv}</p>
                        <p>${a.cena}</p>
                        <p>${a.kompanija}</p>                `);
            }
            res.end(`
                    </body>
                </html>
            `);
        }
        if (urlObj.pathname == "/izmeniArtikalPrikaz"){
            let query=urlObj.query
            let artikal = artikli.find(x => x.id == query.id);
            res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Izmena</title>
                </head>
                <body>
                    <form action='/izmeniArtikal' method='POST'>
                        Id: <input type='number' name='id' value='${artikal.id}'>
                        Naziv: <input type='text' name='adresa' value='${artikal.naziv}'>
                        Cena: <input type='text' name='cena' value='${artikal.cena}'>
                        Kompanija: <input type='text' name='kompanija' value='${artikal.kompanija}'>
                        <button type='submit'>Posalji</button>
                    </form>
                </body>
                </html>
            `);
        }
        if (urlObj.pathname == "/dodajArtikalPrikaz"){
            res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Dodaj Artikal</title>
                </head>
                <body>
                    <form action='/dodajArtikal' method='POST'>
                        Id: <input type='number' name='id'>
                        Naziv: <input type='text' name='naziv'>
                        Cena: <input type='text' name='cena'>
                        Kompanija: <input type='text' name='kompanija'>
                        <button type='submit'>Posalji</button>
                    </form>
                </body>
                </html>
            `);
        }
        if (urlObj.pathname == "/obrisiArtikalPrikaz"){
            res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Obrisi Artikal</title>
                </head>
                <body>
                    <form action='/obrisiArtikal' method='POST'>
                        Id: <input type='number' name='id'>
                        <button type='submit'>Posalji</button>
                    </form>
                </body>
                </html>
            `);
        }
    }
    else if(req.method == "POST") {
        if (urlObj.pathname == "/izmeniArtikal"){
            var body = '';
                req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                izmeniArtikal(querystring.parse(body).id,querystring.parse(body).naziv,querystring.parse(body).cena,querystring.parse(body).kompanija)
                res.writeHead(200)
                res.end('Uspesno izmenjen artikal.');
            });
        }
        if (urlObj.pathname == "/obrisiArtikal"){
            var body = '';
                req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                obrisiArtikal(querystring.parse(body).id)
                res.writeHead(200)
                res.end('Uspesno obrisan artikal.');
            });
        }
        if (urlObj.pathname == "/dodajArtikal"){
            var body = '';
                req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                dodajArtikal(querystring.parse(body).id,querystring.parse(body).naziv,
                           querystring.parse(body).cena,querystring.parse(body).kompanija);
                res.writeHead(200);
                res.end('Uspesno ste dodali artikal.');
            });
        }
    }
}).listen(2000);

function sviArtikli(imeKompanije){
    niz=[]
    for(let a of artikli){
        if(a.kompanija==imeKompanije){
            niz.push(a)
        }
    }
    return niz;
}
function izmeniArtikal(id,naziv,cena,kompanija){
    for(let a of artikli){
        if(a.id==id){
            a.naziv=naziv;
            a.cena=cena;
            a.kompanija=kompanija;
        }
    }
}
function obrisiArtikal(id){
    let noviNiz = []
    for(let a of artikli){
        if(a.id!=id){
            noviNiz.push(a)
        }
    }
    return noviNiz;
}
function dodajArtikal(id,naziv,cena,kompanija){
    let artikal = {
        'id': id,
        'naziv': naziv,
        'cena': cena,
        'kompanija': kompanija
    };
    artikli.push(artikal);
}