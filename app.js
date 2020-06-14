const pokedex = document.getElementById("pokedex");
const searchBar = document.getElementById("searchBar");
let pkmnList = [];

searchBar.addEventListener('keyup', (e)=> {
  const searchString = e.target.value;
  console.log(searchString);
  //console.log(fliteredPkmnList);
  console.log(pkmnList);
  const fliteredPkmnList = pkmnList.filter( (list) => {
    return (list.name.includes(searchString.toLowerCase()) || list.type.includes((searchString.toLowerCase())) || list.id.toString().includes(searchString));
  });
  console.log(fliteredPkmnList);
  displayPokemon(fliteredPkmnList);
});

const pokeCache = {};
//console.log(pokedex);
const pokemonSpeciesBaseURL = `https://pokeapi.co/api/v2/pokemon-species/`;

/*fetch("pokedex.json")
  .then((response) => response.json())
  .then((json) => console.log(json));
  */

const fetchKantoPokemon = async () => {
  document.getElementById("pokeball-container").style.visibility = "visible";

  const url = `https://pokeapi.co/api/v2/pokemon?limit=151`;
  const res = await fetch(url);
  const data = await res.json();
  ;
  console.log("fetch kanto");
  //console.log(data);
  const pokemon = data.results.map((result, index) => ({
    name: checkName(result.name),
    id: index + 1,
    apiURL: result.url,
    /* type: getType(result.url) */
  }));

  for (const pk of pokemon) {
    var num = pokemon.indexOf(pk);
    pokemon[num].type = await getType(pk.apiURL);
    pkmnList = pokemon;
    
    //console.log(url2 + pokemon[num].id);
    
  }
  //console.log(pokemon);
  //console.log(pkmnList);
  displayPokemon(pokemon);
  setTimeout(function () {
    document.getElementById("pokeball-container").style.visibility = "hidden";
  }, 50);
};

const fetchJohtoPokemon = async () => {
  document.getElementById("pokeball-container").style.visibility = "visible";
  const url = `https://pokeapi.co/api/v2/pokemon?limit=100&offset=151`;
  const res = await fetch(url);
  const data = await res.json();
  console.log("fetch johto");
  //console.log(data);
  const pokemon = data.results.map((result, index) => ({
    name: checkName(result.name),
    id: index + 152,
    apiURL: result.url,
  }));

  for (const pk of pokemon) {
    var num = pokemon.indexOf(pk);
    pokemon[num].type = await getType(pk.apiURL);
    pkmnList = pokemon;
    //console.log(pokemon[num]);
  }
  //console.log(pokemon);
  displayPokemon(pokemon);
  setTimeout(function () {
    document.getElementById("pokeball-container").style.visibility = "hidden";
  }, 50);
};

const fetchHoennPokemon = async () => {
  document.getElementById("pokeball-container").style.visibility = "visible";
  const url = `https://pokeapi.co/api/v2/pokemon?limit=135&offset=251`;
  const res = await fetch(url);
  const data = await res.json();
  console.log("fetch hoenn");
  //console.log(data);
  const pokemon = data.results.map((result, index) => ({
    name: checkName(result.name),
    id: index + 252,
    apiURL: result.url,
  }));
  for (const pk of pokemon) {
    var num = pokemon.indexOf(pk);
    pokemon[num].type = await getType(pk.apiURL);
    pkmnList = pokemon;
    /* console.log(pokemon[num]); */
  }
  //console.log(pokemon);
  displayPokemon(pokemon);
  setTimeout(function () {
    document.getElementById("pokeball-container").style.visibility = "hidden";
  }, 50);
};

function displayPokemon(pokemon) {
  console.log("display");
  //console.log(pokemon);
  const pokemonHTMLString = pokemon
    .map(
      (pkmn) => `
      <li class="card bk${pkmn.id} flip-card-front" onclick="selectPokemon(${pkmn.id})">     
          <h2 class="card-id" >#${pad(pkmn.id, 3)} ${capitalize(pkmn.name)}</h2>
          <img class="card-image" src="./images/${pad(pkmn.id, 3)}.png"/>           
          <div class="card-subtitle">${setType(pkmn)}</div>
      </li></a>
    `
    )
    .join("");
  pokedex.innerHTML = "";
  pokedex.innerHTML = pokemonHTMLString;
}

/* <div class="card-subtitle">${type(pkmn)}</div>; 
<h2 class="card-title">${capitalize(pkmn.name)}</h2>;*/

/*
    <div class="flip-card">
      <div class="flip-card-inner">
          <li class="card bk${pkmn.id} flip-card-front" onclick="selectPokemon(${pkmn.id})">
          
              <h2 class="card-id" >#${pad(pkmn.id, 3)} ${capitalize(pkmn.name)}</h2>
              <img class="card-image" src="./images/${pad(pkmn.id, 3)}.png"/>
              
              <div class="card-subtitle">${setType(pkmn)}</div>
          </li></a>
        <div class="flip-card-back">
          <h3>${capitalize(pkmn.name)} </h3>
          <p> ${pkmn.ability} <p>
        </div>
      </div>
    </div>
    */

const selectPokemon = async (id) => {
  //console.log(id);
  //console.log("cache");
  //console.log(pokeCache);
  if (!pokeCache[id]) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    const pkmn = await res.json();
    pokeCache[id] = pkmn;
    pkmn.evoURL = await getEvolutionURL(pokemonSpeciesBaseURL + id);
    //console.log(pkmn);
    displaymodal(pkmn);
  }
  displaymodal(pokeCache[id]);
};

const displaymodal = async (pkmn) => {
  console.log("displaymodalinfo");
  //console.log(pkmn);
  const content = document.getElementById("pkContent");
  const type = pkmn.types.map((type) => type.type.name).join(", ");
  modal.style.display = "block";
  var flavourString = await getText(pkmn.species.url);
  var evoString = await getEvolution(pkmn.evoURL);
  const htmlString = `
    <div class"popup">
      <span class="closeBtn" onclick="closeModal()">&times;</span>
      <br>
      <div class="info-container">
        <div class="first-row">
          <div class="pkimage"><img class="pkmnEntry-image" src="./images/${pad(pkmn.id, 3)}.png"/></div>
          <div class="stats">
            <!--<p class="temp">Height: </p>
            <p class="temp">Weight: </p>
            <p class="temp">Abilities</p>
            <p class="temp">${pkmn.weight / 10} Kg</p>
            <p class="temp">${pkmn.height / 10} m</p>
            <p class="temp">${pkmn.abilities[0].ability.name}</p>--> <!-- gotta display em all in the future-->
            <table class="body-stat" cellpadding="5">
              <tr><th>Height</th><th>Weight</th><th>Abilities</th></tr>
              <tr><td>${pkmn.weight / 10} Kg</td><td>${pkmn.height / 10} m</td><td>${pkmn.abilities[0].ability.name}</td></tr>
            </table>
          </div>
          <div class="specs">
            <table class="specs-stat">
              <tr><th>HP:</th><td>${pkmn.stats[5].base_stat}</td></tr>
              <tr><th>ATK:</th><td>${pkmn.stats[4].base_stat}</td></tr>
              <tr><th>DEF:</th><td>${pkmn.stats[3].base_stat}</td></tr>
              <tr><th>SPD:</th><td>${pkmn.stats[0].base_stat}</td></tr>
              <tr><th>SPA:</th><td>${pkmn.stats[2].base_stat}</td></tr>
              <tr><th>SPD:</th><td>${pkmn.stats[1].base_stat}</td></tr>
            </table>  
          </div>
        </div>
        <div class="description">
          <p class="desc">${flavourString}</p>
        </div>
        <div class="evolution" id="evo">
          ${evoString}
        </div>
      </div>
    </div>  
  `;
  content.innerHTML = htmlString;
};

const getEvolutionURL = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  //console.log(data.evolution_chain.url);
  return data.evolution_chain.url;
};

/* 
TODO: grab maxevo for eevee evos 
*/

function processChain(chain, evoArray) {
  let maxevo = chain.evolves_to.length;
  console.log("possbile parallel evoultions " + maxevo);

  if (chain.evolves_to.length > 0) {
    for (let p = 0; p < chain.evolves_to.length; p++) {
      /*while(chain.evolves_to)
      {
        if (chain.evolves_to[p]) {
          console.log("possbile parallel evo" + maxevo);
        }
      }*/
      var evoDetails = chain.evolves_to[p].evolution_details[0];
      console.log("details");
      console.log("items is " + evoDetails.item);
      //var x = chain.evolves_to[0].evolution_details[0].item[0];
      //console.log(x);
      console.log(evoArray);
      evoArray[evoArray.length] = {
        name: chain.species.name,
        id: chain.species.url.split("/").reverse()[1],
        trigger: getEvoTriggerData(evoDetails.trigger, "name"),
        minLevel: getEvoTriggerData(evoDetails, "min_level"),
        minHappiness: getEvoTriggerData(evoDetails, "min_happiness"),
        timeOfDay: getEvoTriggerData(evoDetails, "time_of_day"),
        item: null,
      };

      if (evoDetails.item) {
        evoArray[evoArray.length - 1].item = getEvoTriggerData(evoDetails.item, "name");
      }

      return processChain(chain.evolves_to[p], evoArray);
    }
  } else {
    evoArray[evoArray.length] = {
      name: chain.species.name,
      id: chain.species.url.split("/").reverse()[1],
    };
    return evoArray;
  }
}

/* 
!where Mena DIED blame someone thx
*/

/* function processChain(chain, evoArray) {
  if (chain.evolves_to.length > 0) {

    evoArray[evoArray.length] = chain.evolves_to[0].evolution_details[0];
    evoArray[evoArray.length-1]["name"] = chain.species.name;
    evoArray[evoArray.length-1]["id"] = chain.species.url.split("/").reverse()[1];
    evoArray[evoArray.length-1]["trigger"] = getEvoTriggerData(chain.evolves_to[0].evolution_details[0].trigger, "name");

    return processChain(chain.evolves_to[0], evoArray);
  } else {
    evoArray[evoArray.length] = {
      name: chain.species.name,
      id: chain.species.url.split("/").reverse()[1]
    };
    return evoArray;
  }
} */

function getEvoTriggerData(JSONin, key) {
  if (JSONin.hasOwnProperty(key)) {
    return JSONin[key];
  }
  return null;
}

const getEvolution = async (url) => {
  const content = document.getElementById("evo");
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);
  const chain = data.chain;
  const forms = await processChain(chain, []);
  console.log("forms");
  //console.log(forms);

  var htmlString = ``;
  for (let i = 0; i < forms.length; i++) {
    htmlString += `<div class="evo-container"><img class="evo-image1" src="./images/${pad(forms[i].id, 3)}.png" /><p class="evo-name">${forms[i].name}</p></div>`;
    var evoReq = ``;

    if (forms[i].minLevel != null) {
      evoReq = `Lvl ${forms[i].minLevel}`;
    } else if (forms[i].minHappiness != null) {
      evoReq = `Happiness`;
    }

    if (forms[i].trigger == "level-up") {
      if (forms[i].minLevel != undefined) {
        htmlString += `<p class="lvl" > <i class="arrow material-icons ">keyboard_arrow_right</i> <br>${evoReq}</p>`;
      } else {
        htmlString += `<p class="lvl">  <i class="arrow material-icons ">keyboard_arrow_right</i> <br>Unknown</p>`;
      }
    } else if (forms[i].trigger == "trade") {
      htmlString += `<p class="lvl">  <i class="arrow material-icons ">keyboard_arrow_right</i> <br>Trade</p>`;
    } else if (forms[i].trigger == "use-item") {
      if (forms[i].item != null) {
        htmlString += `<p class="lvl">  <i class="arrow material-icons ">keyboard_arrow_right</i> <br>Stone</p>`;
      }
    } else {
      htmlString;
    }
  }

  //console.log(htmlString);
  /*     const htmlString = `
      <img class="evo-image1" src="./images/${pad(forms.id, 3)}.png" />
      <img class="evo-image1" src="./images/${pad(data.id + 1, 3)}.png" />
      <img class="evo-image1" src="./images/${pad(data.id + 2, 3)}.png" />
     `; */
  return htmlString;
};

const getType = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return data.types.map((type) => type.type.name);
};

function checkName(name) {
  if (name == "nidoran-f" || name == "nidoran-m") return "nidoran";
  else if (name == "deoxys-normal") return "deoxys";
  else if (name == "mr-mime") return "mr.mime";
  else return name;
}

const getText = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  //console.log("text");
  //console.log(data);
  rawData = grabText("en", "soulsilver", data);
  //console.log("Back from grabText");
  //console.log(rawData);
  return rawData;
};

/* function getText(url) {
  var rawdata = "";
  jQuery.ajaxSetup({ async: false });
  var rawdata = $.get(url, function(data, status) {
    return data;
  });
  //console.log(rawdata.responseJSON);
  rawData = grabText("en", "soulsilver", rawdata.responseJSON);
  //console.log(rawdata);
  return rawData;
} */

function grabText(language, version, data) {
  //console.log("grabtext");
  //console.log(data);
  for (let i = 0; i < data.flavor_text_entries.length; i++) {
    if (language == data.flavor_text_entries[i].language.name && version == data.flavor_text_entries[i].version.name) {
      //console.log(data.flavor_text_entries[i].flavor_text.replace(/\n/g, " "));
      return data.flavor_text_entries[i].flavor_text.replace(/\n/g, " ");
    }
  }
}

function setType(pkmn) {
  var spanString = "";
  for (var i = 0; i < pkmn.type.length; i++) {
    if (pkmn.type.length == 1) {
      spanString += `<div class="type type-empty"> &#10023; </div>`;
    }
    spanString += `<div class="type" id="${pkmn.type[i]}">${capitalize(pkmn.type[i]).trim()}</div>`;
  }
  return spanString;
}

/* ${flavourText[(pkmn.id-1)].text.toString()} */
function pad(str, max) {
  //console.log(str);
  str = str.toString();
  //console.log(str);
  return str.length < max ? pad("0" + str, max) : str;
}

/* <div class="card-subtitle">${type(pkmn)}</div>; */

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

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
  <span class="closeBtn">&times;</span>
  <img class="pkmnEntry-image" src="./images/${pad(num, 3)}.png" />
   <div class="evolution">
   <p class="text">${text}</p></div>
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

fetchKantoPokemon();
