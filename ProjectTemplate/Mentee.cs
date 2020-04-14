using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectTemplate
{
    public class User
    {
        public string _UserId {get; set;}
        public string _FirstName {get; set;}
        public string _LastName {get; set;}
        public string _Email {get; set;}
        public string _Location {get; set;}
        public string _JobTitle {get; set;}
        public string _Department {get; set;}
        public string _EdLevel { get; set; }
        public string _EdFocus {get; set;}
        public string _University { get; set; }
        public string _GradDate {get; set;}
        public string[] _CareerGoals {get; set;}
        public string _MyersBriggs {get; set;}
        public string[] _Hobbies {get; set;}
        public string[] _AvailabilityTimes {get; set;}
        public string[] _AvailabilityType {get; set;}
        public string _Bio {get; set;}
        public string[] _MentorFocus {get; set;}
        public bool _MentorFlag {get; set;}
    }
}