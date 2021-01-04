import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);  // --┬ socket.io를 사용하는 경우에는 app을 http에 연결시키고 이 http를 다시 socket.io에 연결시키는 과정이 필요한데 
const io = require('socket.io')(server);// --┘ 이는 socket.io가 express를 직접 받아들이지 못하기 때문 => socket.io는 io라는 변수명으로 서버에서 사용됨
// import socket from 'socket.io';로 모듈을 불러올 시 에러가 출력됨   .... why?

export const socketIo = () => {

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client.html');
  }); // 모든 request는 client.html을 response하도록 설정

  let count: number = 1;

  io.on('connection', (socket: { id: string, on: Function; }) => { // 사용자가 웹사이트에 접속하게 되면 socket.io에 의해 connection event가 자동으로 발생됨
    // io.on(event, func) => 서버에 전달된 event를 인식하여 func를 실행시키는 이벤트 리스너
    // 함수에는 접속한 사용자의 socket이 파라메터로 전달됨
    // 해당 접속자에 관련한 모든 event들은 이 connection 이벤트 리스너 안에서 작성되어야 함

    // connection 이벤트 리스너에 event가 발생하면 한번만 일어나는 코드 
    console.log("user connected : ", socket.id); // 접속자의 id 출력
    let name: string = `user${count++}`; // user 번호 증가
    io.to(socket.id).emit('change name', name); // change name 이벤트 발생 => client.html에 있는 socket.on("change name", func )이 실행됨
    // io.to(socket.id) => 해당 socket.id로 emit함
    // emit('event listener', parameter) => 클라이언트에 있는 jquery 이벤트 리스너를 실행

    // socket.on(event, func) => 해당 socket에 전달된 event를 인식하여 함수를 실행시킴
    // !! io.on(event, func) = 서버에 전달된 event를 인식
    // !! socket.on(event, func) = 해당 socket에 전달된 event를 인식
    socket.on('disconnect', () => {
      console.log('user disconnected', socket.id);
    });
    // 해당 socket의 연결이 끊긴다면(브라우저를 닫거나 새로고침 시) 연결을 끊음

    // socket.on을 사용하여 send message event 실행
    // client.html에서 send message 를 emit 했을 때 실행이 됨
    socket.on('send message', (name: string, text: string) => {
      let msg = `${name} : ${text}`;
      // 메세지를 보낸 이름과 내용을 받아 string으로 변환
      console.log(msg);
      io.emit('receive message', msg);
      // 화면에 표시하기 위해 html 파일 내에 있는 'receive message' event emit
    });

  });

  server.listen(4000, () => {
    console.log("server listening");
  });
};
