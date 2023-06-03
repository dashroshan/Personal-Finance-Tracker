<h1 align="center">Personal Finance Tracker</h1>

<h3 align="center">Submission to GitHub Copilot Hackathon</h3>

<p align="center">
<a href="https://personal-finance-tracker.dashroshan.com"><img src = "https://img.shields.io/badge/Visit Site-Page?style=flat&logo=alibabacloud&logoColor=white&color=2F6BFF" height = 30px></a> <a href="https://www.youtube.com/watch?v=mXf0OAtq_9U"><img src = "https://img.shields.io/badge/Watch on YouTube-Page?style=flat&logo=youtube&logoColor=white&color=FE0100" height = 30px></a>
</p>

<img src="./frontend/assets/banner.png" width="100%"/>

<br>

<p style="text-align: justify;">
<b>Personal Finance Tracker</b> is a web app built with the help of GitHub Copilot which helps users keep track of their budget and expenses easily with support for cloud and local backups.</p>

## Made with

| Tech used               | For        |
| ----------------------- | ---------- |
| HTML + CSS + JavaScript | Frontend   |
| Node + Express          | Backend    |
| Azure CosmosDB          | Database   |
| Azure VM                | Hosting    |
| GitHub Copilot          | Assistance |

## Team Geek-o-duet

- Roshan Dash
- Shreeya Mishra

## Setup process

Run the below command in the root directory to install all required packages for the backend server:

```
npm install
```

Create an OAuth client ID in Google cloud console with the below info:

```
# Authorized JavaScript origins

http://localhost:4000
https://localhost:4000

# Authorized redirect URIs

http://localhost:4000/api/auth/google/callback
https://localhost:4000/api/auth/google/callback
```

Create a **secrets.env** file in the root directory with content like below:

```
PORT = 4000
FRONTEND = http://localhost:4000
MONGO_URI = <MongoDB or CosmosDB url>
GOOGLE_CLIENT_ID = <Client ID from Google cloud console>
GOOGLE_CLIENT_SECRET = <Client secret from Google cloud console>
CALLBACK_URL = /api/auth/google/callback
PASSPORT_SECRET = <anyRandomText>
```

## Running process

Run the below command in the root directory:

```
node index.js
```
