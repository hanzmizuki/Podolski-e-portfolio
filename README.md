# Podolski E-Portfolio

A group e-Portfolio website for the **TTTN3133 Secure Programming** course, documenting our labs, project development, vulnerability testing and security fixes.
Built as part of our coursework at Universiti Kebangsaan Malaysia (UKM), Faculty of Information Science and Technology (FTSM).

## 🔗 Live Site

👉 **[https://hanzmizuki.github.io/Podolski-e-portfolio/](https://hanzmizuki.github.io/Podolski-e-portfolio/)**

## 📋 About

| | |
|---|---|
| **Programme** | Computer Science — Software Technology Track |
| **University** | Universiti Kebangsaan Malaysia (UKM) |
| **Course** | TTTN3133 Secure Programming |
| **Instructor** | Ts. Dr. Nur Hanis Sabrina binti Suhaimi |

The website highlights:
- Each member's role and contribution
- Lab exercises with demonstration videos and reflections
- Our project and vulnerability solution cases (before/after testing)
- Our learning journey, skills and resources used

## 👥 Team Members

| Name | Matric No. | Role |
|------|-----------|------|
| Harith  | A211140 | Project Manager & GitHub Coordinator |
| Farihin | A211017 | Security Operations Centre (SOC) Analyst |
| Adam    | A211176 | Application Developer |
| Luqman  | A212247 | Security Tester & Documentation Coordinator |

## ✨ Features

- **Navy & gold theme**: navy blue `#000080` with gold `#FFD700` accents
- **Dark / light mode**: toggle button in the navigation bar; the choice is saved in the browser and defaults to the visitor's system setting
- **Animated hero**: a moving network of nodes and data "packets" that reacts to the mouse, a drifting grid, an animated lock-shield and a typewriter terminal line
- **Scroll animations**: sections and cards fade in as you scroll, plus a reading progress bar and a back-to-top button
- **Responsive**: works on desktop, tablet and mobile (collapsible menu on small screens)
- **Accessible**: keyboard navigation, visible focus outlines, skip link, and reduced motion for visitors who turn it on in their system settings
- **Secure by default**: all content is HTML-escaped before rendering, only `https://` links are accepted, and YouTube videos are embedded with a strict referrer policy

## 🛠️ Built With

- HTML5
- CSS3 (custom properties, keyframe animations)
- JavaScript (vanilla, no frameworks or external libraries)
- Canvas API (hero background animation)
- GitHub Pages (hosting)

## 📂 Project Structure

```
.
├── index.html      # Page structure and static text
├── css/
│   └── style.css   # Theme colours, dark mode, layout and animations
├── js/
│   ├── data.js     # EDITABLE CONTENT: members, labs, project, cases, hero phrases
│   └── main.js     # Rendering, animations, theme toggle, navigation
└── README.md
```

## ✏️ Updating Content

**Members, labs, project and vulnerability cases**: open `js/data.js` and fill in the empty `""` fields. Empty fields automatically show "To be added", "Video coming soon" or "Repository link coming soon".
- `video`: any normal YouTube link (`youtube.com/watch?v=…`, `youtu.be/…`, `/shorts/…`)
- `repo`: a full GitHub link starting with `https://`
- `typedPhrases`: the lines typed out in the hero

**Project scenario, reflection, skills and resources**: edit `index.html` directly. Look for the `<!-- EDIT -->` comments.

**Colours**: change the variables at the top of `css/style.css`. Light-mode colours are in `:root`, dark-mode colours are in `:root[data-theme="dark"]`.

## 🚀 Running Locally

1. Clone the repo:
   ```bash
   git clone https://github.com/hanzmizuki/Podolski-e-portfolio.git
   ```
2. Open `index.html` in your browser. No build step or server is needed.

## 🌐 Deployment

The site is hosted on GitHub Pages from the `main` branch. Push changes to `main` and the live site updates automatically within a minute or two.

## 📝 License

This project is for educational purposes.
