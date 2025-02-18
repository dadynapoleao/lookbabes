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

// Function to load the latest 15 actors from Firestore and display in the "ultimos-atores" div (MODIFIED FOR NEW LAYOUT)
async function carregarUltimosAtores() {
    try {
        const snapshot = await getDocs(query(collection(db, "atores"), orderBy('timestamp', 'desc'), limit(15))); // Changed limit to 15
        const ultimosAtores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Includes document ID
        mostrarAtores("ultimos-atores", ultimosAtores); // Calls mostrarAtores for the "ultimos-atores" div
    } catch (error) {
        console.error("Erro ao carregar últimos 15 atores do Firestore: ", error); // Updated error message
        alert("Erro ao carregar últimos atores do Firebase. Veja a consola para mais detalhes.");
    }
}

// Function to load ALL actors from Firestore and display on index.html page (MODIFIED TO FETCH FROM FIRESTORE)
async function carregarAtores() {
    try {
        const snapshot = await getDocs(collection(db, "atores")); // Busca todos os documentos da coleção 'atores'
        const todosAtores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Includes document ID
        mostrarAtores("atores-lista", todosAtores); // Calls mostrarAtores for the "atores-lista" div (if you still want to show all)
    } catch (error) {
        console.error("Erro ao carregar todos os atores do Firestore: ", error);
        alert("Erro ao carregar todos os atores do Firebase. Veja a consola para mais detalhes.");
    }
}

// Function to display actors on the main page
function mostrarAtores(containerId, atoresParaMostrar) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Elemento '${containerId}' não encontrado na página!`);
        return;
    }
    container.innerHTML = "";

    if (!atoresParaMostrar || atoresParaMostrar.length === 0) {
        container.innerHTML = "<p>Nenhum ator encontrado.</p>";
        return;
    }

    atoresParaMostrar.forEach((ator) => {
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

// Function to add a new actor
async function adicionarAtor() {
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
    const foto = document.getElementById("foto-input").value;

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

    try {
        await addDoc(collection(db, "atores"), novoAtor);
        alert("Ator adicionado com sucesso e salvo no Firebase!");
        window.location.href = 'index.html'; // Redirect after adding
    } catch (error) {
        console.error("Erro ao adicionar ator ao Firestore: ", error);
        alert("Erro ao salvar ator no Firebase. Veja a consola para mais detalhes.");
        return;
    }
}


// Function to extract information (remains unchanged)
function extrairInformacoes() { /* ... your extrairInformacoes function code ... */ }

// Function to preview image (remains unchanged)
function previewImage() { /* ... your previewImage function code ... */ }


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('extrair-info-btn')?.addEventListener('click', extrairInformacoes);
    document.getElementById('foto-input')?.addEventListener('input', previewImage);
    document.getElementById('adicionar-ator-btn')?.addEventListener('click', adicionarAtor);

    if (document.location.pathname.endsWith('index.html') || document.location.pathname.endsWith('/')) {
        carregarUltimosAtores();
    }

    if (document.location.pathname.endsWith('ator.html')) {
        // carregarDetalhesAtor(); // You need to implement carregarDetalhesAtor if needed on ator.html
    }
});
