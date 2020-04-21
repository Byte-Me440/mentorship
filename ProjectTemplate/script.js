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

    $("body").css("cursor", "progress");
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
                localStorage.setItem("UserId", responseFromServer);
                location.href = "homeProfile.html";
            }
            else {
                alert("Either Username or Password is Incorrect. Please try again.");
                $("body").css("cursor", "default");
            }
        },
        error: function (e) {
            console.log("this code will only execute if javascript is unable to access the webservice");
            $("body").css("cursor", "default");
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
                window.location.replace("loginPage.html");
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

usersArray = [];
mentorsArray = [];
connectionsPageDisplayArray = [];

function importUsers(){
    var webMethod = "ProjectServices.asmx/ImportUsers";
    $.ajax({
        type: "POST",
        url: webMethod,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        //TODO: If I can fix this, fix it. Probably not good to be doing synchronous webcalls
        async: false,
        success: function (data) {
            usersArray = data.d;
            // make an array with only mentors to search from
            mentorsArray = usersArray.filter(function (e) {
                return e._MentorFlag;
            });

            // make the mentor list the first base display on the connections page
            connectionsPageDisplayArray = mentorsArray
        }
    })
}

function postUser() {

    importUsers();

    var usersID = localStorage.getItem("UserId") - 1;

    // mapping from webcall to html page
    firstName = usersArray[usersID]._FirstName;
    document.getElementById("fName").innerHTML = firstName;
    lastName = usersArray[usersID]._LastName;
    document.getElementById("lName").innerHTML = lastName;
    welcome = usersArray[usersID]._FirstName;
    document.getElementById("welcomeFname").innerHTML = welcome;
    myers = usersArray[usersID]._MyersBriggs;
    document.getElementById("userEmail").innerHTML = email;
    email = usersArray[usersID]._Email;
    document.getElementById("myersBriggs").innerHTML = myers;
    hobbies = usersArray[usersID]._Hobbies;
    document.getElementById("hobby1").innerHTML = hobbies;
    goals = usersArray[usersID]._CareerGoals;
    document.getElementById("goal1").innerHTML = goals;
    jobTitle = usersArray[usersID]._JobTitle;
    document.getElementById("jobTitle").innerHTML = jobTitle;
    department = usersArray[usersID]._Department;
    document.getElementById("jobDept").innerHTML = department;
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
    for (i = 0; i < availabilityType.length; i++) {
        $("input[name='availType']").filter(function () {
            return availabilityType[i].indexOf(this.value) != -1;
        }).prop("checked", true);
    }
    availabilityTimes = usersArray[usersID]._AvailabilityTimes;
    for (i = 0; i < availabilityTimes.length; i++) {
        $("input[name='availTime']").filter(function () {
            return availabilityTimes[i].indexOf(this.value) != -1;
        }).prop("checked", true);
    }
}

function initialPostConnection() {

    //variables to determine which users we post to the page
    var firstPostedUser = 0;
    var lastPostedUser = 5;

    importUsers();

    localStorage.setItem("ConnectionPageNumber", 1);
    firstPostedUser = 0;
    var arrayIndex = firstPostedUser;
    postConnection();

}

function postConnection(connectionsArray=mentorsArray) {

    var arrayIndex = 0;
    
    // hides all spots, enabling posting loop to show them
    for (let counter = 1; counter < 7; counter++) {
        
        profilePicID = "#profilePic" + counter;
        fnameID = "#fName" + counter;
        expertiseID = "#expertise" + counter;
        jobTitleID = "#jobTitle" + counter;
        locationID = "#location" + counter;

        $(profilePicID).hide();
        $(fnameID).hide();
        $(expertiseID).hide();
        $(jobTitleID).hide();
        $(locationID).hide();
    }
    
    for (let counter = 1; counter < connectionsArray.length + 1; counter++) {

        // iterates across all of the users on the page
        // maps all of first user, moves onto next
        // counter = page counter
        // arrayIndex = based on firstPosted User to accomodate for pages

        // setting names of Ids
        profilePicID = "#profilePic" + counter;
        fnameID = "#fName" + counter;
        expertiseID = "#expertise" + counter;
        jobTitleID = "#jobTitle" + counter;
        locationID = "#location" + counter;

        console.log(fnameID);
        console.log(expertiseID);
        $(fnameID).text(connectionsArray[arrayIndex]._FirstName + " " + connectionsArray[arrayIndex]._LastName);
        $(expertiseID).text(connectionsArray[arrayIndex]._EdFocus);
        $(jobTitleID).text(connectionsArray[arrayIndex]._JobTitle);
        $(locationID).text(connectionsArray[arrayIndex]._Location);
        console.log(connectionsArray[arrayIndex]._FirstName);
        arrayIndex++;
        
        $(profilePicID).show();
        $(fnameID).show();
        $(expertiseID).show();
        $(jobTitleID).show();
        $(locationID).show();
        

    }
}

function filterConnection() {
    var filteredArray = [];

    console.log($("#filterDropDown").val());
    switch ($("#filterDropDown").val()) {
        case "personality":
            comparison = $("#filterText").val();
            filteredArray = mentorsArray.filter(function (e) {
                return e._MyersBriggs.toLowerCase().trim() === comparison.toLowerCase().trim();
            })
            console.log(filteredArray);
            postConnection(filteredArray);
            break;

        case "availType":
            comparison = $("#filterText").val();
            filteredArray = mentorsArray.filter(function (e) {
                return e._AvailabilityType.includes(comparison);
            })
            postConnection(filteredArray);
            break;

        case "availTime":
            comparison = $("#filterText").val();
            filteredArray = mentorsArray.filter(function (e) {
                return e._AvailabilityTimes.includes(comparison);
            })
            postConnection(filteredArray);
            break;

        case "Location":
            comparison = $("#filterText").val();
            filteredArray = mentorsArray.filter(function (e) {
                return e._Location.toLowerCase().trim() === comparison.toLowerCase().trim();
            })
            postConnection(filteredArray);
            break;

        case "Dept":
            comparison = $("#filterText").val();
            filteredArray = mentorsArray.filter(function (e) {
                return e._Department.toLowerCase().trim() === comparison.toLowerCase().trim();
            })
            postConnection(filteredArray);
            break;

        default:
            alert("Please Select a filter and try again")
            break;
    }

        

}

