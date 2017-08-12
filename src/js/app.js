const API_URL = "https://api.edamam.com/search";
const API_APP_ID = "c5c24658";
const API_APP_KEY = "34543537cae6e24edf2fa8fc9c747a95";

function getDataFromApi(searchTerm, callback) {
  
  const settings = {
    url: API_URL,
    data: {
      q: searchTerm,
      app_id: API_APP_ID,
      app_key: API_APP_KEY
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };
  $.ajax(settings);
}

function showQueryData(data) {
  console.log('showQueryData');
  console.log('data', data);

}

getDataFromApi("chicken", showQueryData);