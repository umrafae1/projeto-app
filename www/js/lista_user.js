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

        async function carregarUsuarios() {
            const emailMudado = localStorage.getItem("emailMudado");
            const usersCollection = collection(db, emailMudado);
            const userSnapshot = await getDocs(usersCollection);
            const userList = userSnapshot.docs.map(doc => doc.data());

            const listaUsuarios = document.getElementById("listaUsuarios");
            listaUsuarios.innerHTML = "";

            userList.forEach(user => {
                const button = document.createElement("button");
                button.classList.add("btn_lu");
                button.innerHTML = `<i class="ri-user-line"></i> ${user.Nome}`;
                listaUsuarios.appendChild(button);
            });
            const userData = JSON.parse(localStorage.getItem("userData"));
            if (userData.Admin==true) {
            const bt_Add = document.getElementById("Adicionar")
            bt_Add.style.display = "block";
        }
        }
        
       
        window.onload = carregarUsuarios;