# Spotifyclone

**Web-based music player clone of Spotify**, built with plain HTML, CSS, and JavaScript.  
Live demo: [https://spotify-by-gargi.netlify.app/](https://spotify-by-gargi.netlify.app/)

---

## 💫 Table of Contents

1. [✨ Features](#-features)  
2. [🚀 Tech Stack](#-tech-stack)  
3. [🎬 Demo Screenshots](#-demo-screenshots)  
4. [⚙️ Installation & Setup](#️-installation--setup)  
5. [🎧 Usage](#-usage)  
6. [🗂️ Project Structure](#️-project-structure)  
7. [📬 Contact](#-contact)

---

## ✨ Features

- **Dynamic song list** fetched from a `songs.json` manifest  
- **Play / Pause / Next / Previous** controls with a persistent bottom playbar  
- **Album-art thumbnails** on “Quick Picks” buttons  
- **Hover-to-play icon overlay** on thumbnails  
- **Responsive grid** of trending songs with individual play cards  
- **Seek bar** with clickable progress and real-time time updates  
- **Volume control** via a custom range slider  
- **Mobile-friendly** side nav with hamburger menu

---

## 🚀 Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Netlify" />
</p>

- **HTML5** for semantic markup  
- **CSS3** (Flexbox & Grid) for responsive layout  
- **Vanilla JavaScript** (ES6+) for interactivity  
- **Netlify** for effortless static hosting

---

## 🎬 Demo Screenshots

<!-- Desktop: ~750px wide -->
<p align="center">
  <img
    src="https://github.com/user-attachments/assets/82f3de00-304d-4f1c-86fa-00c0e76005dd"
    alt="Homepage"
    style="width:750px; height:auto; max-width:100%;"
  />
  &nbsp;&nbsp;
  <img
    src="https://github.com/user-attachments/assets/6d3b1cca-1007-4d54-bec0-db07648a3a00"
    alt="Quick picks hover"
    style="width:750px; height:auto; max-width:100%;"
  />
</p>

<!-- Mobile: ~320px wide -->
<p align="center">
  <img
    src="https://github.com/user-attachments/assets/3e6a2fdd-22e1-4146-a4e4-9519bf916860"
    alt="Mobile View"
    style="width:320px; height:auto; max-width:100%;"
  />
  &nbsp;&nbsp;
  <img
    src="https://github.com/user-attachments/assets/0b03a9b3-48f0-47bd-93e5-e514d62e288f"
    alt="Side Bar"
    style="width:320px; height:auto; max-width:100%;"
  />
</p>

---

## ⚙️ Installation & Setup

1. **Clone the repo**  
   ```
   git clone https://github.com/gargibhardwaj24/Spotifyclone.git

   cd Spotifyclone

2. **Install dependencies**  
  
 No dependencies—just a static site!

3. **Serve locally** 

- **Option A**: VS Code Live Server

- **Option B**: Simple Python server
   ```bash
   python3 -m http.server 5500

Then open `http://127.0.0.1:5500/` in your browser.

4. **Deploy** 

Push to Netlify (drag & drop in the dashboard or via Git integration).

---
## 🎧 Usage
- Click any Quick Pick button or card play button to start playback.

- Use the bottom playbar for global Play/Pause, Next, Previous.

- Click on the seek bar to jump to any point.

- Adjust volume with the slider.

- On mobile, tap the hamburger to reveal the side library menu.

---

## 🗂️ Project Structure
 ```
├── index.html          # markup  
├── style.css           # main styles  
├── utilities.css       # utility classes  
├── script.js           # player logic  
├── songs.json          # song manifest  
├── /svg                # SVG icons  
├── /songs              # audio files  
└── /screenshots        # demo images  
```
---

## 📬 Contact
### Gargi – @github.com/gargibhardwaj24

### Project Link: https://spotify-by-gargi.netlify.app/
