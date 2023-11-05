const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(cors());

app.get('/', (req, res) =>{
    res.send('Resturant management website server is continued..')
})

app.listen(port, () =>{
    console.log(`Resturant mgmt is running on port: ${port}`)
})