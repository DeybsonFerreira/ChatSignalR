'use strict';
const urlApi = 'https://localhost:5001/chat';

var connection = new signalR.HubConnectionBuilder()
   .withUrl(urlApi)
   .configureLogging(signalR.LogLevel.Information)
   .build();

function hasButtonDisabled(value) {
   document.getElementById('send').disabled = value;
}

function createBrowserId() {
   let guid = NewGuid();
   createSession('browserId', guid);
}
function refreshBrowser() {
   sessionStorage.clear();
   createBrowserId();
}
function init() {
   hasButtonDisabled(true);
   refreshBrowser();
   ValidUsername();
   start();
}

async function start() {
   try {
      await connection.start();
      hasButtonDisabled(false);
   } catch (err) {
      hasButtonDisabled(true);
      return console.error(err.toString());
      // setTimeout(start, 5000); //to reconect
   }
}

connection.on('ReceiveMessage', function (jsonString) {
   const jsonData = JSON.parse(jsonString);
   if (!jsonData) return;

   let browserId = jsonData.BrowserId;
   let isOwn = browserId == getSessionDescription('browserId');

   let messageDiv = createDivMessages(isOwn, jsonData);
   $('.messagesList').append(messageDiv);
   window.scrollTo(0, document.body.scrollHeight);
});

function createDivMessages(isOwn, jsonData) {
   if (isOwn) {
      return createOwnDivMessage(jsonData);
   } else {
      return createOtherDivMessage(jsonData);
   }
}
function createOwnDivMessage(jsonData) {
   let date = new Date(jsonData.Date);

   let dateFormated = new Date(date).toLocaleDateString(navigator.language, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
   });
   let div = ` 
      <div class="chat-log__item chat-log__item--own">
         <h3 class="chat-log__author"> ${jsonData.Username} <small> ${dateFormated}</small></h3>
         <div class="chat-log__message">${jsonData.Message}</div>
       </div>`;
   return div;
}
function createOtherDivMessage(jsonData) {
   let date = new Date(jsonData.Date);

   let dateFormated = new Date(date).toLocaleDateString(navigator.language, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
   });
   let div = ` 
      <div class="chat-log__item">
      <h3 class="chat-log__author"> ${jsonData.Username} <small> ${dateFormated}</small></h3>
      <div class="chat-log__message">${jsonData.Message}</div>
    </div>`;
   return div;
}

$('#setName').on('click', function () {
   let userName = $('#username').val();
   if (userName.length == 0) return;

   createSession('username', userName);
   UserModal(false);
});

$('#messageText').keypress(function (event) {
   const keycode = event.keyCode ? event.keyCode : event.which;
   if (keycode == '13') {
      $('#send').click();
   }
});

$('#send').on('click', function (event) {
   const isValid = ValidUsername();
   if (isValid) {
      let user = getSessionDescription('username');
      let browserId = getSessionDescription('browserId');
      let message = $('#messageText').val();
      if (message.length == 0 || browserId.length == 0) return;

      const jsondata = {
         username: user,
         message: message,
         browserId: browserId,
      };

      connection.invoke('SendMessage', jsondata).catch(function (err) {
         return console.error(err.toString());
      });
      event.preventDefault();
      $('#messageText').val('');
   }
});

function ValidUsername() {
   let user = getSessionDescription('username');
   if (!user) {
      UserModal(true);
      return false;
   }
   return true;
}
function createSession(name, value) {
   sessionStorage.setItem(name, value);
}
function getSessionDescription(key) {
   return sessionStorage[key];
}

function UserModal(value) {
   if (value) {
      $('.userModal').modal('show');
   } else {
      $('.userModal').modal('hide');
   }
}
function NewGuid() {
   function _p8(s) {
      var p = (Math.random().toString(16) + '000000000').substr(2, 8);
      return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
   }
   return _p8() + _p8(true) + _p8(true) + _p8();
}

init();
