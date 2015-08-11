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

var currentRoom = "Lobby";

//SANITIZER
var sanitize = function(input) {
    if (input === undefined || input === null || input.length === null) {return "undefined"}; // edge case

    if (input.indexOf('<script>') !== -1){    console.log(input.indexOf('<script>')); return 'ScriptAttack'}

    return input;
  // for (var character = 0; character < input.length; character++){
  //   // if (input[character] === ' '){
  //   //   output.push('&#20;');
  //   //   continue;
  //   // }

  //   if (input[character] === '<'){
  //     output.push('&lt;');
  //     continue;
  //   }
  //   if (input[character] === '\''){
  //     output.push('&#39;');
  //     continue;
  //   }

  //   if (input[character] === '>'){
  //     output.push('&gt;');
  //     continue;
  //   }
  //   if (input[character] === '$'){
  //     output.push('&dollar;');
  //     continue;
  //   }
  //   if (input[character] === '{'){
  //     output.push('&lbrace;');
  //     continue;
  //   }
  //   if (input[character] === '}'){
  //     output.push('&rbrace;');
  //     continue;
  //   }
  //   if (input[character] === '['){
  //     output.push('$lbrack;');
  //     continue;
  //   }
  //   if (input[character] === ']'){
  //     output.push('&rbrack;');
  //     continue;
  //   }
  //   if (input[character] === '('){
  //     output.push('&#40;');
  //     continue;
  //   }
  //   if (input[character] === ')'){
  //     output.push('&#41;');
  //     continue;
  //   }
  //   if (input[character] === '"'){
  //     output.push('&quot;');
  //     continue;
  //   }
  //   if (input[character] === '='){
  //     output.push('&equals;');
  //     continue;
  //   }
  //   output.push(input[character]);
  // }
  // return "" + output.join("");
};

var removeSpaces = function(input){
  output = [];
  for (var character = 0; character < input.length; character++){
    if (input[character] !== ' '){
      output.push(input[character])
    }
  }
  return output.join("")
}


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
            username: sanitize(messages[i].username),
            text: sanitize(messages[i].text),
            roomname: sanitize(messages[i].roomname),
            time: messages[i].createdAt
          };
          $('#displayMessages').append('<div class="' + removeSpaces(message.roomname) +'"><div class="username">' + 'Username: ' +
            sanitize(message.username) + '</div>' + '<div class="text">' + 'Message: ' +
            sanitize(message.text) + '</div>' + '<div class="time">' + sanitize(message.time) +
            '</div>' + '<div class="roomname">' + sanitize(message.roomname) +
            '</div></div>');
            rooms.push(sanitize(message.roomname));
          }
          rooms = _.uniq(rooms).sort();
          for(var j = 0; j < rooms.length; j++){
            $('#roomSelect').append('<option class="selectOption" value="' + sanitize(rooms[j]) + '">' + sanitize(rooms[j]) + '</option>');
          }
    }, // end success
    error: function(data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to grab');
    }
  });
};
// message format

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
  currentRoom = sanitize($('#roomname').val());
});

$('#roomSelect').on('change', function() {
  currentRoom = removeSpaces($('#roomSelect option:selected').text());
  var rooms = $(".selectOption");
  for (var i = 0; i < rooms.length; i++) {
    if(removeSpaces(rooms[i].text) === currentRoom){
      var show = "." + removeSpaces(rooms[i].text);
      $(''+show).slideDown();
      continue;
    }
    var hide = "." + removeSpaces(rooms[i].text);

    $(''+hide).fadeOut();
    //console.log(rooms[i], rooms[i].text);
  }
  console.log(removeSpaces(currentRoom));
})

