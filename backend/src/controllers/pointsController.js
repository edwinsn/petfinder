const pointModel = require("../Models/point")

const pointsControllers = {}

pointsControllers.getPoints = async (req, res)=>{
    const {lowerlat, upperlat, lowerlon, upperlon} = req.body
    const points = await pointModel.find({
        lat:{$gt:lowerlat,$lt:upperlat},
        lon:{$gt:lowerlon,$lt:upperlon}
    });

    res.json(points);

}

pointsControllers.getDataBase = async (req, res)=>{
    const points = await pointModel.find();
    res.json(points);

}

pointsControllers.postPoint = async (req, res)=>{
    
    const {lat, lon, type} = req.body
    const newPoint = new pointModel({
        lat:lat,
        lon:lon,
        type:type,
        nPost:1,
    })
    await newPoint.save();
    
    return res.json({loactions:"Point saved!"})
}

pointsControllers.updatePoint = async (req,res) =>{
    console.log(req.params.id,req.body);
    await pointModel.findOneAndDelete(req.params.id,req.body)
    return res.json({mesage:"Point actualized"})
}

pointsControllers.deletePoint = async (req, res)=>{
    console.log(req.params.id)
    await pointModel.findByIdAndDelete(req.params.id)
    return res.json({mesage:"deleted"})
}



module.exports = pointsControllers