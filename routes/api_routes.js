const router = require('express').Router()

const {
  WorkoutController,
  ActivityController,
  ExerciseController
} = require('../controllers')


router.post("/activity", ActivityController.setOne)

router.get("/workout", WorkoutController.getAll)
router.post("/workout", WorkoutController.create)

router.get("/exercise", ExerciseController.getAll)


module.exports = router

