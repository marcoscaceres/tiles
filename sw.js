'use strict';
importScripts('async.js');
var weatherData;
// Set the callback for the install step

const fetchWeather = async(function* () {
  try {
    var req = yield fetch('preview/weather.json')
    var data = yield req.json();
  } catch (err) {
    console.log(err);
  }
  console.log('done fetching weather!');
  return data;
});

self.addEventListener('install', async(function* (inst) {
  //inst.waitUntil(fetchWeather());
  console.log('installing done...');
}));

self.addEventListener('fetch', async(function* (event) {
  try {
    console.log("checking match of "  + event.request.url);
    if (/preview.html$/.test(event.request.url)) {
      var html = getHTML(weatherData);
      console.log(html);
      var response = new Response();
      const init = {
        headers: {
          'Content-Type': 'text/html;charset=utf-8'
        }
      }
      var resp = new Response(html, init);
      event.respondWith(resp);
    }
  } catch (e) {
    console.log("fetch err!", e)
  }
}));

self.addEventListener('activate', async(function* (event) {
  weatherData = yield fetchWeather();
  console.log("finished activate...");
}));

function getHTML(data) {
  console.log("getHTML",data);
  var data = data || {
    weather: [{
      main: 'testing'
    }],
    name: 'testing',
  };
  var html = `<!doctype html>
  <style>
  html, body{
    height: 100%;
    padding: 0;
    margin: 0;
  }
  body {
      background: url(clouds.png) no-repeat center center fixed;
      background-size: cover;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
  }
  section {
      font-size: 1em;
      text-align: center;
      display: flex;
      align-items: center;
      border-radius: 20%;
      padding: 5%;
      background-color: rgba(255,255,255,.5);
  }
  </style>
  <section>
      <div class="pill" id="leftpill">
          ${data.weather[0].main}
      </div>
      <div class="pill" id="righpill">
          ${data.name}
      </div>
  </section>`;
  return html;
}
