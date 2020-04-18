'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');

const PORT = process.env.PORT || 8000;

const app = express();
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', errorHandler);

app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(cors());



// app.get('/search', (request, response) => {
//     response.render('/pages/search');
// });


// app.post('/search', (req, res) => {
//     let searchType = req.body.selectType;
//     let searchKeyword = req.body.picName;
//     let apiSelect = req.body.selectApi;
//     imageUrlPix = `https://pixabay.com/api/?key=16102900-d7963a65628f8edaa82e9259f&q=${searchKeyword}`;
//     videoUrlPix = `https://pixabay.com/api/videos/?key=16102900-d7963a65628f8edaa82e9259f&q=${searchKeyword}`;
//     // imageUrlGoogle = `https://pixabay.com/api/?key=16102900-d7963a65628f8edaa82e9259f&q=${searchKeyword}`; //change

//     if (apiSelect === 'Pixabay') {
//         if (searchType === 'image') {

//         } else if (searchType === 'video') {

//         }

//     } else if (apiSelect === 'google') {

//     }

//     let ideaCollection = [];

//     superagent.get(url)
//         .then(pic => {
//             let arrayItems = pic.body.hits;
//             let photos = arrayItems.map(data => {
//                 let photoItem = new Photo(data);
//                 ideaCollection.push(photoItem);
//                 return photoItem;
//             })
//             response.render('pages/search', { keyPhoto: photos });
//         })
//         .catch(error => {
//             res.render('pages/error');
//         });
// });



// function Photo(data) {
//     this.title = data.hits.tags;
//     this.creator_name = data.hits.user;
//     this.categories = data.hits.type;
//     this.source_URL = data.hits.pageURL;
//     this.image_url = data.hits.largeImageURL;
//     this.likes = data.hits.likes;
// }
//////////////////////////////////////////////////////////////////////////////////////
app.get('/', topten);
function topten(req, res) {
    let key = process.env.PIXABAY_API_KEY;
    let pixUrl = `https://pixabay.com/api/?key=${key}&q=design`;
    console.log(key);
    superagent(pixUrl)
        .then(pixRes => {
            console.log(pixRes);

            let pixData = pixRes.body.hits.map((element) => {
                return new Photos(element)
            })
            let sortPixData = pixData.sort((a,b) => {
                return b.likes - a.likes
            })
            let top = sortPixData.slice(0,6);
            res.render('pages/index', { photos: top })

        }).catch((err) => {
            errorHandler(err, req, res);
        });
}
///////////////////constructor/////////////////////////////////////////////////////
function Photos(data) {
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












