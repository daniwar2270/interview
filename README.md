#BASIC documentaion


database MySQL:

'CREATE TABLE meetings (
    id INT PRIMARY KEY AUTOINCREMENT,
    owner varchar(50),
    title varchar(100),
    startDate date,
   startTime time,
   endDate date,
   endTime time,
   roomNumber int
);'

plugins used:

nodemon
swaggerUi
express
bodyparser (for JSON)

basic CRUD functions:
-get all meetings
  
-get all meetings for a user
-get all mettings for a user for a day
date FORMAT: YYYY-MM-DD
time FORMAT: HH:MM:SS
-POST(create)
-PUT (update)
-Delete
TEST in SWAGGEr
