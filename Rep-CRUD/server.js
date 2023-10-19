require('./model/db')
const express = require('express')
const residentController = require('./controller/residentController')
const indexController = require('./controller/indexController')
const path = require('path')
const bodyParser = require('body-parser');

const PORT = 3000
let app = express()

app.set('views', path.join(__dirname, 'view')); // Configuração para usar 'view' como o diretório de visualizações
app.set('view engine', 'ejs'); // Configuração para usar EJS como mecanismo de visualização

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());

app.listen(PORT, () => {
  console.log('O servidor esta rodando na porta: ' + PORT)
})

app.use('/', indexController)
app.use('/residents', residentController)

