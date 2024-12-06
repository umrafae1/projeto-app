// Recupera dados do usuário (admin) armazenados no localStorage
const userData = JSON.parse(localStorage.getItem("userData"));

import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBk3kzqpBKEyrwHdnC_RgHmd4PDUJOqoEU",
  authDomain: "copinfo-5a0f5.firebaseapp.com",
  databaseURL: "https://copinfo-5a0f5-default-rtdb.firebaseio.com",
  projectId: "copinfo-5a0f5",
  storageBucket: "copinfo-5a0f5.appspot.com",
  messagingSenderId: "543026869888",
  appId: "1:543026869888:web:f2ef1ce629b2bf49615865",
  measurementId: "G-9JHXYXYKGT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage(); // Inicializa o Firebase Storage

// Função para upload de imagem no Storage e retorno da URL
async function uploadFile(file, path) {
  const storageRefFile = ref(storage, path);
  await uploadBytes(storageRefFile, file); // Faz o upload do arquivo
  return await getDownloadURL(storageRefFile); // Retorna a URL do arquivo
}

// Evento de envio do formulário
document.getElementById('cadastroFuncionarioForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const dataNasc = document.getElementById('dataNasc').value;
  const cadastro = document.getElementById('cadastro').value;
  const senha = document.getElementById('senha').value;
  const email = document.getElementById('email').value;
  const fotoPerfilFile = document.getElementById("fotoPerfil").files[0];
  const nomeEmp = userData.NomeEmp;
  const logoURL = userData.Logo;

  // Verifica se a senha e a confirmação de senha são iguais
  const confirmarSenha = document.getElementById('confirmarSenha').value;
  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem!");
    return;
  }

  try {
    // Cria um novo usuário
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const userId = userCredential.user.uid;

    // Faz o upload da foto de perfil (se houver)
    const fotoPerfilURL = fotoPerfilFile ? await uploadFile(fotoPerfilFile, `fotos/${userId}_perfil.jpg`) : "";

    const emailMudado = localStorage.getItem("emailMudado");
    
    // Agora, salvamos o documento no Firestore com o UID como o nome do documento
    await setDoc(doc(db, emailMudado, userId), {
      Nome: nome,
      DataNasc: dataNasc,
      FotoPerfil: fotoPerfilURL,
      NomeEmp: nomeEmp,
      Logo: logoURL,
      Cadastro: cadastro,
      Email: email,
      Admin: false
    });

    alert("Funcionário cadastrado com sucesso!");
    document.getElementById('cadastroFuncionarioForm').reset();
  } catch (error) {
    console.error("Erro ao cadastrar: ", error);
    alert("Erro ao cadastrar funcionário: " + error.message);
  }
});