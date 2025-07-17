import express from 'express'
import dotenv from 'dotenv'

dotenv.config()
const app = express()


app.use('/', (req, res) => {
    res.send('Server is running!')
})
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)  
})

