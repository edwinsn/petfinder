const {Schema, model} = require("mongoose")

const pointSchema = new Schema({

        lat:{type:Number,require:true},
        lng:{type:Number,require:true},
        type:{type:String, require:true},
        frecuence:{type:Number, require:true},
        initialFrecuence:{type: Number, require:true},
        range:{type:Number,require}
    },
    {
        timestamps:true
    });

module.exports = {pointModel:model("point", pointSchema), backupPointModel:model("pointsbackup", pointSchema)};