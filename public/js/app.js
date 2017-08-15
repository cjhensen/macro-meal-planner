const MACRO_CALC_FORM='.js-macro-calc',GENDER_INPUT='.js-gender-choice',AGE_INPUT='.js-age-input',HEIGHT_FT_INPUT='.js-height-input-ft',HEIGHT_IN_INPUT='.js-height-input-in',WEIGHT_INPUT='.js-weight-input',ACTIVITY_INPUT='.js-activity-choice',GOAL_INPUT='.js-goal-choice',BTN_GENERATE_MACROS='.js-btn-macro-calc',MACRO_DISPLAY='.js-macro-display',MACRO_DISPLAY_CALS='.js-total-cals',MACRO_DISPLAY_PROTEIN='.js-macro-protein',MACRO_DISPLAY_CARBS='.js-macro-carbs',MACRO_DISPLAY_FAT='.js-macro-fat',MEAL_COUNT_INPUT='.js-meal-count',BTN_GENERATE_RECIPE='.js-btn-recipe-generator',API_URL='https://api.edamam.com/search',API_APP_ID='c5c24658',API_APP_KEY='34543537cae6e24edf2fa8fc9c747a95',appState={userInfo:{},macros:{},macroMealSplit:{}};function handleMacroBtnClicked(a){console.log('handleMacroBtnClicked'),a.preventDefault(),assignUserInfoToAppState(),assignMacroValuesToAppState(),updateMacroDisplay(appState.macros)}function convertUserHeight(a,b){return 2.54*(12*a+b)}function convertUserWeight(a){return a/2.2}function calculateTdee(a){return'male'===a?(10*convertUserWeight(appState.userInfo.weight)+6.25*convertUserHeight(appState.userInfo.height_ft,appState.userInfo.height_in)-5*appState.userInfo.age+5)*appState.userInfo.activity:'female'===a?(10*convertUserWeight(appState.userInfo.weight)+6.25*convertUserHeight(appState.userInfo.height_ft,appState.userInfo.height_in)-5*appState.userInfo.age-161)*appState.userInfo.activity:void 0}function calculateTotalCaloriesByGoal(a,b){return'gain'===a?b+0.2*b:'lose'===a?b-0.2*b:void 0}function updateMacroDisplay(a){console.log('updateMacroDisplay');const b=$(`${MACRO_DISPLAY_CALS} span`),c=$(`${MACRO_DISPLAY_PROTEIN} li:eq(0) span`),d=$(`${MACRO_DISPLAY_PROTEIN} li:eq(1) span`),e=$(`${MACRO_DISPLAY_CARBS} li:eq(0) span`),f=$(`${MACRO_DISPLAY_CARBS} li:eq(1) span`),g=$(`${MACRO_DISPLAY_FAT} li:eq(0) span`),h=$(`${MACRO_DISPLAY_FAT} li:eq(1) span`);[b,c,d,e,f,g,h].forEach(function(a){a.text('')}),b.append(a.totalCals),c.append(a.protein.calories),d.append(a.protein.grams),e.append(a.carbs.calories),f.append(a.carbs.grams),g.append(a.fat.calories),h.append(a.fat.grams)}function calculateMacros(){const a=calculateTdee(appState.userInfo.gender);console.log('tdee',a);const b=calculateTotalCaloriesByGoal(appState.userInfo.goal,a);console.log('totalCalories',b);const c={totalCals:b,protein:{grams:calculateProtein(appState.userInfo.weight).grams,calories:calculateProtein(appState.userInfo.weight).calories},fat:{grams:calculateFat(b).grams,calories:calculateFat(b).calories},carbs:{grams:calculateCarbs(calculateProtein(appState.userInfo.weight).calories,calculateFat(b).calories,b).grams,calories:calculateCarbs(calculateProtein(appState.userInfo.weight).calories,calculateFat(b).calories,b).calories}};return console.log('macros',c),c}function assignMacroValuesToAppState(){console.log('assignMacroValuesToAppState',assignMacroValuesToAppState),Object.assign(appState.macros,calculateMacros())}function calculateProtein(a){return{grams:a,calories:4*a}}function calculateFat(a){const b=.25*a;return{grams:b/9,calories:b}}function calculateCarbs(a,b,c){const d=c-(a+b);return{grams:d/4,calories:d}}function assignUserInfoToAppState(){Object.assign(appState.userInfo,getMacroFormValues())}function convertActivityInput(a){let b=0;return b='sedentary'===a?1.2:'light'===a?1.375:'moderate'===a?1.55:'very'===a?1.725:'extreme'===a?1.9:1,b}function getMacroFormValues(){const a={gender:$(GENDER_INPUT).val(),age:parseInt($(AGE_INPUT).val()),height_ft:parseInt($(HEIGHT_FT_INPUT).val()),height_in:parseInt($(HEIGHT_IN_INPUT).val()),weight:parseInt($(WEIGHT_INPUT).val()),activity:convertActivityInput($(ACTIVITY_INPUT).val()),goal:$(GOAL_INPUT).val()};return a}function assignEventHandlers(){$(BTN_GENERATE_MACROS).on('click',handleMacroBtnClicked),$(BTN_GENERATE_RECIPE).on('click',handleRecipeBtnClicked)}function runApp(){console.log('runApp'),assignEventHandlers()}$(runApp());function handleRecipeBtnClicked(a){a.preventDefault(),console.log('handleRecipeBtnClicked'),assignRandomMacroValuesToAppState(getRecipeCountInputValue())}function getRecipeCountInputValue(){return console.log('getRecipeCountInputValue'),$(MEAL_COUNT_INPUT).val()}function calculateIndividualMacroMealSplit(a,b,c){var d=Math.floor;console.log(a),console.log('userMacros',b),console.log('individualMacro',c);let e=b[c].grams;console.log('originalMacroNum',e);let f=a,g=e/10,h=e-g*f,j=Array(f-1);for(let d=0;d<j.length;d++)j[d]=Math.random();j.sort();let k,l=Array(f),m=0;for(let e=0;e<j.length;e++)k=j[e]-m,l[e]=d(k*h)+g,m=j[e];return l[f-1]=d(h*(1-m))+g,console.log('randomMacros',l),l}function assignRandomMacroValuesToAppState(a){console.log('assignRandomMacroValuesToAppState',assignRandomMacroValuesToAppState),Object.assign(appState.macroMealSplit.protein=calculateIndividualMacroMealSplit(a,appState.macros,'protein')),Object.assign(appState.macroMealSplit.carbs=calculateIndividualMacroMealSplit(a,appState.macros,'carbs')),Object.assign(appState.macroMealSplit.fat=calculateIndividualMacroMealSplit(a,appState.macros,'fat')),console.log('as mms',appState.macroMealSplit)}function getRecipesFromApi(a,b){$.ajax({url:API_URL,data:{q:a,app_id:API_APP_ID,app_key:API_APP_KEY},dataType:'json',type:'GET',success:b})}