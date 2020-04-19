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


app.get('/search/new', (request, response) => {
    response.render('pages/search');
});



// we need to figure out how to get the results of two apis in one response 
// we can combine the array for each api in one array using push and then render the full array and we should remeber to have the same property names


app.post('/search', (request, response) => {

    let fullArr = [];
    let searchType = request.body.selectType;
    let apiSelect = request.body.selectApi;
    let searchKeyword = request.body.picName;
    let unsplashKey = process.env.UNSPLASH_KEY;
    let imageUrlPix = `https://pixabay.com/api/?key=16102900-d7963a65628f8edaa82e9259f&q=${searchKeyword}`;
    let unsplashURL = `https://api.unsplash.com/search/photos?query=${searchKeyword}&client_id=${unsplashKey}`;

    superagent.get(imageUrlPix)
        .then((pixRes) => {
            let pixData = pixRes.body.hits;
            let pixDataArray = pixData.map((data) => {
                return new Photos(data);
            });

            pixDataArray.forEach((item)=> fullArr.push(item))
            console.log('after first push', fullArr);
            return (fullArr);

        }).then((fullArr) => {
           
            return superagent.get(unsplashURL).then((unsplashRes) => {
                let unsplashBody = unsplashRes.body.results;
                let unsplashArray = unsplashBody.map(item => {
                    return new Ideas(item);
                })
                unsplashArray.forEach((item)=> fullArr.push(item))             
                return fullArr;    
            })

        }).then((fullArr) => {
            if (apiSelect === 'pixabay'){
                let pixaBay = fullArr.slice(0,20);
                response.render('pages/results', { keyPhoto: pixaBay });
            } else if (apiSelect === 'unsplash'){
                let unsplash = fullArr.slice(20,30);
                response.render('pages/results', { keyPhoto: unsplash });
            }
        })
        .catch(error => {
            response.render('pages/error');
        });
});


//////////////////////////////////////////////////////////////////////////////////////
app.get('/', topten);
function topten(req, res) {
    let topArray = [];
    let key = process.env.PIXABAY_API_KEY;
    let pixUrl = `https://pixabay.com/api/?key=${key}&q=design`;
    let unsplashKey = process.env.UNSPLASH_KEY;
    let unsplashURL = `https://api.unsplash.com/search/photos?query=design&client_id=${unsplashKey}`
    superagent.get(pixUrl)
        .then(pixRes => {
            let pixData = pixRes.body.hits.map((element) => {
                return new Photos(element)
            })
            let sortPixData = pixData.sort((a, b) => {
                return b.likes - a.likes
            })
            let top = sortPixData.slice(0, 6)
            top.forEach((item) => topArray.push(item))
            return (topArray);
        }).then((topArray) => {
            superagent.get(unsplashURL)
                .then((unsplashRes) => {
                    const unsplashBody = unsplashRes.body.results;
                    const unsplashData = unsplashBody.map(item => {
                        return new Ideas(item);
                    })
                    let sortUnsData = unsplashData.sort((a, b) => {
                        return b.likes - a.likes
                    })
                    let final = sortUnsData.slice(0, 6)
                    final.forEach((item) => topArray.push(item))
                    return topArray;
                }).then((topArray) => {
                    res.render('pages/index', { photos: topArray })
                }).catch(error => {
                    res.render('pages/error');
                });
        })
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

function Ideas(item) {
    this.title = item.tags[1].title
    this.creator_name = item.user.name;
    this.categories = (item.type? item.type : 'photo');
    this.source_URL = (item.user.portfolio_url ? item.user.portfolio_url: item.urls.full);
    this.likes = item.likes;
    this.img_url = item.urls.full;
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












