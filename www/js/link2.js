import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
    import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

    const firebaseConfig = {
        apiKey: "AIzaSyBk3kzqpBKEyrwHdnC_RgHmd4PDUJOqoEU",
        authDomain: "copinfo-5a0f5.firebaseapp.com",
        projectId: "copinfo-5a0f5",
        storageBucket: "copinfo-5a0f5.appspot.com",
        messagingSenderId: "543026869888",
        appId: "1:543026869888:web:f2ef1ce629b2bf49615865",
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    async function carregarChats() {
        const userData = JSON.parse(localStorage.getItem("userData")); // Recupera os dados do usuário logado
        const usuarioEmail = userData.Email; // Obtém o e-mail do usuário logado

        const emailMudado = localStorage.getItem("emailMudado");
        const usuariosCollection = collection(db, emailMudado);
        const usuariosSnapshot = await getDocs(usuariosCollection);
        const usuariosList = usuariosSnapshot.docs.map(doc => doc.data());

        const listaChats = document.getElementById("listaChats");
        listaChats.innerHTML = "";

        usuariosList.forEach(user => {
            // Verifica se o usuário é o mesmo que o logado comparando os e-mails
            if (user.Email === usuarioEmail) {
                return; // Se o e-mail do contato for igual ao do usuário logado, não adiciona à lista
            }

            const button = document.createElement("a");
            button.classList.add("user1");

            // Adiciona evento de click no botão do chat
            button.onclick = () => {
                // Salva as informações do usuário selecionado no localStorage
                localStorage.setItem("usuarioId", user.id);
                localStorage.setItem("usuarioNome", user.Nome);
                localStorage.setItem("usuarioFoto", user.FotoPerfil); // Salva a URL da foto de perfil
                localStorage.setItem("usuarioEmail", user.Email);

                // Redireciona para a página do chat
                window.location.href = "chat.html";
            };

            button.setAttribute("data-id", user.id);
            button.innerHTML = `
                <div class="icone-user">
                    <img src="${user.FotoPerfil}" class="user-img" alt="Foto de perfil">
                </div>
                <h2 class="nome">${user.Nome}</h2>
            `;

            listaChats.appendChild(button);
        });
    }

    // Função para buscar chats
    function buscarChats() {
        const buscaInput = document.getElementById('buscarInput');
        const buscaTexto = buscaInput.value.toLowerCase();

        const listaChats = document.getElementById('listaChats');
        const usuariosList = Array.from(listaChats.getElementsByClassName('user1'));

        usuariosList.forEach(userElement => {
            const nomeUsuario = userElement.querySelector('.nome').textContent.toLowerCase();
            if (nomeUsuario.includes(buscaTexto)) {
                userElement.style.display = 'block';
            } else {
                userElement.style.display = 'none';
            }
        });
    }

    // Adicionar evento de busca
    document.getElementById('buscarInput').addEventListener('input', buscarChats);

    window.onload = carregarChats;