const axios = require('axios');

axios.post('http://localhost:3001/home/', {
    userId: '5ec63fecf2cde62bb40ac911',
  })
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });