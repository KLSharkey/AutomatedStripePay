//Main function - must run first and call other functions
//global vaiables
var coachPayAmount=0;
//var coachStripeAccount=0;

function onEdit(event) {
  //Logger.log("event");
  var sheetOnEdit = event.range.getSheet(); //gets the sheet that was edited 
  var actRng = event.source.getActiveRange(); //get sthe range that was edited
  var index = actRng.getRowIndex(); //get row number for the added row
  //Logger.log(index);
  //Logger.log(sheet.getName());
  //Logger.log(actRng);

//only run if the event was on the Payments tab
  if(sheetOnEdit.getName() == "Payments"){ 
    var sheet = sheetOnEdit;
    var stripeAccountAdded = sheet.getRange(index, 7).getValue();
    if(stripeAccountAdded.length == 0) {
      Logger.log("it's blank");
    } else {
      Logger.log("there is an account number");
      return;
    }
    //var index = actRng.getRowIndex();
    var textSvc = sheet.getRange(index, 6).getValue();//grab value based on Column F and using var index
    var position1 = textSvc.search("with");
    var startposition = position1 + 5;
    var position2 = textSvc.search('&')
    if (position2 == -1) {
      var resultCoach = textSvc.substring(startposition)
    } else {
      var resultCoach = textSvc.substring(startposition,position2-1)
    }
    
    Logger.log(resultCoach);
    Logger.log(textSvc);
//Get service
    //var textSvc="Payment for Allspring Subscription with Stephanie Heath & Winn";
    var position1Svc=12;
    var position2Svc=textSvc.search("with");
    var resultSvc=textSvc.substr(position1Svc,(position2Svc-position1Svc)-1);
    //Logger.log((position2Svc-position1Svc)-1);
    Logger.log(resultSvc);
    findStripeAccount(resultCoach, index);
    findCoachPay(resultSvc, index);
      
    }  
}

//Function to find the Stripe account number for the coach based on the "Stripe" tab
function findStripeAccount(resultCoach, index) {
  var indexRow = index; //keep track of active row
  //Logger.log("made it to findStripeAccount")
  var stripeSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Stripe"); //go to "Stripe" tab
  //var sheet = SpreadsheetApp.getActiveSheet()
  var search_string = resultCoach; //the coach we want to search for
  var textFinder = stripeSheet.createTextFinder(search_string); //find coach
  var search_row = textFinder.findNext().getRow(); //find row number that coach name is in (in column A)
  Logger.log("search row: " + search_row); 
  var coachStripeAccount = stripeSheet.getRange(search_row, 2).getValue(); //coach's stripe account number
  Logger.log(coachStripeAccount);
  assignStripeAccountNumber(coachStripeAccount, indexRow);
}

//Function to find the Coaches payment amount for the service
function findCoachPay(resultSvc, index) {
  var indexRow = index; //keep track of active row
  //Logger.log("made it to findCoachPay")
  var stripeSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CoachPay"); //go to "CoachPay" tab
  //var sheet = SpreadsheetApp.getActiveSheet()
  var search_string = resultSvc; //the service we want to search for
  var textFinder = stripeSheet.createTextFinder(search_string); //find service
  var search_row = textFinder.findNext().getRow(); //find row number that service is in (in column A)
  Logger.log("search row: " + search_row); 
  coachPayAmount = stripeSheet.getRange(search_row, 2).getValue(); //service payment amount
  Logger.log(coachPayAmount);
}

//Function to assign the stripe account number (based on the func above) to the payment entry in the "Payments" tab
function assignStripeAccountNumber (coachStripeAccount, indexRow) {
  var index = indexRow; //active row to add stripe account number to
  var stripeAccountAdd = coachStripeAccount;
  Logger.log("At assign stripe account function " + index);
  var paymentsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Payments");
  paymentsSheet.getRange(index, 7).setValue(stripeAccountAdd); //adds the stripe account number to column G
  //sendPaymentToStripe(stripeAccountAdd);
}