var socket = io.connect('http://localhost:3000');
var uploader = new SocketIOFileClient(socket);

var	btn2 = document.getElementById('upload');
	output = document.getElementById('output');
	feedback = document.getElementById('feedback');

btn2.addEventListener('click', function(e){

    e.preventDefault(e);
    var fileEl = document.getElementById('file');
    var uploadIds = uploader.upload(fileEl.files);

    feedback.innerHTML = '';

   
});

socket.on('file', function(){
	output.innerHTML += '<p>The other user has uploaded a file. Check it here: <a target="_blank" href="localhost:3000/file">localhost:3000/file</a></p>'
});
