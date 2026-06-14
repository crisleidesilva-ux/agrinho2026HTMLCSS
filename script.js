const botao = document.getElementById("registrar");
const mensagem = document.getElementById("mensagem");
const listaHistorico = document.getElementById("listaHistorico");

const totalEntradasTexto = document.getElementById("totalEntradas");
const totalSaidasTexto = document.getElementById("totalSaidas");
const saldoAtualTexto = document.getElementById("saldoAtual");

const barraEntrada = document.getElementById("barraEntrada");
const barraSaida = document.getElementById("barraSaida");
const barraSaldo = document.getElementById("barraSaldo");
const alertaEstoque = document.getElementById("alertaEstoque");

let totalEntradas = 0;
let totalSaidas = 0;
let saldo = 0;
let historico = [];

botao.addEventListener("click", function() {
    const tipoRacao = document.getElementById("tipoRacao").value.trim();
    const movimento = document.getElementById("movimento").value;
    const quantidade = Number(document.getElementById("quantidade").value);

    if (tipoRacao === "" || quantidade <= 0) {
        mostrarMensagem("Preencha o tipo de ração e uma quantidade válida.");
        return;
    }

    if (movimento === "saida" && quantidade > saldo) {
        mostrarMensagem("A saída é maior que o saldo disponível.");
        return;
    }

    if (movimento === "entrada") {
        totalEntradas += quantidade;
        saldo += quantidade;
    } else {
        totalSaidas += quantidade;
        saldo -= quantidade;
    }

    historico.unshift({
        tipo: tipoRacao,
        movimento: movimento,
        quantidade: quantidade
    });

    mostrarMensagem("Movimentação registrada no painel.");
    atualizarDashboard();
    limparCampos();
});

function atualizarDashboard() {
    totalEntradasTexto.textContent = totalEntradas;
    totalSaidasTexto.textContent = totalSaidas;
    saldoAtualTexto.textContent = saldo;

    const maiorValor = Math.max(totalEntradas, totalSaidas, saldo, 1);

    barraEntrada.style.width = (totalEntradas / maiorValor * 100) + "%";
    barraSaida.style.width = (totalSaidas / maiorValor * 100) + "%";
    barraSaldo.style.width = (saldo / maiorValor * 100) + "%";

    atualizarAlerta();
    atualizarHistorico();
}

function atualizarAlerta() {
    if (saldo === 0) {
        alertaEstoque.innerHTML = "⚠️ Estoque zerado. Registre uma entrada para manter a alimentação dos animais.";
    } else if (saldo < 50) {
        alertaEstoque.innerHTML = "🟡 Atenção: estoque baixo. Planeje uma nova compra ou produção de ração.";
    } else {
        alertaEstoque.innerHTML = "🟢 Estoque em situação segura. Continue acompanhando as saídas.";
    }
}

function atualizarHistorico() {
    listaHistorico.innerHTML = "";

    if (historico.length === 0) {
        listaHistorico.innerHTML = '<p class="vazio">Nenhuma movimentação registrada.</p>';
        return;
    }

    historico.forEach(function(item) {
        const div = document.createElement("div");
        div.classList.add("item-historico");

        if (item.movimento === "saida") {
            div.classList.add("saida-item");
        }

        const nomeMovimento = item.movimento === "entrada" ? "Entrada" : "Saída";

        div.innerHTML =
            "<strong>" + item.tipo + "</strong>" +
            "<span>" + nomeMovimento + "</span>" +
            "<span>" + item.quantidade + " kg</span>";

        listaHistorico.appendChild(div);
    });
}

function limparCampos() {
    document.getElementById("tipoRacao").value = "";
    document.getElementById("quantidade").value = "";
}

function mostrarMensagem(texto) {
    mensagem.style.display = "block";
    mensagem.textContent = texto;
}
