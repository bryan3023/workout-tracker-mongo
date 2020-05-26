/*
  Define the Workout model.
 */
module.exports = function(sequelize, DataTypes) {
  const Workout = sequelize.define("Workout", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    day: {
      type: DataTypes.DATE,
      allowNull: false
    }
  })

  return Workout
}
