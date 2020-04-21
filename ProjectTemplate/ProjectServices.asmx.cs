using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using MySql.Data;
using MySql.Data.MySqlClient;
using System.Data;

namespace ProjectTemplate
{
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]

    public class ProjectServices : System.Web.Services.WebService
    {
        ////////////////////////////////////////////////////////////////////////
        ///replace the values of these variables with your database credentials
        ////////////////////////////////////////////////////////////////////////
        private string dbID = "byteme";
        private string dbPass = "!!Byteme";
        private string dbName = "byteme";
        ////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////////////////////
        ///call this method anywhere that you need the connection string!
        ////////////////////////////////////////////////////////////////////////
        private string getConString()
        {
            return "SERVER=107.180.1.16; PORT=3306; DATABASE=" + dbName + "; UID=" + dbID + "; PASSWORD=" + dbPass;
        }
        ////////////////////////////////////////////////////////////////////////



        /////////////////////////////////////////////////////////////////////////
        //don't forget to include this decoration above each method that you want
        //to be exposed as a web service!
        [WebMethod(EnableSession = true)]
        /////////////////////////////////////////////////////////////////////////
        public string TestConnection()
        {
            try
            {

                string testQuery = "select * from Login";

                ////////////////////////////////////////////////////////////////////////
                ///here's an example of using the getConString method!
                ////////////////////////////////////////////////////////////////////////
                MySqlConnection con = new MySqlConnection(getConString());
                ////////////////////////////////////////////////////////////////////////

                MySqlCommand cmd = new MySqlCommand(testQuery, con);
                MySqlDataAdapter adapter = new MySqlDataAdapter(cmd);
                DataTable table = new DataTable();
                adapter.Fill(table);
                return "Success!";
            }
            catch (Exception e)
            {
                return "Something went wrong, please check your credentials and db name and try again.  Error: " + e.Message;
            }
        }

        [WebMethod(EnableSession = true)] //NOTICE: gotta enable session on each individual method
        public int LogOn(string uid, string pass)
        {

            //our connection string comes from our web.config file like we talked about earlier
            // use the method used up top
            string sqlConnectString = getConString();
            //here's our query.  A basic select with nothing fancy.  Note the parameters that begin with @
            //NOTICE: we added admin to what we pull, so that we can store it along with the id in the session
            //string sqlSelect = "SELECT id, admin FROM accounts WHERE userid=@idValue and pass=@passValue";
            string sqlSelect = "SELECT UserId FROM Login WHERE Username=@idValue and Pass=@passValue";

            //set up our connection object to be ready to use our connection string
            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            //set up our command object to use our connection, and our query
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            //tell our command to replace the @parameters with real values
            //we decode them because they came to us via the web so they were encoded
            //for transmission (funky characters escaped, mostly)
            sqlCommand.Parameters.AddWithValue("@idValue", HttpUtility.UrlDecode(uid));
            sqlCommand.Parameters.AddWithValue("@passValue", HttpUtility.UrlDecode(pass));

            //a data adapter acts like a bridge between our command object and
            //the data we are trying to get back and put in a table object
            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
            //here's the table we want to fill with the results from our query
            DataTable sqlDt = new DataTable();
            //here we go filling it!
            sqlDa.Fill(sqlDt);
            //check to see if any rows were returned.  If they were, it means it's
            //a legit account

            if (sqlDt.Rows.Count > 0)
            {
                //if we found an account, store the id and admin status in the session
                //so we can check those values later on other method calls to see if they
                //are 1) logged in at all, and 2) and admin or not
                Session["userId"] = sqlDt.Rows[0]["userId"];
                string user = sqlDt.Rows[0]["userId"].ToString();
                return Int32.Parse(user);
            }
            //return the result!
            return 0;
        }

        [WebMethod(EnableSession = true)]
        public bool LogOff()
        {
            //if they log off, then we remove the session.  That way, if they access
            //again later they have to log back on in order for their ID to be back
            //in the session!
            Session.Abandon();
            return true;
        }

        [WebMethod(EnableSession = true)] //NOTICE: gotta enable session on each individual method
        public String CreateAccount(string UserId, string pass)
        {

            string sqlConnectString = getConString();

            // Select pulls the User table so that we can compare to the desired username
            string sqlSelectUserCheck = "SELECT UserID FROM Login WHERE Username=@idValue";
            string sqlInsertNewUser = "INSERT INTO Login(Username,Pass) VALUES(@idValue,@passValue)";

            //COMMAND SET UP
            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlSelectUserCheckCommand = new MySqlCommand(sqlSelectUserCheck, sqlConnection);
            MySqlCommand sqlInsertCommand = new MySqlCommand(sqlInsertNewUser, sqlConnection);

            // SETTING PARAMETERS
            sqlSelectUserCheckCommand.Parameters.AddWithValue("@idValue", HttpUtility.UrlDecode(UserId));
            sqlInsertCommand.Parameters.AddWithValue("@idValue", HttpUtility.UrlDecode(UserId));
            sqlInsertCommand.Parameters.AddWithValue("@passValue", HttpUtility.UrlDecode(pass));

            // opens up pathway to database and fills data table with user names
            // If rows are returned, that means that the desired user name is in use already
            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlSelectUserCheckCommand);
            DataTable sqlDt = new DataTable();
            sqlDa.Fill(sqlDt);

            if (sqlDt.Rows.Count > 0)
            {
                return "User name is in use, please choose another name and try again";
            }


            // establishing check variables for the password
            bool upperLetter = false;
            bool numberCheck = false;

            // Tests each character in the password for validity. If all tests pass, password is valid
            foreach (char c in pass)
            {
                if (char.IsUpper(c))
                {
                    upperLetter = true;
                }

                if (char.IsDigit(c))
                {
                    numberCheck = true;
                }
            }
            //Checks that both an Upper Case Letter and Number are used in the password
            //If either fails, tells user to try again
            if (upperLetter == false || numberCheck == false)
            {
                return "Please make another password that has >One upper case letter and >One number";
            }

            // Opens Connection to execute query, then closes once finished
            sqlConnection.Open();
            int check = sqlInsertCommand.ExecuteNonQuery();
            sqlConnection.Close();

            // checks to see that a row is affected. If the change is made, Alerts user to log in.
            if (check == 1)
            {
                return "Account Successfully Created, You can now log in";
            }
            else
            {
                return "Account Creation Failed";
            }

        }

        [WebMethod(EnableSession = true)] //NOTICE: gotta enable session on each individual method
        public User[] ImportUsers()
        {
            string sqlConnectString = getConString();
            //here's our query.  A basic select with nothing fancy.  Note the parameters that begin with @
            //NOTICE: we added admin to what we pull, so that we can store it along with the id in the session
            //string sqlSelect = "SELECT id, admin FROM accounts WHERE userid=@idValue and pass=@passValue";
            string sqlSelect = "SELECT * from USERS";

            //set up our connection object to be ready to use our connection string
            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            //set up our command object to use our connection, and our query
            MySqlCommand sqlImportUsersCommand = new MySqlCommand(sqlSelect, sqlConnection);

            //a data adapter acts like a bridge between our command object and
            //the data we are trying to get back and put in a table object
            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlImportUsersCommand);
            //here's the table we want to fill with the results from our query
            DataTable sqlDt = new DataTable();
            //here we go filling it!
            sqlDa.Fill(sqlDt);
            //check to see if any rows were returned.  If they were, it means it's
            //a legit account

            List<User> users = new List<User>();
            for (int i = 0; i < sqlDt.Rows.Count; i++)
            {
                users.Add(new User
                {
                    _UserId = sqlDt.Rows[i]["UserId"].ToString(),
                    _FirstName = sqlDt.Rows[i]["FirstName"].ToString(),
                    _LastName = sqlDt.Rows[i]["LastName"].ToString(),
                    _Email = sqlDt.Rows[i]["Email"].ToString(),
                    _Location = sqlDt.Rows[i]["Location"].ToString(),
                    _JobTitle = sqlDt.Rows[i]["JobTitle"].ToString(),
                    _Department = sqlDt.Rows[i]["Department"].ToString(),
                    _EdLevel = sqlDt.Rows[i]["EdLevel"].ToString(),
                    _EdFocus = sqlDt.Rows[i]["EdFocus"].ToString(),
                    _University = sqlDt.Rows[i]["University"].ToString(),
                    _GradDate = sqlDt.Rows[i]["GradDate"].ToString(),
                    _CareerGoals = sqlDt.Rows[i]["CareerGoals"].ToString().Split(','),
                    _MyersBriggs = sqlDt.Rows[i]["MyersBriggs"].ToString(),
                    _Hobbies = sqlDt.Rows[i]["Hobbies"].ToString().Split(','),
                    _AvailabilityTimes = sqlDt.Rows[i]["AvailabilityTimes"].ToString().Split(','),
                    _AvailabilityType = sqlDt.Rows[i]["AvailabilityType"].ToString().Split(','),
                    _Bio = sqlDt.Rows[i]["Bio"].ToString(),
                    _MentorFocus = sqlDt.Rows[i]["MentorFocus"].ToString().Split(','),
                    _MentorFlag = Convert.ToBoolean(sqlDt.Rows[i]["MentorFlag"])
                });
            }
            //convert the list of accounts to an array and return!
            return users.ToArray();
        }

        //EXAMPLE OF AN INSERT QUERY WITH PARAMS PASSED IN.  BONUS GETTING THE INSERTED ID FROM THE DB!
        [WebMethod(EnableSession = true)]
        public string UpdateAccount(
            string FirstName ="",
            string LastName ="",
            string Email ="",
            string Location ="",
            string JobTitle="",
            string Department="",
            string EdLevel ="",
            string EdFocus="",
            string University="",
            string GradDate="",
            string CareerGoals="",
            string MeyersBriggs="",
            string Hobbies="",
            string AvailabilityTimes="",
            string AvailabilityType="",
            string Bio ="",
            string MentorFocus=""
            )
        {
            string sqlConnectString = getConString();

            //the only thing fancy about this query is SELECT LAST_INSERT_ID() at the end.  All that
            //does is tell mySql server to return the primary key of the last inserted row.
            // query based off the database attributes
            string sqlUpdateAccount =
                "UPDATE byteme.USERS " +
                    "SET " +
                    "FirstName= @FirstName, "+
                    "LastName= @LastName, "+
                    "Email= @Email, "+
                    "Location= @Location, "+
                    "JobTitle= @JobTitle, "+
                    "Department= @Department, "+
                    "EdLevel= @EdLevel, "+
                    "EdFocus= @EdFocus, "+
                    "University= @University, "+
                    "GradDate= @GradDate, "+
                    "CareerGoals= @CareerGoals, "+
                    "MyersBriggs= @MyersBriggs, "+
                    "Hobbies= @Hobbies, "+
                    "AvailabilityTimes=	@AvailabilityTimes, "+
                    "AvailabilityType= @AvailabilityType, "+
                    "Bio= @Bio, "+
                    "MentorFocus= @MentorFocus "+
                    "WHERE UserId= @UserId;"
                ;
            // get the userId of current session and turn object into a string. This line of code is if i wasnt sure to put here or in the js file and pass
            // it in as a parameter rather than assigning it here
            //var currentSessionUserId = Session["userId"].ToString();

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlUpdateAccountCommand = new MySqlCommand(sqlUpdateAccount, sqlConnection);

            sqlUpdateAccountCommand.Parameters.AddWithValue("@UserId", Session["UserId"]);
            sqlUpdateAccountCommand.Parameters.AddWithValue("@FirstName", HttpUtility.UrlDecode(FirstName));
            sqlUpdateAccountCommand.Parameters.AddWithValue("@LastName", HttpUtility.UrlDecode(LastName));
            sqlUpdateAccountCommand.Parameters.AddWithValue("@Email", HttpUtility.UrlDecode(Email));
            sqlUpdateAccountCommand.Parameters.AddWithValue("@Location", HttpUtility.UrlDecode(Location));
            sqlUpdateAccountCommand.Parameters.AddWithValue("@JobTitle", HttpUtility.UrlDecode(JobTitle));
            sqlUpdateAccountCommand.Parameters.AddWithValue("@Department", HttpUtility.UrlDecode(Department));
            sqlUpdateAccountCommand.Parameters.AddWithValue("@EdLevel", HttpUtility.UrlDecode(EdLevel));
            sqlUpdateAccountCommand.Parameters.AddWithValue("@EdFocus", HttpUtility.UrlDecode(EdFocus));
            sqlUpdateAccountCommand.Parameters.AddWithValue("@University", HttpUtility.UrlDecode(University));
            sqlUpdateAccountCommand.Parameters.AddWithValue("@GradDate", HttpUtility.UrlDecode(GradDate));
            sqlUpdateAccountCommand.Parameters.AddWithValue("@CareerGoals", HttpUtility.UrlDecode(CareerGoals));
            sqlUpdateAccountCommand.Parameters.AddWithValue("@MyersBriggs", HttpUtility.UrlDecode(MeyersBriggs));
            sqlUpdateAccountCommand.Parameters.AddWithValue("@Hobbies", HttpUtility.UrlDecode(Hobbies));
            sqlUpdateAccountCommand.Parameters.AddWithValue("@AvailabilityTimes", HttpUtility.UrlDecode(AvailabilityTimes));
            sqlUpdateAccountCommand.Parameters.AddWithValue("@AvailabilityType", HttpUtility.UrlDecode(AvailabilityType));
            sqlUpdateAccountCommand.Parameters.AddWithValue("@Bio", HttpUtility.UrlDecode(Bio));
            sqlUpdateAccountCommand.Parameters.AddWithValue("@MentorFocus", HttpUtility.UrlDecode(MentorFocus));


            sqlConnection.Open();

            try
            {
                // MAKE SURE THIS DOESN'T MESS WITH THE EQUIVALENCY TEST
                // DOUBLE CHECK THIS
                int checkRow;

                checkRow = sqlUpdateAccountCommand.ExecuteNonQuery();


                if (checkRow.Equals(1))
                {
                    sqlConnection.Close();
                    return "Account Updated";
                }
                else
                {
                    sqlConnection.Close();
                    return "Account not updated, please try again";
                }
            }
            catch (Exception e)
            {
                sqlConnection.Close();
                return ("Character not updated, check all values are valid and try again" + e.ToString());
            }

        }


        [WebMethod(EnableSession = true)]
        public String DeleteAccount(string charName)
        {
            string sqlConnectString = getConString();
            string sqlSelect = "DELETE FROM byteme.Character WHERE UserId = @UserId AND CharName = @charName";

            //set up our connection object to be ready to use our connection string
            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            //set up our command object to use our connection, and our query
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            //tell our command to replace the @parameters with real values
            //we decode them because they came to us via the web so they were encoded
            //for transmission (funky characters escaped, mostly)
            sqlCommand.Parameters.AddWithValue("@UserId", Session["userId"]);
            sqlCommand.Parameters.AddWithValue("@charName", HttpUtility.UrlDecode(charName));

            sqlConnection.Open();

            try
            {
                sqlCommand.ExecuteNonQuery();
                sqlConnection.Close();
                return "Success!";
            }
            catch (Exception e)
            {
                sqlConnection.Close();
                return e.ToString();
            }

        }


        [WebMethod(EnableSession = true)] //NOTICE: gotta enable session on each individual method
        public Connection[] PairedUsers()
        {
            string sqlConnectString = getConString();
            //here's our query.  A basic select with nothing fancy.  Note the parameters that begin with @
            //NOTICE: we added admin to what we pull, so that we can store it along with the id in the session
            //string sqlSelect = "SELECT id, admin FROM accounts WHERE userid=@idValue and pass=@passValue";
            string sqlSelect = "SELECT * from Paired";

            //set up our connection object to be ready to use our connection string
            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            //set up our command object to use our connection, and our query
            MySqlCommand sqlImportUsersCommand = new MySqlCommand(sqlSelect, sqlConnection);

            //a data adapter acts like a bridge between our command object and
            //the data we are trying to get back and put in a table object
            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlImportUsersCommand);
            //here's the table we want to fill with the results from our query
            DataTable sqlDt = new DataTable();
            //here we go filling it!
            sqlDa.Fill(sqlDt);
            //check to see if any rows were returned.  If they were, it means it's
            //a legit account

            List<Connection> paired = new List<Connection>();
            for (int i = 0; i < sqlDt.Rows.Count; i++)
            {
                paired.Add(new Connection
                {
                    _MenteeId = sqlDt.Rows[i]["MenteeId"].ToString(),
                    _MentorId = sqlDt.Rows[i]["MentorId"].ToString().Split(',')
                });
            }
            //convert the list of accounts to an array and return!
            return paired.ToArray();
        }



    }
}