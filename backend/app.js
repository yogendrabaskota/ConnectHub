const express = require('express')
const app = express()
require('dotenv').config()



app.use('/', (req, res) => {
    res.send('Server is running!')
})
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)  
})

