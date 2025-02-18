import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js?v=20240126"; // IMPORTANTE: firebase-app.js (não compat)
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js?v=20240126"; // IMPORTANTE: firebase-firestore.js (não compat)

// Configuração do Firebase (COLE A SUA CONFIGURAÇÃO AQUI)
const firebaseConfig = {
  apiKey: "AIzaSyBZEffPMXgbSHYUUrNdIS5duAVGlKlmSq0",
  authDomain: "babes-392fd.firebaseapp.com",
  projectId: "babes-392fd",
  storageBucket: "babes-392fd.appspot.com",
  messagingSenderId: "376795361631",
  appId: "1:376795361631:web:d662f2b2f2cd23b115c6ea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Mesma função de teste que antes:
async function testAddDoc() {
    try {
        const docRef = await addDoc(collection(db, "test-collection"), { testField: "testValue" });
        console.log("Documento escrito com ID: ", docRef.id);
        alert("Teste addDoc bem-sucedido! Verifique o console.");
    } catch (error) {
        console.error("Erro ao adicionar documento: ", error);
        alert("Teste addDoc FALHOU! Verifique o console.");
    }
}

// Anexe a função de teste a um botão:
document.addEventListener('DOMContentLoaded', () => {
    const testButton = document.createElement('button');
    testButton.textContent = 'Testar addDoc (Modular)'; // Texto do botão alterado
    testButton.addEventListener('click', testAddDoc);
    document.body.appendChild(testButton);
});
