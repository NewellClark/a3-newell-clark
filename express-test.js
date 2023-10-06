const express = require('express');
const app = express();
const port = 3000;

app.get('/', (request, response) => {
    response.send('Hello, World!');
});

app.get('/index.html', (request, response) => {
    response.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
    console.log(`Express app listening on port ${port}`);
});