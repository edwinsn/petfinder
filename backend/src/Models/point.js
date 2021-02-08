const {Schema, model} = require("mongoose")

const pointSchema = new Schema({

        lat:{type:Number,require:true},
        lon:{type:Number,require:true},
        nPost:{type:Number,require:true},
        type:{type:String, require:true}

    },
    {
        timestamps:true
    });

module.exports = model("point", pointSchema);