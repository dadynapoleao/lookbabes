// Configuração do Firebase (COLE A SUA CONFIGURAÇÃO AQUI)
const firebaseConfig = {
    apiKey: "AIzaSyBZEffPMXgbSHYUUrNdIS5duAVGlKlmSq0",
    authDomain: "babes-392fd.firebaseapp.com",
    projectId: "babes-392fd",
    storageBucket: "babes-392fd.appspot.com",
    messagingSenderId: "376795361631",
    appId: "1:376795361631:web:d662f2b2f2cd23b115c6ea",
    measurementId: "SEU_MEASUREMENT_ID" // OPCIONAL: Preencha se usar Google Analytics no Firebase
};

console.log("Firebase:", typeof firebase);

// Inicializar o Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar o Firestore
const db = firebase.firestore();

// Array para armazenar os atores localmente (MANTER PARA PERSISTÊNCIA LOCAL - OPCIONAL)
let atoresLocal = [];

// Função para salvar os atores no localStorage (MANTER PARA PERSISTÊNCIA LOCAL - OPCIONAL)
function salvarAtoresLocal() {
    localStorage.setItem("atores", JSON.stringify(atoresLocal));
}

// Função para carregar os atores do localStorage (MANTER PARA PERSISTÊNCIA LOCAL - OPCIONAL)
function carregarAtoresLocal() {
    const salvos = localStorage.getItem("atores");
    if (salvos) {
        atoresLocal = JSON.parse(salvos);
        mostrarAtores(); // Atenção: mostrarAtores() pode precisar de ajustes dependendo de onde você quer exibir esses atores locais
    }
}

// Função para mostrar os atores na página principal (MODIFICADA PARA NOVO LAYOUT E CONTAINER ID E SEM LABELS E CARDS CLICÁVEIS)
function mostrarAtores(containerId, atoresParaMostrar) {
    console.log("mostrarAtores chamada para containerId:", containerId); // DEBUG
    console.log("mostrarAtores - atoresParaMostrar:", atoresParaMostrar); // DEBUG

    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Elemento '${containerId}' não encontrado na página!`);
        return;
    }
    container.innerHTML = "";

    if (!atoresParaMostrar || atoresParaMostrar.length === 0) {
        container.innerHTML = "<p>Nenhum ator encontrado.</p>"; // Mensagem caso não haja atores
        return;
    }

    atoresParaMostrar.forEach((ator, index) => {
        const cardLink = document.createElement("a"); // Criar um elemento 'a' (link)
        cardLink.href = `ator.html?id=${ator.id}`; // Define o link para ator.html, passando o ID do ator como parâmetro
        cardLink.style.textDecoration = 'none'; // Remove o sublinhado padrão dos links

        const card = document.createElement("div");
        card.className = "ator-card";

        // Novo layout do card: Imagem, Nome, Nacionalidade, Idade (TUDO JUNTO VERTICALMENTE, SEM LABELS)
        card.innerHTML = `
            <img src="${ator.foto}" alt="${ator.nome}" class="ator-foto">
            <h3 class="ator-nome-card">${ator.nome}</h3>
            <div class="ator-info-stack">
                <p class="ator-nacionalidade-card">${ator.pais}</p>
                <p class="ator-idade-card">${ator.idade} anos</p>
            </div>
        `;

        cardLink.appendChild(card); // Adiciona o card como filho do link
        container.appendChild(cardLink); // Adiciona o link (que contém o card) ao container
    });
}


// Função para adicionar um novo ator (MODIFICADA - SEM CHAMADA DIRETA A mostrarAtores e COM REDIRECIONAMENTO)
async function adicionarAtor() {
    console.log("adicionarAtor() chamada"); // Debug
    const nome = document.getElementById("nome").value;
    const idade = document.getElementById("idade").value;
    const dataNascimento = document.getElementById("data-nascimento").value;
    const pais = document.getElementById("pais").value;
    const etnia = document.getElementById("etnia").value;
    const corCabelo = document.getElementById("cor-cabelo").value;
    const corOlhos = document.getElementById("cor-olhos").value;
    const altura = document.getElementById("altura").value;
    const peso = document.getElementById("peso").value;
    const tipoCorpo = document.getElementById("tipo-corpo").value;
    const medidas = document.getElementById("medidas").value;
    const nota = document.getElementById("nota").value;
    const foto = document.getElementById("foto-input").value; // Use o ID correto: foto-input

    if (!nome || !idade || !dataNascimento || !pais || !etnia || !corCabelo || !corOlhos || !altura || !peso || !tipoCorpo || !medidas || !nota || !foto) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const novoAtor = {
        nome,
        idade,
        dataNascimento,
        pais,
        etnia,
        corCabelo,
        corOlhos,
        altura,
        peso,
        tipoCorpo,
        medidas,
        nota,
        foto,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Salvar no Firestore
    try {
        const docRef = await db.collection("atores").add(novoAtor); // Obtém a DocumentReference após adicionar
        console.log("Ator adicionado ao Firestore com sucesso, ID:", docRef.id);
        alert("Ator adicionado com sucesso e salvo no Firebase!");
    } catch (error) {
        console.error("Erro ao adicionar ator ao Firestore: ", error);
        alert("Erro ao salvar ator no Firebase. Veja a consola para mais detalhes.");
        return;
    }

    // Redirecionar para index.html após adicionar o ator
    window.location.href = 'index.html';

    // Limpar o formulário após adicionar (manter esta parte)
    document.getElementById("info-texto").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("idade").value = "";
    document.getElementById("data-nascimento").value = "";
    document.getElementById("pais").value = "";
    document.getElementById("etnia").value = "";
    document.getElementById("cor-cabelo").value = "";
    document.getElementById("cor-olhos").value = "";
    document.getElementById("altura").value = "";
    document.getElementById("peso").value = "";
    document.getElementById("tipo-corpo").value = "";
    document.getElementById("medidas").value = "";
    document.getElementById("nota").value = "0";
    document.getElementById("foto-input").value = ""; // Use o ID correto: foto-input
}


// Função para remover um ator (MANTER - REMOÇÃO LOCAL AGORA NÃO RELEVANTE PARA A LISTA DO FIREBASE)
function removerAtor(index) {
    if (confirm("Tem certeza de que deseja remover este ator?")) {
        atoresLocal.splice(index, 1); // Usando atoresLocal aqui
        salvarAtoresLocal(); // Usando salvarAtoresLocal aqui
        mostrarAtores(); // Aqui você precisa decidir onde e como quer mostrar esses atores locais, `mostrarAtores()` como está pode não funcionar diretamente.
    }
}


// Função para extrair as informações do texto e preencher os campos automaticamente (MANTER - FUNCIONALIDADE DE EXTRAÇÃO INALTERADA)
function extrairInformacoes() {
    console.log("extrairInformacoes() chamada"); // Para debug
    const texto = document.getElementById("info-texto").value;

    // Expressões regulares atualizadas para encontrar as informações
    const idadeMatch = texto.match(/Age:\s*(\d+)/);
    // Expressão regular ajustada para o formato "Born: Monday 24th of January 1994"
    const nascimentoMatch = texto.match(/Born:\s*(?:[A-Za-z]+\s+)?(\d{1,2})(?:th|st|nd|rd)?\s+of\s+([A-Za-z]+)\s+(\d{4})/i);
    const birthplaceMatch = texto.match(/Birthplace:\s*(.*)/); // Captura toda a linha "Birthplace"
    const etniaMatch = texto.match(/Ethnicity:\s*([\w\s]+)(?=[,\n:])/); // Etnia (até vírgula, quebra de linha ou dois pontos)
    const cabeloMatch = texto.match(/Hair color:\s*([\w\s]+)(?=[,\n:])/); // Cor do cabelo (até vírgula, quebra de linha ou dois pontos)
    const olhosMatch = texto.match(/Eye color:\s*([\w\s]+)(?=[,\n:])/); // Cor dos olhos (até vírgula, quebra de linha ou dois pontos)
    const alturaMatch = texto.match(/Height:\s*(?:[\d'"]+.*?\d{1,2}\s?cm|[\d]+(?:\.\d+)?\s?cm)/); // Altura (apenas números em cm)
    const pesoMatch = texto.match(/Weight:\s*(?:[\d]+(?:\.\d+)?\s?lbs \(or\s([\d]+)\s?kg\)|[\d]+(?:\.\d+)?\s?kg)/); // Peso (apenas números em kg)
    const tipoCorpoMatch = texto.match(/Body type:\s*([\w\s]+)(?=[,\n:])/); // Tipo de corpo (até vírgula, quebra de linha ou dois pontos)
    const medidasMatch = texto.match(/Measurements:\s*([\dA-Za-z\-]+)/); // Medidas

    // Função para extrair o país da linha "Birthplace"
    function extrairPais(birthplace) {
        if (!birthplace) return "N/A"; // Se não houver linha "Birthplace", retorna "N/A"
        const partes = birthplace.split(","); // Divide a string pelos separadores (vírgulas)
        const pais = partes[partes.length - 1].trim(); // Pega o último elemento e remove espaços extras
        return pais || "N/A"; // Retorna "N/A" se estiver vazio
    }

    // Função para limpar e extrair a etnia
    function limparEtnia(etnia) {
        if (!etnia) return "N/A"; // Se não houver valor, retorna "N/A"
        return etnia.trim().replace(/[,;:\n].*/, "") || "N/A"; // Remove delimitadores e retorna "N/A" se vazio
    }

    // Função para limpar e extrair a cor do cabelo
    function limparCorCabelo(corCabelo) {
        if (!corCabelo) return "N/A"; // Se não houver valor, retorna "N/A"
        return corCabelo.trim().replace(/[,;:\n].*/, "") || "N/A"; // Remove delimitadores e retorna "N/A" se vazio
    }

    // Função para limpar e extrair a cor dos olhos
    function limparCorOlhos(corOlhos) {
        if (!corOlhos) return "N/A"; // Se não houver valor, retorna "N/A"
        return corOlhos.trim().replace(/[,;:\n].*/, "") || "N/A"; // Remove delimitadores e retorna "N/A" se vazio
    }

    // Função para limpar e extrair a altura em centímetros
    function limparAltura(altura) {
        if (!altura) return "N/A"; // Se não houver valor, retorna "N/A"
        const match = altura.match(/(\d+)\s?cm/); // Captura apenas o número antes de "cm"
        return match ? match[1] : "N/A"; // Retorna o número ou "N/A" se não encontrado
    }

    // Função para limpar e extrair o peso em quilogramas
    function limparPeso(peso) {
        if (!peso) return "N/A"; // Se não houver valor, retorna "N/A"
        const match = peso.match(/(\d+)\s?kg/); // Captura apenas o número antes de "kg"
        return match ? match[1] : "N/A"; // Retorna o número ou "N/A" se não encontrado
    }

    // Função para limpar e extrair o tipo de corpo
    function limparTipoCorpo(tipoCorpo) {
        if (!tipoCorpo) return "N/A"; // Se não houver valor, retorna "N/A"
        return tipoCorpo.trim().replace(/[,;:\n].*/, "") || "N/A"; // Remove delimitadores e retorna "N/A" se vazio
    }

    // Função para limpar e extrair as medidas
    function limparMedidas(medidas) {
        if (!medidas) return "N/A"; // Se não houver valor, retorna "N/A"
        return medidas.trim() || "N/A"; // Remove espaços extras e retorna "N/A" se vazio
    }

    // Preenchendo os campos com as informações extraídas
    document.getElementById("nome").value = "N/A"; // Inicializa com "N/A"
    document.getElementById("idade").value = "N/A";
    // document.getElementById("data-nascimento").value = ""; // REMOVIDO: Não definir valor padrão para data
    document.getElementById("pais").value = "N/A";
    document.getElementById("etnia").value = "N/A";
    document.getElementById("cor-cabelo").value = "N/A";
    document.getElementById("cor-olhos").value = "N/A";
    document.getElementById("altura").value = "N/A";
    document.getElementById("peso").value = "N/A";
    document.getElementById("tipo-corpo").value = "N/A";
    document.getElementById("medidas").value = "N/A";

    if (idadeMatch) {
        document.getElementById("idade").value = idadeMatch[1];
    }
    if (nascimentoMatch) {
        // Extrai dia, mês e ano do regex
        const dia = nascimentoMatch[1];
        const mesNome = nascimentoMatch[2];
        const ano = nascimentoMatch[3];

        // Converte o nome do mês para número (ex: "January" para 1)
        const mesNumero = new Date(Date.parse(mesNome + " 1, 2000")).getMonth() + 1; // Usando um ano qualquer para o parse
        const mesFormatado = mesNumero < 10 ? '0' + mesNumero : mesNumero; // Adiciona '0' se for menor que 10
        const diaFormatado = dia < 10 ? '0' + dia : dia; // Adiciona '0' se for menor que 10


        // Formata a data para YYYY-MM-DD (formato do input type="date")
        const dataFormatada = `${ano}-${mesFormatado}-${diaFormatado}`;
        document.getElementById("data-nascimento").value = dataFormatada;
    }
    if (birthplaceMatch) {
        const pais = extrairPais(birthplaceMatch[1]); // Extrai o país da linha "Birthplace"
        document.getElementById("pais").value = pais;
    }
    if (etniaMatch) {
        const etnia = limparEtnia(etniaMatch[1]); // Limpa e extrai a etnia corretamente
        document.getElementById("etnia").value = etnia;
    }
    if (cabeloMatch) {
        const corCabelo = limparCorCabelo(cabeloMatch[1]); // Limpa e extrai a cor do cabelo corretamente
        document.getElementById("cor-cabelo").value = corCabelo;
    }
    if (olhosMatch) {
        const corOlhos = limparCorOlhos(olhosMatch[1]); // Limpa e extrai a cor dos olhos corretamente
        document.getElementById("cor-olhos").value = corOlhos;
    }
    if (alturaMatch) {
        const alturaCm = limparAltura(alturaMatch[0]); // Limpa e extrai apenas o valor em centímetros
        document.getElementById("altura").value = alturaCm;
    }
    if (pesoMatch) {
        const pesoKg = limparPeso(pesoMatch[0]); // Limpa e extrai apenas o valor em quilogramas
        document.getElementById("peso").value = pesoKg;
    }
    if (tipoCorpoMatch) {
        const tipoCorpo = limparTipoCorpo(tipoCorpoMatch[1]); // Limpa e extrai apenas o tipo de corpo
        document.getElementById("tipo-corpo").value = tipoCorpo;
    }
    if (medidasMatch) {
        const medidas = limparMedidas(medidasMatch[1]); // Limpa e extrai as medidas
        document.getElementById("medidas").value = medidas;
    }
}


// Função para carregar os últimos 10 atores do Firestore e exibir no div "ultimos-atores" (MODIFICADA PARA NOVO LAYOUT)
async function carregarUltimosAtores() {
    console.log("carregarUltimosAtores chamada"); // DEBUG
    try {
        const snapshot = await db.collection("atores")
            .orderBy('timestamp', 'desc') // Ordena por timestamp em ordem decrescente (mais recentes primeiro)
            .limit(10)                     // Limita a 10 resultados
            .get();

        console.log("carregarUltimosAtores - snapshot:", snapshot); // DEBUG
        console.log("carregarUltimosAtores - snapshot.docs.length:", snapshot.docs.length); // DEBUG

        if (snapshot.empty) {
            console.warn("carregarUltimosAtores: Snapshot vazia, não foram encontrados atores."); // Debug: Log snapshot vazia
            mostrarAtores("ultimos-atores", []); // Mostra mensagem de "sem atores"
            return;
        }

        const ultimosAtores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Inclui o ID do documento
        console.log("carregarUltimosAtores - ultimosAtores:", ultimosAtores); // DEBUG: Log ultimosAtores array

        mostrarAtores("ultimos-atores", ultimosAtores); // Chama mostrarAtores para o div "ultimos-atores"
        console.log("Últimos 10 atores carregados do Firestore com sucesso!");
    } catch (error) {
        console.error("Erro ao carregar últimos 10 atores do Firestore: ", error);
        alert("Erro ao carregar últimos atores do Firebase. Veja a consola para mais detalhes.");
    }
}


// Função para carregar TODOS os atores do Firestore e exibir na página index.html (MODIFICADA PARA BUSCAR DO FIRESTORE)
async function carregarAtores() {
    try {
        const snapshot = await db.collection("atores").get(); // Busca todos os documentos da coleção 'atores'
        const todosAtores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Inclui o ID do documento
        mostrarAtores("atores-lista", todosAtores); // Chama mostrarAtores para o div "atores-lista" (se ainda quiser mostrar todos)
        console.log("Todos os atores carregados do Firestore com sucesso!");
    } catch (error) {
        console.error("Erro ao carregar todos os atores do Firestore: ", error);
        alert("Erro ao carregar todos os atores do Firebase. Veja a consola para mais detalhes.");
    }
}


// Chame carregarUltimosAtores() e carregarAtores() quando a página index.html carregar (se estiver na index.html) - **CARREGARATORES() REMOVIDO!**
if (document.location.pathname.endsWith('index.html') || document.location.pathname.endsWith('/')) { // Verifica se o caminho da página termina com 'index.html' ou é a raiz '/'
    carregarUltimosAtores(); // Carrega e exibe os últimos 10 atores no div "ultimos-atores"
    // REMOVIDO: carregarAtores(); // Carrega e exibe TODOS os atores no div "atores-lista" (se quiser manter a lista completa)
}


// Função para pré-visualizar a imagem (MANTER - FUNCIONALIDADE INALTERADA)
function previewImage() {
    const fotoInput = document.getElementById("foto-input"); // Use o ID correto: foto-input
    const imagePreview = document.getElementById("image-preview");
    const imagePreviewContainer = document.getElementById("image-preview-container");

    if (fotoInput.value) {
        // Define o src da imagem como o valor do input
        imagePreview.src = fotoInput.value;
        imagePreview.style.display = "block"; // Mostra a imagem
    } else {
        // Oculta a imagem se o campo estiver vazio
        imagePreview.style.display = "none";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const extrairInfoButton = document.getElementById('extrair-info-btn');
    if (extrairInfoButton) {
        extrairInfoButton.addEventListener('click', extrairInformacoes);
    } else {
        console.error("Botão 'Extrair Informações' não encontrado!");
    }

    const fotoInput = document.getElementById('foto-input');
    if (fotoInput) {
        fotoInput.addEventListener('input', previewImage); // Attach previewImage to input event
    } else {
        console.error("Input 'foto' não encontrado!");
    }

    const adicionarAtorButton = document.getElementById('adicionar-ator-btn');
    if (adicionarAtorButton) {
        adicionarAtorButton.addEventListener('click', adicionarAtor); // Attach adicionarAtor to click event
    } else {
        console.error("Botão 'Adicionar Ator' não encontrado!");
    }
});
