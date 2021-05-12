let express = require('express')
let router = express.Router()

router.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/html/index.html')
})

module.exports = router
