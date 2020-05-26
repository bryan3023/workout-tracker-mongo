const {Exercise} = require("../models")

const ExerciseController = {

  getAll(req, res){
    Exercise.findAll({
      attributes: {exclude: ['createdAt', 'updatedAt']}
    }).then(response => {
      const result = {
        status: "success",
        data: response.map(r => r.dataValues)
      }
      res.json(result)
    }).catch(error => {
      const result = {
        status: "failure",
        data: error.message
      }
      res.json(result)
    })
  }

}

module.exports = ExerciseController 