# Food Recipe (Soheil OS)

This repository contains a web-based operating system simulation designed to showcase various applications, including a detailed **Garlic Bread Recipe**. The project mimics a macOS-like interface with functional apps such as Finder, Safari, iGithub, and Music.

## Features

- **Desktop Environment**: A fully responsive desktop interface with a dock, menu bar, and window management.
- **Finder**: Browse files and folders (Projects, Desktop, Downloads).
- **Safari**: A simulated web browser that can navigate between internal pages.
- **iGithub**: A GitHub client that fetches repositories and displays their READMEs (including this one!).
- **Recipes**: A dedicated app for browsing recipes, featuring the signature Garlic Bread guide.
- **Music**: A simple music player application.

## Technologies Used

- **HTML5 & CSS3**: For structure and styling, including responsive design for mobile devices.
- **JavaScript (ES6+)**: Handles window management, drag-and-drop functionality, and application logic.
- **GitHub API**: Used by iGithub to fetch repository data dynamically.
- **Marked.js**: Renders Markdown content within the iGithub app.

## How to Run

1.  Clone the repository:
    ```bash
    git clone https://github.com/Soheil-Aghayani/food-recipe.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd food-recipe
    ```
3.  Start a local server (e.g., using Python):
    ```bash
    python3 -m http.server 3000
    ```
4.  Open your browser and visit:
    ```
    http://localhost:3000
    ```

## License

This project is open-source and available under the MIT License.
