# Pedigree Application

This is a Pedigree Chart application that allows users to manually create and edit pedigree charts using an interactive GUI. The current version is a work-in-progress, with the core functionalities implemented but still some features under development. This application aims to provide a dynamic and user-friendly environment for pedigree analysis, including the ability to add, modify, and visualize family relationships.

## Features

- **Dynamic GUI Editor**: Create, edit, and customize pedigree charts.
- **Symbols for Individuals**: Manually add symbols (squares for males, circles for females) to represent individuals in the pedigree.
- **Interactive Lines and Connections**: Add and adjust lines to represent relationships between individuals.
- **Component-Based Architecture**: Built using modern front-end technologies for a responsive experience.

## Known Issues

- **Incomplete Symbol and Line Features**: Some symbols and line types are not fully available, which may limit some chart customization options.
- **Errors and Bugs**: The application may have some errors related to the incomplete implementation of relationship lines.

## File Structure

- **index.html**: Entry point of the application.
- **src/**: Contains all source files.
  - **components/**: Reusable UI components for the pedigree editor.
  - **hooks/**: Custom hooks used across the application.
  - **utils/**: Utility functions for supporting various functionalities.
  - **pedigreeEditor.js**: Main script for managing the pedigree chart editor.
- **styles**: CSS files for application styling.

## Technologies Used

- **React**: For building the user interface.
- **TypeScript**: To ensure type safety across the codebase.
- **Tailwind CSS**: For styling the application.
- **Vite**: For building and bundling the application.

## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```sh
   cd Pedigree-v1-main
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Run the development server:
   ```sh
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000`.

## Contribution

Contributions are welcome! Please feel free to submit a Pull Request or create an Issue to report a bug or suggest a new feature.

## License

This project is licensed under the MIT License.

