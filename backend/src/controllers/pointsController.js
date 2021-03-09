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


    const {lat, lng, isDeprecated} = req.body
 
    let pointToUpdate =await pointModel.findOne({lat, lng})
    
    let deleteOption = false;
    let newDeprecatedLevel = pointToUpdate.deprecated_level+(isDeprecated?1:-1)

    if(newDeprecatedLevel>0 && newDeprecatedLevel<10 ){
      await pointModel.updateOne( {lat,lng},{deprecated_level:newDeprecatedLevel} );
      res.json({mesagge:"Point updated!"})
    }else if(deleteOption&&newDeprecatedLevel==0){
      const {type, frecuence, deprecated_level, id} = pointToUpdate
      await deletePoint(id, lat, lng, type, frecuence, deprecated_level);
      console.log(id)
      res.json({message:"point deleted!"})
    }
    else if(newDeprecatedLevel==0)res.json({message:"cant increase more the certainty of the data"})
    else res.json({message:"can decrease more the certainty of the data"})
        
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