const {feedBackModel} = require("../Models/feedback");

const feedBackControllers = {};
// eslint-disable-next-line
feedBackControllers.postFeedBack = async (req, res) => {
  try {
    const {isSlow, isConfuse, moreSuggestions} = req.body;
    const newSuggestion = new feedBackModel({
      isSlow,
      isConfuse,
      moreSuggestions,
    });
    /* console.log({
            isSlow,
            isConfuse,
            moreSuggestions
        })*/

    await newSuggestion.save();

    return res.json({mesagge: "Suggestion saved!"});
  } catch (err) {
    return res.json({mesagge: "Error:Bad data!"});
  }
};

module.exports = feedBackControllers;
