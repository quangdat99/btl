const axios = require('axios');

axios.post('http://localhost:3001/search/allUser', {
    field: '@',
  })
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });