# Frontend

## Deploy to Bluemix

Requirements:
- npm packages installed
- angular cli installed
- cloud foundry cli installed

After connecting to Bluemix with your credentials (`cf login && cf api`):

- Run `ng build -prod` to build the app.
- Run `cf push` to deploy static files Bluemix.
