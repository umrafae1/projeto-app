// Importa as funções do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("cadastroAdmGrupoForm");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nome = document.getElementById("Nome").value.trim();
        const dataNasc = document.getElementById("DataNasc").value;
        const nomeEmp = document.getElementById("NomeEmp").value.trim();
        const cadastro = document.getElementById("Cadastro").value.trim();
        const senha = document.getElementById("Senha").value.trim();
        const confirmaSenha = document.getElementById("ConfirmaSenha").value.trim();
        const email = document.getElementById("Email").value.trim();
        const fotoPerfilFile = document.getElementById("FotoPerfil").files[0];
        const logoFile = document.getElementById("Logo").files[0];

        const emailMudado = email.replace(/[.#$[\]/]/g,"")
        localStorage.setItem("emailMudado", emailMudado);

        // Validação
        if (!validateEmail(email)) {
            document.getElementById("mensagem").innerText = "E-mail inválido.";
            return;
        }

        if (senha !== confirmaSenha) {
            document.getElementById("mensagem").innerText = "As senhas não coincidem.";
            return;
        }

        try {
            // Cria o usuário com email e senha
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            const user = userCredential.user;

            // Envia o e-mail de verificação
            await sendEmailVerification(user);

            // Mostra a mensagem de carregamento enquanto aguarda a verificação
            document.getElementById("mensagem").innerText = "E-mail de verificação enviado. Aguarde...";

            // Aguardar a confirmação de verificação
            let emailVerificado = false;
            while (!emailVerificado) {
                await user.reload(); // Atualiza o status do usuário
                emailVerificado = user.emailVerified; // Verifica se o e-mail foi confirmado
                if (!emailVerificado) {
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Aguarda 2 segundos antes de verificar novamente
                }
            }

            // Função para upload de imagem no Storage e retorno da URL
            async function uploadFile(file, path) {
                const storageRefFile = storageRef(storage, path);
                await uploadBytes(storageRefFile, file);
                return await getDownloadURL(storageRefFile);
            }

            // Verifica se as imagens foram enviadas e faz o upload
            const fotoPerfilURL = fotoPerfilFile ? await uploadFile(fotoPerfilFile, `fotos/${user.uid}_perfil.jpg`) : "";
            const logoURL = logoFile ? await uploadFile(logoFile, `logos/${user.uid}_logo.jpg`) : "";

            // Grava os dados no Firestore
            await setDoc(doc(db, emailMudado, user.uid), {
                Nome: nome,
                DataNasc: dataNasc,
                FotoPerfil: fotoPerfilURL,
                NomeEmp: nomeEmp,
                Logo: logoURL,
                Cadastro: cadastro,
                Email: email,
                Admin: true
            });

            document.getElementById("mensagem").innerText = "Cadastro realizado com sucesso!";
            form.reset();
            window.location.href = "index.html";

        } catch (error) {
            console.error("Erro ao cadastrar: ", error);
            document.getElementById("mensagem").innerText = "Erro ao cadastrar: " + error.message;
        }
    });

    // Validação de email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
});