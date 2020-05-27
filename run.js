const axios = require('axios');

axios.post('http://localhost:3001/search/groupUser', {
    field: '#null',
    userId: '5ec63fecf2cde62bb40ac911',
    groupId: '5ec6bba8e0af9557584b9ab3'
  })
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });