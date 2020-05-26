/*
  Define the Activity model, which consists of an exercise and the conditions
  to perform it under.
 */
module.exports = function(sequelize, DataTypes) {
  const Activity = sequelize.define("Activity", {
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sets: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    reps: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    distance: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  })

  Activity.associate = function(models) {
    models.Workout.hasMany(Activity, {
      as: 'activities',
      foreignKey: 'workoutId'
    })
    models.Exercise.hasMany(Activity, {
      foreignKey: 'exerciseId'
    })
  }

  return Activity
}
