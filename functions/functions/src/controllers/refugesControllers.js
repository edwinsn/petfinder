
const functions = require("firebase-functions");
let axios = require('axios')

const refugesControllers = {};

refugesControllers.getRefuges = async (req, res) => {

    let { lat, lng, radius } = req.body

    try {

        const { data } = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}
        &radius=${radius}   
        &keyword=refugio%animal
        &key=${functions?.config().env?.PLACESKEY || process.env.PLACESKEY}`)

        let refuges = data.results.map(e => {
            return {
                lat: e.geometry.location.lat,
                lng: e.geometry.location.lng,
                name: e.name,
                _id: e.place_id
            }
        })

        //res.json(data.results)
        res.json(refuges)

    } catch (err) {
        console.log(err)
    }

}


refugesControllers.getRefugeDetails = async (req, res) => {

    let { _id } = req.body

    try {
        const { data } = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${_id}&key=${functions?.config().env?.PLACESKEY || process.env.PLACESKEY}&fields=business_status,formatted_address,formatted_phone_number,opening_hours,website`)

        res.json(data)

    } catch (err) {
        console.log(err)
    }
}

module.exports = refugesControllers;