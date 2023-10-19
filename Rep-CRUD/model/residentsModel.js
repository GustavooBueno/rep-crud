const mongoose = require('mongoose')

let residentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  nickname: {
    type: String
  },
  course: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  photo: {
    data: Buffer, // Armazena os dados binários da imagem
    contentType: String // Armazena o tipo de conteúdo da imagem (por exemplo, 'image/jpeg')
  }
})

module.exports = mongoose.model('Resident', residentSchema)