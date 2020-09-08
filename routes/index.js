/***************************************
 .___            .___
 |   | ____    __| _/____ ___  ___
 |   |/    \  / __ |/ __ \\  \/  /
 |   |   |  \/ /_/ \  ___/ >    <
 |___|___|  /\____ |\___  >__/\_ \
 \/      \/    \/      \/
 Index related API
 *****************************************/

const express = require('express')
const router = express.Router()

router.get('/health', function (req, res) {
  res.json({ message: 'OK' })
})

module.exports = router
