import app from './app.js'
import { connectDB } from './config/db.config.js'

const port = process.env.PORT || 7000

connectDB()
.then(()=> {
    app.on("error", (error)=> {
        console.log("Error in Index File: ", error)
        throw error
    })
    app.listen(port, () => {
        console.log(`http://localhost:${port}`)
    })
})
.catch(error => {
    console.log("MongoDB Connection failed in Index File !!", error)
})