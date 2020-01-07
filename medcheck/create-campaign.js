function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// Default Fields
/////////////////
var defaultFields =
  {
    fields: {
      subject: {
        name: "Subject Line",
        order: "1"
      },
      previewText: {
        name: "Preview Text",
        order: "2"
      },
      content: {
        name: "Content",
        order: "3"
      },
      links: {
        name: "Links",
        order: "4"
      },
      eventTimes: {
        name: "Event Times",
        order: "5"
      },
      eventLocations: {
        name: "Event Locations",
        order: "6"
      },
      spellCheck: {
        name: "Spell Check",
        order: "7"
      }
    }
  };

// Metadata
///////////
var metadata = {
  discipline: "",
  subscription: "",
  campaignType: "",
  campaignName: ""
};

// Page Elements
////////////////
var addItemBtn = document.getElementById("addItemBtn");
var itemListWrapper = document.getElementById("itemListWrapper");

// Other variables
///////////
var campaignId = "";
var campaign = "";

//////////////////
//////////////////
var buildAdminRows = function(data) {

  var fields = data.fields;

  Object.keys(fields).forEach(function (item) {

  	console.log(item); // key
  	console.log(fields[item].order); // value

    buildListRow({name: item, order: fields[item].order, friendlyName: fields[item].name});

  });

  // Finished building rows, reveal the add button
  addItemBtn.style.display = "";

};

//////////////////
//////////////////
var buildListRow = function(data) {

  if ( !data ) {
    var data = {
      order: document.querySelectorAll(".item-row").length,
      name: "",
      friendlyName: "",
      saved: "false"
    };
  }
  else {
    data.saved = "true";
  }

  var row = "<div class='item-row' data-saved='" + data.saved + "' data-name='" + data.name + "' data-order='" + data.order + "'><div class='reorder'></div><input type='text' value='" + data.friendlyName + "'><div class='delete' data-delete='true'></div></div>";

  itemListWrapper.insertAdjacentHTML("beforeend", row);

};





/////////////////////
/////////////////////
var addItem = function() {
  console.log("addItem()");

  buildListRow();

  document.querySelectorAll(".item-row:last-child input")[0].focus();

};
addItemBtn.addEventListener("click", addItem, false);


/////////////////////
/////////////////////
var action = function() {

  var e = event.target;

  if ( e.dataset.delete ) {
    deleteItem(e);
  }

};

/////////////////////
/////////////////////
var deleteItem = function(e) {

  var row = e.parentNode;
  var rowName = row.dataset.name;

  if ( row.dataset.saved === "true" ) {
    // Remove the field from the database
    // https://stackoverflow.com/questions/47452855/delete-a-field-from-firestore-with-a-dynamic-key/47555348#47555348
    var removeField = campaign.update({
      ['fields.' + rowName]: firebase.firestore.FieldValue.delete()
    });
  }

  // now remove the row from this page
  row.remove();
};

/////////////////////
/////////////////////
var clearItemRows = function() {

  var range = document.createRange();
  range.selectNodeContents(itemListWrapper);
  range.deleteContents();

};


/////////////////////
/////////////////////
var checkListItemEdited = function() {
  console.log("checkListItemEdited()");

  var input = event.target;
  var row = input.parentNode;

  if ( input.value.length > 0 ) {

    saveChecklistItem(input, row);

  }

};


/////////////////////
/////////////////////
var saveChecklistItem = function(input, row) {
  console.log("saveChecklistItem()");



  row.dataset.saved = "true";
};


/////////////////////
/////////////////////
var playgroundCampaignCreate = function() {
  console.log("playgroundCampaignCreate()");

  var campaignId = document.getElementById("campaignId").value;

  var result = lookForCampaign(campaignId, true, function(data) {
    buildAdminRows(data);
  });

};


/////////////////////
/////////////////////
var itemListWrapper = document.getElementById("itemListWrapper");
itemListWrapper.addEventListener("click", action, false);


/////////////////////
/////////////////////
itemListWrapper.addEventListener("change", checkListItemEdited, false);


/////////////////////
/////////////////////
var createBtn = document.getElementById("submit");
createBtn.addEventListener("click", function() {
  doSomethingWithACampaign(document.getElementById("campaignId").value);
}, false);





function doSomethingWithACampaign(campaignId) {

    clearItemRows();

    getCampaign(campaignId, function(campaign) {
		  console.log(campaign);
      buildAdminRows(campaign);
	});
}



////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

// playgroundData
var exampleId = "12345";
var campaignIdInEmail = "";


// determine platform and get IDs
var platformName, campaignIdInEmail, activeCampaignMsgId;

if ( /pardot/i.test(window.location.host) ) {
  platformName = "pardot";
  campaignIdInEmail = window.location.pathname.replace(/^.+\//i, "");

}
else {
  platformName = "ac";
  // campaignIdInEmail +=;
  // use the new api for getting querystring

}





// create id portion of the email
if ( platformName === "pardot" ) {
  campaignIdInEmail = campaignId;
} else {
  campaignIdInEmail = campaignId + "-" + activeCampaignMsgId;
}

// put it together. create a regex too
var emailCode = "+qa-" + platformName + "-" + campaignIdInEmail;
var emailCodeRegex = new RegExp( "." + escapeRegExp(emailCode) + "@", "gi");

var modifyEmailAddress = function() {
  if ( event.target.tagName === "INPUT" ) {



    var str = event.target.value;

    var count = (str.match(/@/g) || 0).length;



    console.log(count);


    var emails = str.split(",");
    console.log(emails);

    var newString = "";
    emails.forEach(function (email, index) {

      console.log(index); // index
    	console.log(email); // value

      // is it a valid email yet?
      if ( /.@./gi.test(email) ) {

        // does it have the qa code?
        if ( !emailCodeRegex.test(email) ) {
          console.log("true ", email);

          // first remove any existing aliases.
          email = email.replace(/\+.+?@/i, "@");

          // update email and replace it in array
          let replace = email.trim().split("@");
          replace = replace[0] + emailCode + "@" + replace[1];
          console.log(replace);
          newString += replace + ", ";

        }
        else {
          console.log("false ", email);
          newString += email.trim() + ", ";
        }

      }
      else {
        newString += email.trim() + ", ";
      }

    });

    newString = newString.replace(/, +$/, "");

    event.target.value = newString;

  }
}

document.body.addEventListener("change", modifyEmailAddress, false);
