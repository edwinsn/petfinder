const {Schema, model} = require("mongoose")

const pointSchema = new Schema({

        lat:{type:Number,require:true},
        lng:{type:Number,require:true},
        type:{type:String, require:true},
        frecuence:{type:String, require:true},
        deprecated_level:{type:Number}  
    },
    {
        timestamps:true
    });

module.exports = {pointModel:model("point", pointSchema), backupPointModel:model("pointsbackup", pointSchema)};