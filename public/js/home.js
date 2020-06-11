const socket = io.connect('http://localhost:3001');
socket.on('NEW_HISTORY', (data) => {
  console.log(data);



});