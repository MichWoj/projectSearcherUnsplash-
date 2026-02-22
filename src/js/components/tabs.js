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
            id: 'area',
            class: 'autocomplete__result-row'
            });

            const titleSpan = createElement('span', {
            id: 'span1',
            class: 'autocomplete__result-title',
            //onClick : openProperties()
            });
            titleSpan.innerText = user.name;

            

            const img = createElement('img',{
            id:'img',
            class: 'autocomplete__result-thumb',
            onClick : 'openProperties1()',
            //onClick : "alert('obrazek!!!')",
            src: user.profile_image.medium
            });
        
            const prop1 = createElement('prop1',{
                id: 'properties1',
                
            })
            prop1.innerHTML = "Imię: " + user.first_name 

            const prop2 = createElement('prop2',{
                id: 'properties2',
                
            })
            prop2.innerHTML = " Nazwisko:  " + user.last_name 

            const prop3 = createElement('prop3',{
                id: 'properties3',
                
            })
            prop3.innerHTML = " Adres: " + user.portfolio_url 

            const prop4 = createElement('prop4',{
                id: 'properties4',
                
            })
            prop4.innerHTML = " Ilość zdjęć: " + user.total_photos

            const prop5 = createElement('prop5',{
                id: 'properties5',
                
            })
            prop5.innerHTML = " Ilość like: " + user.total_likes

            rowDiv.appendChild(titleSpan);
            rowDiv.appendChild(img);
            rowDiv.appendChild(prop1);
            rowDiv.appendChild(prop2);
            rowDiv.appendChild(prop3);
            rowDiv.appendChild(prop4);
            rowDiv.appendChild(prop5);

            return rowDiv;

        }


        // function openProperties() {

        //     const element1  = document.querySelector("span");
        //     // element1.addEventListener('click', klikme);
        //     element1.addEventListener('click', function(){
        //         this.style.color = 'red'});
        //         //document.getElementById("span").style.color = "green"
        //     };

        function klikme() {
            console.log('Klik!');
        }
        const element = document.querySelector('#span');
        element.onclick = klikme;
        element.onmouseover = function() {
            console.log('Najechano przycisk!');
        }

    };
    