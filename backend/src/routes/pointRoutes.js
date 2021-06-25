const {Router} = require('express');
const {getPoints, postPoint, updatePoint, deletePoint, getDataBase} = require('../controllers/pointsController')


const router = Router();


router.route("/").get(getPoints)
                 .post(postPoint)
                 .put(updatePoint)
                 
router.route("/database").get(getDataBase)
                
module.exports = router