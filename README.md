<div align="center">
  <h1>SOHEIL OS · FOOD RECIPE</h1>
  <p><strong>A playful macOS-inspired browser world where recipes, music, files, and tiny apps live together.</strong></p>
  <p>
    <a href="https://soheil-aghayani.github.io/food-recipe/"><strong>Open the live desktop →</strong></a>
  </p>
  <p>
    <img src="https://img.shields.io/badge/HTML%2FCSS%2FJS-static-0B2F36?style=for-the-badge&logo=html5&logoColor=white" alt="Static HTML CSS JavaScript">
    <img src="https://img.shields.io/badge/desktop_simulation-interactive-1D6B70?style=for-the-badge" alt="Interactive desktop simulation">
    <img src="https://img.shields.io/badge/GitHub_API-connected-E5A24B?style=for-the-badge&labelColor=0B2F36" alt="GitHub API">
  </p>
</div>

---

## The experience

Food Recipe is not only a garlic-bread page. It is a small browser operating system with a desktop, dock, windows, internal Safari pages, Finder-like navigation, music, and an iGithub app that can render repository information.

The recipe is the entry point. The real project is the interface experiment around it.

## Included apps

| App | What it does |
| --- | --- |
| Desktop | Window management, dock interactions, menu bar, wallpapers, and responsive layout |
| Finder | Browse the simulated Projects, Desktop, Downloads, and Bin spaces |
| Safari | Navigate between internal pages and recipe views |
| iGithub | Fetch and render GitHub repository information |
| Recipes | Browse garlic bread, lasagna, and recipe data from JSON |
| Music | Play the included soundtrack and switch between tracks |

## Run locally

~~~bash
git clone https://github.com/Soheil-Aghayani/food-recipe.git
cd food-recipe
python -m http.server 3000
~~~

Open http://localhost:3000.

A local server is recommended because the browser features use modules, assets, audio, and API requests.

## Stack

- HTML5 and CSS3
- Vanilla JavaScript
- GitHub API
- Marked.js for Markdown rendering
- Local JSON data for recipes and app content

<div align="center">
  <sub>One browser tab. Many little worlds.</sub>
</div>
