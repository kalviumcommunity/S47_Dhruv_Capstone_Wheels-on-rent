const express = require("express");
const app = express()
const port = 7000;
const cors = require("cors")
const rent = require("./routes/rent");
const sale = require("./routes/sale");
const user = require("./routes/user")
app.use(cors())
app.use(express.static('../server'));
app.use('/',rent);
app.use('/',sale);
app.use('/',user)
app.listen(port,()=>{
    console.log(`Server is running at ${port}`)
})
