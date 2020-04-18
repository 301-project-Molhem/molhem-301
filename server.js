'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');

const PORT = process.env.PORT || 4000;

const app = express();
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', errorHandler);

app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(cors());






//////////////////////////////////////////////////////////////////////////////////////
app.get('/', topten);
function topten(req, res) {
let key=process.env.PIXABAY_API_KEY;
let pixUrl=`https://pixabay.com/api/?key=${key}&q=design`;
console.log(key);
    superagent(pixUrl)
        .then(pixRes => {
           console.log(pixRes);
            let pixData = pixRes.body.hits.map((element) => {
                return new Photo(element)
            })
           
            res.render('pages/index', { photos: pixData })
            
        }).catch((err) => {
            errorHandler(err, req, res);
        });
}
///////////////////constructor/////////////////////////////////////////////////////
function Photo(data) {
    this.title = data.tags;
    this.creator_name = data.user;
    this.categories = data.type;
    this.source_URL = data.pageURL;
    this.likes = data.likes;
    this.img_url = data.largeImageURL;
}

/////////////////////////////////////////////////////////////////////////////////////////

client.connect().then(() => {
    app.listen(PORT, () => console.log('up and running in port', PORT));
});


// handler functions
app.use('*', notFoundHandler);
function notFoundHandler(request, response) {
    response.status(404).send('Not Found');
}

function errorHandler(error, request, response) {
    response.status(500).send(error);
}












