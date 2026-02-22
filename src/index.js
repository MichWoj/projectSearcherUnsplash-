
import './scss/partials/index.scss'
import { initializeCollectionsTab, initializePhotosTab, initializeTabs, initializeUserTab } from './js/components/tabs'; 

initializeTabs('#my-js-tabs', [initializePhotosTab, initializeCollectionsTab, initializeUserTab]);