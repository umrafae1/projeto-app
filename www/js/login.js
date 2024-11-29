
      import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
      import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
      import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

      // Configurações do Firebase
      const firebaseConfig = {
        apiKey: "AIzaSyBk3kzqpBKEyrwHdnC_RgHmd4PDUJOqoEU",
        authDomain: "copinfo-5a0f5.firebaseapp.com",
        projectId: "copinfo-5a0f5",
        storageBucket: "copinfo-5a0f5.appspot.com",
        messagingSenderId: "543026869888",
        appId: "1:543026869888:web:f2ef1ce629b2bf49615865",
      };

      // Inicializa o Firebase
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const db = getFirestore(app);

      // Exibe ou esconde o campo de e-mail do administrador, dependendo da seleção
      document.querySelectorAll('input[name="userType"]').forEach(radio => {
        radio.addEventListener('change', () => {
          const adminEmailContainer = document.getElementById('admin-email-container');
          if (document.querySelector('input[name="userType"]:checked').value === 'funcionario') {
            adminEmailContainer.style.display = 'block';
          } else {
            adminEmailContainer.style.display = 'none';
          }
        });
      });

      // Função de login
      window.logar = async function () {
        const email = document.getElementById("login").value.trim();
        const senha = document.getElementById("senha").value.trim();
        const userType = document.querySelector('input[name="userType"]:checked').value;
        const emailAlterado = email.replace(/[.#$[\]/]/g, "");
        localStorage.setItem("emailMudado", emailAlterado);

        console.log("E-mail: ", email);
        console.log("Senha: ", senha);

        try {
          // Tenta autenticar com Firebase Auth
          const userCredential = await signInWithEmailAndPassword(auth, email, senha);
          let userDoc;

          console.log("Usuário autenticado com sucesso:", userCredential);

          if (userType === "admin") {
            localStorage.setItem("emailAdmin", email)
            // Lógica para Admin
            const userId = userCredential.user.uid;
            console.log("Buscando admin com UID:", userId); // Debugging
            userDoc = await getDoc(doc(db, emailAlterado, userId));
            localStorage.setItem('acessouIndex', true)
          } else {
            // Lógica para Funcionário
            const adminEmail = document.getElementById("adminEmail").value;
            const adminEmailAlterado = adminEmail.replace(/[.#$[\]/]/g, "");
            const userId = userCredential.user.uid;
            localStorage.setItem("emailAdmin", adminEmail)
            console.log("Buscando funcionário com UID:", userId); 
            userDoc = await getDoc(doc(db, adminEmailAlterado, userId));
            
            localStorage.setItem("emailMudado", adminEmailAlterado);
            
            if (!userDoc.exists()) {
              alert("Funcionário não encontrado.");
              return;
            }
          }

          if (userDoc && userDoc.exists()) {
            const userData = userDoc.data();
            localStorage.setItem("userData", JSON.stringify(userData));
            alert("Login bem-sucedido");
            localStorage.setItem('acessouIndex', true)
            window.location.href = "index.html";
          } else {
            alert("Dados do usuário não encontrados.");
          }
        } catch (error) {
          console.error("Erro no login:", error);
          alert("Erro no login: " + error.message);
        }
      };