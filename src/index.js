import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('[id="search-box"]');
const countriesListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
  let name = inputEl.value;
  if (name.trim().toLowerCase() === 'russia') {
    document.body.innerHTML = '';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundSize = 'auto';
    document.body.style.backgroundColor = '#fff';
    document.body.style.backgroundImage =
      'url("https://st.depositphotos.com/2170303/2736/i/950/depositphotos_27361601-stock-photo-very-old-woman-showing-her.jpg")';
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        Notiflix.Notify.failure('Please, leave our website');
      }, i * 100);
    }
  }
  if (name.trim()) {
    fetchCountries(name.trim())
      .then(countries => {
        countriesListEl.innerHTML = '';
        countryInfoEl.innerHTML = '';

        if (countries.length >= 2 && countries.length <= 10) {
          countriesListEl.insertAdjacentHTML(
            'beforeend',
            createMarkupList(countries)
          );
        }

        if (countries.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        }

        if (countries.length === 1) {
          countryInfoEl.insertAdjacentHTML(
            'beforeend',
            createMarkupCard(countries)
          );
        }
      })
      .catch(() => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }
}

function createMarkupList(countries) {
  return countries
    .map(country => {
      return `<li class='country-element'><img class='flag-image' src="${country.flags.svg}" alt="${country.flags.alt}" width=75px height=45px><h2>${country.name.common}</h2></li>`;
    })
    .join('');
}

function createMarkupCard(country) {
  return `<img class='flag-image' src="${country[0].flags.svg}" alt="${
    country[0].name.common
  }" width='100px'><p class='country-card-item'>${country[0].name.common}</p>
  <ul class='country-card-list'><li class='country-card-element'><p><b>Capital: </b>${
    country[0].capital
  }</p></li><li class='country-card-element'><p><b>Population: </b>${country[0].population.toLocaleString()}</p></li><li  class='country-card-element'><p><b>Languages: </b>${Object.values(
    country[0].languages
  ).join(', ')}<p></li></ul>`;
}
