const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/repDB', { useNewUrlParser: true })
  .then(() => {
    console.log("Conexão com o Banco estabelecida")
  })
  .catch((err) => {
    console.log("Conexão com o Banco teve o seguinte erro: " + err)
  })

  require('./residentsModel')