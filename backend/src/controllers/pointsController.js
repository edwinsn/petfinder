const {pointModel, backupPointModel} = require("../Models/point")

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
    //resolve to an error in the catch  (400,500)
    
    try{
    
        const {coords, type, frecuence} = req.body;
        const {lat, lng} = coords;

        if(type.length&frecuence&lat&lng){

            const newPoint = new pointModel({
                lat,
                lng,
                type,
                frecuence,
                deprecated_level:0
            })
            await newPoint.save();
            
            return res.json({mesagge:"Point saved!"})
        }
        else{
            return res.status(400).send({mesage:"Data incomplete"})
        }
        }
    catch(err){
        return res.status(500).send(err);
    }
}

pointsControllers.updatePoint = async (req,res) =>{
    //actualiza the deprecated level

    const {lat, lng} = req.body.coords
 
    let pointToUpdate =await pointModel.findOne({lat, lng})
    
    let deleteOption = false;

    if(pointToUpdate.deprecated_level<5 || !deleteOption ){
      await pointModel.updateOne({lat,lng},{deprecated_level:pointToUpdate.deprecated_level+1})
      res.json({mesagge:"Point updated!"})
    }else {
      const {type, frecuence, deprecated_level, id} = pointToUpdate
      await deletePoint(id, lat, lng, type, frecuence, deprecated_level);
      console.log(id)
      res.json({message:"point deleted!"})
    }
    
}

deletePoint = async (id,lat,lng,type,frecuence,deprecated_level)=>{
    //move to a back up and deprecated database

    const deprecatedPoint = await pointModel.findByIdAndDelete(id)


    const newPoint = new backupPointModel({
            lat,
            lng,
            type,
            frecuence,
            deprecated_level
            })
    await newPoint.save();
}

module.exports = pointsControllers