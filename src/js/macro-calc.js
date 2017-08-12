const MACRO_CALC_FORM = '.js-macro-calc';
const GENDER_INPUT = '.js-gender-choice';
const AGE_INPUT = '.js-age-input';
const HEIGHT_FT_INPUT = '.js-height-input-ft';
const HEIGHT_IN_INPUT = '.js-height-input-in';
const WEIGHT_INPUT = '.js-weight-input';
const ACTIVITY_INPUT = '.js-activity-choice';
const GOAL_INPUT = '.js-goal-choice';
const BTN_GENERATE_MACROS = '.js-btn-macro-calc';

function handleMacroBtnClicked(event) {
  console.log('handleMacroBtnClicked');
  event.preventDefault();
  console.log(getMacroFormValues());
}

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

function assignEventHandlers() {
  $(BTN_GENERATE_MACROS).on('click', handleMacroBtnClicked);
}

function runApp() {
  console.log('runApp');
  assignEventHandlers();
}

$(runApp());