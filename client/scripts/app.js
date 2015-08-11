// YOUR CODE HERE:
/* HTML INPUT ITEMS
  #username        - Username input [text]
  #roomname        - Roomname input [text]
  #text            - Message input [text]
  #send            - Send button [button]
  #displayMessages - Container div for displaying messages
  #refresh         - Get and refresh new items [button]
*/


$(document).ready(function(){
  console.log("Ready!");
  app.grab();
});


//SANITIZER
var sanitize = function(input) {
    if (input === undefined || input === null || input.length === null) {return "undefined"}; // edge case
  output = [];
  for (var character = 0; character < input.length; character++){
    if (input[character] === '<'){
      output.push('&lt;');
      continue;
    }
    if (input[character] === '>'){
      output.push('&gt;');
      continue;
    }
    if (input[character] === '$'){
      output.push('&dollar;');
      continue;
    }
    if (input[character] === '{'){
      output.push('&lbrace;');
      continue;
    }
    if (input[character] === '}'){
      output.push('&rbrace;');
      continue;
    }
    if (input[character] === '['){
      output.push('$lbrack;');
      continue;
    }
    if (input[character] === ']'){
      output.push('&rbrack;');
      continue;
    }
    if (input[character] === '='){
      output.push('&equals;');
      continue;
    }
    output.push(input[character]);
  }
  return "" + output.join("");
};


// API
var appURL = 'https://api.parse.com/1/classes/chatterbox';
// Declaration of app object and methods
var app = {};
app.init = function() {};
app.send = function(message) {
  console.log(message)
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: '' + appURL,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data) {
      console.log("sending:", JSON.stringify(data));
      console.log('chatterbox: Message sent');
      app.grab();
    },
    error: function(data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};
app.grab = function() {
  $.ajax({
    url: appURL,
    type: 'GET',
    contentType: 'application/json',
    success: function(data) {
      var messages = data.results;
      var rooms = [];
      for (var i = 0; i < messages.length; i++) {
        var message = {
          username: messages[i].username,
          text: messages[i].text,
          roomname: messages[i].roomname,
          time: messages[i].createdAt
        };
        $('#displayMessages').append('<div class="username">' + 'Username: ' +
          sanitize(message.username) + '</div>' + '<div class="text">' + 'Message: ' +
          sanitize(message.text) + '</div>' + '<div class="time">' + sanitize(message.time) +
          '</div>' + '<div class="roomname">' + sanitize(message.roomname) +
          '</div>');
          rooms.push(sanitize(message.roomname));
      }
        rooms = _.uniq(rooms).sort();
        for(var j = 0; j < rooms.length; j++){
          $('#roomSelect').append('<option class="selectOption" value="' + rooms[j] + '">' + rooms[j] + '</option>');
        }
    }, // end success
    error: function(data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to grab');
    }
  });
};
// message format

// GLOBAL VARIABLE
var currentRoom = "Lobby";
// Event Listeners
$('#send').on('click', function() {
  var message = {};
    message.text = $('#text').val();
    message.username = $('#username').val();
    message.room = currentRoom;
  app.send(message);
});


$('#refresh').on('click', function() {
  app.grab();
});

$('#createNewRoom').on('click', function() {
  currentRoom = $('#roomname').val();
});

$('#roomSelect').on('change', function() {
  currentRoom = $('#roomSelect option:selected').text();
  console.log(currentRoom);
})

