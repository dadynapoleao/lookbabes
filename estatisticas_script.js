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

let atoresGlobais = []; // Array global para armazenar todos os atores

document.addEventListener('DOMContentLoaded', iniciarPagina);

async function iniciarPagina() {
    await carregarAtoresParaTabela(); // Carrega os atores e preenche a tabela inicialmente
    popularFiltroPaises(); // Popula o filtro de países
    adicionarEventListenersFiltros(); // Adiciona listeners para os filtros
}


async function carregarAtoresParaTabela() {
    try {
        const snapshot = await db.collection("atores").get();
        atoresGlobais = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Carrega para o array global
        preencherTabelaAtores(atoresGlobais); // Preenche a tabela com todos os atores inicialmente
        console.log("Tabela de atores carregada com sucesso!");
    } catch (error) {
        console.error("Erro ao carregar atores para tabela: ", error);
        alert("Erro ao carregar atores para a tabela de estatísticas.");
    }
}

function preencherTabelaAtores(atores) {
    const tabelaBody = document.getElementById("atores-tabela-body");
    if (!tabelaBody) {
        console.error("Elemento 'atores-tabela-body' não encontrado!");
        return;
    }
    tabelaBody.innerHTML = "";

    if (atores.length === 0) {
        tabelaBody.innerHTML = `<tr><td colspan="14">Não há atores para exibir na tabela.</td></tr>`;
        return;
    }

    atores.forEach(ator => {
        const row = tabelaBody.insertRow();
        row.insertCell().innerHTML = `<img src="${ator.foto}" alt="${ator.nome}" style="max-width: 50px; height: auto;">`;
        // Célula do Nome MODIFICADA para incluir um link
        const nomeCell = row.insertCell();
        const atorLink = document.createElement("a"); // Cria um elemento 'a' (link)
        atorLink.href = `ator.html?id=${ator.id}`;   // Define o href para a página do ator, passando o ID
        atorLink.textContent = ator.nome;             // Define o texto do link como o nome do ator
        atorLink.style.color = 'white';              // Estilo para a cor do link (branco para contrastar com o fundo)
        atorLink.style.textDecoration = 'none';      // Remove o sublinhado padrão do link
        nomeCell.appendChild(atorLink);               // Adiciona o link à célula do nome


        row.insertCell().textContent = ator.idade;
        row.insertCell().textContent = ator.dataNascimento;
        row.insertCell().textContent = ator.pais;
        row.insertCell().textContent = ator.etnia;
        row.insertCell().textContent = ator.corCabelo;
        row.insertCell().textContent = ator.corOlhos;
        row.insertCell().textContent = ator.altura;
        row.insertCell().textContent = ator.peso;
        row.insertCell().textContent = ator.tipoCorpo;
        row.insertCell().textContent = ator.medidas;
        row.insertCell().textContent = ator.nota;
        // Adicione mais células com outras propriedades do ator, se necessário
    });
}

async function popularFiltroPaises() {
    const filtroPaisSelect = document.getElementById("filtrar-pais");
    if (!filtroPaisSelect) return;

    const paises = [...new Set(atoresGlobais.map(ator => ator.pais).filter(pais => pais))]; // Extrai países únicos do array de atores

    paises.sort().forEach(pais => { // Ordena os países alfabeticamente
        const option = document.createElement("option");
        option.value = pais;
        option.textContent = pais;
        filtroPaisSelect.appendChild(option);
    });
}


function adicionarEventListenersFiltros() {
    document.getElementById('ordenar-idade').addEventListener('change', filtrarAtores);
    document.getElementById('ordenar-nota').addEventListener('change', filtrarAtores);
    document.getElementById('filtrar-pais').addEventListener('change', filtrarAtores);
    document.getElementById('filtrar-nota').addEventListener('change', filtrarAtores); // **Adicionado event listener para o novo filtro de nota**
}


function filtrarAtores() {
    let atoresFiltrados = [...atoresGlobais]; // Começa com todos os atores

    // **FILTRO POR PAÍS**
    const paisSelecionado = document.getElementById("filtrar-pais").value;
    if (paisSelecionado !== "todos") {
        atoresFiltrados = atoresFiltrados.filter(ator => ator.pais === paisSelecionado);
    }

    // **ORDENAÇÃO POR IDADE**
    const ordenarIdadeSelecionado = document.getElementById("ordenar-idade").value;
    if (ordenarIdadeSelecionado === "mais-novos") {
        atoresFiltrados.sort((a, b) => a.idade - b.idade); // Mais novos primeiro (ascendente)
    } else if (ordenarIdadeSelecionado === "mais-velhos") {
        atoresFiltrados.sort((a, b) => b.idade - a.idade); // Mais velhos primeiro (descendente)
    }

    // **ORDENAÇÃO POR NOTA**
    const ordenarNotaSelecionado = document.getElementById("ordenar-nota").value;
    if (ordenarNotaSelecionado === "mais-alta") {
        atoresFiltrados.sort((a, b) => b.nota - a.nota); // Nota mais alta primeiro (descendente)
    } else if (ordenarNotaSelecionado === "mais-baixa") {
        atoresFiltrados.sort((a, b) => a.nota - b.nota); // Nota mais baixa primeiro (ascendente)
    }

    // **FILTRO POR NOTA (MAIOR OU IGUAL A)**
    const filtrarNotaSelecionada = document.getElementById("filtrar-nota").value;
    if (filtrarNotaSelecionada !== "nenhum") {
        const notaMinima = parseInt(filtrarNotaSelecionada);
        atoresFiltrados = atoresFiltrados.filter(ator => ator.nota >= notaMinima); // Filtra por nota mínima
    }

    preencherTabelaAtores(atoresFiltrados); // Preenche a tabela com os atores filtrados e/ou ordenados
}
