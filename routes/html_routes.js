const
  router = require("express").Router(),
  {AboutController} = require("../controllers")


router.get('/', AboutController.getAbout)


module.exports = router
