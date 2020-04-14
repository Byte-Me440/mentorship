function createAccount() {
    var id = document.getElementById("createId").value;
    var pass = document.getElementById("createPass").value;

    var webMethod = "ProjectServices.asmx/createAccount";

    var parameters = "{\"uid\":\"" + encodeURI(id) + "\", \"pass\":\"" + encodeURI(pass) + "\"}";


    //jQuery ajax method
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var responseFromServer = msg.d;
            if (responseFromServer == true) {
                alert(responseFromServer);
                //window.location.replace("index.html");
            }
            else {
                alert(responseFromServer);
            }
            //after creating an account, sends you back to the login page (works here but also works when password isnt set right)
            //window.location.replace("index.html");
        },
        error: function (e) {
            console.log("this code will only execute if javascript is unable to access the webservice");
        }
    });
}

//function openCharacterSheet(id) {
//    localStorage.setItem('usersid', id);
//    window.location.href = 'homeProfile.html';
//}

function logon() {
    var id = document.getElementById("logonId").value;
    var pass = document.getElementById("logonPass").value;

    var webMethod = "ProjectServices.asmx/LogOn";

    var parameters = "{\"uid\":\"" + encodeURI(id) + "\", \"pass\":\"" + encodeURI(pass) + "\"}";


    //jQuery ajax method
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var responseFromServer = msg.d;
            if (responseFromServer == true) {
                //location.href = "mainpage.html";
                alert("logged In");
            }
            else {
                alert("Either Username or Password is Incorrect. Please try again.");
            }
        },
        error: function (e) {
            console.log("this code will only execute if javascript is unable to access the webservice");
        }
    });
}


//function postUser() {
//    var webMethod = "ProjectServices.asmx/ImportUsers";
//    $.ajax({
//        type: "POST",
//        url: webMethod,
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (data) {
//            var usersArray = data.d;
//            //var usersID = localStorage.getItem('usersid');
//            //var usersID = 1;
//            console.log(usersArray);
//            //console.log(usersID);

//            $("#nameId").val(usersArray[usersID]._UserId);
//            $("#fName").val(usersArray[usersID]._FirstName);
//            $("#lName").val(usersArray[usersID]._LastName);
//            //$("#armorClassId").val(usersArray[usersID]._Email);
//            $("#Location").val(usersArray[usersID]._Location);
//            $("#jobTitle").val(usersArray[usersID]._JobTitle);
//            $("#jobDept").val(usersArray[usersID]._Department);
//            $("#edLevel").val(usersArray[usersID]._EdLevel);
//            $("#edFocus").val(usersArray[usersID]._EdFocus);
//            $("#university").val(usersArray[usersID]._University);
//            $("#gradYear").val(usersArray[usersID]._GradDate);
//            $("#goal1").val(usersArray[usersID]._CareerGoals);

//            $("#myersBriggs").val(usersArray[usersID]._MyersBriggs);
//            $("#hobby1").val(usersArray[usersID]._Hobbies);
//            $("#constitutionId").val(usersArray[usersID]._AvailabilityTimes);
//            $("#intelligenceId").val(usersArray[usersID]._AvailabilityType);
//            $("#bio").val(usersArray[usersID]._Bio);
//            //$("#charismaId").val(usersArray[usersID]._MentorFocus);
//            //$("#hitPointsId").val(usersArray[usersID]._MentorFlag);



//            var x = usersArray[usersID]._level



//            //$("#name1").val(characterArray[0]._charName);
//            //$("#class1").val(characterArray[0]._class);
//            //$("#level1").val(characterArray[0]._level);

//            //$("#name2").val(characterArray[1]._charName);
//            //$("#class2").val(characterArray[1]._class);
//            //$("#level2").val(characterArray[1]._level);

//            //$("#name3").val(characterArray[2]._charName);
//            //$("#class3").val(characterArray[2]._class);
//            //$("#level3").val(characterArray[2]._level);

//            //$("#name4").val(characterArray[3]._charName);
//            //$("#class4").val(characterArray[3]._class);
//            //$("#level4").val(characterArray[3]._level);

//        }
//    });
//}


//logs the user off both at the client and at the server
function logOff() {
    var webMethod = "ProjectServices.asmx/LogOff";
    $.ajax({
        type: "POST",
        url: webMethod,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d) {
                //we logged off, so go back to logon page,
                //stop checking messages
                //and clear the chat panel
                //showPanel('logonPanel');
                //HideMenu();
                window.location.replace("index.html");
                console.log(msg.d);
            }
            else {
            }
        },
        error: function (e) {
            console.log("boo...");
        }
    });
}

