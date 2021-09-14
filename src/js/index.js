// =============================== //
const API_URL = "https://covid-api.mmediagroup.fr/v1/cases";

const btnSearch = document.getElementById("btn-searchCountry");

const tableBody = document.getElementById("table-body");
const countryInput = document.getElementById("input-country");

const NUMBER_FORMAT = new Intl.NumberFormat("de-DE");

let countrySession = JSON.parse(sessionStorage.getItem("itemsSession")) || [];

let countrySelected;

// =============================== //
const countryAlreadySaved = (countryName) => {

    if (countrySession.length === 0) {
        return false;
    }

    return countrySession.some(actualCountry => actualCountry.country === countryName);
};

const saveInSessionStorage = (country) => {

    countrySession.push(country);

    sessionStorage.setItem("itemsSession", JSON.stringify(countrySession));
};

function deleteItem(btnDelete, countryName) {

    btnDelete.addEventListener("click", () => {

        if (countrySession.length === 1) {

            countrySession = [];
            tableBody.innerHTML = ``;
            sessionStorage.clear();
            return;
        }
    
        countrySession = countrySession.filter(actualItem => actualItem.country !== countryName);
    
        sessionStorage.setItem("itemsSession", JSON.stringify(countrySession));
    
        loadSavedItems();
    });
}

const loadSavedItems = () => {

    tableBody.innerHTML = ``;

    if (countrySession.length === 0) {
        return;
    }

    for (const actualCountry of countrySession) {
        
        const newRow = document.createElement("tr");

        newRow.classList.add("index__container__data__wrapper__content__body__row");

        newRow.innerHTML = `
            <td>${actualCountry.country}</td>
            <td>${actualCountry.continent}</td>
            <td>${NUMBER_FORMAT.format(actualCountry.confirmed)}</td>
            <td>${NUMBER_FORMAT.format(actualCountry.deaths)}</td>
            <td>${NUMBER_FORMAT.format(actualCountry.population)}</td>
            <td><i class="fas fa-trash-alt index__container__data__wrapper__content__body__row__delete" id="btn-delete-${actualCountry.iso}"></i></td>
        `;

        tableBody.appendChild(newRow);

        const btnDelete = document.getElementById(`btn-delete-${actualCountry.iso}`);

        deleteItem(btnDelete, actualCountry.country);
    }
};

const loadAPI = () => {

    let wordInput = countryInput.value;
    countrySelected = wordInput.charAt(0).toUpperCase() + wordInput.slice(1).toLowerCase();

    countryInput.value = "";

    if (countrySelected.length === 0) {
        alert("Please, write a country to analyze.");
        return;
    }

    if (countryAlreadySaved(countrySelected)) {
        alert("That country was already analyzed.");
        return;
    }

    fetch(API_URL)
        .then(response => response.json())
        .then(loadData);
};

const loadData = (json) => {

    if (json[countrySelected] === undefined) {
        alert("Only valid countries.");
        return;
    }

    let finalCountry = json[countrySelected]["All"];

    saveInSessionStorage(finalCountry);

    loadSavedItems();
};

window.onload = () => {

    btnSearch.addEventListener("click", loadAPI);
    
    loadSavedItems();
};
