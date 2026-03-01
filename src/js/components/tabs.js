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

   export function initializePhotosTab() {
    const searchInput = document.querySelector('#photos-tab input');
    const colorSelect = document.querySelector('#photos-tab select');
    const selectButton = document.querySelector('#photos-tab button');
    const results = document.querySelector('#photos-tab .photos-tab__results');

    selectButton.addEventListener('click', () => {
    searchPhotos(searchInput.value, colorSelect.value)
    .then((photos) => {
    results.innerHTML = '';

    for (const photo of photos.results) {
    const img = createElement('img', {
    src: photo.urls.thumb
    });

    results.appendChild(img);
    }
    });
    });
   }

    export function initializeCollectionsTab() {
    const searchInput = document.querySelector('#collections-tab input');
    const autocompleteResults = document.querySelector('#collections-tab .autocomplete__results');
    const results = document.querySelector('#collections-tab .photos-tab__results');

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
            results.innerHTML = '';
            for (const collection of collections.results) {
            const rowDiv = createRow(collection);
            rowDiv.addEventListener('click', () => {
            handleAutocompleteSelect(collection.id);
            });
            results.appendChild(rowDiv);
            }
            console.log(collections);
            });
            }, 200);
            });

            
            function handleAutocompleteSelect(collectionId) {
            getCollectionPictures(collectionId)
            .then((pictures) => {
            console.log(pictures);
            });
            }
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
            getCollectionPictures(userId)
            .then((pictures1) => {
            console.log(pictures1);
            });
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
        src: user.profile_image.large // medium może być za małe do szerokiego gridu
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