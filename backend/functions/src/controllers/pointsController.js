const { pointModel, backupPointModel } = require("../Models/point");

const pointsControllers = {};
// eslint-disable-next-line
pointsControllers.getPoints = async function (req, res) {
  const { lowerlat, upperlat, lowerlng, upperlng, markersLoaded, userid } = req.query;

  let points = await pointModel.find({
    lat: { $gt: lowerlat, $lt: upperlat },
    lng: { $gt: lowerlng, $lt: upperlng },
  });

  points = points.map((e) => {
    const { lat, lng, type, frecuence, range, imgurl, description, contact, _id } = e;
    if (e.userid === userid) {
      return { lat, lng, type, frecuence, range, imgurl, description, contact, _id, userid };
    }
    return { lat, lng, type, frecuence, range, imgurl, description, contact, _id };
  });

  points = points.filter((e) => {
    if (markersLoaded.includes(e.lat + "" + e.lng)) {
      return false;
    }
    return true;
  });
  // console.log("-returned:" + points.length)
  res.json(points);
};

pointsControllers.getDataBase = async (req, res) => {
  const points = await pointModel.find();

  let database = "lat|lng|type|frecuence|area|ingurl|description\n";

  points.forEach((point) => {
    const { lat, lng, type, frecuence, range, imgurl, description } = point;
    database += [lat, lng, type, frecuence, range, imgurl, description].join("|") + "\n";
  });


  const filename = "miociddb.json";
  const mimetype = "application/json";

  res.setHeader("Content-disposition", "attachment; filename=" + filename);
  res.setHeader("Content-type", mimetype);
  res.send(database);
};

pointsControllers.postPoint = async (req, res) => {
  try {
    const { coords, type, frecuence, range, imgurl, description, contact, userid } = req.body;

    const { lat, lng } = coords;

    if (type.length && frecuence && lat && lng) {
      const newPoint = new pointModel({
        lat,
        lng,
        type,
        frecuence,
        initialFrecuence: frecuence,
        range,
        imgurl,
        description,
        contact,
        userid,
      });


      const { id } = await newPoint.save();

      return res.json({ mesagge: "Point saved!", _id: id });
    } else {
      return res.status(400).send({ mesage: "Data incomplete" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

pointsControllers.updatePoint = async (req, res) => {
  const { lat, lng, isDeprecated, userid, newlat, newlng, _id, description, contact, frecuence, imgurl, relocating, range } = req.body;


  // console.log({ lat, lng, isDeprecated, userid, newlat, newlng, _id, description, contact, frecuence, imgurl, relocating })
  let pointToUpdate;

  try {
    pointToUpdate = await pointModel.findById(_id);
  } catch (err) {
    res.status(500).send({ message: "internal error" });
  }

  if (relocating && userid === pointToUpdate.userid) {
    let data = {};


    data = { ...data, description, contact, frecuence };

    if (imgurl) {
      data = { ...data, imgurl };
    }

    await pointModel.findByIdAndUpdate(_id, { lat: newlat, lng: newlng, ...data, range });
    res.json({ message: "updated!" });
  } else {
    const pointToUpdate = await pointModel.findOne({ lat, lng });
    const deleteOption = false;
    let newFrecuence;

    try {
      newFrecuence = pointToUpdate.frecuence + (isDeprecated ? -0.5 : 1);
    } catch (err) {
      console.log("Err");
      newFrecuence = 5;
    }
    newFrecuence = newFrecuence > 5 ? 5 : newFrecuence;
    if (newFrecuence >= 0) {
      await pointModel.updateOne({ lat, lng }, { frecuence: newFrecuence });
      res.json({ mesagge: "Point updated!" });
    } else if (deleteOption && newFrecuence == 0) {
      const { type, initialFrecuence, id } = pointToUpdate;
      await deletePoint(id, lat, lng, type, initialFrecuence);
      // console.log(id)
      res.json({ message: "point deleted!" });
    } else if (newFrecuence == 0) res.json({ message: "cant increase more the certainty of the data" });
    else res.json({ message: "can decrease more the certainty of the data" });
  }
};
deletePoint = async (id, lat, lng, type, initialFrecuence) => {
  // move to a back up and deprecated database

  const deprecatedPoint = await pointModel.findByIdAndDelete(id);

  const newPoint = new backupPointModel({
    lat,
    lng,
    type,
    intitialFrecuence,
  });
  await newPoint.save();
};

module.exports = pointsControllers;
