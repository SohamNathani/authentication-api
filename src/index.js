const express = require("express")
const port = process.env.PORT

require("./db/mongoose")

const app = express()
const userRoute = require("./routes/user")

app.use(express.json())
app.use(userRoute)

app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`)
}) 

