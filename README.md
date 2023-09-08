# MERN APPLICATION 

This is a MERN stack application as a part of the "MERN Stack Front To Back" course on [Udemy](https://www.udemy.com/mern-stack-front-to-back/). It is a small social network app that includes authentication, profiles and forum posts.

# Quick Start

### Add a default.json file in config folder with the following

```
{
  "mongoURI": "<your_mongoDB_Atlas_uri_with_credentials>",
  "jwtSecret": "secret",
  "githubToken": "<yoursecrectaccesstoken>"
}
```

### Install server dependencies

```bash
npm install
```

### Install client dependencies

```bash
cd client
npm install
```

### Run both Express & React from root

```bash
npm run dev
```

### Build for production

```bash
cd client
npm run build
```

### Test production before deploy

After running a build in the client, cd into the root of the project.  
And run...

Linux/Unix

```bash
NODE_ENV=production node server.js
```

Windows Cmd Prompt or Powershell

```bash
$env:NODE_ENV="production"
node server.js
```

Check in browser on [http://localhost:3000/](http://localhost:3000/)

### Deployed at Heroku

Create a local only branch, lets call it _production_.

```bash
git checkout -b production
```

Add the config file...

```bash
git add -f config/production.json
```

Commit...

```bash
git commit -m 'ready to deploy'
```

Create your Heroku project

```bash
heroku create
```

And push the local production branch to the remote heroku main branch.

```bash
git push heroku production:main
```

> After deployment you can delete the production branch if you like.

```bash
git checkout main
git branch -D production
```
