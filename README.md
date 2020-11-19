# Pelilauta

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=villetakanen_pelilauta2&metric=alert_status)](https://sonarcloud.io/dashboard?id=villetakanen_pelilauta2)

_Elven wizard casts a resurrection: [pelilauta.web.app](https://pelilauta.web.app)_

An Open Source vue3+firebase project for a community site. 

## Goals
1. Provide a web-forum like UX for desktop
2. Provide a social-media-stream like UX for mobile, without compromising (1)
3. Provide GDPR tools for Personal data removal
4. Provide basic tools for community moderation
5. Super simple to use

## How you can help.
1. Use the App
2. Read the code
3. Log issues to the github tracker of this repo
4. Ask Ville for access, and start peer reviewing or writin code :P
5. Ask Ville for access, and start helping with Firebase devops tasks o_O
6. Use the App.

## Project setup

### Prequisites

Since 4.0.0, you need to have:
1. A Firebase project
2. An Algolia index
3. A clone of [pelilauta-functions](https://github.com/villetakanen/pelilauta-functions)

### Install
```
npm install
```

Create a file called env.local and add following data from the Firebase app
```text
VUE_APP_FIREBASE_API_KEY = 
VUE_APP_FIREBASE_AUTH_DOMAIN =  
VUE_APP_FIREBASE_DATABASE_URL = 
VUE_APP_FIREBASE_PROJECT_ID  = 
VUE_APP_FIREBASE_STORAGE_BUCKET  = 
VUE_APP_FIREBASE_MESSAGING_SENDER_ID =
VUE_APP_FIREBASE_APP_ID =
VUE_APP_FIREBASE_MEASUREMENT_ID = 
VUE_APP_ALGOLIA_APP_ID = 
VUE_APP_ALGOLIA_APP_SEARCH_KEY = 
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Release a new version (from CLI)
```bash
npm run release && npm run build && firebase deploy
git push --follow-tags origin master
```
