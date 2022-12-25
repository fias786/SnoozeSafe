"use strict";

// Change Eyes closed threshold value for future use.

let eyesClosedThreshold = 0.65; // For 65% open eyes.
let timeThreshold = 800; // For 0.8 seconds;

let lastClosedTime,
  continuous = false;
let alarm = document.getElementById("alarm");
let body = document.querySelector("body");

//entry point :
function main() {
  NEELFCTRFAPI.init({
    canvasId: "canvas",
    NNCpath: "src/model/",
    callbackReady: function(errCode) {
      if (errCode) {
        console.log(
          "ERROR - cannot init NEELFCTRFAPI. errCode =",
          errCode
        );
        errorCallback(errCode);
        return;
      }
      console.log("INFO : NEELFCTRFAPI is ready !!!");
      successCallback();
    } //end callbackReady()
  });
} //end main()

function successCallback() {
  // Call next frame
  document.getElementById("full-page-loader").style.display = "none";
  nextFrame();
  // Add code after API is ready.
}

function errorCallback(_errorCode) {
  // Add code to handle the error
  alert("Cannot work without camera. Check if the camera is attached.");
}



function nextFrame() {
  let deltaTime = Date.now() - lastClosedTime;
  if (deltaTime > timeThreshold && continuous) {
    start_alarm();
    // console.log("Alarm Called");
    body.style.background = "linear-gradient(120deg, #EF0107 0%, #FC9842 100%)";

    document.getElementById("alertz").innerHTML = "⚠️ ALERT";
    document.getElementById("alertz").style.color = "white";
    // document.getElementById("heartbeatz").innerHTML = 0;
    setTimeout(function() {
      document.getElementById("alertz").innerHTML = "🟢 NORMAL";
      document.getElementById("alertz").style.color = "green";
    }, 200);


    
    
  } else {
    stop_alarm();
    // body.style.background = "#fff";
    // body style linear gradient
    body.style.background = "linear-gradient(90deg, #D7E1EC 0%, #FFFFFF 100%)";
  }

  if (NEELFCTRFAPI.is_detected()) {
    // Gand Marao
    let expressions = NEELFCTRFAPI.get_morphTargetInfluences();
    //**************************************************************************** */
    if (
      expressions[8] >= eyesClosedThreshold && // For left and right eye
      expressions[9] >= eyesClosedThreshold
    ) {
      if (lastClosedTime === undefined || !continuous)
        lastClosedTime = Date.now(); // Now is the new time
      continuous = true;
    } else {
      continuous = false;
    }

    // The API is detected
    // console.log("Detected");
  } else {
    // Tell the user that detection is off.
    continuous = false;
    // console.log("Not Detected");
  }
  // Replay frame
  requestAnimationFrame(nextFrame);
}

    // // create a function that returns a value to id heartbeatz between 65 and 95 every 2.5 seconds if the eyes are open and 0 if the eyes are closed
    // function heartbeatz() {
    //   if (continuous) {
    //     document.getElementById("heartbeatz").innerHTML = Math.floor(Math.random() * 30) + 65;
    //   } else {
    //     document.getElementById("heartbeatz").innerHTML = 0;
    //   }
    // }
    

