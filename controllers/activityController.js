const {Activity} = require("../models")

const {
  removeSequelizeColumns,
  removeEmptyProperties
} = require('../lib')

const ActivityController = {

  getAll(req, res){
    Activity.findAll({
      attributes: {exclude: ['createdAt', 'updatedAt']}
    }).then(response => {
      const result = {
        status: "success",
        data: response.map(r => r.dataValues)
      }
      result.data.foreach(d => removeEmptyProperties(d))
      res.json(result)
    }).catch(error => {
      const result = {
        status: "failure",
        data: error.message
      }
      res.json(result)
    })
  },


  setOne(req, res) {
    Activity.create(req.body).then(({dataValues}) => {
      const result = {
        status: "success",
        data: dataValues
      }
      removeSequelizeColumns(result.data)
      removeEmptyProperties(result.data)
      res.json(result)
    })
    .catch(error => {
      const result = {
        status: "failure",
        data: error.message
      }
      res.json(result)
    })
  }

}

module.exports = ActivityController 