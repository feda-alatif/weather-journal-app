const express = require('express');
const cors = require('cors');


const routes = require('./routes');


const app = express();


app.use('/', routes);



app.use(cors());


app.use(express.static('project/website'));



const PORT = 3000;
const serverCallback = () => {
    console.log(`Server started. Listening on port ${PORT}`);
}

app.listen(PORT, serverCallback);
