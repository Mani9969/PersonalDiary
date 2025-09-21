//const express = require("express")

import express from "express"
import cors from 'cors'
import dotenv from "dotenv"
import notesRoutes from "./routes/notesRoutes.js"
import { connectDB } from "./config/db.js"
import rateLimiter from "./middleware/rateLimiter.js"
import path, { join } from "path"


dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001
const __dirname = path.resolve()   //for connection with the dist during the deployment

//middleware
if(process.env.NODE_ENV !== "production"){   //this is only required during the development 
    app.use(cors({
        origin: "http://localhost:5173",
    }))
}

app.use(express.json()) //this middleware will parse JSON bodies: req.body

app.use(rateLimiter)



// our simple custom middleware

// app.use((req,res,next) => {
//     console.log(`Req method is ${req.method} & Req URL is ${req.url}`)
//     next()
// })

app.use("/api/notes",notesRoutes)

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

    app.get("*",(req,res) => {
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))  //if we get any extra route other than specific
    })
}

connectDB().then(() => {
    app.listen(PORT,() => {
    console.log("server started on PORT :",PORT)
    })
})

