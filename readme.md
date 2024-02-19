# Setup

1. run 'npm install' in project directory
2. cd into client. run 'npm install' again.
3. cd into project. run 'npm build client'
> ^ this step is optional. You can always run this after building the front end.
4. don't forget to set up git:

    a. git init

    b. git add .

    c. git commit -m "comment here"

    d. log into git, make a new repo

    e. run "git remote add origin https://github.com/shareefhadid/...."

    f. run "git push -u origin master". I think you can do this without the step above tbh.

# .env
create a '.env' file in the root directory with the options for development:
DB_USER=
DB_PASSWORD=
DB_HOST=
SESSION_SECRET=
STORE_SECRET=
UNSUB_TOKEN_SECRET=
DOMAIN=localhost
PASSCODE=passcode

# Vue
The client folder was built using @vue/cli node module. If you want to delete it and build one from scratch, here are the steps:

To download it, run 'npm install -g @vue/cli'

To upgrade it run 'npm update -g @vue/cli'

To check version, and that it is working, run 'vue --version'

To create a project run 'vue create projectname' in the parent directory

If you select manual set up, you can include VueX and VueRouter, which I did in this template

**I added the vue.config.js file; it did not come with vue cli**

# Python
Inside /server/scripts there is python script and a function called execPyScript

The python script only contains the code necessary to connect to mongoDB. If you change the name of this file, you will have to change it in execPyScript.

If you change the name of execPyScript, you will also have to change it in /server/routes/results.js. Right now the script is running when a GET request is sent to /results/search.

All of the modules necessary to run the python script must be included in requirements.txt

# Licenses
1. npm install license-report
2. make a license-report-config.json
3. run license-report --output=csv --config license-report-config.json --only=prod
