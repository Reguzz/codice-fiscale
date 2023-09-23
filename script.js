const dictMesi = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
  4: "E",
  5: "H",
  6: "L",
  7: "M",
  8: "P",
  9: "R",
  10: "S",
  11: "T",
};

const dictPosPari = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
  I: 8,
  J: 9,
  K: 10,
  L: 11,
  M: 12,
  N: 13,
  O: 14,
  P: 15,
  Q: 16,
  R: 17,
  S: 18,
  T: 19,
  U: 20,
  V: 21,
  W: 22,
  X: 23,
  Y: 24,
  Z: 25,
};

const dictPosDispari = {
  0: 1,
  1: 0,
  2: 5,
  3: 7,
  4: 9,
  5: 13,
  6: 15,
  7: 17,
  8: 19,
  9: 21,
  A: 1,
  B: 0,
  C: 5,
  D: 7,
  E: 9,
  F: 13,
  G: 15,
  H: 17,
  I: 19,
  J: 21,
  K: 2,
  L: 4,
  M: 18,
  N: 20,
  O: 11,
  P: 3,
  Q: 6,
  R: 8,
  S: 12,
  T: 14,
  U: 16,
  V: 10,
  W: 22,
  X: 25,
  Y: 24,
  Z: 23,
};

const dictCheckDigit = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
  4: "E",
  5: "F",
  6: "G",
  7: "H",
  8: "I",
  9: "J",
  10: "K",
  11: "L",
  12: "M",
  13: "N",
  14: "O",
  15: "P",
  16: "Q",
  17: "R",
  18: "S",
  19: "T",
  20: "U",
  21: "V",
  22: "W",
  23: "X",
  24: "Y",
  25: "Z",
};

async function getStati() {
  const stati = await fetch("./stati.json")
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return stati;
}

async function getComuni() {
  const comuni = await fetch("./comuni.json")
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return comuni;
}

function checkRadio() {
  let genere = document.getElementsByName("genere");
  let res = false;
  for (let i = 0; i < genere.length; i++) {
    if (genere[i].checked) {
      res = true;
    }
  }
  return res;
}

async function calcolaCodiceFiscale() {
  //fare controlli su input all'inizio
  //ad esempio almeno uno dei radio checcato
  //che i campi di testo non siano vuoti
  //che la data sia valida

  let codice = "";
  let cognome = document.getElementById("in-cognome").value;
  if (cognome.length === 0) {
    alert("Inserire un cognome");
    return;
  }
  cognome = generateCognome(cognome);
  let nome = document.getElementById("in-nome").value;
  if (nome.length === 0) {
    alert("Inserire un nome");
    return;
  }
  nome = generateNome(nome);
  let data = document.getElementById("in-data").value;
  if (data.length === 0) {
    alert("Inserire una data");
    return;
  }
  let genere = document.getElementsByName("genere");
  if (!checkRadio()) {
    alert("Selezionare un genere");
    return;
  }
  genere = genere[0].checked ? "M" : "F";
  data = generateData(data, genere);

  let nazione = document.getElementById("in-stato").value;
  if (nazione.length === 0) {
    alert("Inserire uno stato");
    return;
  }

  if (nazione === "ITALIA") {
    let comuneNascita = document.getElementById("in-citta").value;
    if (comuneNascita.length === 0) {
      alert("Inserire un comune");
      return;
    }
    let codComune = await getCodComune(comuneNascita);
    if (codComune.length === 0) {
      alert("Comune non trovato");
      return;
    }
    codice = cognome + nome + data + codComune;
  } else {
    let codStato = await getCodStato(nazione);
    if (codStato.length === 0) {
      alert("Stato non trovato");
      return;
    }
    codice = cognome + nome + data + codStato;
  }

  codice += generateCheckDigit(codice);
  document.getElementById("res").innerHTML = codice;
}

function textValidator(event) {
  let text = event.target.value;
  text = text.toUpperCase().replace(/[^(\-|A-Z|'|\s)]/g, "");
  event.target.value = text;
}

function generateCognome(cognome) {
  let res = "";
  cognome = cognome.replace(/[^(A-Z)]/g, "");

  let consonanti = cognome.match(/[^AEIOU]/g);
  let vocali = cognome.match(/[AEIOU]/g);
  while (vocali.length < 3) {
    vocali += "X";
  }

  switch (consonanti.length) {
    case 0:
      res = vocali[0] + vocali[1] + vocali[2];
      break;
    case 1:
      res = consonanti[0] + vocali[0] + vocali[1];
      break;
    case 2:
      res = consonanti[0] + consonanti[1] + vocali[0];
      break;
    default:
      res = consonanti[0] + consonanti[1] + consonanti[2];
      break;
  }
  console.log(res);
  return res;
}

function generateNome(nome) {
  let res = "";
  nome = nome.replace(/[^(A-Z)]/g, "");

  let consonanti = nome.match(/[^AEIOU]/g);
  let vocali = nome.match(/[AEIOU]/g);
  while (vocali.length < 3) {
    vocali += "X";
  }

  switch (consonanti.length) {
    case 0:
      res = vocali[0] + vocali[1] + vocali[2];
      break;
    case 1:
      res = consonanti[0] + vocali[0] + vocali[1];
      break;
    case 2:
      res = consonanti[0] + consonanti[1] + vocali[0];
      break;
    case 3:
      res = consonanti[0] + consonanti[1] + consonanti[2];
      break;
    default:
      res = consonanti[0] + consonanti[2] + consonanti[3];
      break;
  }

  console.log(res);
  return res;
}

function generateData(data, genere) {
  data = new Date(data);
  let anno = data.getFullYear().toString().slice(2);
  let mese = dictMesi[data.getMonth()];
  let giorno = data.getDate().toString();

  if (genere == "F") {
    giorno = parseInt(giorno) + 40;
  } else if (giorno.length < 2) {
    giorno = "0" + giorno;
  }

  console.log(anno + mese + giorno);
  return anno + mese + giorno;
}

function generateCheckDigit(codice) {
  // function generateCheckDigit() {
  // let codice = 'RGZFRZ00B22A794'
  // let codice = "BBBTTT20H12X122";
  // console.log(codice);
  if (codice.length != 15) {
    return "ERRORE";
  }
  let sum = 0;
  for (let i = 0; i < codice.length; i++) {
    if (i % 2 == 1) {
      sum += dictPosPari[codice[i]];
    } else {
      sum += dictPosDispari[codice[i]];
    }
  }
  console.log(dictCheckDigit[sum % 26]);
  return dictCheckDigit[sum % 26];
}

async function getCodStato(denominazione) {
  // console.log(continente, stato);
  let codStato = "";
  let stati = await getStati();
  let res = stati.filter((stato) => stato.Denominazione === denominazione);
  if (res.length > 0) {
    codStato = res[0]["Codice Nazionale"];
  }
  console.log(codStato);
  return codStato;
}

async function getCodComune(comuneNascita) {
  // console.log(comune);
  let codComune = "";
  let comuni = await getComuni();
  let res = comuni.filter(
    (comune) => comune["Denominazione Italiana"] === comuneNascita
  );
  if (res.length > 0) {
    codComune = res[0]["Codice Nazionale"];
  }
  console.log(codComune);
  return codComune;
}
