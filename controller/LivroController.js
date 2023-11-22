const express = require('express');

// IMPORTAÇÃO DOS PACOTES DO FIREBASE
const { initializeApp } = require('firebase/app');
const { getStorage,
    ref,
    getDownloadURL,
    uploadBytes,
    listAll,
    deleteObject } = require('firebase/storage');


const app = express();
const router = express.Router();

const livro = require('../model/Livro');

const upload = require('../helpers/upload/uploadImagem');

const deleteImage = require('../helpers/upload/deleteImagem')


/************** FIREBASE - CONEXÃO E CONFIGURAÇÃO **************/

// DADOS DE CONEXÃO COM O FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyBxDTG36pesUMtqeZQIOdodXd3Ex3wPvSU",
    authDomain: "upload-nodejs-f5df7.firebaseapp.com",
    projectId: "upload-nodejs-f5df7",
    storageBucket: "upload-nodejs-f5df7.appspot.com",
    messagingSenderId: "337647363273",
    appId: "1:337647363273:web:7e19097fc8c9354d999918",
    measurementId: "G-S7D21M6QZ2"
};

// INICIALIZAR O FIREBASE
const firebaseapp = initializeApp(firebaseConfig);

// CONECTANDO COM O STORAGE
const store = getStorage(firebaseapp);

router.post('/livro/cadastrarLivro', upload.array('files', 2), (req, res) => {

    const { titulo,
            preco,
            detalhes,
            codigo_categoria } = req.body;
        
    const files = req.files;

    let imagem_peq_url;
    let imagem_peq;
    let imagem_grd_url;
    let imagem_grd;
    let cont = 0;

    files.forEach(file=>{
        // console.log("ARQUIVO" + cont);

        //DEFINE O NOME UNICO  DO ARQUIVO
        const fileName = Date.now().toString() + '-' + file.originalname;
        const fileRef = ref(store, fileName);

        uploadBytes(fileRef, file.buffer)
            .then(
                (snapshot)=>{
                    imageRef = ref(store, snapshot.metadata.name)
                    getDownloadURL(imageRef)
                        .then(
                            (urlFinal)=>{
                                if(cont == 0){
                                    //IMAGEM PEQUENA
                                    imagem_peq = fileName ;
                                    imagem_peq_url = urlFinal;
                                    cont++;
                                    console.log('NOME DA IMAGEM PEQ: ' + imagem_peq);
                                    console.log('URL DA IMAGEM PEQ: ' + imagem_peq_url);
                                } else{
                                    //IMAGEM GRANDE
                                    imagem_grd = fileName;
                                    imagem_grd_url = urlFinal;
                                    console.log('NOME DA IMAGEM GRD: ' + imagem_grd);
                                    console.log('URL DA IMAGEM GRD: ' + imagem_grd_url);
                                }
                                if(imagem_peq && imagem_grd){
                                    //GRAVAÇÃO DO LIVRO NO BANCO DE DADOS
                                    livro.create(
                                        {
                                            titulo,
                                            preco,
                                            imagem_peq,
                                            imagem_peq_url,
                                            imagem_grd,
                                            imagem_grd_url,
                                            detalhes,
                                            codigo_categoria
                                
                                        }
                                    ).then(
                                        () => {
                                            return res.status(201).json({
                                                erroStatus: false,
                                                mensagemStatus: 'Livro inserido com sucesso.'
                                            });
                                        }
                                    ).catch((erro) => {
                                        return res.status(400).json({
                                            erroStatus: true,
                                            erroMensagem: erro
                                        });
                                    });
                                }
                            }
                        )
                }
            )
            .catch(
                (error)=>{
                    res.send('ERRO: '+ error);
                }
            );
    });
});

router.get('/livro/listarLivro', (req, res) => {

    livro.findAll()
        .then((livros) => {
            return res.status(200).json(livros)
        }).catch((erro) => {
            return res.status(400).json({
                erroStatus: true,
                erroMensagem: erro
            });
        });
});

router.get('/livro/listarLivroCodigo/:codigo_livro', (req, res) => {

    const { codigo_livro } = req.params

    livro.findByPk(codigo_livro)
        .then((livro) => {
            return res.status(200).json(livro)
        }).catch((erro) => {
            return res.status(400).json({
                erroStatus: true,
                erroMensagem: erro
            });
        });
});

router.delete('/livro/excluirLivro/:codigo_livro', (req, res) => {

    const { codigo_livro } = req.params;

    livro.findByPk(codigo_livro)
        .then(
            (livro)=>{
                // console.log('IMAGEM PEQUENA' + livro.imagem_peq)
                // console.log('IMAGEM GRANDE' + livro.imagem_grd)
                deleteImage(livro.imagem_peq);
                deleteImage(livro.imagem_grd);
                livro.destroy({
                    where: { codigo_livro }
                }).then(
                    () => {
                        return res.status(200).json({
                            erroStatus: false,
                            mensagemStatus: 'Livro excluído com sucesso.'
                        });
            
                    }).catch((erro) => {
                        return res.status(400).json({
                            erroStatus: true,
                            erroMensagem: erro
                        });
                    });
            }
        )
});

router.put('/livro/editarLivro', (req, res) => {

    const { titulo,
        preco,
        imagem_peq,
        imagem_grd,
        detalhes,
        codigo_categoria,
        codigo_livro } = req.body;



    /** UPDATE SEM IMAGEM **/
    livro.update(
        {
            titulo,
            preco,
            imagem_peq,
            imagem_grd,
            detalhes,
            codigo_categoria,
        },
        { where: { codigo_livro } }
    ).then(
        () => {
            return res.status(200).json({
                erroStatus: false,
                mensagemStatus: 'Livro alterado com sucesso.'
            });
        }).catch((erro) => {
            return res.status(400).json({
                erroStatus: true,
                erroMensagem: erro
            });
        });
});

module.exports = router;