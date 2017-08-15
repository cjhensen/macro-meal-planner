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






