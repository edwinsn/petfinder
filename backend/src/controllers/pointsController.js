const {pointModel, backupPointModel} = require("../Models/point")

const pointsControllers = {}

pointsControllers.getPoints = async (req, res)=>{
    const {lowerlat, upperlat, lowerlng, upperlng, markersLoaded} = req.query

    let points = await pointModel.find({
        lat:{$gt:lowerlat,$lt:upperlat},
        lng:{$gt:lowerlng,$lt:upperlng}
    });
    points = points.filter(e=>{
        if(markersLoaded.includes(e.lat+""+e.lng)) {
            return false}
        return true
    })
    console.log("-returned:"+points.length)
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
        console.log(req.body.frecuence)
        if(type.length&&frecuence&&lat&&lng){

            const newPoint = new pointModel({
                lat,
                lng,
                type,
                frecuence,
                deprecated_level:9-2*frecuence
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
    let newDeprecatedLevel
    try{
        newDeprecatedLevel = pointToUpdate.deprecated_level+(isDeprecated?1:-1)
    }
    catch(err){
        console.log("Err")
        newDeprecatedLevel = 0
    }
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