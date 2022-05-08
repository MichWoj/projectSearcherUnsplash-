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
            autocompleteResults.innerHTML = '';
            for (const collection of collections.results) {
            const rowDiv = createRow(collection);
            rowDiv.addEventListener('click', () => {
            handleAutocompleteSelect(collection.id);
            });
            autocompleteResults.appendChild(rowDiv);
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
            id: 'nnnn',
            class: 'autocomplete__result-row',
            
            //onclick : "alert(' Kliknąłeś link! ')"
            });

            const titleSpan = createElement('span', {
            class: 'autocomplete__result-title',
            //onclick : "alert('text!!!')"
            });
            titleSpan.innerText = user.name;

            const img = createElement('img',{
            id:'1',
            class: 'autocomplete__result-thumb',
            //onClick : "alert('obrazek!!!')",
            src: user.profile_image.medium
            });

            
            
            const prop = createElement('prop',{
                class: 'properties',
            })
            prop.innerHTML = "Imię: " + user.first_name 

            const prop1 = createElement('prop1',{
                class: 'properties1',
            })
            prop1.innerHTML = " Nazwisko:  " + user.last_name 

            const prop2 = createElement('prop2',{
                class: 'properties2',
            })
            prop2.innerHTML = " Adres: " + user.portfolio_url 

            const prop3 = createElement('prop3',{
                class: 'properties3',
            })
            prop3.innerHTML = " Ilość zdjęć: " + user.total_photos

            const prop4 = createElement('prop4',{
                class: 'properties3',
            })
            prop4.innerHTML = " Ilość like: " + user.total_likes

            rowDiv.appendChild(titleSpan);
            rowDiv.appendChild(img);
            rowDiv.appendChild(prop);
            rowDiv.appendChild(prop1);
            rowDiv.appendChild(prop2);
            rowDiv.appendChild(prop3);
            rowDiv.appendChild(prop4);

            return rowDiv;
            };

            //=========================================================================
            const spans = document.querySelectorAll('span');

            spans.forEach((span) => {
            span.addEventListener('click', function() {
            this.textContent === span.name ? 
            this.textContent = 'show' :
            this.textContent = 'hide';

            const divInside1 = this.parentNode.querySelectorAll('prop'); //'prop1', 'prop2', 'prop3', 'prop4'
            divInside1.forEach((prop) => {
            const divDisplay1 = prop.style.display;
            (divDisplay1 === '' || divDisplay1 === 'block') ?
            hideDiv1(prop) : showDiv1(prop);
            });
            });
                });

            function hideDiv1(prop) {
            prop.style.display = 'none';
            }

            function showDiv1(prop) {
            prop.style.display = 'block';
            };


};
