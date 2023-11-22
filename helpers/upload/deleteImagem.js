const {initializeApp}  = require('firebase/app');
const { getStorage, ref, deleteObject} = require('firebase/storage');

/* DADOS DE ACESSO AO FIREBASE */
const firebaseConfig = {
    apiKey: "AIzaSyBxDTG36pesUMtqeZQIOdodXd3Ex3wPvSU",
    authDomain: "upload-nodejs-f5df7.firebaseapp.com",
    projectId: "upload-nodejs-f5df7",
    storageBucket: "upload-nodejs-f5df7.appspot.com",
    messagingSenderId: "337647363273",
    appId: "1:337647363273:web:7e19097fc8c9354d999918",
    measurementId: "G-S7D21M6QZ2"
};

/* INICIALIZAÇÃO DO FIREBASE */
const firebaseApp = initializeApp(firebaseConfig);

/* INICIALIZAÇÃO DO STORAGE DO FIREBASE */
const storage = getStorage(firebaseApp);

const deleteImage = (imagem)=>{

    const deleteRef = ref(storage, imagem);

    deleteObject(deleteRef)
    .then(()=>{
        console.log('IMAGEM EXCLUÍDA COM SUCESSO!');
    })
    .catch((error)=>{
        console.log('ERRO AO EXCLUIR IMAGEM!');
    });

}

module.exports = deleteImage;