# Flag Jockey

Flag Jockey is a React-based web application that allows users to create combined national flags by selecting countries and blending their flag designs. The application generates a new flag by averaging the pixel values of the selected country flags, creating unique combinations.

## Features

- Browse countries organized by continent
- Select multiple countries to create a combined flag
- View real-time flag blending as you select countries
- Toggle visibility of the selected countries list
- Select random countries with one click
- Responsive design that works on desktop and mobile devices

## How It Works

1. **Country Selection**: Users can expand continents and select individual countries using checkboxes
2. **Flag Blending**: The application loads SVG flag images for selected countries and combines them by averaging pixel values
3. **Real-time Updates**: The combined flag updates instantly as countries are selected or deselected
4. **Visual Feedback**: The application shows the number of selected countries and provides loading states during flag generation

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd flag-jockey
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

### Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
src/
├── assets/flags/          # SVG flag images for each country
├── components/            # React components
│   ├── CombinedFlag.tsx   # Component for displaying blended flags
│   └── CountryList.tsx    # Component for country selection UI
├── data/                  # Country data and continent organization
├── design/                # Design documentation
└── App.tsx               # Main application component
```

## Technical Details

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS modules
- **Flag Processing**: Canvas-based pixel manipulation for flag blending
- **Data Management**: Continent and country data stored in structured JSON format

## Available Scripts

- `npm run dev`: Starts the development server
- `npm run build`: Creates a production build
- `npm run lint`: Runs ESLint for code quality checks
- `npm run preview`: Previews the production build locally

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
