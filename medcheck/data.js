            /// FROM PETE
            //
            // function createCampaign(campaignId) {
            //     var defaultFields = {
            //         fields: {
            //             subject: {
            //                 name: "Subject Line",
            //                 order: "1"
            //             },
            //             previewText: {
            //                 name: "Preview Text",
            //                 order: "2"
            //             }
            //         }
            //     };
            //
            //     return campaign.set(defaultFields);
            // }
            //
            //
            // function getCampaign(campaignId, callback, skipCreate) {
            //     campaign.get().then(function(doc) {
            //         if (doc.exists) {
            //             callback(doc.data());
            //             return;
            //         }
            //
            //         if (skipCreate) {
            //             callback(false);
            //             return;
            //         }
            //
            //         createCampaign(campaignId).then(function() {
            //             getCampaign(campaignId, callback);
            //         }).catch(function(error){
            //             callback(false);
            //         });
            //
            //     }).catch(function(error) {
            //         callback(error);
            //     });
            // };
            //
            //
            // function doSomethingWithACampaign(campaignId) {
            //
            //     // If you want to create missing campaigns
            //     getCampaign(campaignId, function(campaign) {
            //         // Do something with the campaign
            //     });
            //
            //     // If you want to not create missing campaigns
            //     getCampaign(campaignId, function(campaign) {
            //         // Do something with the campaign
            //     }, true);
            // }


var createCampaign = function(campaignId) {

  // the campaign variable has already been set by the getCampaign function.
  // use it to set our default fields
  return campaign.set(defaultFields);

};


var getCampaign = function(campaignId, callback) {

  console.log("getting campaign data for id ", campaignId);

  campaign = db.collection("campaigns").doc(campaignId);

  campaign.get().then(function(doc) {
      if (doc.exists) {
          console.log("doc exists");
          callback(doc.data());
          return;
      }

      createCampaign(campaignId).then(function() {
          getCampaign(campaignId, callback);
      }).catch(function(error){
		callback(false);
	});

  }).catch(function(error) {
      callback(error);
  });

};



// // read firebase to check if the campaign exists
// /////////////////
// var createCampaigA = function(campaignId) {
//   console.log("createCampaign()");
//
//   // create a new doc
//   campaign.set(defaultFields)
//   .then(function() {
//     console.log("Document successfully written!");
//     lookForCampaign(campaignId);
//   })
//   .catch(function(error) {
//       console.error("Error writing document: ", error);
//   });
//
//   // campaign.get().then(function(doc) {
//   //     if (doc.exists) {
//   //         console.log("Document data:", doc.data());
//   //         populateListwithItems(doc.data());
//   //         getUserData();
//   //     } else {
//   //         // doc.data() will be undefined in this case
//   //         console.log("No such document!");
//   //         // create a new doc for this user
//   //         campaign.set({content: "pending"})
//   //         .then(function() {
//   //             console.log("Document successfully written!");
//   //             revealChecklist();
//   //         })
//   //         .catch(function(error) {
//   //             console.error("Error writing document: ", error);
//   //         });
//   //     }
//   // }).catch(function(error) {
//   //     console.log("Error getting document:", error);
//   // });
//
//
// };
//
// //////////////////
// //////////////////
// var lookForCampaign = function(campaignId, create, success) {
//   console.log("lookForCampaign()");
//
//   console.log(campaignId, create, success);
//   // if (typeof campaignId !== 'string' ) {
//   //   campaignId = document.getElementById("campaignId").value;
//   // }
//   campaign = db.collection("campaigns").doc(campaignId);
//
//   campaign.get().then(function(doc) {
//     if (doc.exists) {
//
//       console.log("Document exists, document data:", doc.data());
//       success(doc.data());
//
//     } else {
//       // doc.data() will be undefined in this case
//       console.log("No such document found!");
//
//       if ( create ) {
//         createCampaign(campaignId);
//       }
//       else {
//         success(false);
//       }
//
//     }
//   }).catch(function(error) {
//       console.log("Error getting document:", error);
//   });
//
// };
