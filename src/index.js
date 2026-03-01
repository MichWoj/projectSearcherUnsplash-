
import './scss/partials/index.scss'
import { initializeCollectionsTab, initializePhotosTab, initializeTabs, initializeUserTab } from './js/components/tabs'; 

initializeTabs('#my-js-tabs', [initializePhotosTab, initializeCollectionsTab, initializeUserTab]);

import { searchPhotos } from './js/services/unsplash.js';

// Selektory dopasowane do Twojego HTML
const photoInput = document.querySelector('#photos-tab input');
const colorSelect = document.querySelector('#photos-tab select');
const searchButton = document.querySelector('#photos-tab .button-24');
const resultsContainer = document.querySelector('.photos-tab__results');

async function handleSearch() {
    const query = photoInput.value.trim();
    const color = colorSelect.value;

    if (!query) {
        alert("Wpisz czego szukasz!");
        return;
    }

    // Wyświetlamy loader lub czyścimy stare wyniki
    resultsContainer.innerHTML = '<p>Szukam...</p>';

    try {
        const data = await searchPhotos(query, color);
        renderPhotos(data.results);
    } catch (error) {
        console.error("Błąd podczas pobierania zdjęć:", error);
        resultsContainer.innerHTML = '<p>Wystąpił błąd podczas pobierania zdjęć.</p>';
    }
}

function renderPhotos(photos) {
    if (photos.length === 0) {
        resultsContainer.innerHTML = '<p>Brak wyników dla podanych kryteriów.</p>';
        return;
    }

    resultsContainer.innerHTML = photos.map(photo => `
        <div class="photo-item" style="display: inline-block; margin: 10px;">
            <img src="${photo.urls.small}" alt="${photo.alt_description || 'Unsplash Photo'}" 
                 style="width: 250px; height: 200px; object-fit: cover; border-radius: 20px;">
        </div>
    `).join('');
}

// 1. Szukaj po kliknięciu przycisku
searchButton.addEventListener('click', handleSearch);

// 2. Szukaj po zmianie koloru w select
colorSelect.addEventListener('change', handleSearch);

// 3. Szukaj po wciśnięciu Enter
photoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});