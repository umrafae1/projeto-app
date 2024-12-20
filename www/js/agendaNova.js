const dataAtual = new Date();
        let mesAtual = dataAtual.getMonth();
        let anoAtual = dataAtual.getFullYear();

        const meses = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];

        const nomeMesElemento = document.querySelector('#nomeMes');
        const listaDiasElemento = document.querySelector('#listaDias');

        async function atualizarMes() {
            nomeMesElemento.textContent = `${meses[mesAtual]} ${anoAtual}`;
        }

        function criarDias() {
            listaDiasElemento.innerHTML = '';
            const ultimoDiaDoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();
            const hoje = new Date();

            for (let dia = 1; dia <= ultimoDiaDoMes; dia++) {
                const dataCompleta = new Date(anoAtual, mesAtual, dia);

                // Só exibe os dias que são iguais ou posteriores à data atual
                if (dataCompleta >= hoje) {
                    const diaElemento = document.createElement('li');
                    diaElemento.classList.add('dia');
                    diaElemento.innerHTML = `
                        <div class="data">${dia}</div>
                        <div class="descricao"></div>
                        <button class="botao-nova-pagina" onclick="salvarData(${dia}, ${mesAtual + 1}, ${anoAtual})">Adicionar</button>
                    `;

                    diaElemento.addEventListener('click', function() {
                        document.querySelectorAll('.dia').forEach(d => d.classList.remove('selecionado'));
                        diaElemento.classList.add('selecionado');
                    });

                    listaDiasElemento.appendChild(diaElemento);
                }
            }
        }

        function salvarData(dia, mes, ano) {
            localStorage.setItem('dataSelecionada', JSON.stringify({ dia, mes, ano }));
            window.location.href = 'add_agenda.html';
        }

        document.querySelector('#anterior').addEventListener('click', function() {
            if (mesAtual > 0) mesAtual--;
            else { mesAtual = 11; anoAtual--; }
            salvarEstadoAgenda();
            atualizarMes();
            criarDias();
        });

        document.querySelector('#proximo').addEventListener('click', function() {
            if (mesAtual < 11) mesAtual++;
            else { mesAtual = 0; anoAtual++; }
            salvarEstadoAgenda();
            atualizarMes();
            criarDias();
        });

        function salvarEstadoAgenda() {
            localStorage.setItem('estadoAgenda', JSON.stringify({ mes: mesAtual, ano: anoAtual }));
        }

        if (localStorage.getItem('estadoAgenda')) {
            const estado = JSON.parse(localStorage.getItem('estadoAgenda'));
            mesAtual = estado.mes;
            anoAtual = estado.ano;
        }

        atualizarMes();
        criarDias();