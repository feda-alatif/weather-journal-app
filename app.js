onst FAPIKey = "jq4JXgGeqxzcyBk78hZrin30VIKE2f9GNp05Xbm7";
const URL = "https://api.nasa.gov/planetary/apod?api_key=jq4JXgGeqxzcyBk78hZrin30VIKE2f9GNp05Xbm7" + FAPIKey;
const BBUrl = "http://localhost:8000"


function getCCD() {  
  let d = new Date();
  return d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();
}

function getruu() {
    const ent = document.getElementById('feelings');
  
    return ent.value
  }

function getc() {
  const c = document.getElementById('zip');
 
  return c.value
}





const w = async (url= '', zipCode = '') => {
  const Wurl = url + "&zip=" + zipCode
  const rt = await fetch(Wurl);
  try {
    const dataw = await rt.json();
    return dataw;
  }
  catch(error) {
   
    console.log("error", error);
  }
}

const dData = async ( url = '', data = {})=>{
    const rd = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),       
    });
  
    try {
      const Datan = await rd.json();
      return Datan;
    }catch(error) {
      console.log("error", error);
    }
  };
function iuu(date, temperature, content) {

  document.getElementById('pressure').innerText = date;
  document.getElementById('temp').innerText = temperature;
  document.getElementById('rh').innerText = content;
}





function getWeather(url='', zipCode='', userResponse='') {
  w(url, zipCode)
    .then(function(weatherofd={}) {
    
      const data = {
        'temperature'   : weatherofd.main.temp,
        'date'          : getCCD(),
        'user_response' : getruu()
      }
      return data;
    })
    .then(function (data={}) {
      console.log(data);
      dData(BBUrl+'/', data);
      return data;
    })
    .then(function (data={}) {
      updateUI(data.date, data.temperature, data.user_response);
    });
}


window.addEventListener('DOMContentLoaded', (event) => {
  const temp = document.getElementById('generate');
  console.log(temp);
  temp.addEventListener("click", function() {
    getWeather(URL, getc(), getruu());
  });
});
