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


app.get('/', (request, response) => {
    response.status(200).send('Home Page');
});

app.use('*', notFoundHandler);


client.connect().then(() => {
    app.listen(PORT, () => console.log('up and running in port', PORT));
});


// handler functions
function notFoundHandler(request, response) {
    response.status(404).send('Not Found');
}

function errorHandler(error, request, response) {
    response.status(500).send(error);
}












