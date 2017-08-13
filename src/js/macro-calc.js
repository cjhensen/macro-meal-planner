const MACRO_CALC_FORM = '.js-macro-calc';
const GENDER_INPUT = '.js-gender-choice';
const AGE_INPUT = '.js-age-input';
const HEIGHT_FT_INPUT = '.js-height-input-ft';
const HEIGHT_IN_INPUT = '.js-height-input-in';
const WEIGHT_INPUT = '.js-weight-input';
const ACTIVITY_INPUT = '.js-activity-choice';
const GOAL_INPUT = '.js-goal-choice';
const BTN_GENERATE_MACROS = '.js-btn-macro-calc';

const appState = {
  userInfo: {
  }
};

// When macro button is clicked:
// Get the values from the macro form
function handleMacroBtnClicked(event) {
  console.log('handleMacroBtnClicked');
  event.preventDefault();
  assignUserInfoToAppState();
  console.log('appState', appState);
  calculateMacros();
}

// Convert user height from inches to centimeters for the equation
function convertUserHeight(height_ft, height_in) {
  const ftToInches = height_ft * 12;
  const totalInches = ftToInches + height_in;
  const heightInCm = totalInches * 2.54;
  return heightInCm;
}

// Convert user weight from pounds to kilograms for the equation
function convertUserWeight(weight) {
  const weightInKg = weight / 2.2;
  return weightInKg;
}

// Calculates TDEE based on gender due to the varying formulas
function calculateTdee(gender) {
  if(gender === "male") {
    return ((10 * convertUserWeight(appState.userInfo.weight)) + (6.25 * convertUserHeight(appState.userInfo.height_ft, appState.userInfo.height_in)) - (5 * appState.userInfo.age) - 5) * appState.userInfo.activity;
  }
  if(gender === "female") {
    return (10 * convertUserWeight(appState.userInfo.weight) + 6.25 * convertUserHeight(appState.userInfo.height_ft, appState.userInfo.height_in) - 5 * appState.userInfo.age - 161) * appState.userInfo.activity;
  }
}

// Calculate total calories for either goal by increasing or decreasing the tdee by a percentage
function calculateTotalCaloriesByGoal(goal, tdee) {
  if(goal === "gain") {
    return tdee + (tdee * .20);
  }
  if(goal === "lose") {
    return tdee - (tdee * .20);
  }
}

function calculateMacros() {
  // male && gain weight
  const tdee = calculateTdee(appState.userInfo.gender);
  console.log('tdee', tdee);
  const totalCalories = calculateTotalCaloriesByGoal(appState.userInfo.goal, tdee);
  console.log('totalCalories', totalCalories);

  const macros = {
    protein: {
      grams: appState.userInfo.weight,
      calories: appState.userInfo.weight * 4
    },
    fat: {
      grams: appState.userInfo.weight * .4,
      calories: (appState.userInfo.weight * .4) * 9
    }
  }
  console.log('macros', macros);
}


// Assigns the form values to an object in the app state
function assignUserInfoToAppState() {
  Object.assign(appState.userInfo, getMacroFormValues());
}

// Converts the activity string to its corresponding number multiplier
function convertActivityInput(val) {
  let activityMultiplier = 0;

  switch(val) {
    case "sedentary":
      activityMultiplier = 1.2;
      break;
    case "light":
      activityMultiplier = 1.375;
      break;
    case "moderate":
      activityMultiplier = 1.55;
      break;
    case "very":
      activityMultiplier = 1.75;
      break;
    case "extreme":
      activityMultiplier = 1.9;
      break;
    default:
      activityMultiplier = 1;
    }

    return activityMultiplier;
}

// Gets the values from the macro form
// Returns them as an object, after converting
// the string numbers to integers
// and converting the activity string to its matching number
function getMacroFormValues() { 
  const macroFormValues = {
    gender: $(GENDER_INPUT).val(),
    age: parseInt($(AGE_INPUT).val()),
    height_ft: parseInt($(HEIGHT_FT_INPUT).val()),
    height_in: parseInt($(HEIGHT_IN_INPUT).val()),
    weight: parseInt($(WEIGHT_INPUT).val()),
    activity: convertActivityInput($(ACTIVITY_INPUT).val()),
    goal: $(GOAL_INPUT).val()
  }

  return macroFormValues;
}

// Sets up event handlers for:
// macro button click
// 
function assignEventHandlers() {
  $(BTN_GENERATE_MACROS).on('click', handleMacroBtnClicked);
}

// Runs the app
// Assigns event handlers
function runApp() {
  console.log('runApp');
  assignEventHandlers();
}

$(runApp());