import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
    import { getFirestore, collection, query, getDocs, where } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

    async function carregarEventos(mesAtual, anoAtual) {
      const listaDiasElemento = document.querySelector('#listaDias');
      listaDiasElemento.innerHTML = '';

      // Obter o email armazenado
      const emailMudado = localStorage.getItem('emailMudado');
      const sanitizedEmail = emailMudado.replace(/[\.#$\[\]\/]/g, '_');

      // Obter ID do colaborador do localStorage
      const userData = JSON.parse(localStorage.getItem('userData'));
      const userId = userData.Cadastro;

      // Datas de início e fim do mês
      const dataInicio = new Date(anoAtual, mesAtual, 1);
      const dataFim = new Date(anoAtual, mesAtual + 1, 0);

      // Consultar eventos no Firestore
      const eventosRef = collection(db, "admins", sanitizedEmail, "eventos");
      const eventosQuery = query(
        eventosRef,
        where("data", ">=", dataInicio.toISOString().split("T")[0]),
        where("data", "<=", dataFim.toISOString().split("T")[0])
      );

      const eventosSnapshot = await getDocs(eventosQuery);
      const eventos = eventosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const ultimoDiaDoMes = dataFim.getDate();

      for (let dia = 1; dia <= ultimoDiaDoMes; dia++) {
        const diaElemento = document.createElement('li');
        diaElemento.classList.add('dia');
        const dataDia = new Date(anoAtual, mesAtual, dia);

        // Filtrar eventos para o dia atual
        const eventosDia = eventos.filter(evento => {
          return (
            evento.data === dataDia.toISOString().split("T")[0] &&
            (evento.codigoColaborador === userId || evento.destinatario === 'todosFuncionarios')
          );
        });

        // Conteúdo do dia
        let descricao = "Sem eventos";
        let detalhes = "Sem Eventos";

        if (eventosDia.length > 0) {
          descricao = eventosDia[0].evento;
          detalhes = eventosDia.map(e => `${e.horarioInicio} - ${e.horarioFim}: ${e.local}`).join("<br>");
        }

        diaElemento.innerHTML = `
          <div class="data">${dia}</div>
          <div class="descricao">${descricao}</div>
          <button class="botao-expandir">Detalhes</button>
          <div class="expanded">${detalhes}</div>
        `;

        diaElemento.querySelector('.botao-expandir').addEventListener('click', function () {
          diaElemento.querySelector('.expanded').classList.toggle('show');
        });

        listaDiasElemento.appendChild(diaElemento);
      }
    }

    function iniciarCalendario() {
      const dataAtual = new Date();
      let mesAtual = dataAtual.getMonth();
      let anoAtual = dataAtual.getFullYear();

      const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
      ];

      const nomeMesElemento = document.querySelector('#nomeMes');

      function atualizarMes() {
        nomeMesElemento.textContent = `${meses[mesAtual]} ${anoAtual}`;
        carregarEventos(mesAtual, anoAtual);
      }

      document.querySelector('#anterior').addEventListener('click', function () {
        if (mesAtual > 0) {
          mesAtual--;
        } else {
          mesAtual = 11;
          anoAtual--;
        }
        atualizarMes();
      });

      document.querySelector('#proximo').addEventListener('click', function () {
        if (mesAtual < 11) {
          mesAtual++;
        } else {
          mesAtual = 0;
          anoAtual++;
        }
        atualizarMes();
      });

      atualizarMes();
    }

    iniciarCalendario();