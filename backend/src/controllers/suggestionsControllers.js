const { feedBackModel } = require("../Models/feedback")

const feedBackControllers = {}

feedBackControllers.postFeedBack = async (req, res) => {
    try {

        const { isSlow, isConfuse, moreSuggestions } = req.body
        let newSuggestion = new feedBackModel({
            isSlow,
            isConfuse,
            moreSuggestions
        })
        /*console.log({
            isSlow,
            isConfuse,
            moreSuggestions
        })*/

        await newSuggestion.save();

        return res.json({ mesagge: "Suggestion saved!" })

    }
    catch (err) {

        return res.json({ mesagge: "Error:Bad data!" })
    }
}

module.exports = feedBackControllers