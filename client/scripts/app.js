// YOUR CODE HERE:
/* HTML INPUT ITEMS
  #username        - Username input [text]
  #roomname        - Roomname input [text]
  #text            - Message input [text]
  #send            - Send button [button]
  #displayMessages - Container div for displaying messages
  #refresh         - Get and refresh new items [button]
*/

var sanitize = function(string) {
  return string ? string.replace(/</g, '&lt;').replace(/>/g, '&gt;') :
    undefined;
};

var removeSpacesApos = function(string) {
  return string ? string.replace(/ /g, '').replace(/'/g, '') : undefined;
};

var app = {};

app.url = 'https://api.parse.com/1/classes/chatterbox';

app.currentRoom = "Lobby";

app.createMessage = function(message) {
  var messageObj = {
    username: sanitize(message.username),
    text: sanitize(message.text),
    roomname: removeSpacesApos(sanitize(message.roomname)),
    time: message.createdAt
  };
  return messageObj;
};

app.showMessages = function(messages) {
  var rooms = [];
  for (var i = 0; i < messages.length; i++) {
    var newMessage = app.createMessage(messages[i]);
    rooms.push(newMessage.roomname);
    $('#displayMessages').append('<div class="' + removeSpacesApos(newMessage
        .roomname) + ' chat"><div class="username">' + 'Username: ' +
      newMessage.username + '</div>' + '<div class="text">' + 'Message: ' +
      newMessage.text + '</div>' + '<div class="time">' + newMessage.time +
      '</div>' + '<div class="roomname">' + newMessage.roomname +
      '</div></div>');
  }
    rooms = _.uniq(rooms).sort();
    rooms.forEach(function(room) {
      $('#roomSelect').append('<option class="selectOption" value="' +
        room + '">' + room + '</option>');
    });

};

app.send = function(message) {
  console.log(message);
  $.ajax({
    url: app.url,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data) {
      console.log("sending:", JSON.stringify(data));
      console.log('chatterbox: Message sent');
    },
    error: function(data) {
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.grab = function() {
  $.ajax({
    url: app.url,
    type: 'GET',
    contentType: 'application/json',
    success: function(data) {
      app.showMessages(data.results);
    },
    error: function(data) {
      console.error('chatterbox: Failed to Grab');
    }
  });
};

app.init = function() {
  app.grab();

  $('#refresh').on('click', function() {
    app.grab();
  });

  $('#send').on('click', function() {
    var message = {};
    message.text = $('#text').val();
    message.username = $('#username').val();
    message.room = app.currentRoom;
    app.send(message);
  });
  $('#roomSelect').on('change', function() {
    var currentRoom = $('#roomSelect option:selected').text();
    $('#displayMessages').find('.'+currentRoom).slideDown();
    $('#displayMessages > div').not('.'+currentRoom).fadeOut();
  });
};

$(document).ready(function() {
  app.init();
  console.log(app.rooms);
});
