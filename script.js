// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js?v=20240126";
import { getFirestore, collection, addDoc, getDocs, orderBy, limit, serverTimestamp, doc, getDoc, query } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore-compat.js?v=20240126";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBZEffPMXgbSHYUUrNdIS5duAVGlKlmSq0",
    authDomain: "babes-392fd.firebaseapp.com",
    projectId: "babes-392fd",
    storageBucket: "babes-392fd.appspot.com",
    messagingSenderId: "376795361631",
    appId: "1:376795361631:web:d662f2b2f2cd23b115c6ea",
    measurementId: "SEU_MEASUREMENT_ID" // OPCIONAL: Set if you use Google Analytics in Firebase
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Array to store actors locally (KEEP FOR LOCAL PERSISTENCE - OPTIONAL)
let atoresLocal = [];

// Function to save actors to localStorage (KEEP FOR LOCAL PERSISTENCE - OPTIONAL)
function salvarAtoresLocal() {
    localStorage.setItem("atores", JSON.stringify(atoresLocal));
}

// Function to load actors from localStorage (KEEP FOR LOCAL PERSISTENCE - OPTIONAL)
function carregarAtoresLocal() {
    const salvos = localStorage.getItem("atores");
    if (salvos) {
        atoresLocal = JSON.parse(salvos);
        mostrarAtores(); // Attention: mostrarAtores() might need adjustments depending on where you want to display these local actors
    }
}

// Function to display actors on the main page (MODIFIED FOR NEW LAYOUT AND CONTAINER ID AND WITHOUT LABELS AND CLICKABLE CARDS)
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
        container.innerHTML = "<p>Nenhum ator encontrado.</p>"; // Message if no actors found
        return;
    }

    atoresParaMostrar.forEach((ator, index) => {
        const cardLink = document.createElement("a"); // Create an 'a' element (link)
        cardLink.href = `ator.html?id=${ator.id}`; // Set the link to ator.html, passing the actor ID as a parameter
        cardLink.style.textDecoration = 'none'; // Remove default link underline

        const card = document.createElement("div");
        card.className = "ator-card";

        // New card layout: Image, Name, Nationality, Age (ALL VERTICALLY TOGETHER, WITHOUT LABELS)
        card.innerHTML = `
            <img src="${ator.foto}" alt="${ator.nome}" class="ator-foto">
            <h3 class="ator-nome-card">${ator.nome}</h3>
            <div class="ator-info-stack">
                <p class="ator-nacionalidade-card">${ator.pais}</p>
                <p class="ator-idade-card">${ator.idade} anos</p>
            </div>
        `;

        cardLink.appendChild(card); // Add the card as a child of the link
        container.appendChild(cardLink); // Add the link (containing the card) to the container
    });
}


// Function to add a new actor (MODIFIED - WITHOUT DIRECT CALL TO mostrarAtores and WITH REDIRECTION)
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
    const foto = document.getElementById("foto-input").value; // Use the correct ID: foto-input

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
        timestamp: serverTimestamp()
    };

    // Save to Firestore
    try {
        const docRef = await addDoc(collection(db, "atores"), novoAtor); // Get DocumentReference after adding
        console.log("Ator adicionado ao Firestore com sucesso, ID:", docRef.id);
        alert("Ator adicionado com sucesso e salvo no Firebase!");
    } catch (error) {
        console.error("Erro ao adicionar ator ao Firestore: ", error);
        alert("Erro ao salvar ator no Firebase. Veja a consola para mais detalhes.");
        return;
    }

    // Redirect to index.html after adding the actor
    window.location.href = 'index.html';

    // Clear the form after adding (keep this part)
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
    document.getElementById("foto-input").value = ""; // Use the correct ID: foto-input
}


// Function to remove an actor (KEEP - LOCAL REMOVAL NOW NOT RELEVANT FOR FIREBASE LIST)
function removerAtor(index) {
    if (confirm("Tem certeza de que deseja remover este ator?")) {
        atoresLocal.splice(index, 1); // Using atoresLocal here
        salvarAtoresLocal(); // Using salvarAtoresLocal here
        mostrarAtores(); // Here you need to decide where and how you want to show these local actors, `mostrarAtores()` as it is might not work directly.
    }
}


// Function to extract information from text and automatically fill the fields (KEEP - EXTRACTION FUNCTIONALITY UNCHANGED)
function extrairInformacoes() {
    console.log("extrairInformacoes() chamada"); // For debug
    const texto = document.getElementById("info-texto").value;

    // Updated regular expressions to find the information
    const idadeMatch = texto.match(/Age:\s*(\d+)/);
    // Adjusted regular expression for the format "Born: Monday 24th of January 1994"
    const nascimentoMatch = texto.match(/Born:\s*(?:[A-Za-z]+\s+)?(\d{1,2})(?:th|st|nd|rd)?\s+of\s+([A-Za-z]+)\s+(\d{4})/i);
    const birthplaceMatch = texto.match(/Birthplace:\s*(.*)/); // Captures the entire "Birthplace" line
    const etniaMatch = texto.match(/Ethnicity:\s*([\w\s]+)(?=[,\n:])/); // Ethnicity (up to comma, newline or colon)
    const cabeloMatch = texto.match(/Hair color:\s*([\w\s]+)(?=[,\n:])/); // Hair color (up to comma, newline or colon)
    const olhosMatch = texto.match(/Eye color:\s*([\w\s]+)(?=[,\n:])/); // Eye color (up to comma, newline or colon)
    const alturaMatch = texto.match(/Height:\s*(?:[\d'"]+.*?\d{1,2}\s?cm|[\d]+(?:\.\d+)?\s?cm)/); // Height (only numbers in cm)
    const pesoMatch = texto.match(/Weight:\s*(?:[\d]+(?:\.\d+)?\s?lbs \(or\s([\d]+)\s?kg\)|[\d]+(?:\.\d+)?\s?kg)/); // Weight (only numbers in kg)
    const tipoCorpoMatch = texto.match(/Body type:\s*([\w\s]+)(?=[,\n:])/); // Body type (up to comma, newline or colon)
    const medidasMatch = texto.match(/Measurements:\s*([\dA-Za-z\-]+)/); // Measurements

    // Function to extract the country from the "Birthplace" line
    function extrairPais(birthplace) {
        if (!birthplace) return "N/A"; // If there is no "Birthplace" line, return "N/A"
        const partes = birthplace.split(","); // Divide a string pelos separadores (vírgulas)
        const pais = partes[partes.length - 1].trim(); // Pega o último elemento e remove espaços extras
        return pais || "N/A"; // Retorna "N/A" se estiver vazio
    }

    // Function to clean and extract ethnicity
    function limparEtnia(etnia) {
        if (!etnia) return "N/A"; // If there is no value, return "N/A"
        return etnia.trim().replace(/[,;:\n].*/, "") || "N/A"; // Remove delimitadores e retorna "N/A" se vazio
    }

    // Function to clean and extract hair color
    function limparCorCabelo(corCabelo) {
        if (!corCabelo) return "N/A"; // If there is no value, return "N/A"
        return corCabelo.trim().replace(/[,;:\n].*/, "") || "N/A"; // Remove delimitadores e retorna "N/A" se vazio
    }

    // Function to clean and extract eye color
    function limparCorOlhos(corOlhos) {
        if (!corOlhos) return "N/A"; // If there is no value, return "N/A"
        return corOlhos.trim().replace(/[,;:\n].*/, "") || "N/A"; // Remove delimitadores e retorna "N/A" se vazio
    }

    // Function to clean and extract height in centimeters
    function limparAltura(altura) {
        if (!altura) return "N/A"; // If there is no value, return "N/A"
        const match = altura.match(/(\d+)\s?cm/); // Captura apenas o número antes de "cm"
        return match ? match[1] : "N/A"; // Retorna o número ou "N/A" se não encontrado
    }

    // Function to clean and extract weight in kilograms
    function limparPeso(peso) {
        if (!peso) return "N/A"; // If there is no value, return "N/A"
        const match = peso.match(/(\d+)\s?kg/); // Captura apenas o número antes de "kg"
        return match ? match[1] : "N/A"; // Retorna o número ou "N/A" se não encontrado
    }

    // Function to clean and extract body type
    function limparTipoCorpo(tipoCorpo) {
        if (!tipoCorpo) return "N/A"; // If there is no value, return "N/A"
        return tipoCorpo.trim().replace(/[,;:\n].*/, "") || "N/A"; // Remove delimitadores e retorna "N/A" se vazio
    }

    // Function to clean and extract measurements
    function limparMedidas(medidas) {
        if (!medidas) return "N/A"; // Se não houver valor, retorna "N/A"
        return medidas.trim() || "N/A"; // Remove espaços extras e retorna "N/A" se vazio
    }

    // Filling the fields with the extracted information
    document.getElementById("nome").value = "N/A"; // Initializes with "N/A"
    document.getElementById("idade").value = "N/A";
    // document.getElementById("data-nascimento").value = ""; // REMOVED: Do not set default value for date
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
        // Extracts day, month, and year from the regex
        const dia = nascimentoMatch[1];
        const mesNome = nascimentoMatch[2];
        const ano = nascimentoMatch[3];

        // Converts month name to number (e.g., "January" to 1)
        const mesNumero = new Date(Date.parse(mesNome + " 1, 2000")).getMonth() + 1; // Using an arbitrary year for parsing
        const mesFormatado = mesNumero < 10 ? '0' + mesNumero : mesNumero; // Adds '0' if less than 10
        const diaFormatado = dia < 10 ? '0' + dia : dia; // Adds '0' if less than 10


        // Formats the date to YYYY-MM-DD (input type="date" format)
        const dataFormatada = `${ano}-${mesFormatado}-${diaFormatado}`;
        document.getElementById("data-nascimento").value = dataFormatada;
    }
    if (birthplaceMatch) {
        const pais = extrairPais(birthplaceMatch[1]); // Extracts the country from the "Birthplace" line
        document.getElementById("pais").value = pais;
    }
    if (etniaMatch) {
        const etnia = limparEtnia(etniaMatch[1]); // Cleans and extracts ethnicity correctly
        document.getElementById("etnia").value = etnia;
    }
    if (cabeloMatch) {
        const corCabelo = limparCorCabelo(cabeloMatch[1]); // Cleans and extracts hair color correctly
        document.getElementById("cor-cabelo").value = corCabelo;
    }
    if (olhosMatch) {
        const corOlhos = limparCorOlhos(olhosMatch[1]); // Cleans and extracts eye color correctly
        document.getElementById("cor-olhos").value = corOlhos;
    }
    if (alturaMatch) {
        const alturaCm = limparAltura(alturaMatch[0]); // Cleans and extracts only the value in centimeters
        document.getElementById("altura").value = alturaCm;
    }
    if (pesoMatch) {
        const pesoKg = limparPeso(pesoMatch[0]); // Cleans and extracts only the value in kilograms
        document.getElementById("peso").value = pesoKg;
    }
    if (tipoCorpoMatch) {
        const tipoCorpo = limparTipoCorpo(tipoCorpoMatch[1]); // Cleans and extracts only the body type
        document.getElementById("tipo-corpo").value = tipoCorpo;
    }
    if (medidasMatch) {
        const medidas = limparMedidas(medidasMatch[1]); // Cleans and extracts the measurements
        document.getElementById("medidas").value = medidas;
    }
}


// Function to load the latest 12 actors from Firestore and display in the div "ultimos-atores" (MODIFIED FOR NEW LAYOUT)
async function carregarUltimosAtores() {
    console.log("carregarUltimosAtores chamada"); // DEBUG
    try {
        const snapshot = await getDocs(query(collection(db, "atores"), orderBy('timestamp', 'desc'), limit(12)));

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
        console.log("Últimos 12 atores carregados do Firestore com sucesso!"); // Updated log message
    } catch (error) {
        console.error("Erro ao carregar últimos 12 atores do Firestore: ", error); // Updated error message
        alert("Erro ao carregar últimos atores do Firebase. Veja a consola para mais detalhes.");
    }
}


// Function to load ALL actors from Firestore and display on index.html page (MODIFIED TO FETCH FROM FIRESTORE)
async function carregarAtores() {
    try {
        const snapshot = await getDocs(collection(db, "atores")); // Busca todos os documentos da coleção 'atores'
        const todosAtores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Inclui o ID do documento
        mostrarAtores("atores-lista", todosAtores); // Chama mostrarAtores para o div "atores-lista" (se ainda quiser mostrar todos)
        console.log("Todos os atores carregados do Firestore com sucesso!");
    } catch (error) {
        console.error("Erro ao carregar todos os atores do Firestore: ", error);
        alert("Erro ao carregar todos os atores do Firebase. Veja a consola para mais detalhes.");
    }
}

// Function to load details of a specific actor for ator.html page
async function carregarDetalhesAtor() {
    const urlParams = new URLSearchParams(window.location.search);
    const atorId = urlParams.get('id');

    if (atorId) {
        try {
            const atorDoc = await getDoc(doc(db, "atores", atorId));

            if (atorDoc.exists()) {
                const atorDetalhes = atorDoc.data();
                // Preencher os campos na página ator.html com atorDetalhes
                document.getElementById("ator-nome").textContent = atorDetalhes.nome;
                document.getElementById("ator-foto-detalhe").src = atorDetalhes.foto;
                document.getElementById("ator-idade").textContent = atorDetalhes.idade;
                document.getElementById("ator-data-nascimento").textContent = atorDetalhes.dataNascimento;
                document.getElementById("ator-pais").textContent = atorDetalhes.pais;
                document.getElementById("ator-etnia").textContent = atorDetalhes.etnia;
                document.getElementById("ator-cor-cabelo").textContent = atorDetalhes.corCabelo;
                document.getElementById("ator-cor-olhos").textContent = atorDetalhes.corOlhos;
                document.getElementById("ator-altura").textContent = atorDetalhes.altura;
                document.getElementById("ator-peso").textContent = atorDetalhes.peso;
                document.getElementById("ator-tipo-corpo").textContent = atorDetalhes.tipoCorpo;
                document.getElementById("ator-medidas").textContent = atorDetalhes.medidas;
                document.getElementById("ator-nota").textContent = atorDetalhes.nota;
                // ... preencher outros campos conforme necessário
            } else {
                console.error("Ator não encontrado!");
                alert("Ator não encontrado.");
            }
        } catch (error) {
            console.error("Erro ao carregar detalhes do ator: ", error);
            alert("Erro ao carregar detalhes do ator do Firebase. Veja a consola para mais detalhes.");
        }
    } else {
        console.error("ID do ator não fornecido na URL.");
        alert("ID do ator não fornecido na URL.");
    }
}


// Chame carregarUltimosAtores() e carregarAtores() quando a página index.html carregar (se estiver na index.html) - **CARREGARATORES() REMOVIDO!**
if (document.location.pathname.endsWith('index.html') || document.location.pathname.endsWith('/')) { // Verifica se o caminho da página termina com 'index.html' ou é a raiz '/'
    carregarUltimosAtores(); // Carrega e exibe os últimos 12 atores no div "ultimos-atores"
    // REMOVIDO: carregarAtores(); // Carrega e exibe TODOS os atores no div "atores-lista" (se quiser manter a lista completa)
}

// Chame carregarDetalhesAtor() quando a página ator.html carregar
if (document.location.pathname.endsWith('ator.html')) {
    carregarDetalhesAtor();
}


// Function to preview the image (KEEP - FUNCTIONALITY UNCHANGED)
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
