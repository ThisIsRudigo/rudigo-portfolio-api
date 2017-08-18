BACK END API FOR TAILOR MADE USING NODE.JS AND MONGODB
=======================================================

END POINTS FOR THE USER REGISTRATION
Basic registration 

1) "/users/register" //registers a new user to the database.

*	method "POST"
*	request parameters "(username),
			    (email),
			    (d_o_b),
			    (password)

**********all fields required


2) "/users/login" // authenticates a user information and generates an token for each user each token expires in 1h.

*	method "POST"
*	request parameters "(json)"
		(username),
		(password)

**************all required fields

3) "/users/logout"  //logs a user out of the server.
*	method "POST"
*	no request parameters



4) "/users/facebook/callback" method "GET" //gets user login details from facebook and generates a token for the user.


5)"/forgot/forgot"   //takes a users email and verifies its existence in the database if it exist generates a token and send a mail to the email address.

*	method "POST"
request parameters

*	(email)


6) "/forgot/reset/:token" // redirects a user from his mail with the password reset token for validation from the database.

*	method "GET"
* request parameters

7) "/forgot/reset/:token" // takes the token and checkes its authenticity in the database then saves the new password to the database.

*	method "POST"
request parameters
*	(password)

8) "/user_profile/user"  //gets an array of the users information in the database.

*	method "GET"
*	no request parameters

9) "/user_profile/user/edit_profile"  //gets an array of the users information in the database.

*	method "PUT"
*	request parameters:

	    (
            height,
            bio,
    		trouser_length,
   		    width,
    		blah,
    		hip,
    		waist,
    		chest
				        )

10) "/user_profile/user/edit_password"  //gets an array of the users information in the database.

*	method "PUT"

*	request parameters:
	        (password)


****these are the data set from the mock up provided FOR PROFILE ****
