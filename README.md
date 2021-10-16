# Xord Summer Blockship Program #
## MERN Stack Training ##
## Metropolis Health Clinic Assignment ##
### API Documentation ###

Deployed API Endpoints Base URL: https://metropolis-health-clinic.herokuapp.com
GitHub Repo Link: https://github.com/danishraza12/metropolis-health-clinic
 
# 1.     User Registration Module #
## 1.1.         User Signup ##
*API Endpoint:* https://metropolis-health-clinic.herokuapp.com/users/signup
*API Method:* POST
*Request Sample:*
{
    "email": "myemail@gmail.com",
    "password": "testingpass12",
    "userType": "Patient"
}
Request Info:
“email” field should be in a valid email format
“status” is set to “false” by default and cannot be set by the user
Response Sample:
{
    "message": "Registered Successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im15ZW1haWxAZ21haWwuY29tIiwic3RhdHVzIjp0cnVlLCJpYXQiOjE2MzQwMDQxMTYsImV4cCI6MTYzNDAwNTkxNn0.cE48p_J80EvF0Mf8Z9L6soN8U-fogi2UP9oNlIVCy3Q"
}
Response Info:
The token is a Json Web Token(JWT) which has been generated by using a payload of Username and Status with the value true, “token” will get expired after 30 minutes and the user will not be able to authenticate with that token after that.

## 1.2.         Activate account Endpoint ##
API Endpoint: https://metropolis-health-clinic.herokuapp.com/users/activate
API Method: POST
Request Sample:
{
    "email": "myemail@gmail.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im15ZW1haWxAZ21haWwuY29tIiwic3RhdHVzIjp0cnVlLCJpYXQiOjE2MzQwMDQxMTYsImV4cCI6MTYzNDAwNTkxNn0.cE48p_J80EvF0Mf8Z9L6soN8U-fogi2UP9oNlIVCy3Q"
}
Request Info:
token: This is the token that was generated in the “User Signup(Heading 1.1)” portion of the User Registration module
 
Response Sample:
{
    "message": "Activation Succesful",
    "status": true
}
 
# 2.     User Authentication Module #
## 2.1.         User Login ##
API Endpoint: https://metropolis-health-clinic.herokuapp.com/users/login
API Method: POST
Request Sample:
{
    "email": "myemail@gmail.com",
    "password": "testingpass12"
}
Request Info:
“email”: This is the activated email otherwise authentication will fail.
“password”: Should be the same as entered while registering the account.
Response Sample:
{
    "message": "Authentication successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNjRlYzk0YmMzOTk5ZGUxODhkODBmNSIsInVzZXJuYW1lIjoibXllbWFpbEBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6IlBhdGllbnQiLCJpYXQiOjE2MzQwMDUyMDV9.21rt9AprWUJy099ib6zpq7LWj9sYx2tFF-MgtFrU4V4"
}
Response Info:
The token is a Json Web Token(JWT) which has been generated by using a payload of:
i)                    Id (Document Id of Users Collection)
ii)                   Username
iii)                 User Type
This “token” will be used to authenticate all the endpoints.
If user tries to login using inactivated email:
{
    "message": "Auth failed"
}
 
## 2.2.         Delete User ##
API Endpoint: https://metropolis-health-clinic.herokuapp.com/users/:userId
API Method: DELETE
Response Sample:
{
    "message": "User deleted"
}
 
 
 
# 3.     Appointment Booking #
API Endpoint: https://metropolis-health-clinic.herokuapp.com/appointments
API Method: POST
Request Sample:
{
    "doctorId": null,
    "patientId": null,
    "time": "11:25AM",
    "status": null
}
Request Info:
“doctorId”: (Automatically Generated, request can be sent without this)
“patientId”: (Automatically Generated, request can be sent without this)
“status”: (Default value is ‘prescribed’, request can be sent without this)
Response Sample:
{
    "message": "Appointment created successfully",
    "result": {
        "_id": "616641b1ca2a67e7edc7d11a",
        "doctorId": "616641b1ca2a67e7edc7d11b",
        "patientId": "61663b8f34e37bc9ee76b83e",
        "time": "11:25AM",
        "status": "pending",
        "__v": 0
    }
}
Response Info:
If another appointment is not already booked at the specified time then the customer will be able to book an appointment successfully.
“doctorId”: Id from users collection of type doctor
“patientId”: Extracted from the JWT’s payload
“time”: To be provided by the user
“status”: Set by default to ‘pending’
If there is a time conflict(Error code 409: conflict):
{
    "message": "Appointment already booked at: 11:25AM"
}
 
# 4.    Treatment Module #
API Endpoint: https://metropolis-health-clinic.herokuapp.com/treatment
API Method: POST
Request Sample:
{
    "appointmentId": "616641b1ca2a67e7edc7d11a",
    "treatment": "Treatment#3 has been prescribed"
}
 
Request Info:
“appointmentId”: Required field, it is the appointment which needs to be prescribed the treatment
Response Sample:
{
    "message": "Treatment prescribed successfully",
    "appointmentId": "616641b1ca2a67e7edc7d11a",
    "treatment": "Treatment#3 has been prescribed",
    "appointmentStatus": "Prescribed"
}
Response Info:
Shows the treatment which was provided against the provided appointment ID and the updated status.
