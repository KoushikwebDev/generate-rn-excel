# Generate Release Note

A comprehensive Excel generation tool for SBI General Insurance release notes and test cases. **Internal use only.**

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [File Structure](#file-structure)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [Developer](#developer)

---

## 🎯 Overview
Generate Release Note is a modern React-based web application designed specifically for SBI General Insurance to streamline the process of creating release notes and test case documentation. The application provides an intuitive interface for developers and supervisors to input project details and generate professional Excel files with proper formatting and branding.

The tool supports both individual Excel file generation and packaged ZIP downloads containing multiple files with a structured folder organization. It also includes preview functionality for reviewing content before final generation.

---

## ✨ Features
- **Form Management**
  - Comprehensive form with validation using Formik and Yup
  - Auto-save functionality for form details
  - Real-time form validation with error messages
  - Date picker integration for release and SIT pass dates
- **Excel Generation**
  - Release Note Excel with SBI branding and logo
  - Test Cases Excel with predefined columns and structure
  - Professional formatting with proper styling
  - Customizable content based on form inputs
- **ZIP Packaging**
  - Package multiple files into a single ZIP download
  - Organized folder structure within ZIP
  - Includes release notes, test cases, and additional files
  - Custom naming based on CR number
- **Preview System**
  - Preview release notes before generation
  - Preview test cases with editable interface
  - Real-time content editing in preview mode
  - Download directly from preview window
- **Modern UI/UX**
  - Light and dark theme support
  - Smooth animations with Framer Motion
  - Responsive design for all screen sizes
  - Modern gradient backgrounds and shadows
  - Interactive hover effects and transitions
- **Advanced Features**
  - Form data persistence across sessions
  - Selective field reset after submission
  - Error handling and user feedback
  - Cross-browser compatibility

---

## 🛠️ Tech Stack
- **Frontend Framework**
  - React 19.1.0
  - Vite 6.3.5
  - React Router DOM 7.6.3
- **Form Management**
  - Formik 2.4.6
  - Yup 1.6.1
  - React DatePicker 8.4.0
- **Excel & File Handling**
  - ExcelJS 4.4.0
  - FileSaver 2.0.5
  - JSZip 3.10.1
- **UI/UX & Animations**
  - Framer Motion 12.23.3
  - Tailwind CSS 4.1.8
  - PostCSS 8.5.4
- **Development Tools**
  - ESLint 9.28.0
  - TypeScript
  - Autoprefixer 10.4.21

---

## 🚀 Installation

### Prerequisites
- Node.js 22.x or higher
- npm 8.x or higher

### Installation Steps
1. Clone the repository:
   ```sh
   git clone [repository-url]
   cd generate-xls
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start development server:
   ```sh
   npm run dev
   ```
4. Build for production:
   ```sh
   npm run build
   ```

---

## 📖 Usage Guide
1. **Form Filling**
   - Fill in all required fields including developer information, CR details, and dates. The form includes real-time validation to ensure all data is properly entered.
2. **Preview Options**
   - Use the preview buttons to review your release notes and test cases before final generation. Preview windows allow editing and direct download of files.
3. **File Generation**
   - Choose between individual Excel file download or ZIP package containing multiple files. The ZIP option includes organized folder structure with all necessary documentation.
4. **Data Persistence**
   - Enable "Save details for next time" to automatically populate form fields in future sessions. Only CR number and title are reset after successful generation.

---

## 📁 File Structure
```
generate-xls/
├── public/
│   ├── vite.svg
│   └── index.html
├── src/
│   ├── components/
│   │   └── Documentation.jsx
│   ├── context/
│   │   └── ThemeContext.jsx
│   ├── images/
│   │   ├── sbig-logo.png
│   │   └── sbig-logo.svg
│   ├── utils/
│   │   ├── exportReleaseNoteExcel.js
│   │   ├── exportReleaseNoteZip.js
│   │   └── previewExcel.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

---

## 🔧 API Reference
- **exportReleaseNoteExcel(formData, logo)**
  - Generates a release note Excel file with SBI branding.
  - **Parameters:** `formData` (object), `logo` (string)
  - **Returns:** Promise that resolves when file is downloaded
- **exportReleaseNoteZip(formData)**
  - Creates a ZIP package containing multiple files with organized structure.
  - **Parameters:** `formData` (object)
  - **Returns:** Promise that resolves when ZIP is downloaded
- **openExcelPreview(formData, type)**
  - Opens a preview window with editable Excel-like interface.
  - **Parameters:** `formData` (object), `type` ('releaseNote' | 'testCases')
  - **Returns:** Promise that resolves when preview window opens

---

## 🤝 Contributing
We welcome contributions to improve Generate Release Note! Please follow these guidelines:

- **Development Setup**
  - Fork the repository
  - Create a feature branch
  - Make your changes
  - Run tests and linting
  - Submit a pull request
- **Code Standards**
  - Follow ESLint configuration
  - Use meaningful commit messages
  - Add comments for complex logic
  - Maintain consistent code style

---

## 👨‍💻 Developer
**Developed by [Koushik Saha](https://ksaha.netlify.app/)**
