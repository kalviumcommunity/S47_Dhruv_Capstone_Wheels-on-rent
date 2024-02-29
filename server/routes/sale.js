const express = require("express");
const mongoose = require("mongoose");
const {saleModel} = require("../model/schema");
const {saleUpload} = require("../middleware/saleImage.middleware.js")
const  {validData} = require("../model/validation")
const sale = express()


require("dotenv").config();
sale.use(express.json());

mongoose.connect(process.env.Mongoose_URL, {
    dbName : "Capstone"
}).then(()=>{
    console.log("Connected to Database")
}).catch((err)=>{
    console.log(err)
})

sale.get("/ping", async (req, res)=>{
    try {
        res.send("Pong")
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
        
    }
})

sale.get("/sale/data", async (req, res) => {
    try {
        const data = await saleModel.find({})
        res.json(data)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message})
    }
    
})

sale.post("/sale/insert", saleUpload.fields([{name: "ownerImg", maxCount: 1},{name: "vehicleImg", maxCount: 1}]), async (req, res) => {
    const newData = req.body
    let OwnerImg = []
    let VehicleImg = []
    if(req.files && req.files.ownerImg && req.files.vehicleImg && Array.isArray(req.files.ownerImg) && Array.isArray(req.files.vehicleImg)){
        for(let i = 0; i < req.files.ownerImg.length; i++){
            OwnerImg.push(req.files.ownerImg[i].path)
        }
        for(let i = 0; i < req.files.vehicleImg.length; i++){
            VehicleImg.push(req.files.vehicleImg[i].path)
        }
        newData.ownerImg = OwnerImg
        newData.vehicleImg = VehicleImg
    }

    try {
        const {error} = validData(req.body)
        if(error) return res.json({message:error.message})
        // console.log(req.body)
        await saleModel.create(newData)
        res.json(req.body)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message}) 
    }
})

sale.get("/sale/:id", async (req, res) => {
    try {
        const id = req.params.id
        const Data = await saleModel.findById(id)
        res.json(Data)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message})
    }
})

sale.put("/sale/:id", async (req, res) => {
    try {
        const id = req.params.id
        const updatedData = req.body
        await saleModel.findByIdAndUpdate(id, updatedData)
        res.json(updatedData)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message})
    }
})

module.exports = sale