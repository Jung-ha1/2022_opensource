const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const app = express()
const port = 8000

mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://rion:jha1410@cluster0.gwqugzl.mongodb.net/?retryWrites=true&w=majority');
const db = mongoose.connection;


db.on('error', function(){
    console.log('Connection Failed!');
});
4
db.once('open', function() {
    console.log('Connected!');
});

const taxiDataSchema = mongoose.Schema({
    index: Number,
    start: { lat: Number, lng: Number, name: String },
    end: { lat: Number, lng: Number, name: String },
    cur: Number,
    max: Number
});

var TaxiData = mongoose.model('Schema', taxiDataSchema);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/get', (req, res) => {
    TaxiData.find(function(error, data){
        console.log('--- Read all ---');
        if(error){
            console.log(error);
        }else{
            console.log(data);
            res.json(data)
        }
    })
})

app.post('/with', (req, res) => {
    TaxiData.findById(req.body, function(error, data) {
        if (error) {
            console.log(error)
            return
        }
        console.log("check")
        console.log(data);
        data.cur = data.cur + 1
        data.save(function(error,modified_student){
            if(error){
                console.log(error);
            }else{
                console.log(modified_student);
            }
        })
    })
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.post('/add', (req, res) => {
    (new TaxiData(req.body)).save(function(error, data){
        if (error) {
            console.log(error);
        }
    });
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})