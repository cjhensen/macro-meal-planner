
const MACRO_CALC_FORM = '.js-macro-calc';
const GENDER_INPUT = '.js-gender-choice';
const AGE_INPUT = '.js-age-input';
const HEIGHT_FT_INPUT = '.js-height-input-ft';
const HEIGHT_IN_INPUT = '.js-height-input-in';
const WEIGHT_INPUT = '.js-weight-input';
const ACTIVITY_INPUT = '.js-activity-choice';
const GOAL_INPUT = '.js-goal-choice';
const BTN_GENERATE_MACROS = '.js-btn-macro-calc';
const MACRO_DISPLAY = '.js-macro-display';
const MACRO_DISPLAY_CALS = '.js-total-cals';
const MACRO_DISPLAY_PROTEIN = '.js-macro-protein';
const MACRO_DISPLAY_CARBS = '.js-macro-carbs';
const MACRO_DISPLAY_FAT = '.js-macro-fat';


// Recipe-generator.js
const MEAL_COUNT_INPUT = '.js-meal-count';
const BTN_GENERATE_RECIPE = '.js-btn-recipe-generator';

// API
const API_URL = "https://api.edamam.com/search";
const API_APP_ID = "c5c24658";
const API_APP_KEY = "70914e38dfb0496c9ab318337033b9b9";


const appState = {
  userInfo: {},
  macros: {},
  macroMealSplit: {}
};

// When macro button is clicked:
// Get the values from the macro form
// Assign the values after processing them to the userInfo object in appState
// Assign the values for macros after processing to the macros object in appState
// Update the macro display to show the calcualted macros
function handleMacroBtnClicked(event) {
  console.log('handleMacroBtnClicked');
  event.preventDefault();
  assignUserInfoToAppState();
  assignMacroValuesToAppState();
  updateMacroDisplay(appState.macros);
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
    return ((10 * convertUserWeight(appState.userInfo.weight)) + (6.25 * convertUserHeight(appState.userInfo.height_ft, appState.userInfo.height_in)) - (5 * appState.userInfo.age) + 5) * appState.userInfo.activity;
  }
  if(gender === "female") {
    return ((10 * convertUserWeight(appState.userInfo.weight)) + (6.25 * convertUserHeight(appState.userInfo.height_ft, appState.userInfo.height_in)) - (5 * appState.userInfo.age) - 161) * appState.userInfo.activity;
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

// Show the macros on the page
// Re-factor this:
//  Hide macro display first
//  Have a template in js
//  Populate that template
//  Append the template to the page, instead of doing all these single field selections
function updateMacroDisplay(macros) {
  console.log('updateMacroDisplay');
  const displayCals = $(`${MACRO_DISPLAY_CALS} span`);
  const displayProteinCals = $(`${MACRO_DISPLAY_PROTEIN} li:eq(0) span`);
  const displayProteinGrams = $(`${MACRO_DISPLAY_PROTEIN} li:eq(1) span`);
  const displayCarbsCals = $(`${MACRO_DISPLAY_CARBS} li:eq(0) span`);
  const displayCarbsGrams = $(`${MACRO_DISPLAY_CARBS} li:eq(1) span`);
  const displayFatCals = $(`${MACRO_DISPLAY_FAT} li:eq(0) span`);
  const displayFatGrams = $(`${MACRO_DISPLAY_FAT} li:eq(1) span`);

  const displayFields = [
    displayCals, 
    displayProteinCals, 
    displayProteinGrams, 
    displayCarbsCals, 
    displayCarbsGrams, 
    displayFatCals, 
    displayFatGrams
  ];

  // clear existing text first just in-case they already calculated macros
  displayFields.forEach(function(item) {
    item.text('');
  });

  displayCals.append(macros.totalCals);
  displayProteinCals.append(macros.protein.calories);
  displayProteinGrams.append(macros.protein.grams);
  displayCarbsCals.append(macros.carbs.calories);
  displayCarbsGrams.append(macros.carbs.grams);
  displayFatCals.append(macros.fat.calories);
  displayFatGrams.append(macros.fat.grams);
}


// Gets tdee and total calories and stores them as local variables
// Uses the local variables and appState.userInfo.weight
// Returns an object with macronutrients properly calculated in grams and cals
function calculateMacros() {
  // male && gain weight
  const tdee = calculateTdee(appState.userInfo.gender);
  console.log('tdee', tdee);
  const totalCalories = calculateTotalCaloriesByGoal(appState.userInfo.goal, tdee);
  console.log('totalCalories', totalCalories);

  const macros = {
    totalCals: totalCalories,
    protein: {
      grams: calculateProtein(appState.userInfo.weight).grams,
      calories: calculateProtein(appState.userInfo.weight).calories
    },
    fat: {
      grams: calculateFat(totalCalories).grams,
      calories: calculateFat(totalCalories).calories
    },
    carbs: {
      grams: calculateCarbs(
                  calculateProtein(appState.userInfo.weight).calories, 
                  calculateFat(totalCalories).calories,
                  totalCalories).grams,
      calories: calculateCarbs(
                  calculateProtein(appState.userInfo.weight).calories, 
                  calculateFat(totalCalories).calories,
                  totalCalories).calories
    }
  }
  console.log('macros', macros);

  return macros;
}

function assignMacroValuesToAppState() {
  console.log('assignMacroValuesToAppState', assignMacroValuesToAppState);
  Object.assign(appState.macros, calculateMacros());
}


function calculateProtein(weight) {
  const grams = weight;
  const calories = weight * 4;

  const protein = {
    grams: grams,
    calories: calories
  }

  return protein;
}

function calculateFat(totalCals) {
  const calories = totalCals * .25;
  const grams = calories / 9;
  
  const fat = {
    grams: grams,
    calories: calories
  }

  return fat;
}

function calculateCarbs(proteinCals, fatCals, totalCals) {
  const usedCals = proteinCals + fatCals;
  const remainingCals = totalCals - usedCals;

  const grams = remainingCals / 4;

  const carbs = {
    grams: grams,
    calories: remainingCals
  }

  return carbs;
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
      activityMultiplier = 1.725;
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
  $(BTN_GENERATE_RECIPE).on('click', handleRecipeBtnClicked);
}

// Runs the app
// Assigns event handlers
function runApp() {
  console.log('runApp');
  assignEventHandlers();
}

$(runApp());
function handleRecipeBtnClicked(event) {
  event.preventDefault();
  console.log('handleRecipeBtnClicked');
  const mealCount = getRecipeCountInputValue();
  assignRandomMacroValuesToAppState(mealCount);
  getRecipes(mealCount);

}

function getRecipeCountInputValue() {
  console.log('getRecipeCountInputValue');
  return parseInt($(MEAL_COUNT_INPUT).val());
}

function calculateIndividualMacroMealSplit(mealCount, userMacros, individualMacro) {
  console.log(mealCount);
  let originalMacroNum = userMacros[individualMacro].grams;
  let splitParts = mealCount;
  let minimum = originalMacroNum / 10; // use a random num instead?

  let delta = originalMacroNum - minimum * splitParts;
  let randomNums = new Array(splitParts - 1);

  for(let i = 0; i < randomNums.length; i++) {
    randomNums[i] = Math.random();
  }

  randomNums.sort();

  let randomMacros = new Array(splitParts);
  let last = 0;
  let perc;

  for(let i = 0; i < randomNums.length; i++) {
    perc = randomNums[i] - last;
    randomMacros[i] = Math.floor(perc * delta) + minimum;
    last = randomNums[i];
  }

  randomMacros[splitParts - 1] = Math.floor(delta * (1 - last)) + minimum;

  return randomMacros;
}

function assignRandomMacroValuesToAppState(mealCount) {
  console.log('assignRandomMacroValuesToAppState');
  Object.assign(appState.macroMealSplit.protein = calculateIndividualMacroMealSplit(mealCount, appState.macros, "protein"));
  Object.assign(appState.macroMealSplit.carbs = calculateIndividualMacroMealSplit(mealCount, appState.macros, "carbs"));
  Object.assign(appState.macroMealSplit.fat = calculateIndividualMacroMealSplit(mealCount, appState.macros, "fat"));

  console.log('as mms', appState.macroMealSplit);
}

function getRecipes(mealCount) {
  console.log('getRecipes', getRecipes);
  console.log('mc', mealCount);
  const searchTerms = ["breakfast", "lunch", "dinner", "snack", "snack"];

  const apiOptions = {
  };

  // arrays with length equal to meal count
  const splitCarbs = appState.macroMealSplit.carbs;
  const splitProtein = appState.macroMealSplit.protein;
  const splitFat = appState.macroMealSplit.fat;


  console.log('splits', splitCarbs, splitProtein, splitFat);
  if(mealCount === 5) {
    console.log('if inside');
    for(let i = 0; i < mealCount; i++) {
      let absoluteMealCals = ((splitCarbs[i] * 4) + (splitProtein[i] * 4) + (splitFat[i] * 9));
      console.log('absoluteMealCals', absoluteMealCals);
      let calorieRange = `gte ${Math.floor(absoluteMealCals) - 50}, lte ${Math.floor(absoluteMealCals) + 50}`;
      console.log('calorieRange', calorieRange);
      console.log('typeof cr', typeof(calorieRange));
      apiOptions.calories = calorieRange;
      console.log('apiOptions', apiOptions);
      getDataFromApi(searchTerms[i], apiOptions, processRecipes);
    }
  }

}

function processRecipes(data) {
  console.log('api data', data);
}



function getDataFromApi(searchTerm, options, callback) {

  const settings = {
    url: API_URL,
    data: {
      q: searchTerm,
      calories: options.calories,
      app_id: API_APP_ID,
      app_key: API_APP_KEY
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };
  $.ajax(settings);
}






