# assignment-3-2-205520141_312199698
Assignment 3-2 Version 1.0 10-06-20  
---------------------------------------------------------------------------------------------------------
- Names: Amit Damri & Dvir Simhon  
- ID: 312199698 & 205520141  
----------------------------------------------------------------------------------------------------------
API's Link: https://app.swaggerhub.com/apis-docs/amitdamri/Recieps/1.0.1   
----------------------------------------------------------------------------------------------------------  
Here are some things you should know:  
- In every endpoint ends with "recipeIDs", server expects to array of integers
    (otherwise an appropriate error message will show up)  
- There are "two" show recipe preview endpoints, one for logged-in user and one for guests, 
  but they are different, so that they complete each other.
  (user's recipe preview contains the user addition details: indication whether recipe was watched by the user
  and whether recipe was saved as favorite by the user).
- In registeration we implemented checks over the whole input, although some may be implemented in
  front end in the next iteration.  
---------------------------------------------------------------------------------------------------------
Copyright 2020 Server. all rights reserved.  
This program is subject to license agreement, copyright,
trademark, patent and other laws.

 