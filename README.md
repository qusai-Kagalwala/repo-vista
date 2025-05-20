# Repo Vista

A modern React application that creates beautiful social preview images for your GitHub repositories. Repo Vista helps developers craft eye-catching social preview images that showcase their repositories on GitHub, complete with repository statistics, language breakdown, avatars, and more.

## ✨ Features

- **GitHub API Integration**: Fetches real repository data including stars, forks, and language statistics
- **User Avatar Support**: Displays repository owner's avatar in the preview
- **Enhanced UI**: Beautiful, modern interface with customizable elements
- **Multiple Themes**: Choose from 7 different color themes:
  - 🌑 Dark: Dark blue gradient background
  - ☀️ Light: Clean white background
  - 🌈 Gradient: Purple to blue gradient
  - 🐙 GitHub: GitHub's dark theme
  - 🌅 Sunset: Warm orange to yellow gradient
  - 🌊 Ocean: Calming blue gradient
  - 🌲 Forest: Soothing green gradient
- **Background Patterns**: Add stylish patterns to your preview
- **Customizable Language Breakdown**: Edit your repository's language distribution
- **Download & Copy**: Export your preview as a PNG image or copy to clipboard
- **Responsive Design**: Works seamlessly on all devices

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/qusai-Kagalwala/repo-vista.git
cd repo-vista
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

## 📋 Usage

### Using GitHub API

1. Enter a GitHub repository URL (e.g., https://github.com/username/repository)
2. Click "Fetch" to automatically load repository data from GitHub
3. The preview will update with real repository data and language breakdown

### Manual Customization

1. Edit repository details (name, description, stars, forks)
2. Customize language breakdown by adding, removing, or adjusting percentages
3. Choose your preferred theme and background pattern
4. Download the preview image or copy it to clipboard

### Setting Your GitHub Social Preview

1. Download your generated image
2. Go to your GitHub repository
3. Click on "Settings"
4. Scroll down to the "Social Preview" section
5. Click "Edit"
6. Upload your downloaded image
7. Click "Save changes"

## 🏗️ Project Structure

```
repo-vista/
│
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
│
├── src/
│   ├── components/
│   │   ├── GitHubPreviewGenerator.jsx   # Main component
│   │   ├── LanguageBar.jsx              # Language breakdown bar
│   │   ├── PreviewCard.jsx              # Preview display
│   │   └── ThemeSelector.jsx            # Theme selection
│   │
│   ├── styles/
│   │   ├── main.css                     # Main CSS styles
│   │   ├── themes.css                   # Theme-specific styles
│   │   └── languages.css                # Language color definitions
│   │
│   ├── utils/
│   │   ├── helpers.js                   # Helper functions
│   │   └── github-api.js                # GitHub API integration
│   │
│   ├── App.jsx
│   ├── index.jsx
│   └── index.css
│
├── package.json
└── README.md
```

## 🔌 GitHub API Integration

This project uses the GitHub REST API to fetch repository data:

- Repository information: `https://api.github.com/repos/{username}/{repository}`
- Language statistics: `https://api.github.com/repos/{username}/{repository}/languages`
- User avatar: `https://api.github.com/users/{username}`

Note: The GitHub API has rate limits for unauthenticated requests (60 requests per hour). For higher limits, consider implementing GitHub OAuth authentication.

## 🛠️ Technologies Used

- **React**: UI framework
- **Bootstrap**: CSS framework for layout and components
- **HTML2Canvas**: For generating downloadable images
- **Lucide React**: For SVG icons
- **GitHub API**: For fetching repository data

## 🎨 Customization Options

### Themes

Choose from 7 beautiful themes to make your preview stand out:

- **Dark**: Dark blue gradient background
- **Light**: Clean white background
- **Gradient**: Purple to blue gradient
- **GitHub**: GitHub's dark theme
- **Sunset**: Warm orange to yellow gradient
- **Ocean**: Calming blue gradient
- **Forest**: Soothing green gradient

### Background Patterns

Add extra style with various patterns:

- **None**: Solid background
- **Dots**: Dotted pattern
- **Lines**: Diagonal lines
- **Hexagons**: Hexagonal pattern
- **Circuit**: Circuit board pattern

## 🤝 Contributing

Contributions are welcome! Here are some ways you can contribute:

1. Report bugs or request features by opening an issue
2. Improve documentation
3. Fix bugs or add features by submitting a pull request

### Development Guidelines

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License

## 🙏 Acknowledgments

- Inspired by [Socialify](https://socialify.git.ci/)
- GitHub for their API
- The open-source community

---

Made with ❤️ by [Qusai Kagalwala](https://github.com/qusai-Kagalwala)
