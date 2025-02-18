// Configuração do Firebase (COLE A SUA CONFIGURAÇÃO AQUI - **CERTIFIQUE-SE DE QUE É A MESMA DOS OUTROS FICHEIROS JS!** )
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

let atoresGlobais = []; // Array global para armazenar todos os atores

document.addEventListener('DOMContentLoaded', iniciarPagina);

async function iniciarPagina() {
    await carregarAtores(); // Carrega todos os atores do Firestore
    popularListaNacionalidades(); // Popula a lista de nacionalidades na página

    // Verificar se há um país selecionado na URL (parâmetro 'pais')
    const params = new URLSearchParams(window.location.search);
    const paisSelecionado = params.get('pais');
    if (paisSelecionado) {
        carregarAtoresPorNacionalidade(paisSelecionado); // Carrega e exibe atores do país selecionado
    }
}

async function carregarAtores() {
    try {
        const snapshot = await db.collection("atores").get();
        atoresGlobais = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Carrega todos os atores para o array global
        console.log("Todos os atores carregados do Firestore para a página de nacionalidades.");
    } catch (error) {
        console.error("Erro ao carregar atores do Firestore: ", error);
        alert("Erro ao carregar atores para a página de nacionalidades.");
    }
}


async function popularListaNacionalidades() {
    const listaNacionalidadesUL = document.getElementById("lista-nacionalidades");
    if (!listaNacionalidadesUL) return;
    listaNacionalidadesUL.innerHTML = ""; // Limpa a mensagem "Carregando..."

    const paisesUnicos = [...new Set(atoresGlobais.map(ator => ator.pais).filter(pais => pais))]; // Extrai países únicos

    paisesUnicos.sort().forEach(pais => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = `nacionalidades.html?pais=${pais}`; // Link para a mesma página, mas com parâmetro 'pais' na URL
        link.textContent = pais;
        li.appendChild(link);
        listaNacionalidadesUL.appendChild(li);
    });
}


async function carregarAtoresPorNacionalidade(pais) {
    console.log(`Carregando atores do país: ${pais}`); // Debug
    const atoresFiltrados = atoresGlobais.filter(ator => ator.pais === pais); // Filtra atores por país
    mostrarAtoresPorNacionalidade(atoresFiltrados, pais);
}


function mostrarAtoresPorNacionalidade(atores, pais) {
    console.log(`Mostrar atores de ${pais}:`, atores); // Debug
    const containerAtoresPais = document.getElementById("atores-por-nacionalidade");
    const tituloAtoresPais = document.getElementById("titulo-atores-nacionalidade");
    if (!containerAtoresPais || !tituloAtoresPais) {
        console.error("Container de atores por nacionalidade ou título não encontrados!");
        return;
    }
    containerAtoresPais.innerHTML = ""; // Limpa o conteúdo anterior
    tituloAtoresPais.textContent = `Atores de ${pais}`; // Define o título dinâmico

    if (atores.length === 0) {
        containerAtoresPais.innerHTML = `<p>Não foram encontrados atores do país ${pais}.</p>`;
    } else {
        // Reutiliza a função mostrarAtores de script.js para exibir os cards de atores
        mostrarAtores("atores-por-nacionalidade", atores); // Usando a função de script.js
    }

    const sectionAtoresPais = document.getElementById("atores-por-nacionalidade-section");
    if (sectionAtoresPais) {
        sectionAtoresPais.style.display = 'block'; // Mostra a secção de atores por nacionalidade
    }
}


// Função mostrarAtores (COPIE A FUNÇÃO mostrarAtores DO SEU script.js COMPLETO AQUI!)
function mostrarAtores(containerId, atoresParaMostrar) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Elemento '${containerId}' não encontrado na página!`);
        return;
    }
    container.innerHTML = "";

    atoresParaMostrar.forEach((ator, index) => {
        const cardLink = document.createElement("a");
        cardLink.href = `ator.html?id=${ator.id}`;
        cardLink.style.textDecoration = 'none';

        const card = document.createElement("div");
        card.className = "ator-card";

        card.innerHTML = `
            <img src="${ator.foto}" alt="${ator.nome}" class="ator-foto">
            <h3 class="ator-nome-card">${ator.nome}</h3>
            <div class="ator-info-stack">
                <p class="ator-nacionalidade-card">${ator.pais}</p>
                <p class="ator-idade-card">${ator.idade} anos</p>
            </div>
        `;

        cardLink.appendChild(card);
        container.appendChild(cardLink);
    });
}
