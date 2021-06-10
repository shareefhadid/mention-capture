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
DB_USER=0a5f90f2c7a565e7b1ce5a63b409e26ad16821ae9e273e2697a93331933d23c3
DB_PASSWORD=058664c84ddcdcb100bea57a57bcca7511e56b38bc77566a02a8437cbcc0fb10
DB_HOST=mongo:27017
SESSION_SECRET=a585b4c5a3e99ae6b734271f3b57c15fdadfd75ebd5960778d39e3d2290b424ddef950adce3284e1e8c6c53323b91cdf62f437e42946eaaf4788ca65494086a6
STORE_SECRET=91c18916d911124a66d747da1de650dc84d07b7e300762063313c909392fc1ea36687f2232cfae583ec11a638f9957ef0bf8664b47b309b2adb7f8375426bca6
UNSUB_TOKEN_SECRET=6f45275935188dd0eadeb204bd1b299bc6de7ddd98fb2078f28f728e6ea314d78d409ae70d0a8193bb896b97c518a7f304a0db37ee56ab8b2bf17e43017bdb6d
DOMAIN=localhost
PASSCODE=passcode

We don't push this code to github because it contains secrets. So when we clone for production, we will need to set these manually, and to different values. However, we should note the secrets down somewhere in case the server crashes. Otherwise, we won't be able to unhash data.

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