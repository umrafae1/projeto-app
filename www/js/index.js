const dataAtual = new Date();
let mesAtual = dataAtual.getMonth();
let anoAtual = dataAtual.getFullYear();

const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const nomeMesElemento = document.querySelector('#nomeMes');
const listaDiasElemento = document.querySelector('#listaDias');

function atualizarMes() {
    nomeMesElemento.textContent = `${meses[mesAtual]} ${anoAtual}`;
}

function criarDias() {
    listaDiasElemento.innerHTML = '';

    const ultimoDiaDoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();

    for (let dia = 1; dia <= ultimoDiaDoMes; dia++) {
        const diaElemento = document.createElement('li');
        diaElemento.classList.add('dia');

        diaElemento.innerHTML = `
            <div class="data">${dia}</div>
            <div class="descricao">Expediente</div>
            <button class="botao-expandir">Detalhes</button>
            <div class="expanded">
                <p>Detalhes sobre o expediente do dia ${dia}.</p>
            </div>
        `;

        diaElemento.querySelector('.botao-expandir').addEventListener('click', function() {
            const expanded = diaElemento.querySelector('.expanded');
            expanded.classList.toggle('show');
        });

        listaDiasElemento.appendChild(diaElemento);
    }
}

document.querySelector('#anterior').addEventListener('click', function() {
    if (mesAtual > 0) {
        mesAtual--;
    } else {
        mesAtual = 11;
        anoAtual--;
    }
    atualizarMes();
    criarDias();
});

document.querySelector('#proximo').addEventListener('click', function() {
    if (mesAtual < 11) {
        mesAtual++;
    } else {
        mesAtual = 0;
        anoAtual++;
    }
    atualizarMes();
    criarDias();
});

atualizarMes();
criarDias();
