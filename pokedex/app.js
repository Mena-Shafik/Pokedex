const pokedex = document.getElementById("pokedex");

//console.log(pokedex);
//const url2 = `https://pokeapi.co/api/v2/pokemon-species/`;

function fetchKantoPokemon() {
  const promises = [];
  const promises2 = [];
  for (let i = 1; i <= 151; i++) {
    console.log("Fetching Kanto Pokemon!");
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    const url2 = `https://pokeapi.co/api/v2/pokemon-species/${i}`;
    promises.push(fetch(url).then(res => res.json()));
    promises2.push(fetch(url2).then(res => res.json()));
  }
  var pokemon;
  var flavourText;
  Promise.all(promises)
    .then(results => {
      console.log(results);
      //console.log(results[1]);
      pokemon = results.map(data => ({
        name: data.species.name,
        id: data.id,
        image: data.sprites["front_default"],
        type: data.types.map(type => type.type.name),
        weight: data.weight / 10
      }));
    })
    .then(
      Promise.all(promises2).then(results => {
        flavourText = results.map(data => ({
          text: grabText("en", "soulsilver", data),
          evoUrl: data.evolution_chain.url
        }));

        //console.log(pokemon);
        displayPokemon(pokemon, flavourText, 1);
      })
    );
}

/* function evo(url)
{
  var evo;
  var rawdata = '';
    const evoinfo = fetch(url).then(res => res.json());
    rawdata = $.get(url, function(data, status) {
      evo = data.map(d =>({
        to: d.chain.evolves_to.s
      }))
      return data;
      
    });
    return evo;
} */

/* function getText(url) {
  var rawdata= "";
  jQuery.ajaxSetup({ async: false });
  var rawdata = $.get(url, function(data, status) {
    return data;
  });
  rawData = grabText("en", "soulsilver", rawdata.responseJSON);
  return rawData; 
 } */

function getText(url) {
  return fetch(url)
    .then(res => res.json())
    .then(data => {
      rawData = grabText("en", "soulsilver", data);
      //console.log(grabText("en", "soulsilver", data));
      console.log(rawData);
      return data;
    });
}

function grabText(language, version, data) {
  //console.log(data);
  for (let i = 0; i < data.flavor_text_entries.length; i++) {
    if (language == data.flavor_text_entries[i].language.name && version == data.flavor_text_entries[i].version.name) {
      //console.log(data2.flavor_text_entries[i].flavor_text.replace(/\n/g, " "));
      return data.flavor_text_entries[i].flavor_text.replace(/\n/g, " ");
    }
  }
}

function fetchJohtoPokemon() {
  const promises = [];
  const promises2 = [];
  for (let i = 152; i <= 251; i++) {
    console.log("Fetching Johto Pokemon!");
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    const url2 = `https://pokeapi.co/api/v2/pokemon-species/${i}`;
    promises.push(fetch(url).then(res => res.json()));
    promises2.push(fetch(url2).then(res => res.json()));
  }
  var pokemon;
  var flavourText;
  Promise.all(promises)
    .then(results => {
      //console.log(results);
      pokemon = results.map(data => ({
        name: data.species.name,
        id: data.id,
        image: data.sprites["front_default"],
        type: data.types.map(type => type.type.name)
        //desc: getText(url2 + data.id)
      }));
      console.log(pokemon);
      //displayPokemon(pokemon);
    })
    .then(
      Promise.all(promises2).then(results2 => {
        //console.log(results2);
        flavourText = results2.map(data2 => ({
          text: grabText("en", "soulsilver", data2)
        }));
        console.log(flavourText);
        displayPokemon(pokemon, flavourText, 152);
      })
    );
}

function fetchHoennPokemon() {
  const promises = [];
  const promises2 = [];
  for (let i = 252; i <= 386; i++) {
    console.log("Fetching Hoenn Pokemon!");
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    const url2 = `https://pokeapi.co/api/v2/pokemon-species/${i}`;
    promises.push(fetch(url).then(res => res.json()));
    promises2.push(fetch(url2).then(res => res.json()));
  }
  var pokemon;
  var flavourText;
  Promise.all(promises)
    .then(results => {
      //console.log(results);
      pokemon = results.map(data => ({
        name: data.species.name,
        id: data.id,
        image: data.sprites["front_default"],
        type: data.types.map(type => type.type.name)
      }));
      //console.log(pokemon);
      //displayPokemon(pokemon, flavourText, 252);
    })
    .then(
      Promise.all(promises2).then(results => {
        //console.log(results2);
        flavourText = results.map(data => ({
          text: grabText("en", "soulsilver", data)
        }));
        console.log(flavourText);
        displayPokemon(pokemon, flavourText, 252);
      })
    );
}

function displayPokemon(pokemon, flavourText, offset) {
  console.log("display");
  //console.log(flavourText[0].text);
  /*  waves-effect waves-light */
  //-----
  //console.log(flavourText[99].text);
  //-----
  const pokemonHTMLString = pokemon
    .map(
      pkmn => `
    <a id="modalBtn" pkmn="${pkmn.id}" onclick="openModal(${pkmn.id}, '${flavourText[pkmn.id - offset].text}')">
    <li class="card bk${pkmn.id}">
    
        <h2 class="card-id" >#${pad(pkmn.id, 3)}</h2>
        <img class="card-image" src="./images/${pad(pkmn.id, 3)}.png"/>
        <h2 class="card-title" >${capitalize(pkmn.name)}</h2>
        <div class="card-subtitle">${type(pkmn)}</div>
       
    </li></a>
    `
    )
    .join("");
  pokedex.innerHTML = "";
  pokedex.innerHTML = pokemonHTMLString;
}
/* ${flavourText[(pkmn.id-1)].text.toString()} */

var modal = document.getElementById("pkmnEntry");
var modalBtn = document.getElementById("modalBtn");
var closeBtn = document.getElementsByClassName("closeBtn")[0];

//modalBtn.addEventListener('click', openModal);
//loseBtn.addEventListener("click", closeModal);
window.addEventListener("click", outsideClick);

function openModal(num, text) {
  const content = document.getElementById("pkContent");
  console.log("open");
  modal.style.display = "block";
  //console.log(text);
  var pk = `
  <span class="closeBtn" onclick="closeModal()">&times;</span>
    <img class="pkmnEntry-image" src="./images/${pad(num, 3)}.png" />
    <div class="stats">
      <p class="temp">Height</p>
      <p class="temp">Weight</p>
      <p class="temp">Abilities</p>
      <p class="temp">00 Kg</p>
      <p class="temp">00 m</p>
      <p class="temp">Overgrow</p>
    </div>
    <div class="Specs">
      <p class="battle-stat"> HP:00</p>
      <p class="battle-stat">ATK:00</p>
      <p class="battle-stat">DEF:00</p>
      <p class="battle-stat">SPD:00</p>
      <p class="battle-stat">SPA:00</p>
      <p class="battle-stat">SPD:00</p>
    </div>
    <div class="description">
      <p class="desc">${text}</p>
    </div>
    <div class="evolution">
      <img class="evo-image1" src="./images/${pad(num, 3)}.png" />
      <img class="evo-image1" src="./images/${pad(num + 1, 3)}.png" />
      <img class="evo-image1" src="./images/${pad(num + 2, 3)}.png" />
    </div>
  `;
  /* <p>${<p>${flavourText[num - 1].text}</p> */
  content.innerHTML = pk;
}

function closeModal() {
  console.log("close");
  modal.style.display = "none";
}

function outsideClick(e) {
  console.log("close");
  if (e.target == modal) {
    modal.style.display = "none";
  }
}

function pad(str, max) {
  //console.log(str);
  str = str.toString();
  //console.log(str);
  return str.length < max ? pad("0" + str, max) : str;
}

const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

function type(pkmn) {
  var spanString = "";
  for (var i = 0; i < pkmn.type.length; i++) {
    spanString += `<span class="type" id="${pkmn.type[i]}">${capitalize(pkmn.type[i]).trim()}</span>`;
  }
  return spanString;
}

fetchKantoPokemon();
