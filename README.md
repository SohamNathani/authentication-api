# authentication-api
Basic authentication api with profile

List of end points available

/users POST 
{
  email, password,username, gender, dob
}

/users/login POST
{
  email, password
}

/users/logout POST

/users/logoutall POST

/users/me/avatar POST (update profile pic)
key avatar value=jpg,jpeg,png

/users/me GET (get user profile data)

/users/me/avatar GET (get user profile pic)
