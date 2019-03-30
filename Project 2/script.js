// var request;
var objJSON;
var id_mongo;
var userID=0;
var userData = {};
var baseURL = window.location.href;
baseURL = baseURL.substr(0, baseURL.lastIndexOf("/")) + "/rest/";
var websiteName = "Antykwariat";

var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
var open = indexedDB.open("BazaOcen1", 1);

open.onupgradeneeded = function() {
    var db = open.result;
    var store = db.createObjectStore("Oceny", {keyPath: "id", autoIncrement: true});
    store.createIndex("ocena", "ocena", { unique: false });
    store.createIndex("opinia", "opinia", { unique: false });
    store.createIndex("data", "data", { unique: false });
};



open.onsuccess = function() {
  var db = open.result;
  document.getElementById('dodaj').onclick = function() {
    var ocena = {};
    ocena.ocena = document.getElementById('ocena');
    ocena.opinia = document.getElementById('opinia');
    var status = document.getElementById('status');
    status.innerHTML = '';
    if (!ocena.ocena.checkValidity()) {
      status.innerHTML += 'Ocena: ' + ocena.ocena.validationMessage + '<br />';
    }
    if (status.innerHTML.length > 0)
      return;
    ocena.ocena = ocena.ocena.value;
    ocena.opinia = ocena.opinia.value;
    if (ocena.opinia == "" || ocena.ocena == "") {
      document.getElementById('result').innerHTML = "Uzupełnij wszystkie pola!";
      return;
    }
    ocena.data = timeConverter(Date.now());

    var tx = db.transaction("Oceny", "readwrite");
    var store = tx.objectStore("Oceny");
    adding = store.put({ocena: ocena.ocena, opinia: ocena.opinia, data: ocena.data});
    adding.onsuccess = function() {
      alert('Pomyslnie dodano element');
    }
  }
    document.getElementById('zapisaneOffline').onclick = function() {
    document.getElementById('dodajKsiazke').style.display = "none";
    var transaction = db.transaction("Oceny", 'readonly');
    var objectStore = transaction.objectStore("Oceny");
    objectStore.getAll().onsuccess = function(event) {
      var array = event.target.result;
      var sync = 0;
      var txt = `<table>
          <thead><tr>
            <td width="20%">ID</td>
            <td width="40%">Stan Książki</td>
            <td width="40%">Tytul</td>
            <td width="40%">Data</td>
          </tr></thead>`;
      for (var i = 0; i < array.length; i++) {
        sync = sync + 1;
        txt += `<tr><td>`+array[i]['id']+`</td><td>`+array[i]['ocena']+`</td><td>`+array[i]['opinia']+`</td><td>`+array[i]['data']+`</td></tr>`;
      }
      if (sync == 0) {
        txt += "<tr><td colspan='3'><center>Brak rekordów</center></td></tr>";
      } else{
	      txt += `<tr><td colspan="2" style="text-align: center;"><button onclick="delete1();" value="">Usun pierwszy rekord</button></td></tr>`;
      }
      txt += `</table>`;
      document.getElementById('data').innerHTML = txt;
    };
  }
}

function delete1() {
    var db = open.result;
    var transaction = db.transaction("Oceny", 'readwrite');
    var objectStore = transaction.objectStore("Oceny");
    var cursorRequest = objectStore.openCursor();
    cursorRequest.onsuccess = function(event){
    	cursor = event.target.result;
    	cursor.delete();
    }
    document.location.reload()
}

function sync() {
    var db = open.result;
    document.getElementById('dodajKsiazke').style.display = "none";
    var transaction = db.transaction("Oceny", 'readwrite');
    var objectStore = transaction.objectStore("Oceny");
    var cursorRequest = objectStore.openCursor();
    var sync = 0;
    cursorRequest.onsuccess = function(event) {
      cursor = event.target.result;
      if (cursor) {
        var ksiazka = {};
        ksiazka.ocena = cursor.value.ocena;
        ksiazka.opinia = cursor.value.opinia;
        ksiazka.data = cursor.value.data;
        txt = JSON.stringify(ksiazka);
        var request = getRequestObject();
        request.onreadystatechange = function() {
          if (request.readyState == 4 && request.status == 200 )
          {
              objJSON = JSON.parse(request.response);
              if(objJSON['status'] == 'ok')
              {
                 
              }
          }
        }
        request.open("POST", baseURL+"addRating", true);
        request.send(txt);
        cursor.delete();
        sync++;
        cursor.continue();
      }
      else {
        if (sync > 0)
          alert("Zsynchronizowano "+sync+" rekordów.");
        else
          alert("Nie ma rekordów do synchronizacji.");
        sync = 0;
      }
    }
  }

function sredniaStanu(){
	getAvgRatings();
}

function getRequestObject() {
  if ( window.ActiveXObject) {
    return (new ActiveXObject("Microsoft.XMLHTTP"));
  }
  else if (window.XMLHttpRequest) {
    return (new XMLHttpRequest());
  }
  else {
    return (null);
  }
}

function writeCookie(value) {
  document.cookie = "sessionID=" + value + "; path=/";
}

function readCookie() {
  var i, c, ca, nameEQ = "sesja=";
  ca = document.cookie.split(';');
  for(i=0;i < ca.length;i++) {
    c = ca[i];
    while (c.charAt(0)==' ') {
      c = c.substring(1,c.length);
    }
    if (c.indexOf(nameEQ) == 0) {
      return c.substring(nameEQ.length,c.length);
    }
  }
  return '';
}


function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = a.getMonth()+1;
  if (month.toString().length == 1)
    month = "0"+month;
  var date = a.getDate();
  if (date.toString().length == 1)
    date = "0"+date;
  var hour = a.getHours();
  if (hour.toString().length == 1)
    hour = "0"+hour;
  if (hour.toString().length == 1)
    hour = "0"+hour;
  var min = a.getMinutes();
  if (min.toString().length == 1)
    min = "0"+min;
  var sec = a.getSeconds();
  if (sec.toString().length == 1)
    sec = "0"+sec;
  var time = year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}


function checkSession(isAccessingPanel = false) {
  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      if (userID != parseInt(objJSON['id'])) {
        userID = parseInt(objJSON['id']);
        userData = objJSON;
      }
      if (isAccessingPanel) {
        if (userID == 0) {
          pokazPanelLogowania();
        }
        else {
          pokazPanel();
        }
      }
    }
  }
  var req = {};
  req.sesja = readCookie();
  sesja = JSON.stringify(req);
  request.open("POST", baseURL+"checkSession", true);
  // request.timeout
  request.send(sesja);
}


function panelUzytkownika() {
  document.getElementById('result').innerHTML = '';
  checkSession(true);
}


function pokazPanelLogowania() {
  document.getElementById('dodajKsiazke').style.display = "none";
  document.title = websiteName + " - Logowanie";
  document.getElementById('data').innerHTML = `
  <div style="margin: 0 auto; width: 300px; align: center;">
  <table style="width: 100%; text-align: center;">
  <thead><tr><td colspan="2">Logowanie</td></tr></thead>
    <form method='post'>
      <tr><td width="40%">Login:</td><td><input type='text' value='' name='login' id='login' /></td></tr>
      <tr><td>Hasło:</td><td><input type='password' value='' name='password' id='password' /></td></tr>
      <tr><td colspan="2"><input type='submit' name='submitLogin' onclick='log(this.form);' value='Zaloguj' /></td></tr>
    </form>
  </table></div>
  `;
}

function pokazPanel() {
  document.getElementById('dodajKsiazke').style.display = "none";
  document.title = websiteName + " - Panel użytkownika";
  document.getElementById('data').innerHTML = `
  <div style="margin: 0 auto; width: 300px; align: center;">
  <table style="width: 100%; text-align: center;">
  <thead><tr><td colspan="2">Witaj `+"Konrad"+`</td></tr></thead>
    <form method='post'>
      <tr>
        <td><button onclick="sync();" value="">Synchronizuj</button></td>
      </tr>
      <tr>
      <td colspan="2"><input type='submit' name='logout' onclick='wylog();' value='Wyloguj' /></td></tr>
    </form>
  </table></div>
  `;
}

function log(form) {
  login = document.getElementById('login').value;
  password = document.getElementById('password').value;
  if (login == "" || password == "") {
    document.getElementById('result').innerHTML = "Uzupełnij wszystkie pola!";
    return;
  }
  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200 )
    {
        objJSON = JSON.parse(request.response);
        if(objJSON['status'] == 'ok')
        {
            pokazPanel();
            writeCookie(objJSON['sessionID']);
        }
        else
            alert("Błędny login lub hasło.");
    }
    else if (request.readyState == 4 && request.status == 500)
    {
        alert("Brak połączenia z serwisem.");
    }
    }
  var req = {};
  req.login = login;
  req.haslo = password;
  input = JSON.stringify(req);
  request.open("POST", baseURL+"login", true);
  request.send(input);
}


function wylog() {
  var sessionID = readCookie();
  var cookie = {};
  cookie.sessionID = sessionID;
  txt = JSON.stringify(cookie);
  request = getRequestObject();
  request.onreadystatechange = function()
  {
      if (request.readyState == 4 && request.status == 200 )
      {
            document.getElementById('result').innerHTML = 'Pomyślnie wylogowano.';
            pokazPanelLogowania();
            writeCookie('');
      }
      else if (request.readyState == 4 && request.status == 500)
      {
          alert("Brak połączenia z serwisem.");
      }
  }
  request.open("POST", baseURL+"logout", true);
  request.send(txt);
}



function wyswietlKsiazki() {
  document.getElementById('dodajKsiazke').style.display = "block";
  document.title = websiteName + " - Ksiazki";
  document.getElementById('result').innerHTML = '';
  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var txt = `
      <table>
        <thead><tr>
          <td width="45%">Stan Książki</td>
          <td width="45%">Tytul</td>
          <td width="45%">Data</td>
        </tr></thead>
      `;
      for (var id in objJSON) {
        obj = objJSON[id];
        txt += `
        <tr>
          <td>`+obj['ocena']+`</td>
          <td>`+obj['opinia']+`</td>
          <td>`+obj['data']+`</td>
        </tr>
        `;
      }
      txt += `</table>`;
      document.getElementById('data').innerHTML = txt;
    }
  }
  request.open("GET", baseURL+"getRatings");
  request.send(null);
}

function getAvgRatings() {
  document.getElementById('dodajKsiazke').style.display = "none";
  document.title = websiteName + " - Średnie Stany Książek";
  document.getElementById('result').innerHTML = '';
  var request = getRequestObject();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      objJSON = JSON.parse(request.response);
      var suma = 0;
			var ilosc = 0;
      var txt = "<h1>Sredni stan ksiazek w Antykwariacie: ";
		 for ( var id in objJSON ) {
              ilosc++;
                  suma += parseInt(objJSON[id]['ocena']);
             }
 							txt =txt+(suma/parseInt(ilosc))+"</h1><h1>Ilosc ksiazek: "+ilosc+"</h1>";
      document.getElementById('data').innerHTML = txt;
    }
  }
  request.open("GET", baseURL+"getRatings");
  request.send(null);
}


function dodajForm() {
  if (document.getElementById('dodajKsiazke').style.display == "none") {
    document.getElementById('dodajKsiazke').style.display = "block";
    document.getElementById('result').innerHTML = "";
  }
  return;
}
