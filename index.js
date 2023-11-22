//IMPORTAÇÃO DO MÓDULO DO EXPRESS
const express = require("express");


//IMPORTACAO DO ARQUIVO DE MODEL DA TABELA DE CATEGORIA


//INSTANCIA DE MODULO DO EXPRESS
const app = express();

//CONFIGURACAO PARA O EXPRESS MANIPULAR JSON  
app.use(express.json());

//CONFIGURACAO PARA O EXPRESS TRABALHAR COM DADOS DE FORMULARIO
app.use(express.urlencoded({extended:true}));

//TESTE DE MODEL PARA A CRIAÇÃO DAS TABELAS
// const categoriaModel = require('./model/Categoria');
// const livroModel = require('./model/Livro');

//IMPORTACAO DA CONTROLLER CATEGORIA
const categoriaController = require("./controller/Categoria");
app.use("/", categoriaController);

//IMPORTAÇÃO DA CONTROLLER LIVRO
const livroController = require("./controller/LivroController");
app.use("/", livroController);

//TESTE DE CONEXAO 
// const connection = require("./database/database");
// console.log(connection);

//CRIAÇÃO DO SERVIDOR WEB DE REQUISIÇOES E RESPOSTAS 
app.listen(3080, ()=>{
    console.log('API LIVRARIA RODANDO EM: http:localhost:3000');
});