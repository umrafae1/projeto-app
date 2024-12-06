function toggleCalendar(icon) {
    const calendar = icon.closest('.icons').nextElementSibling;

    // Alterna a visibilidade do calendário
    calendar.classList.toggle('hidden');

    // Alterna o ícone da seta
    if (calendar.classList.contains('hidden')) {
      icon.classList.remove('ri-arrow-up-s-line');
      icon.classList.add('ri-arrow-down-s-line');
    } else {
      icon.classList.remove('ri-arrow-down-s-line');
      icon.classList.add('ri-arrow-up-s-line');
    }
}
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
    import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
    import { getFirestore, collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

    const firebaseConfig = {
      apiKey: "AIzaSyBk3kzqpBKEyrwHdnC_RgHmd4PDUJOqoEU",
      authDomain: "copinfo-5a0f5.firebaseapp.com",
      projectId: "copinfo-5a0f5",
      storageBucket: "copinfo-5a0f5.appspot.com",
      messagingSenderId: "543026869888",
      appId: "1:543026869888:web:f2ef1ce629b2bf49615865",
      measurementId: "G-9JHXYXYKGT"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);

    function showAlert(message) {
      const avisoElement = document.getElementById("avisoEnviado");
      avisoElement.innerText = message;
      avisoElement.style.display = "block";
      setTimeout(() => {
        avisoElement.style.display = "none";
      }, 5000);
    }

    // Recupera a data do localStorage e preenche o campo de data
    const dataSelecionada = JSON.parse(localStorage.getItem('dataSelecionada'));
    if (dataSelecionada) {
      const { dia, mes, ano } = dataSelecionada;
      const dataSalva = new Date(ano, mes - 1, dia);

      // Data atual
      const dataAtual = new Date();

      // Verifica se a data salva é no passado
      if (dataSalva < dataAtual) {
        const dataFormatada = `${dataAtual.getFullYear()}-${String(dataAtual.getMonth() + 1).padStart(2, '0')}-${String(dataAtual.getDate()).padStart(2, '0')}`;
        document.getElementById("data").value = dataFormatada;
      } else {
        const dataFormatada = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        document.getElementById("data").value = dataFormatada;
      }
    }

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        document.getElementById("cadastroEventoForm").addEventListener("submit", async function (e) {
          e.preventDefault();

          const evento = document.getElementById("evento").value;
          const data = document.getElementById("data").value;
          const horarioInicio = document.getElementById("horarioInicio").value;
          const horarioFim = document.getElementById("horarioFim").value;
          const local = document.getElementById("local").value;
          const destinatario = document.querySelector('input[name="fun"]:checked').id;
          const codigoColaborador = document.getElementById("codigoColaborador").value;

          try {
            const emailMudado = localStorage.getItem('emailMudado');
            const sanitizedEmail = sanitizeEmail(emailMudado);

            const [ano, mes, dia] = data.split("-");
            const dataEvento = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

            let nomeDocumento;
            if (destinatario === "todosFuncionarios") {
              nomeDocumento = `todos_${dataEvento}`;
            } else {
              nomeDocumento = `${codigoColaborador}_${dataEvento}`;
            }

            const eventoRef = doc(db, "admins", sanitizedEmail, "eventos", nomeDocumento);

            const eventoData = {
              evento,
              data,
              horarioInicio,
              horarioFim,
              local,
              destinatario,
              codigoColaborador,
              dataPostagem: new Date(),
            };

            await setDoc(eventoRef, eventoData);

            showAlert("Evento enviado com sucesso!");

            setTimeout(() => {
              window.location.href = "agendaNova.html";
            }, 5000);
          } catch (error) {
            showAlert("Erro ao enviar evento: " + error.message);
          }
        });
      } else {
        showAlert("Você precisa estar logado para cadastrar um evento.");
      }
    });

    document.querySelectorAll('input[name="fun"]').forEach((input) => {
      input.addEventListener("change", function () {
        const codigoColaboradorContainer = document.getElementById("codigoColaboradorContainer");
        if (document.getElementById("porCadastro").checked) {
          codigoColaboradorContainer.style.display = "block";
        } else {
          codigoColaboradorContainer.style.display = "none";
        }
      });
    });

    function sanitizeEmail(email) {
      return email.replace(/[\.#$\[\]\/]/g, '_');
    }