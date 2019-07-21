/////////////////////
//
//
//   PWA Service Worker
//
//
/////////////////////

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => {
        console.log('Service worker registered! 😎', reg);
      })
      .catch(err => {
        console.log('😥 Service worker registration failed: ', err);
      });
  });
}



/////////////////////
//
//
//  Update All Visuals
//
//
/////////////////////

var updateAllVisuals = function() {

 console.log(days);

 let trips = document.querySelectorAll(".cost-trigger");
 trips.forEach(function (trip, index) {

   console.log(trip);
   console.log(index);

 });

}


/////////////////////
//
//
//   Carpool Calculator
//
//
/////////////////////

// Get or create the days object
var days = JSON.parse(localStorage.getItem('days'));
console.log(days);

if ( days ) {

  updateAllVisuals();

}

else {

  var days = {
    sunAm: 0,
    sunPm: 0,
    monAm: 0,
    monPm: 0,
    tueAm: 0,
    tuePm: 0,
    wedAm: 0,
    wedPm: 0,
    thuAm: 0,
    thuPm: 0,
    friAm: 0,
    friPm: 0,
    satAm: 0,
    satPm: 0,
  }

}

// Get or create the settings object
var settings = JSON.parse ( localStorage.getItem('settings') );
if ( !settings ) {
  var settings = {
    incrementValue: 0.50
  }
  localStorage.setItem('settings', JSON.stringify(settings));
}



/////////////////////
//
//
//   XXX
//
//
/////////////////////
document.getElementById("calculator").addEventListener("click", function() {
  if ( event.target.dataset.trip ) {

    var trip = event.target;
    trip.classList.remove("inactive");

    var day = trip.dataset.trip;

    console.log(days);

    // Calculate and Update day
    if ( trip.innerText === "+" ) {
      trip.innerText = "$0.00";
    }
    else {
      days[day] = days[day] + settings.incrementValue;
      trip.innerText = roundAsDollars(days[day]);
    }
    //
    updateStorage();

    // Calculate and Update Total
    calcTotal(days);

  }
})



var calcTotal = function(obj) {

  console.log();

  var total = Object.keys(obj).reduce((sum,key)=>sum+parseFloat(obj[key]||0),0);

  total = roundAsDollars(total);

  document.getElementById("dollars").innerText = total;

  console.log( total );
}

var roundAsDollars = function(int) {
  return "$" + Number(int).toFixed(2);
}


// RELOAD
var reset = function() {
  console.log("resetting calculator");

  // reset object
  console.groupCollapsed("Resetting totals object");
  for (var key in days) {
  	if (days.hasOwnProperty(key)) {

		  console.log(key); // key (ex. sandwich)
	    console.log(days[key]); // value (ex. turkey)

      days[key] = 0;
  	}
  }
  updateStorage();
  console.groupEnd();

  // Reset visuals
  document.getElementById("dollars").innerText = "$0.00";

  let trips = document.querySelectorAll(".cost-trigger");
  trips.forEach(function (trip) {

    trip.classList.add("inactive");
    trip.innerText = "+";

  });

}
document.getElementById("reload").addEventListener("click", reset, false);


// TOUCH

var copyTotal = function() {
  copyToClipboard(this.innerText);
}

document.getElementById("total").addEventListener("touchstart", copyTotal, false);
document.getElementById("total").addEventListener("click", copyTotal, false);



/////////////////////
//
//
//   Update Storage
//
//
/////////////////////

var updateStorage = function() {

  localStorage.setItem('days', JSON.stringify(days));

}



//
// var onlongtouch;
// var timer;
// var touchduration = 500; //length of time we want the user to touch before we do something
//
// touchstart() {
//   console.log("hi!")
//     timer = setTimeout(onlongtouch, touchduration);
// }
//
// touchend() {
//
//     //stops short touches from firing the event
//     if (timer)
//         clearTimeout(timer); // clearTimeout, not cleartimeout..
// }
//
// onlongtouch = function() { //do something };


function copyToClipboard(str) {
    /* ——— Derived from: https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
           improved to add iOS device compatibility——— */
    const el = document.createElement('textarea'); // Create a <textarea> element

    let storeContentEditable = el.contentEditable;
    let storeReadOnly = el.readOnly;

    el.value = str; // Set its value to the string that you want copied
    el.contentEditable = true;
    el.readOnly = false;
    el.setAttribute('readonly', false); // Make it readonly false for iOS compatability
    el.setAttribute('contenteditable', true); // Make it editable for iOS
    el.style.position = 'absolute';
    el.style.left = '-9999px'; // Move outside the screen to make it invisible
    document.body.appendChild(el); // Append the <textarea> element to the HTML document
    const selected =
        document.getSelection().rangeCount > 0 // Check if there is any content selected previously
            ? document.getSelection().getRangeAt(0) // Store selection if found
            : false; // Mark as false to know no selection existed before
    el.select(); // Select the <textarea> content
    el.setSelectionRange(0, 999999);
    document.execCommand('copy'); // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el); // Remove the <textarea> element
    if (selected) {
        // If a selection existed before copying
        document.getSelection().removeAllRanges(); // Unselect everything on the HTML document
        document.getSelection().addRange(selected); // Restore the original selection
    }

    el.contentEditable = storeContentEditable;
    el.readOnly = storeReadOnly;
}
