const express = require('express');

const cors = require("cors");
require("dotenv").config();
const { join } = require('path');
const port = 5000;

const app = express();
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(join(__dirname, '..', 'client', 'build')));
    app.all('*', (req, res) =>
        res.sendFile(join(__dirname, '..', 'client', 'build', 'index.html'))
    );
}

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
app.use("/users", require("./routes/userRouter"));
app.use("/", require("./routes/posRouter"));