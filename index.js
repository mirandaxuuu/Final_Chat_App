var express = require('express');
var socket = require('socket.io');
var SocketIOFile = require('socket.io-file');
var ejs = require('ejs');

//app setup
var app = express();
var server = app.listen(3000, function(){
	console.log('listening on port 3000');
});

var fileName='placeholder.jpg';
var fileType='image/jpeg';

//static files
app.use(express.static(__dirname + '/public'));

app.engine('.ejs', require('ejs').__express)
app.set('views', __dirname + '/public')
app.set('view engine', 'ejs')

app.get('/', function(req, res){
    res.render('index');
})

app.get('/file', function(req, res){
    res.render('file', {fileName: fileName, fileType: fileType});
})

// app.get('/', (req, res, next) => {
// 	return res.sendFile(__dirname + '/client/index.html');
// });


app.get('/chat.js', (req, res, next) => {
	return res.sendFile(__dirname + '/client/chat.js');
});

app.get('/socket.io.js', (req, res, next) => {
	return res.sendFile(__dirname + '/node_modules/socket.io-client/dist/socket.io.js');
});

app.get('/socket.io-file-client.js', (req, res, next) => {
	return res.sendFile(__dirname + '/node_modules/socket.io-file-client/socket.io-file-client.js');
});



//socket setup
var io = socket(server);

io.on('connection', function(socket){
	console.log('connection made', socket.id);

	socket.on('chat', function(data){
		io.sockets.emit('chat', data);
	});

    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });

    socket.on('file', function(){
        socket.broadcast.emit('file');
    });



	var uploader = new SocketIOFile(socket, {
        uploadDir: 'public/data/',
        accepts: ['audio/mpeg', 'audio/mp3', 'image/jpeg'],
        maxFileSize: 4194304, // 4MB
        chunkSize: 10240, // 1KB
        transmissionDelay: 0,
        overwrite: true
    });


    uploader.on('start', (fileInfo) => {
        console.log('Start uploading');
        // console.log(fileInfo);
    });
    uploader.on('stream', (fileInfo) => {
        console.log(`${fileInfo.wrote} / ${fileInfo.size} byte(s)`);
    });


    uploader.on('complete', (fileInfo) => {
        console.log('Upload Complete.');

        // setTimeout(function(){
        //     fileName = fileInfo.name;
        //     console.log(fileName)
        // }, 3000);

        fileName = fileInfo.name;
        fileType = fileInfo.mime;
        // console.log(fileType);

        socket.broadcast.emit('file');

        // fs.writeFile('fileName.txt', fileName, 'utf8', finished)
        // function finished(err) {
        //     console.log('Finished writing fileName.txt file');
        // }

    });


    uploader.on('error', (err) => {
        console.log('Error!', err);
    });
    uploader.on('abort', (fileInfo) => {
        console.log('Aborted: ', fileInfo);
    });


});

