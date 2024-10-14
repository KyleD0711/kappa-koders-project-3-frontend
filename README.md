# OC Tutor Scheduling Frontend

This application allows users to make, book, confirm, and cancel appointments as well as make requests for additional help. It also allows admins to manage students, tutors, locations, and topics for their group as well as view reporting for appointments. This application utilizes the Google API for authentication to ensure a smooth and reliable registration process. It can also authorize use of Google Calendar, so that we can add their appointments to their Google Calendar.

#### Please note:
- You will need to make a **local .env file** with the values specified below.
- This project utilizes **Google Authentication** to allow users to log in.
- You will need to provide a **Client ID from Google** for this project to run locally.

## Project Setup
1. Clone the project.
```
git clone https://github.com/ChloeSheasby/tutorscheduling-vue.git
```

2. Install the project.
```
npm install
```

3. Make sure you have a project registered with the **Google Developer console**.
    - https://console.developers.google.com/
    - Enable **Google+ API** and **Google Analytics API**.
    - Enable an **OAuth consent screen**.
    - Create an **OAuth client ID**.
    - Save your **Client ID** and **Client Secret** in a safe place.

4. Add a local **.env** file and make sure the **client ID** is the one you have registered with Google.
    - VUE_APP_CLIENT_ID = '**your-google-client-id**'
    - VUE_APP_CLIENT_URL = 'http://localhost:8081'
    - VUE_APP_API_URL = 'https://accounts.google.com/gsi/client'

5. Compile and run the project locally.
```
npm run serve
```

6. (Optional) Compile the project for production.
```
npm run build
```

7. (Optional) Lint and fix the project files.
```
npm run lint
```
