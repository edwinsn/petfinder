const { Router } = require("express");
const { getPoints, postPoint, updatePoint,
  getDataBase, deletePoint } = require("../controllers/pointsController");
const { postFeedBack } = require("../controllers/suggestionsControllers");
const { getRefuges, getRefugeDetails } = require("../controllers/refugesControllers.js")

// eslint-disable-next-line
const router = Router();


router.route("/").get(getPoints)
  .post(postPoint)
  .put(updatePoint)
  .delete(deletePoint);

router.route("/database").get(getDataBase);

router.route("/feedBack").post(postFeedBack);

router.route("/refuges").get(getRefuges)

router.route("/refugeDatails").get(getRefugeDetails)

module.exports = router;
