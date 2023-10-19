const express = require('express')
const multer = require('multer');
const Residents = require('../model/residentsModel')
const router = express.Router()

// Configuração do multer para lidar com o upload da imagem
const storage = multer.memoryStorage(); // Armazena a imagem na memória
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    let resident = await Residents.find()
    let dataURL = [];

    if (resident.photo){
      for(let i = 0; i < resident.length; i++){
        let dataURLToAppend  = `data:image/png;base64,${resident[i].photo.data.toString('base64')}`
        dataURL.push(dataURLToAppend)
      }
      
    }

    res.status(200).render('residentViewGet', {success:true, resident, dataURL})
  } catch (error) {
    res.status(400).json({error: "Erro ao buscar os moradores: " + error, success: false})
  }
})

router.get('/resident-photo/:id', async (req, res) => {
  try {
    const resident = await Residents.findById(req.params.id);

    if (!resident) {
      return res.status(404).json({ error: 'Residente não encontrado', success: false });
    }

    res.set('Content-Type', resident.photo.contentType);
    res.send(resident.photo.data);
  } catch (error) {
    res.status(400).json({ error: "Erro ao buscar a foto do morador: " + error, success: false });
  }
});


router.get('/new', async (req, res) => {
  try {
    res.status(200).render('residentViewPost')
  } catch (error) {
    res.status(400).json({error: "Erro: " + error, success: false})
  }
})

router.get('/change/:id', async (req, res) => {
  try {
    const residentId = req.params.id;
    const resident = await Residents.findById(residentId);

    if (!resident) {
      return res.status(404).json({ error: 'Residente não encontrado', success: false });
    }

    // Renderiza o formulário de edição com os dados do residente
    res.status(200).render('residentViewPut', { resident });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao buscar o morador: ' + error, success: false });
  }
});


router.get('/:id', async (req, res) => {
  try {
    let residentId = req.params.id

    let resident = await Residents.findById(residentId)

    if(!resident){
      res.status(404).json({error: 'Residente não encontrado', success: false})
    }

    res.status(200).json({success:true, resident})
  } catch (error) {
    res.status(400).json({error: "Erro ao buscar o morador: " + error, success: false})
  }
})

router.post('/', upload.single('photo'), async (req, res) => {
  try {
    let {fullName, nickname, course, year, photo} = req.body
    
    if (req.file) {
      await Residents.create({fullName, nickname, course, year, 
        photo: 
          {data: req.file.buffer, // Os dados binários da imagem
          contentType: req.file.mimetype // O tipo de conteúdo da imagem
          }
        })
    } else{
      await Residents.create({
        fullName,
        nickname,
        course,
        year
      });
      console.log('nenhuma foto encontrada')
    }

    res.redirect('/residents')
  } catch (error) {
    res.status(400).json({error: "Erro ao criar o morador: " + error, success: false})
  }
})

router.post('/:id/change', async (req, res) => {
  try {
    let {fullName, nickname, course, year} = req.body

    let resident = await Residents.findByIdAndUpdate(req.params.id, {fullName, nickname, course, year}, {new:true})

    if(!resident){
      return res.status(404).json({ error: 'Residente não encontrado', success: false });
    }

    res.redirect('/residents')
  } catch (error) {
    res.status(400).json({error: "Erro ao editar o morador: " + error, success: false})
  }
})

router.get('/:id/delete', async (req, res) => {
  try {
    const residentId = req.params.id

    let resident = await Residents.findByIdAndRemove(residentId)

    if(!resident){
      return res.status(404).json({ error: 'Residente não encontrado', success: false });
    }

    res.redirect('/residents')
  } catch (error) {
    res.status(400).json({error: "Erro ao deletar o morador: " + error, success: false})
  }
})

router.get('/:id/profile', async(req, res) => {
  try {
    const residentId = req.params.id;

    let resident = await Residents.findById(residentId)

    if(!resident){
      return res.status(404).json({ error: 'Residente não encontrado', success: false });
    }

    res.status(200).render('residentProfile', { resident });

  } catch (error) {
    res.status(400).json({error: "Erro ao encontrar perfil do morador: " + error, success: false})
  }
})

module.exports = router