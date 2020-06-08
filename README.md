# Strapi application for Activities

A Strapi application to create multilingual **activities**.  An activity consists of Title, SubTitle, Description, Pictures and Price. All of the items in activity are multilingual. This app supports EN, DE, ES.

##  Start application
To start this application you would need npm, node, Strapi and MariaDB installed on your local. Follow the below steps to boot up this application.
- Clone this repository 
- Import DB dump from `strapi-db-dump.sql`
- Update DB credentials in `.env` and `/config/database.js`
- Start DB server
- Run `npm i`
- Run `npm run develop`
- Once the app is started, go to `http://localhost:1337/admin`
- Use username `Ashish Kumar` and password `password` to login

## Creating new activity

To create a new activity, click `Activities` in the left menu under `Collection Types`section. Now, click `+ Add New Activities` on the right top side to create a new entry. 

Click + to add Title, SubTitle, Description, Pictures and Price. Each component has fields for supported languages (EN, DE, ES)
>Title and price are required components.

Once the activity is created, you can see the updated activities by calling [http://localhost:1337/activities](http://localhost:1337/activities)

## Updating price with discount

This application allows you to apply discount to all the activities. To add a discount, call below-mentioned API.
```
PUT: /activities_price

Request:
body: {
	"Discount" : <number>
}

Success Response: 
status: 200 OK
body: {
	statusCode:  200,
	message:  'Price of activities updated'
}

Failure Response:
1. Where no activities are present
status: 404 Not Found
body: {
	statusCode:  404,
	error: "Not Found"
	message:  'No activities found'
}

2. Invalid request
status: 400 Bad Request
body: {
	statusCode:  400,
	error: "Bad Request"
	message:  <invalid message>
}

List of invalid data messages:
- Request body missing
- Error in parsing JSON
- Invalid discount amount
- Discount amount should be in correct range
```
> To update price, discount should be in range of (0, 100] and price of activity should be higher than 0.



## Send automated email on new activity

Whenever a new `Activity` is created a mail is sent to `info@mallorcard.es` with subject, `New activity is created in activities`.  

In this application, Nodemailer is used to send email. To change the config of nodemailer, go to `.env` file and change variables with prefix `EMAIL_`. These EMAIL environment variables are consumed in the configuration of nodemailer in `/config/plugin.js` file.

To update the recipient email address, open `email` in `/api/activities/controllers/activities.js`

# Contact me

Drop an email to me at ashishk1409@gmail.com  if you have any questions.