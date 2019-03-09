const express = require("express")
const router = express.Router()
const axios = require("axios")


router.get("/", (req, res) => {
    var gifApiUrl = "http://api.giphy.com/v1/gifs/search?api_key=v8eWEjQEV5jPlgw7GIV1emj4lI1wX7ws&q=basketball?limit=1"
    axios.get(gifApiUrl)
        .then(response => {
            var gifImgUrl = response.data.data[0].images.downsized_large.url
            res.render("index/landing", { gifUrl: gifImgUrl })
        })
        .catch(error => {
            res.send(error)
        })
})

router.get("*", (req, res) => {
    res.render("index/error404")
})


module.exports = router
