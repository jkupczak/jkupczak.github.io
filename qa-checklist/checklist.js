// create ref to the campaign and the user
/////////////////
// placeholder campaign variable
var campaign = db.collection("campaign-123453331sadXXXasdXXX11").doc("jkupczak");

function runChecklist() {
  // populate data from firebase
  /////////////////
  var populateList = function(data) {

    Object.keys(data).forEach(function (savedItem) {
    	console.log(savedItem); // key
    	console.log(data[savedItem]); // value

      if ( data[savedItem] === "approved" || data[savedItem] === "skipped" ) {
        var item = document.querySelectorAll("[data-item='" + savedItem + "']")[0];
        updatePage(item, data[savedItem]);
      };
    });

    revealChecklist();
  }

  // hide the spinner
  /////////////////
  var revealChecklist = function() {
    document.getElementById("spinner").remove();
    document.getElementById("checklist").style.removeProperty('display');
    document.getElementById("checklistHeader").style.removeProperty('display');
  }

  // read firebase to check if the doc exists
  /////////////////
  campaign.get().then(function(doc) {
      if (doc.exists) {
          console.log("Document data:", doc.data());
          populateList(doc.data());
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
          // create a new doc for this user
          campaign.set({content: "pending"})
          .then(function() {
              console.log("Document successfully written!");
              revealChecklist();
          })
          .catch(function(error) {
              console.error("Error writing document: ", error);
          });
      }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });


  /////////////////
  /////////////////
  /////////////////
  var processClick = function(e) {

    var el = e.target;

    // update database
    //////////////////
    var saveChoice = function(choice) {

      campaign.update(choice)
      .then(function() {
          console.log("Document successfully written!");
          updatePage(item, status);
      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });
    }

    //
    ////////////////
    var cancelStatusChange = function() {
      item.classList.remove("select-option");
    }

    // save the selected option
    /////////////////
    if ( el.closest(".item-options") ) {

      var item = el.closest(".list-item");

      if ( el.closest(".item-approved") ) {

        if ( el.closest(".approved") ) {
          cancelStatusChange();
        }
        else {
          var status = "approved";
          // send info to database
          var key = el.closest(".list-item").dataset.item;
          saveChoice( { [key]: "approved"} );
        }
      }

      if ( el.closest(".item-skipped") ) {

        if ( el.closest(".skipped") ) {
          cancelStatusChange();
        }
        else {
          var status = "skipped";
          // send info to database
          var key = el.closest(".list-item").dataset.item;
          console.log(key);
          saveChoice( { [key]: "skipped"} );
        }

      }

    }
    // trigger the available options
    else if ( el.closest(".item-confirm") ) {

      el.closest(".list-item").classList.add("select-option");

    }
    else {
      var activeItems = document.querySelectorAll(".select-option");
      activeItems.forEach(function (activeItem, index) {
        console.log(index); // index
        console.log(activeItem); // value
        activeItem.classList.remove("select-option");
      });
    }


  }

  ////////////////////
  ////////////////////
  ////////////////////
  var checksLeft = document.querySelectorAll(".list-item").length;
  var totalChecks = checksLeft;
  var progressBar = document.getElementById("progressBar");

  var updatePage = function(item, status) {

    //////////////
    //////////////
    if ( status === "approved" ) {
      item.classList.remove("unconfirmed", "select-option", "skipped");
      item.classList.add("approved");
    }
    else {
      item.classList.remove("unconfirmed", "select-option", "approved");
      item.classList.add("skipped");
    }

    // update page
    //////////////
    checksLeft = document.querySelectorAll(".list-item.unconfirmed").length;
    document.getElementById("progress").innerHTML = checksLeft + " checks remain";

    var percent = (( (totalChecks - checksLeft) / totalChecks) * 100);
    console.log(percent);

    progressBar.style = "width:" + percent + "%";

  }

  /////////////////////
  /////////////////////
  /////////////////////
  var checklist = document.getElementById("checklist");
  document.addEventListener("click", processClick);
}


runChecklist();
