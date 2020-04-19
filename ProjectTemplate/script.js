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
            if (responseFromServer > 0) {
                location.href = "homeProfile.html";
                localStorage.setItem("UserId", responseFromServer);
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

function postUser() {
    var webMethod = "ProjectServices.asmx/ImportUsers";
    $.ajax({
        type: "POST",
        url: webMethod,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var usersArray = data.d;
            console.log(usersArray);
            //var usersID = localStorage.getItem('usersid');
            var usersID = localStorage.getItem("UserId") - 1;
            console.log(usersArray);
            console.log(usersID);

            firstName = usersArray[usersID]._FirstName;
            document.getElementById("fName").innerHTML = firstName;

            lastName = usersArray[usersID]._LastName;
            document.getElementById("lName").innerHTML = lastName;

            welcome = usersArray[usersID]._FirstName;
            document.getElementById("welcomeFname").innerHTML = welcome;


            myers = usersArray[usersID]._MyersBriggs;
            document.getElementById("myersBriggs").innerHTML = myers;

            hobbies = usersArray[usersID]._Hobbies;
            document.getElementById("hobby1").innerHTML = hobbies;

            goals = usersArray[usersID]._CareerGoals;
            document.getElementById("goal1").innerHTML = goals;

            jobTitle = usersArray[usersID]._JobTitle;
            document.getElementById("jobTitle").innerHTML = jobTitle;

            department = usersArray[usersID]._Department;
            document.getElementById("jobDept").innerHTML = department;

            //location = usersArray[usersID]._Location;
            //document.getElementById("Location").innerHTML = location;

            university = usersArray[usersID]._University;
            document.getElementById("university").innerHTML = university;

            gradDate = usersArray[usersID]._GradDate;
            document.getElementById("gradYear").innerHTML = gradDate;

            eduLevel = usersArray[usersID]._EdLevel;
            document.getElementById("edLevel").innerHTML = eduLevel;

            eduFocus = usersArray[usersID]._EdFocus;
            document.getElementById("edFocus").innerHTML = eduFocus;

            loc = usersArray[usersID]._Location;
            document.getElementById("userLocation").innerHTML = loc;

            // make sure there is two different locations job vs user location
            jobLoc = usersArray[usersID]._Location;
            document.getElementById("jobLocation").innerHTML = jobLoc;

            availabilityType = usersArray[usersID]._AvailabilityType;
            console.log(availabilityType);

            for (i = 0; i < availabilityType.length; i++) {
                $("input[name='availType']").filter(function () {
                    return availabilityType[i].indexOf(this.value) != -1;
                }).prop("checked", true);
            }


            availabilityTimes = usersArray[usersID]._AvailabilityTimes;
            console.log(availabilityTimes);

            for (i = 0; i < availabilityTimes.length; i++) {
                $("input[name='availTime']").filter(function () {
                    return availabilityTimes[i].indexOf(this.value) != -1;
                }).prop("checked", true);
            }
        }
    });
}
