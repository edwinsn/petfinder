const {Router} = require('express');
const {getPoints, postPoint, updatePoint, deletePoint, getDataBase} = require('../controllers/pointsController')
const {postFeedBack} = require("../controllers/suggestionsControllers")

const router = Router();


router.route("/").get(getPoints)
                 .post(postPoint)
                 .put(updatePoint)
                 
router.route("/database").get(getDataBase)

router.route("/feedBack").post(postFeedBack)
                
module.exports = router