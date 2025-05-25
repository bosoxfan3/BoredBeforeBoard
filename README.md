# Bored Before Board

A lightweight web app for Bay Area commuters to check real-time BART train schedules and kill time while they wait — with built-in YouTube search and a quick game of Tic-Tac-Toe.

---

## 📋 Table of Contents

1. [Screenshots](#screenshots)
2. [Purpose](#purpose)
3. [Technologies Used](#technologies-used)
4. [Setup & Usage](#setup--usage)
5. [Notes on PWA Support](#notes-on-pwa-support)

---

## 📸 Screenshots

Main page where the user chooses their station and direction:  
![Main page](/screenshots/main.png)

Results page with only train times displayed:  
![Results page with no entertainment](/screenshots/times.png)

Results page showing train times + YouTube video search:  
![Results page with YouTube search](/screenshots/youtube.png)

Results page showing train times + Tic-Tac-Toe game:  
![Results page with Tic-Tac-Toe](/screenshots/tictactoe.png)

---

## 🎯 Purpose

This app serves two purposes:

-   Provide **real-time BART train schedules** by station and direction, especially for stops that lack public displays.
-   Offer built-in **entertainment options** (YouTube search and Tic-Tac-Toe) so users can pass time without switching apps.

It’s designed for fast access, clean display, and mobile-friendliness. Whether you're waiting solo or with a friend, there's something to do while keeping tabs on your next train.

---

## 🛠 Technologies Used

-   **HTML/CSS** – static layout and styling
-   **JavaScript** – core functionality
-   **jQuery** – DOM manipulation and Ajax requests
-   **YouTube API** – for video search results
-   **BART API** – for live transit data
-   PWA support for installable experience

---

## 🚀 Setup & Usage

### 1. Clone the repository

```
git clone https://github.com/bosoxfan3/BoredBeforeBoard.git
cd BoredBeforeBoard
```

### 2. Add Your API Keys

Create a new file in the root of your project titled config.js. Create and define two variables as outlined below:

```
const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY_HERE';
const BART_API_KEY = 'YOUR_BART_API_KEY_HERE';
```

You can get a YouTube API key in the [Google Cloud Console](https://console.cloud.google.com/)
and can explore BART API key choices [here](https://www.bart.gov/schedules/developers/api)

### 3. Open the app in a browser

Just open index.html in your browser — no build or server required.

## 📱 Notes on PWA Support

This project includes basic PWA setup so it can be installed on mobile devices via "Add to Home Screen":

Includes manifest.json

Supports a simple service worker for installability

No offline caching (functionality depends on API access)

## 🔒 Disclaimer

Your API key is exposed in the frontend, so make sure to restrict it in the Google Cloud Console to specific domains (e.g., yourdomain.com/\*) if deploying.
