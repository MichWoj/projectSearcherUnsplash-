import JsTabs from 'js-tabs'
import { createElement } from '../helpers/document.helper';
import { getCollectionPictures, getUserPictures, searchCollections, searchPhotos, searchUsers } from '../services/unsplash'

export function initializeTabs(elm, tabFuncs) { 
    const myTabs = new JsTabs({
    elm
    });

    myTabs.init();
    if (tabFuncs) {
    for (const func of tabFuncs) {
    func();
    }
    }
   }

// Wspólna funkcja renderowania zdjęć (jak w index.js)
function renderPhotos(photos, container) {
    if (photos.length === 0) {
        container.innerHTML = '<p>Brak wyników dla podanych kryteriów.</p>';
        return;
    }

    container.innerHTML = photos.map(photo => `
        <div class="photo-item" style="display: inline-block; margin:10px">
            <img src="${photo.urls.small}" alt="${photo.alt_description || 'Unsplash Photo'}" 
                 style="width: 250px; height: 200px; object-fit: cover; border-radius: 20px;">
        </div>
    `).join('');
}

   export function initializePhotosTab() {
    const searchInput = document.querySelector('#photos-tab input');
    const colorSelect = document.querySelector('#photos-tab select');
    const selectButton = document.querySelector('#photos-tab button');
    const results = document.querySelector('#photos-tab .photos-tab__results');

    selectButton.addEventListener('click', () => {
    searchPhotos(searchInput.value, colorSelect.value)
    .then((photos) => {
    renderPhotos(photos.results, results);
    });
    });
   }

    export function initializeCollectionsTab() {
    const searchInput = document.querySelector('#collections-tab input');
    const autocompleteResults = document.querySelector('#collections-tab .autocomplete__results');
    const collectionsResults = document.querySelector('#collections-tab .collections-tab__results');

    let debounceTimeout; 

    searchInput.addEventListener('focus', () => {
    autocompleteResults.classList.remove('hide');
    });

    document.addEventListener('click', (event) => {
    if (event.target == searchInput || autocompleteResults.contains(event.target)) {return;}
    autocompleteResults.classList.add('hide');
    })

    searchInput.addEventListener('keyup', () => {
        if (debounceTimeout) {
        clearTimeout(debounceTimeout);
        }
        debounceTimeout = setTimeout(() => {
            searchCollections(searchInput.value)
            .then((collections) => {
            autocompleteResults.innerHTML = '';

            for (const collection of collections.results) {
            const rowDiv = createRow(collection);
            rowDiv.addEventListener('click', () => {
            handleAutocompleteSelect(collection.id);
            });
            autocompleteResults.appendChild(rowDiv);
            }
            });
            }, 200);
            });

            
            function handleAutocompleteSelect(collectionId) {
            // Pokaż loader w kontenerze wyników
            collectionsResults.innerHTML = '<p>Ładowanie zdjęć kolekcji…</p>';
            autocompleteResults.classList.add('hide');

            getCollectionPictures(collectionId)
            .then((pictures) => {
            renderCollectionPhotos(pictures);
            })
            .catch((error) => {
            console.error('Błąd ładowania zdjęć kolekcji:', error);
            collectionsResults.innerHTML = '<p>Nie udało się załadować zdjęć.</p>';
            });
            }

            function renderCollectionPhotos(pictures) {
            if (!pictures || pictures.length === 0) {
            collectionsResults.innerHTML = '<p>Brak zdjęć w tej kolekcji.</p>';
            return;
            }

            renderPhotos(pictures, collectionsResults);
            }

            function openModal(contentHtml) {
            const modal = document.getElementById('photo-modal');
            const modalGrid = modal.querySelector('.modal__grid');

            if (contentHtml) {
            modalGrid.innerHTML = contentHtml;
            }

            modal.classList.remove('hide');
            }

            function closeModal() {
            const modal = document.getElementById('photo-modal');
            modal.classList.add('hide');
            }

            // Zamknięcie modal przy kliknięciu w overlay lub krzyżyk
            const modal = document.getElementById('photo-modal');
            modal.addEventListener('click', (event) => {
            const action = event.target.getAttribute('data-action');
            if (action === 'close') {
            closeModal();
            }
            });

            function createRow(colection) {
            const rowDiv = createElement('div', {
            class: 'autocomplete__result-row'
            });
            const titleSpan = createElement('span', {
            class: 'autocomplete__result-title'
            });
            titleSpan.innerText = colection.title;
            const img = createElement('img', {
            class: 'autocomplete__result-thumb',
            src: colection.cover_photo.urls.thumb
            });
            rowDiv.appendChild(titleSpan);
            rowDiv.appendChild(img);
            return rowDiv;
            };

};

//=============================
export function initializeUserTab() {
    const searchInput = document.querySelector('#user-tab input');
    const autocompleteResults = document.querySelector('#user-tab .autocomplete__results');
    const results = document.querySelector('#user-tab .photos-tab__results');

    let debounceTimeout1; 

    searchInput.addEventListener('focus', () => {
    autocompleteResults.classList.remove('hide');
    });

    document.addEventListener('click', (event) => {
    if (event.target == searchInput || autocompleteResults.contains(event.target)) {return;}
    autocompleteResults.classList.add('hide');
    })


    searchInput.addEventListener('keyup', () => {
        if (debounceTimeout1) {
        clearTimeout(debounceTimeout1);
        }

        debounceTimeout1 = setTimeout(() => {
            searchUsers(searchInput.value)
            .then((users) => {
            autocompleteResults.innerHTML = '';

            for (const user of users.results) {
            const rowDiv =createRow(user);

            rowDiv.addEventListener('click', () => {
            handleAutocompleteSelect(user.id);
            });

            autocompleteResults.appendChild(rowDiv);
            }
            console.log(users);
            });
            }, 200);
            });
      

            function handleAutocompleteSelect(userId) {
            // Pokaż loader w pop-upie
            openModal('<p>Ładowanie zdjęć użytkownika…</p>');
            autocompleteResults.classList.add('hide');

            getUserPictures(userId)
            .then((pictures) => {
            renderUserPhotos(pictures);
            })
            .catch((error) => {
            console.error('Błąd ładowania zdjęć użytkownika:', error);
            openModal('<p>Nie udało się załadować zdjęć.</p>');
            });
            }

            function renderUserPhotos(pictures) {
            const modalGrid = document.querySelector('#photo-modal .modal__grid');

            if (!pictures || pictures.length === 0) {
            openModal('<p>Brak zdjęć tego użytkownika.</p>');
            return;
            }

            renderPhotos(pictures, modalGrid);
            openModal();
            }

function createRow(user) {
    const rowDiv = createElement('div', {
        class: 'autocomplete__result-row'
    });

    const titleSpan = createElement('span', {
        class: 'autocomplete__result-title'
    });
    titleSpan.innerText = user.name;

    const img = createElement('img', {
        class: 'autocomplete__result-thumb',
        src: user.profile_image.large // medium może być za małe do szerokiego gridu,
        
    });

    // NOWOŚĆ: Jeden kontener na wszystkie dane (szczegóły)
    const detailsDiv = createElement('div', { class: 'user-details' });
    
    detailsDiv.innerHTML = `
        <p>Imię: ${user.first_name || ''}</p>
        <p>Nazwisko: ${user.last_name || ''}</p>
        <p>Adres: ${user.portfolio_url || 'Brak'}</p>
        <p>Zdjęcia: ${user.total_photos}</p>
        <p>Like: ${user.total_likes}</p>
    `;

    rowDiv.appendChild(img); // Najpierw zdjęcie
    rowDiv.appendChild(titleSpan); // Potem tytuł
    rowDiv.appendChild(detailsDiv); // Na końcu detale

    return rowDiv;
}
}