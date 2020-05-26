/*
  All client-side script.
 */

$(document).ready(() => {

  /*
    Get the initial state.
   */
  function start() {
    getExercises()
    getWorkouts()
  }


  /*
    Manage the state of exercises on the page.
   */
  const Exercises = {
    exercises: [],

    getAll() {
      return this.exercises
    },

    setAll(exercises) {
      this.exercises = exercises
    },

    getName(id) {
      return this.exercises
        .filter(e => parseInt(id) === e.id)[0].name
    }
  }


  /*
    Manage the state of workouts (and their associated actitivties) on the page.
   */
  const Workouts = {
    workouts: [],
    current: null,

    getAll() {
      return this.workouts
    },

    get(id) {
      return this.workouts.filter(w => w.id === id)[0]
    },

    setAll(workouts) {
      workouts.forEach(w => w.day = getDayString(w.day))
      this.workouts = workouts
    },

    getCurrent() {
      return this.get(this.current)
    },

    getCurrentId() {
      return this.current
    },

    setCurrentId(current) {
      this.current = parseInt(current)
    },

    add(workout) {
      workout.activities = []
      workout.day = getDayString(workout.day)
      this.workouts.push(workout)
    },

    getCurrentActivities() {
      return this.getCurrent().activities
    },

    addCurrentActivity(activity) {
      this.getCurrentActivities().push(activity)
    },

    count() {
      return this.workouts.length
    },

    countCurrentActivities() {
      return this.getCurrentActivities().length
    }
  }


  /*
    Key page components.
   */
  const
    $exerciseDropDown = $("select[name='exerciseId']"),
    $workoutList = $("#workouts-list ul"),
    $activityList = $("#activities-list ul"),
    $addWorkoutForm = $("form#add-workout"),
    $addActivityForm = $("form#add-activity")


// --- DOM Population ---

  /*
    Render the list of workout items, highlighting the selected one.
   */
  function renderWorkoutList() {
    $workoutList.empty()

    if (Workouts.count() === 0) {
      $workoutList.append(getRenderedPlaceholderItem("No workouts"))
      return
    }

    Workouts.getAll().forEach(workout => {
      const $workoutItem = getRenderedWorkoutItem(workout)

      if (Workouts.getCurrentId() === workout.id) {
        $workoutItem.addClass("selected")
      }
      $workoutList.append($workoutItem)
    })
  }


  /*
    Render an individual item in the workout list.
   */
  function getRenderedWorkoutItem(item) {
    return $("<li>")
      .addClass("workout-item")
      .attr("data-workout-id", item.id)
      .html(`<span>${item.day}</span> ${item.name}`)
  }


  /*
    Create this list of activities for the current workout and
    show the activity pane.
   */
  function renderActivityList() {
    $activityList.empty()

    if (Workouts.countCurrentActivities() === 0) {
      $activityList.append(getRenderedPlaceholderItem("No activites"))
      showActivitiesPane()
      return
    }

    Workouts.getCurrentActivities().forEach(activity => {
      const $activityItem = getRenderedActivityItem(activity)
      $activityList.append($activityItem)
    })
    showActivitiesPane()
  }


  /*
    Show the activities pane and change its header to show the current workout.
   */
  function showActivitiesPane() {
    renderActivitiesHeader()
    $("div.activity-pane").show()
  }


  /*
    If an activity's target has a value, render HTML for that target.
   */
  function getActivityTargetString(object, property) {
    return property in object && object[property] ?
      `<strong>${property}:</strong> ${object[property]}` :
      null
  }


  /*
    Get a list item with all of the set values for an activity.
   */
  function getRenderedActivityItem(activity) {
    const
      exerciseName = Exercises.getName(activity.exerciseId),
      activityDescription = `<span>${exerciseName}</span>`,
      idValues = ['id', 'workoutId', 'exerciseId'],
      exerciseTargets = []

    removeEmptyProperties(activity)
    for (const property in activity) {
      if (!idValues.includes(property)) {
        exerciseTargets.push(getActivityTargetString(activity, property))
      }
    }

    const $activityItem = $("<li>")
      .addClass("activity-item")
      .html(activityDescription + exerciseTargets.join(", "))

    return $activityItem
  }


  /*
    Update the activity pane's header with the name of the current workout.
   */
  function renderActivitiesHeader() {
    const workoutName = Workouts.getCurrent().name
    $("#activity-header").text(`${workoutName} - Activities`)
  }


  /*
    Get a generic placeholder to show when a list is empty.
   */
  function getRenderedPlaceholderItem(text) {
    return $("<li>").addClass("placeholder").text(text)
  }


  /*
    Fill the drop-down list with exercises to choose from.
   */
  function renderExerciseDropDownList() {
    Exercises.getAll().forEach(exercise => {
      const $exerciseOption = $("<option>")
        .val(exercise.id)
        .text(exercise.name)
      $exerciseDropDown.append($exerciseOption)
    })    
  }


  /*
    Breifly show an alert when the user fails to provide needed input.
   */
  function showAlert(message) {
    const $alertBox = $(".error-alert")
    $alertBox.text(message)
    $alertBox.show()
    setTimeout(() => $alertBox.hide(), 2000)
  }


// --- Event handlers ---
  
  /*
    When an item in the workout list is clicked, show it on the activity pane.
   */
  $workoutList.on("click", ".workout-item", function(event) {
    event.preventDefault()

    $workoutList.children().removeClass("selected")
    $(this).addClass("selected")

    const id = $(this).attr("data-workout-id")
    Workouts.setCurrentId(id)

    renderActivityList()
  })


  /*
    Create a new workout when the user submits a name.
   */
  $addWorkoutForm.on("submit", function(event) {
    event.preventDefault();

    const form = $(this)
    form.find("[name='day']").val(new Date())
    trimFormInputs(form)

    if (form.find("[name='name']").val()) {
      saveWorkout(form.serialize())
      form[0].reset()
    }
  })


  /*
    Add an activity to the current workout.

    Note that when processing this form, we temporarily disable
    empty inputs to prevent them from being serialized.
   */
  $addActivityForm.on("submit", function(event) {
    event.preventDefault()

    const form = $(this)
    form.find("[name='workoutId']").val(Workouts.getCurrentId())
    trimFormInputs(form)
    getEmptyInputs(form).prop('disabled','disabled')

    const
      exerciseId = form.find("[name='exerciseId']").val(),
      countFilledValues = getNonemptyInputs(form).length

    if (!exerciseId) {
      showAlert("Please choose an exercise.")
    } else if (countFilledValues <= 1) {
      showAlert("Choose at least one target for this exercise.")      
    } else {
      saveActivity(form.serialize())
      form[0].reset()
    }

    getEmptyInputs(form).removeAttr('disabled')
  })


// --- API Calls ---

  /*
    Get all exercises, then fill in the drop-down.
   */
  function getExercises() {
    invokeRestCall({
      url: "/api/exercise",
      method: "GET"
    },
    (data) => {
      Exercises.setAll(data)
      renderExerciseDropDownList()
    })
  }


  /*
    Get all workouts, then update the list.
   */
  function getWorkouts() {
    invokeRestCall({
      url: "/api/workout",
      method: "GET"
    },
    (data) => {
      Workouts.setAll(data)
      renderWorkoutList()
    })
  }


  /*
    Save a workout, set it as the current item, then update the page.
   */
  function saveWorkout(workout) {
    invokeRestCall({
      url: "/api/workout",
      method: "POST",
      data: workout
    },
    (data) => {
      Workouts.add(data)
      Workouts.setCurrentId(data.id)
      renderWorkoutList()
      renderActivityList()
    })
  }


  /*
    Add an activity to the current workout, then update the page.
   */
  function saveActivity(activity) {
    invokeRestCall({
      url: "/api/activity",
      method: "POST",
      data: activity
    },
    (data) => {
      Workouts.addCurrentActivity(data)
      renderActivityList()
    })
  }


  /*
    Boilerplate wrapper for API calls.
   */
  function invokeRestCall(ajaxObject, successCb) {
    $.ajax(ajaxObject).then(({status, data}) => {
      if ("success" === status) {
        successCb(data)
      } else {
        const apiName = `${ajaxObject.method} ${ajaxObject.url}`
        console.error(`${apiName} failed: ${data}`)
      }
    })
  }


// --- Utility functions ---

  /*
    Remove properties with no set value to keep object clean.
   */
  function removeEmptyProperties(object) {
    for (let property in object) {
      if (null === object[property]) delete object[property]
      if (undefined === object[property]) delete object[property]
    }
    return object
  }


  /*
    Get all form inputs that have no set value.
   */
  function getEmptyInputs(form) {
    return form.find("input").filter(function() {
      return "" === this.value
    })
  }


  /*
    Get all form inputs that have some set value.
   */
  function getNonemptyInputs(form) {
    return form.find("input").filter(function() {
      return "" !== this.value
    })
  }


  /*
    Trim text across all input fields on a form.
   */
  function trimFormInputs(form) {
    form.children("input").val((index, value) => value.trim())
  }


  /*
    Get a nicely formatted date string. If date is null, the string will
    be for the current time.
   */
  function getDayString(date) {
    return moment(date).format("MMM DD, YYYY")
  }


// --- Start the app ---

  start()

})
