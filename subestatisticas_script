// Configuração do Firebase (COLE A SUA CONFIGURAÇÃO AQUI - **CERTIFIQUE-SE DE QUE É A MESMA DO script.js e ator_script.js!** )
const firebaseConfig = {
    apiKey: "AIzaSyBZEffPMXgbSHYUUrNdIS5duAVGlKlmSq0",
    authDomain: "babes-392fd.firebaseapp.com",
    projectId: "babes-392fd",
    storageBucket: "babes-392fd.appspot.com",
    messagingSenderId: "376795361631",
    appId: "1:376795361631:web:d662f2b2f2cd23b115c6ea",
    measurementId: "SEU_MEASUREMENT_ID" // OPCIONAL: Preencha se usar Google Analytics no Firebase
};

// Inicializar o Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar o Firestore
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', carregarEstatisticas);

async function carregarEstatisticas() {
    try {
        const snapshot = await db.collection("atores").get();
        const atores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Calcular e preencher tabelas
        preencherTabelaCabelo(atores);
        preencherTabelaOlhos(atores);
        preencherTabelaAlturas(atores);
        preencherTabelaPaises(atores);
        preencherTabelaNotaPais(atores);

        console.log("Tabelas de subestatísticas carregadas com sucesso!");
    } catch (error) {
        console.error("Erro ao carregar estatísticas: ", error);
        alert("Erro ao carregar tabelas de subestatísticas.");
    }
}

function preencherTabelaCabelo(atores) {
    const contagemCabelo = contarPorPropriedade(atores, 'corCabelo');
    const tabelaBody = document.getElementById("tabela-cabelo-body");
    tabelaBody.innerHTML = "";
    for (const cor in contagemCabelo) {
        const row = tabelaBody.insertRow();
        row.insertCell().textContent = cor || "N/A"; // Cor do cabelo
        row.insertCell().textContent = contagemCabelo[cor]; // Contagem
    }
}

function preencherTabelaOlhos(atores) {
    const contagemOlhos = contarPorPropriedade(atores, 'corOlhos');
    const tabelaBody = document.getElementById("tabela-olhos-body");
    tabelaBody.innerHTML = "";
    for (const cor in contagemOlhos) {
        const row = tabelaBody.insertRow();
        row.insertCell().textContent = cor || "N/A"; // Cor dos olhos
        row.insertCell().textContent = contagemOlhos[cor]; // Contagem
    }
}

function preencherTabelaAlturas(atores) {
    const atoresOrdenadosPorAltura = [...atores].sort((a, b) => a.altura - b.altura); // Ordena por altura
    const maisBaixos = atoresOrdenadosPorAltura.slice(0, 5); // 5 mais baixos
    const maisAltos = atoresOrdenadosPorAltura.slice(-5).reverse(); // 5 mais altos (e reverte para ordem decrescente)

    preencherSubTabelaAltura(maisBaixos, "tabela-alturas-baixas-body");
    preencherSubTabelaAltura(maisAltos, "tabela-alturas-altas-body");
}

function preencherSubTabelaAltura(atores, tabelaBodyId) {
    const tabelaBody = document.getElementById(tabelaBodyId);
    tabelaBody.innerHTML = "";
    atores.forEach(ator => {
        const row = tabelaBody.insertRow();
        row.insertCell().textContent = ator.nome;
        row.insertCell().textContent = ator.altura || "N/A";
    });
}


function preencherTabelaPaises(atores) {
    const contagemPaises = contarPorPropriedade(atores, 'pais');
    const tabelaBody = document.getElementById("tabela-paises-body");
    tabelaBody.innerHTML = "";
    for (const pais in contagemPaises) {
        const row = tabelaBody.insertRow();
        row.insertCell().textContent = pais || "N/A"; // País
        row.insertCell().textContent = contagemPaises[pais]; // Contagem
    }
}

function preencherTabelaNotaPais(atores) {
    const mediaNotasPorPais = calcularMediaPorPais(atores, 'nota');
    const paisesOrdenadosPorMedia = Object.entries(mediaNotasPorPais).sort(([, mediaA], [, mediaB]) => mediaB - mediaA); // Ordena por média descendente

    const tabelaBody = document.getElementById("tabela-nota-pais-body");
    tabelaBody.innerHTML = "";
    paisesOrdenadosPorMedia.forEach(([pais, media]) => {
        const row = tabelaBody.insertRow();
        row.insertCell().textContent = pais || "N/A"; // País
        row.insertCell().textContent = media.toFixed(2); // Média da nota (2 casas decimais)
    });
}


// Função Utilitária para Contar Propriedades
function contarPorPropriedade(atores, propriedade) {
    return atores.reduce((contagem, ator) => {
        const valor = ator[propriedade] || 'N/A'; // Usar 'N/A' se a propriedade for undefined
        contagem[valor] = (contagem[valor] || 0) + 1;
        return contagem;
    }, {});
}

// Função Utilitária para Calcular Média de Nota por País
function calcularMediaPorPais(atores, propriedadeNota) {
    const notasPorPais = atores.reduce((acumulador, ator) => {
        const pais = ator.pais || 'N/A'; // Usar 'N/A' se o país for undefined
        const nota = parseFloat(ator.nota) || 0; // Converte a nota para número, 0 se inválida
        if (!acumulador[pais]) {
            acumulador[pais] = { somaNotas: 0, contagem: 0 };
        }
        acumulador[pais].somaNotas += nota;
        acumulador[pais].contagem += 1;
        return acumulador;
    }, {});

    const mediaPorPais = {};
    for (const pais in notasPorPais) {
        mediaPorPais[pais] = notasPorPais[pais].somaNotas / notasPorPais[pais].contagem || 0; // Evita divisão por zero
    }
    return mediaPorPais;
}
