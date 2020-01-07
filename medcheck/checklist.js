var checkList, checkListItems;

//
//////////////////////
var runChecklist = function(campaignId, subcampaignId, user) {

  // Set variables
  checkList = document.getElementById("qa-checklist");
  checkListItems = document.getElementById("checklist");

  // Get campaign data from data.js using provided ID.
  // This will wait for the data to be returned.
  // Then we can run some functions with that data.
  getCampaign(campaignId, function(data) {

    if ( !data ) {
      console.log("false");
    }
    else {

      buildUserRows(data);
      updateListWithValues(data[subcampaignId][user]);

    }

  });
};


//
//////////////////////
var selectSubCampaign = function(data, subcampaignId, callback) {

  console.log(data);
  console.log(subcampaignId);

  var subcampaigns = data.subcampaigns;

  for (var i = 0, keys = Object.keys(subcampaigns); i < keys.length; i++) {

    if ( subcampaigns[keys[i]].subject === subject ) {
      console.log("found matching subcampaign:", subcampaigns[keys[i]]);
      callback(subcampaigns[keys[i]]);
      return;
    }

  }

};


// populate the list of items from firebase
//////////////////////
var buildUserRows = function(data) {

  console.group("buildUserRows");

  var fields = data.fields;

  Object.keys(fields).forEach(function (savedItem) {
  	console.group(savedItem); // key
  	console.log(fields[savedItem]); // value

    buildUserRow(savedItem, fields[savedItem].name, fields[savedItem].order);
    console.groupEnd();
  });

  console.groupEnd();

};

// give our list of items values (approved/skipped)
//////////////////////
var updateListWithValues = function(data) {
  console.group("updateListWithValues");
  console.log(data);

  Object.keys(data).forEach(function (savedItem) {
    console.group(savedItem); // key
  	console.log(data[savedItem]); // value

    if ( data[savedItem] === "approved" || data[savedItem] === "skipped" ) {
      var item = document.querySelectorAll("[data-item='" + savedItem + "']")[0];
      if (item) {
        updatePage(item, data[savedItem]);
      }
    }
    console.groupEnd();
  });

  console.groupEnd();

  revealChecklist();
};

// hide the spinner
/////////////////
var revealChecklist = function() {
  document.getElementById("spinner").remove();
  document.getElementById("checklist").style.removeProperty('display');
  document.getElementById("checklistHeader").style.removeProperty('display');
};



/////////////////
/////////////////
/////////////////
var processClick = function(e) {

  var el = e.target;

  // update database
  //////////////////
  var saveChoice = function(choice) {

    console.log(campaign);
    console.log(choice);

    var valueUpdate = {};
    valueUpdate[`subcampaigns.abc.james.eventtimes`] = "approved";
    console.error(valueUpdate);

    campaign.update(valueUpdate)
    .then(function() {
        console.log("Document successfully written!");
        updatePage(item, status);
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
  };

  //
  ////////////////
  var cancelStatusChange = function() {
    item.classList.remove("select-option");
  };

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


};

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
  // console.log(percent);

  progressBar.style = "width:" + percent + "%";

};

/////////////////////
/////////////////////
/////////////////////
var checklist = document.getElementById("checklist");
document.addEventListener("click", processClick);


// build checklist item
/////////////////
var buildUserRow = function(name, friendlyName, order) {
  console.log("building new checklist item and injecting it");
  var item = '<div class="list-item unconfirmed" data-item="' + name + '" style="order:' + order + '"><div class="list-item-wrapper"><div class="item-title">' + friendlyName + '</div><div class="item-confirm"><svg height="30" viewBox="0 0 1792 1792" width="30" xmlns="http://www.w3.org/2000/svg"><path fill="#ffffff" d="M1671 566q0 40-28 68l-724 724-136 136q-28 28-68 28t-68-28l-136-136-362-362q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 295 656-657q28-28 68-28t68 28l136 136q28 28 28 68z"/></svg></div><div class="item-options"><div class="item-skipped">Skip</div><div class="item-approved"> <svg height="30" viewBox="0 0 1792 1792" width="30" xmlns="http://www.w3.org/2000/svg"><path fill="#ffffff" d="M1671 566q0 40-28 68l-724 724-136 136q-28 28-68 28t-68-28l-136-136-362-362q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 295 656-657q28-28 68-28t68 28l136 136q28 28 28 68z"/></svg></div></div></div></div>';

  checkListItems.insertAdjacentHTML("beforeend", item);

};
