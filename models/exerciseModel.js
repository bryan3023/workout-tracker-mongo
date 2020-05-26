/*
  Define the Exercise model, which constists of an exercise type and its name.
 */
module.exports = function(sequelize, DataTypes) {
  const Exercise = sequelize.define("Exercise", {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1],
        isIn: [['cardio', 'strength', 'stretching', 'balance']]
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    }
  })

  return Exercise
}
