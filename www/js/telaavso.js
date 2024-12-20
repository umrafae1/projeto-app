import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, query, orderBy, doc, deleteDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";

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
const db = getFirestore(app);
const storage = getStorage(app);

let currentDocId = null;  // Variável global para armazenar o ID do documento a ser excluído
let validAdminEmail = null; // Variável para armazenar o e-mail do administrador válido

function carregarAvisos() {
    const messageListElement = document.getElementById('messageList');
    const userData = JSON.parse(localStorage.getItem("userData"));
    const adminEmail = localStorage.getItem("emailAdmin");
    validAdminEmail = adminEmail.replace(/\./g, "_"); // Atualiza a variável global

    // Exibir a logo do grupo
    const groupLogo = document.getElementById("groupLogo");
    if (userData && userData.Logo) {
        groupLogo.src = userData.Logo;
    }

    try {
        const adminDocRef = collection(db, "admins", validAdminEmail, "tela de aviso");
        const q = query(adminDocRef, orderBy("data", "desc"));

        onSnapshot(q, (querySnapshot) => {
            messageListElement.innerHTML = "";

            if (querySnapshot.empty) {
                messageListElement.innerHTML = '<p>Não há avisos disponíveis no momento.</p>';
                return;
            }

            querySnapshot.forEach((docSnapshot) => {
                const aviso = docSnapshot.data();
                const messageItem = document.createElement('div');
                messageItem.classList.add('message-item');

                // Substitui as quebras de linha (\n) por <br> para exibir corretamente
                let formattedText = aviso.texto.replace(/\n/g, '<br>');

                // Verificar e substituir links do YouTube por iframes
                formattedText = insertYouTubeVideos(formattedText);

                // Exibir arquivos anexados
                if (aviso.anexos && aviso.anexos.length > 0) {
                    aviso.anexos.forEach(arquivo => {
                        if (arquivo.nome.match(/\.(jpg|jpeg|png|gif)$/i)) {
                            // Para imagens, exibir como miniatura
                            formattedText += `<br><img src="${arquivo.url}" alt="${arquivo.nome}" class="thumbnail" />`;
                        } else {
                            // Para outros tipos de arquivo, criar um link
                            formattedText += `<br><a href="${arquivo.url}" alt="${arquivo.nome}" target="_blank">Abrir arquivo: ${arquivo.nome}</a>`;
                        }
                    });
                }

                messageItem.innerHTML = `
                    <p>${formattedText}</p>
                    <small>Postado em: ${new Date(aviso.data).toLocaleString()}</small>
                `;

                if (userData.Admin === true) {
                    const deleteButton = document.createElement('button');
                    deleteButton.classList.add('delete-button');
                    deleteButton.textContent = 'Excluir';
                    deleteButton.onclick = () => {
                        // Armazenar o ID do documento a ser excluído
                        currentDocId = docSnapshot.id;
                        document.getElementById('confirmModal').style.display = 'flex';
                    };
                    messageItem.appendChild(deleteButton);
                }

                messageListElement.appendChild(messageItem);
            });
        });

    } catch (error) {
        console.error("Erro ao carregar os avisos:", error);
        messageListElement.innerHTML = '<p>Erro ao carregar os avisos. Tente novamente mais tarde.</p>';
    }
}

// Função para detectar e substituir links do YouTube por iframes
function insertYouTubeVideos(text) {
    const youtubePattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube|youtu|youtube-nocookie)\.(?:com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([\w-]{11})/g;

    return text.replace(youtubePattern, function(match, videoId) {
        const iframe = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        return iframe;
    });
}

// Confirmar exclusão
document.getElementById('confirmDeleteBtn').onclick = async () => {
    if (currentDocId) {
        try {
            await deleteDoc(doc(db, "admins", validAdminEmail, "tela de aviso", currentDocId));
            currentDocId = null;
            document.getElementById('confirmModal').style.display = 'none';
        } catch (error) {
            console.error("Erro ao excluir o aviso:", error);
        }
    }
};

// Cancelar a exclusão
document.getElementById('cancelDeleteBtn').onclick = () => {
    currentDocId = null;
    document.getElementById('confirmModal').style.display = 'none';
};

document.addEventListener('DOMContentLoaded', carregarAvisos);
