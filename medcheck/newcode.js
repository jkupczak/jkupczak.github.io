/////////////////////
/////////////////////
var action = function() {

  var e = event.target;

  if ( e.dataset.delete ) {
    deleteCheck(e);
  }

};

/////////////////////
/////////////////////
var deleteCheck = function(e) {

  var savedItems = document.querySelectorAll(".item-row[data-saved='true']");

  if ( savedItems.length < 2 ) {
    console.log("can't delete item, campaigns need at least 1 checklist item");
    return false;
  }
  else {
    deleteItem(item);
  }

};

/////////////////////
/////////////////////
var deleteItem = function(e) {

  var rowName = e.parentNode.dataset.name;

  // Remove the field from the database
  var removeCapital = campaign.update({
      ['fields.' + rowName]: firebase.firestore.FieldValue.delete()
  });

  // now remove the row from this page
  e.parentNode.remove();
};
