import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
        import { getFirestore, doc, setDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
        import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";
        import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

        const firebaseConfig = {
            apiKey: "AIzaSyBk3kzqpBKEyrwHdnC_RgHmd4PDUJOqoEU",
            authDomain: "copinfo-5a0f5.firebaseapp.com",
            databaseURL: "https://copinfo-5a0f5-default-rtdb.firebaseio.com",
            projectId: "copinfo-5a0f5",
            storageBucket: "copinfo-5a0f5.appspot.com",
            messagingSenderId: "543026869888",
            appId: "1:543026869888:web:f2ef1ce629b2bf49615865",
        };

        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const storage = getStorage(app);
        const auth = getAuth();

        let uid; // Armazena o UID do usuário

        // Verifica se o usuário está autenticado
        onAuthStateChanged(auth, (user) => {
            if (user) {
                uid = user.uid; // Armazena o UID
                console.log("Usuário autenticado:", uid);
            } else {
                alert("Por favor, efetue o login.");
                window.location.href = "login.html";
            }
        });

        const preVisualizacaoContainer = document.querySelector('.pre-visualizacao');
        const fileInput = document.querySelector('.anexar-arquivo');

        // Previsualização dos arquivos anexados
        fileInput.addEventListener('change', () => {
            preVisualizacaoContainer.innerHTML = '';

            Array.from(fileInput.files).forEach((file, index) => {
                const previewItem = document.createElement('div');
                previewItem.classList.add('pre-visualizacao-item');
                previewItem.textContent = file.name;

                const removeButton = document.createElement('button');
                removeButton.classList.add('remove');
                removeButton.textContent = '×';
                removeButton.onclick = () => {
                    const dt = new DataTransfer();
                    Array.from(fileInput.files).forEach((f, i) => {
                        if (i !== index) dt.items.add(f);
                    });
                    fileInput.files = dt.files;
                    previewItem.remove();
                };

                previewItem.appendChild(removeButton);
                preVisualizacaoContainer.appendChild(previewItem);
            });
        });

        // Função para exibir a notificação de sucesso
        function showNotification() {
            const notification = document.getElementById('notification');
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, 5000); // A notificação desaparece após 5 segundos
        }

        // Função para exibir a notificação de erro
        function showErrorNotification() {
            const notificationError = document.getElementById('notification-error');
            notificationError.classList.add('show');
            setTimeout(() => {
                notificationError.classList.remove('show');
            }, 5000); // A notificação desaparece após 5 segundos
        }

        // Função para fechar as notificações
        function closeNotification(notificationId) {
            const notification = document.getElementById(notificationId);
            notification.classList.remove('show');
        }

        // Lógica para postar aviso
        document.querySelector('.enviar-aviso').addEventListener('click', async () => {
            const avisoTexto = document.querySelector('.texto-aviso').value;
            const arquivos = fileInput.files;

            if (avisoTexto.trim() !== '') {
                const userData = JSON.parse(localStorage.getItem("userData"));
                const adminEmail = userData.Email;
                const validAdminEmail = adminEmail.replace(/\./g, "_");

                try {
                    // Documento do administrador
                    const adminDocRef = doc(db, "admins", validAdminEmail);
                    await setDoc(adminDocRef, { email: adminEmail, chat: "Ativo" });

                    // Documento do aviso
                    const avisosRef = collection(adminDocRef, "tela de aviso");
                    const avisoDoc = await addDoc(avisosRef, {
                        texto: avisoTexto,
                        data: new Date().toISOString(),
                    });

                    // Upload dos arquivos e obtenção dos links
                    let avisoComAnexos = avisoTexto;
                    const anexos = [];

                    for (const file of arquivos) {
                        const sanitizedFileName = file.name.replace(/\s+/g, "_").replace(/[^\w.-]/g, "");
                        const fileRef = ref(storage, `avisos/${avisoDoc.id}/${sanitizedFileName}`);

                        // Fazendo o upload do arquivo
                        await uploadBytes(fileRef, file);

                        // Obtendo a URL de download do arquivo
                        const fileURL = await getDownloadURL(fileRef);
                        anexos.push({
                            nome: sanitizedFileName,
                            url: fileURL,
                        });

                        
                        avisoComAnexos += `\n\nn ${fileURL}`;
                    }

                   
                    await setDoc(doc(avisosRef, avisoDoc.id), {
                        texto: avisoComAnexos,
                        data: new Date().toISOString(),
                        anexos: anexos,
                    }, { merge: true });

                    showNotification();
                    document.querySelector('.texto-aviso').value = '';
                    preVisualizacaoContainer.innerHTML = '';
                } catch (error) {
                    console.error("Erro ao postar aviso:", error);
                    showErrorNotification();
                }
            } else {
                showErrorNotification();
            }
        });