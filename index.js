const session = require('express-session');
const router = require('./backend/router/routes');
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const flash = require('express-flash');
const fileUpload = require('express-fileupload');
const compression = require('compression');
const SitemapGenerator = require('sitemap-generator');

require('dotenv').config();

app.disable('x-powered-by');

const generator = SitemapGenerator('http://localhost:8080/', {
    stripQuerystring: false
});
// register event listeners
generator.on('done', () => {
    // sitemaps created
});

// start the crawler
generator.start();

app.use(express.static(path.join(__dirname,('public/'))));
app.use(express.static(path.join(__dirname,('node_modules/mdb-ui-kit/css/'))));
app.use(express.static(path.join(__dirname,('node_modules/mdb-ui-kit/js/'))));

app.set('view engine', 'ejs')
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash())
app.use(fileUpload())

app.use(session({
    secret: process.env.SECRET,
    permission: process.env.PERMISSION,
    saveUninitialized: false,
    resave: false
}));

global.loggedIn = null;

app.use("*",(req,res,next)=>{
    loggedIn = req.session.userId
    next()
})

mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true
})
if(mongoose){
    console.log('Db connected')
} else {
    console.log('No Db connected')
}

const port = process.env.PORT;
app.listen(port || 8000,() => { // changed from app to httpServer
    console.log(`App listening on ${port}`)
});

app.use('/', compression(), router)

app.use(function(req, res, next){
    res.status(404).render('notFound.ejs', {title: "Sorry, page not found"});
});