import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";

const Documentation = () => {
  const { isDark, colors } = useTheme();
  const currentColors = isDark ? colors.dark : colors.light;

  return (
    <motion.div
      className="documentation-container"
      style={{
        backgroundColor: currentColors.background,
        color: currentColors.text,
        minHeight: '100vh',
        padding: '2rem',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 style={{ 
          color: currentColors.primary, 
          fontSize: '2.5rem', 
          marginBottom: '1rem',
          fontWeight: 'bold'
        }}>
          Generate Release Note - Documentation
        </h1>
        <p style={{ 
          color: currentColors.textSecondary, 
          fontSize: '1.1rem',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          A comprehensive Excel generation tool for SBI General Insurance release notes and test cases. Internal use only.
        </p>
        
        {/* Back to App Button */}
        <motion.div style={{ marginTop: '2rem' }}>
          <Link to="/">
            <motion.button
              style={{
                background: currentColors.gradient,
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.75rem 1.5rem',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                boxShadow: currentColors.shadow
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              ← Back to Application
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        style={{
          width: '100%',
          maxWidth: '100%',
          margin: '0',
          lineHeight: '1.6'
        }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Table of Contents */}
        <motion.div
          style={{
            backgroundColor: currentColors.surface,
            padding: '1.5rem',
            borderRadius: '1rem',
            marginBottom: '2rem',
            boxShadow: currentColors.shadow,
            border: `1px solid ${currentColors.border}`
          }}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 style={{ color: currentColors.primary, marginBottom: '0.75rem', fontSize: '1.25rem' }}>📋 Table of Contents</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '0.5rem',
            color: currentColors.textSecondary
          }}>
            <a href="#overview" style={{ 
              color: currentColors.primary, 
              textDecoration: 'none',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: currentColors.background,
              border: `1px solid ${currentColors.border}`,
              display: 'block',
              transition: 'all 0.2s ease'
            }} onMouseEnter={(e) => {
              e.target.style.backgroundColor = currentColors.inputBg;
              e.target.style.transform = 'translateY(-2px)';
            }} onMouseLeave={(e) => {
              e.target.style.backgroundColor = currentColors.background;
              e.target.style.transform = 'translateY(0)';
            }}>Overview</a>
            <a href="#features" style={{ 
              color: currentColors.primary, 
              textDecoration: 'none',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: currentColors.background,
              border: `1px solid ${currentColors.border}`,
              display: 'block',
              transition: 'all 0.2s ease'
            }} onMouseEnter={(e) => {
              e.target.style.backgroundColor = currentColors.inputBg;
              e.target.style.transform = 'translateY(-2px)';
            }} onMouseLeave={(e) => {
              e.target.style.backgroundColor = currentColors.background;
              e.target.style.transform = 'translateY(0)';
            }}>Features</a>
            <a href="#tech-stack" style={{ 
              color: currentColors.primary, 
              textDecoration: 'none',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: currentColors.background,
              border: `1px solid ${currentColors.border}`,
              display: 'block',
              transition: 'all 0.2s ease'
            }} onMouseEnter={(e) => {
              e.target.style.backgroundColor = currentColors.inputBg;
              e.target.style.transform = 'translateY(-2px)';
            }} onMouseLeave={(e) => {
              e.target.style.backgroundColor = currentColors.background;
              e.target.style.transform = 'translateY(0)';
            }}>Tech Stack</a>
            <a href="#installation" style={{ 
              color: currentColors.primary, 
              textDecoration: 'none',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: currentColors.background,
              border: `1px solid ${currentColors.border}`,
              display: 'block',
              transition: 'all 0.2s ease'
            }} onMouseEnter={(e) => {
              e.target.style.backgroundColor = currentColors.inputBg;
              e.target.style.transform = 'translateY(-2px)';
            }} onMouseLeave={(e) => {
              e.target.style.backgroundColor = currentColors.background;
              e.target.style.transform = 'translateY(0)';
            }}>Installation</a>
            <a href="#usage" style={{ 
              color: currentColors.primary, 
              textDecoration: 'none',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: currentColors.background,
              border: `1px solid ${currentColors.border}`,
              display: 'block',
              transition: 'all 0.2s ease'
            }} onMouseEnter={(e) => {
              e.target.style.backgroundColor = currentColors.inputBg;
              e.target.style.transform = 'translateY(-2px)';
            }} onMouseLeave={(e) => {
              e.target.style.backgroundColor = currentColors.background;
              e.target.style.transform = 'translateY(0)';
            }}>Usage Guide</a>
            <a href="#file-structure" style={{ 
              color: currentColors.primary, 
              textDecoration: 'none',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: currentColors.background,
              border: `1px solid ${currentColors.border}`,
              display: 'block',
              transition: 'all 0.2s ease'
            }} onMouseEnter={(e) => {
              e.target.style.backgroundColor = currentColors.inputBg;
              e.target.style.transform = 'translateY(-2px)';
            }} onMouseLeave={(e) => {
              e.target.style.backgroundColor = currentColors.background;
              e.target.style.transform = 'translateY(0)';
            }}>File Structure</a>
            <a href="#api-reference" style={{ 
              color: currentColors.primary, 
              textDecoration: 'none',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: currentColors.background,
              border: `1px solid ${currentColors.border}`,
              display: 'block',
              transition: 'all 0.2s ease'
            }} onMouseEnter={(e) => {
              e.target.style.backgroundColor = currentColors.inputBg;
              e.target.style.transform = 'translateY(-2px)';
            }} onMouseLeave={(e) => {
              e.target.style.backgroundColor = currentColors.background;
              e.target.style.transform = 'translateY(0)';
            }}>API Reference</a>
            <a href="#contributing" style={{ 
              color: currentColors.primary, 
              textDecoration: 'none',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: currentColors.background,
              border: `1px solid ${currentColors.border}`,
              display: 'block',
              transition: 'all 0.2s ease'
            }} onMouseEnter={(e) => {
              e.target.style.backgroundColor = currentColors.inputBg;
              e.target.style.transform = 'translateY(-2px)';
            }} onMouseLeave={(e) => {
              e.target.style.backgroundColor = currentColors.background;
              e.target.style.transform = 'translateY(0)';
            }}>Contributing</a>
          </div>
        </motion.div>

        {/* Overview */}
        <motion.section
          id="overview"
          style={{
            backgroundColor: currentColors.surface,
            padding: '2rem',
            borderRadius: '1rem',
            marginBottom: '2rem',
            boxShadow: currentColors.shadow,
            border: `1px solid ${currentColors.border}`
          }}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 style={{ color: currentColors.primary, marginBottom: '1rem' }}>🎯 Overview</h2>
          <p style={{ color: currentColors.textSecondary, marginBottom: '1rem' }}>
            Generate XLS is a modern React-based web application designed specifically for SBI General Insurance 
            to streamline the process of creating release notes and test case documentation. The application 
            provides an intuitive interface for developers and supervisors to input project details and 
            generate professional Excel files with proper formatting and branding.
          </p>
          <p style={{ color: currentColors.textSecondary }}>
            The tool supports both individual Excel file generation and packaged ZIP downloads containing 
            multiple files with a structured folder organization. It also includes preview functionality 
            for reviewing content before final generation.
          </p>
        </motion.section>

        {/* Features */}
        <motion.section
          id="features"
          style={{
            backgroundColor: currentColors.surface,
            padding: '2rem',
            borderRadius: '1rem',
            marginBottom: '2rem',
            boxShadow: currentColors.shadow,
            border: `1px solid ${currentColors.border}`
          }}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 style={{ color: currentColors.primary, marginBottom: '1rem' }}>✨ Features</h2>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: currentColors.background, 
              borderRadius: '0.5rem',
              border: `1px solid ${currentColors.border}`
            }}>
              <h3 style={{ color: currentColors.text, marginBottom: '0.5rem' }}>📝 Form Management</h3>
              <ul style={{ color: currentColors.textSecondary, marginLeft: '1rem' }}>
                <li>Comprehensive form with validation using Formik and Yup</li>
                <li>Auto-save functionality for form details</li>
                <li>Real-time form validation with error messages</li>
                <li>Date picker integration for release and SIT pass dates</li>
              </ul>
            </div>

            <div style={{ 
              padding: '1rem', 
              backgroundColor: currentColors.background, 
              borderRadius: '0.5rem',
              border: `1px solid ${currentColors.border}`
            }}>
              <h3 style={{ color: currentColors.text, marginBottom: '0.5rem' }}>📊 Excel Generation</h3>
              <ul style={{ color: currentColors.textSecondary, marginLeft: '1rem' }}>
                <li>Release Note Excel with SBI branding and logo</li>
                <li>Test Cases Excel with predefined columns and structure</li>
                <li>Professional formatting with proper styling</li>
                <li>Customizable content based on form inputs</li>
              </ul>
            </div>

            <div style={{ 
              padding: '1rem', 
              backgroundColor: currentColors.background, 
              borderRadius: '0.5rem',
              border: `1px solid ${currentColors.border}`
            }}>
              <h3 style={{ color: currentColors.text, marginBottom: '0.5rem' }}>📦 ZIP Packaging</h3>
              <ul style={{ color: currentColors.textSecondary, marginLeft: '1rem' }}>
                <li>Package multiple files into a single ZIP download</li>
                <li>Organized folder structure within ZIP</li>
                <li>Includes release notes, test cases, and additional files</li>
                <li>Custom naming based on CR number</li>
              </ul>
            </div>

            <div style={{ 
              padding: '1rem', 
              backgroundColor: currentColors.background, 
              borderRadius: '0.5rem',
              border: `1px solid ${currentColors.border}`
            }}>
              <h3 style={{ color: currentColors.text, marginBottom: '0.5rem' }}>👁️ Preview System</h3>
              <ul style={{ color: currentColors.textSecondary, marginLeft: '1rem' }}>
                <li>Preview release notes before generation</li>
                <li>Preview test cases with editable interface</li>
                <li>Real-time content editing in preview mode</li>
                <li>Download directly from preview window</li>
              </ul>
            </div>

            <div style={{ 
              padding: '1rem', 
              backgroundColor: currentColors.background, 
              borderRadius: '0.5rem',
              border: `1px solid ${currentColors.border}`
            }}>
              <h3 style={{ color: currentColors.text, marginBottom: '0.5rem' }}>🎨 Modern UI/UX</h3>
              <ul style={{ color: currentColors.textSecondary, marginLeft: '1rem' }}>
                <li>Light and dark theme support</li>
                <li>Smooth animations with Framer Motion</li>
                <li>Responsive design for all screen sizes</li>
                <li>Modern gradient backgrounds and shadows</li>
                <li>Interactive hover effects and transitions</li>
              </ul>
            </div>

            <div style={{ 
              padding: '1rem', 
              backgroundColor: currentColors.background, 
              borderRadius: '0.5rem',
              border: `1px solid ${currentColors.border}`
            }}>
              <h3 style={{ color: currentColors.text, marginBottom: '0.5rem' }}>🔧 Advanced Features</h3>
              <ul style={{ color: currentColors.textSecondary, marginLeft: '1rem' }}>
                <li>Form data persistence across sessions</li>
                <li>Selective field reset after submission</li>
                <li>Error handling and user feedback</li>
                <li>Cross-browser compatibility</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Tech Stack */}
        <motion.section
          id="tech-stack"
          style={{
            backgroundColor: currentColors.surface,
            padding: '2rem',
            borderRadius: '1rem',
            marginBottom: '2rem',
            boxShadow: currentColors.shadow,
            border: `1px solid ${currentColors.border}`
          }}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 style={{ color: currentColors.primary, marginBottom: '1rem' }}>🛠️ Tech Stack</h2>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: currentColors.background, 
              borderRadius: '0.5rem',
              border: `1px solid ${currentColors.border}`
            }}>
              <h3 style={{ color: currentColors.text, marginBottom: '0.5rem' }}>Frontend Framework</h3>
              <ul style={{ color: currentColors.textSecondary, marginLeft: '1rem' }}>
                <li><strong>React 19.1.0</strong> - Modern React with latest features</li>
                <li><strong>Vite 6.3.5</strong> - Fast build tool and development server</li>
                <li><strong>React Router DOM 7.6.3</strong> - Client-side routing</li>
              </ul>
            </div>

            <div style={{ 
              padding: '1rem', 
              backgroundColor: currentColors.background, 
              borderRadius: '0.5rem',
              border: `1px solid ${currentColors.border}`
            }}>
              <h3 style={{ color: currentColors.text, marginBottom: '0.5rem' }}>Form Management</h3>
              <ul style={{ color: currentColors.textSecondary, marginLeft: '1rem' }}>
                <li><strong>Formik 2.4.6</strong> - Form state management</li>
                <li><strong>Yup 1.6.1</strong> - Schema validation</li>
                <li><strong>React DatePicker 8.4.0</strong> - Date input component</li>
              </ul>
            </div>

            <div style={{ 
              padding: '1rem', 
              backgroundColor: currentColors.background, 
              borderRadius: '0.5rem',
              border: `1px solid ${currentColors.border}`
            }}>
              <h3 style={{ color: currentColors.text, marginBottom: '0.5rem' }}>Excel & File Handling</h3>
              <ul style={{ color: currentColors.textSecondary, marginLeft: '1rem' }}>
                <li><strong>ExcelJS 4.4.0</strong> - Excel file generation and manipulation</li>
                <li><strong>FileSaver 2.0.5</strong> - Client-side file saving</li>
                <li><strong>JSZip 3.10.1</strong> - ZIP file creation and packaging</li>
              </ul>
            </div>

            <div style={{ 
              padding: '1rem', 
              backgroundColor: currentColors.background, 
              borderRadius: '0.5rem',
              border: `1px solid ${currentColors.border}`
            }}>
              <h3 style={{ color: currentColors.text, marginBottom: '0.5rem' }}>UI/UX & Animations</h3>
              <ul style={{ color: currentColors.textSecondary, marginLeft: '1rem' }}>
                <li><strong>Framer Motion 12.23.3</strong> - Smooth animations and transitions</li>
                <li><strong>Tailwind CSS 4.1.8</strong> - Utility-first CSS framework</li>
                <li><strong>PostCSS 8.5.4</strong> - CSS processing</li>
              </ul>
            </div>

            <div style={{ 
              padding: '1rem', 
              backgroundColor: currentColors.background, 
              borderRadius: '0.5rem',
              border: `1px solid ${currentColors.border}`
            }}>
              <h3 style={{ color: currentColors.text, marginBottom: '0.5rem' }}>Development Tools</h3>
              <ul style={{ color: currentColors.textSecondary, marginLeft: '1rem' }}>
                <li><strong>ESLint 9.28.0</strong> - Code linting and formatting</li>
                <li><strong>TypeScript</strong> - Type checking and IntelliSense</li>
                <li><strong>Autoprefixer 10.4.21</strong> - CSS vendor prefixing</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Installation */}
        <motion.section
          id="installation"
          style={{
            backgroundColor: currentColors.surface,
            padding: '2rem',
            borderRadius: '1rem',
            marginBottom: '2rem',
            boxShadow: currentColors.shadow,
            border: `1px solid ${currentColors.border}`
          }}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h2 style={{ color: currentColors.primary, marginBottom: '1rem' }}>🚀 Installation</h2>
          
          <div style={{ 
            backgroundColor: currentColors.background, 
            padding: '1.5rem', 
            borderRadius: '0.5rem',
            border: `1px solid ${currentColors.border}`,
            fontFamily: 'monospace',
            fontSize: '0.9rem'
          }}>
            <p style={{ color: currentColors.textSecondary, marginBottom: '1rem' }}>
              <strong style={{ color: currentColors.text }}>Prerequisites:</strong>
            </p>
            <ul style={{ color: currentColors.textSecondary, marginLeft: '1rem', marginBottom: '1rem' }}>
              <li>Node.js 22.x or higher</li>
              <li>npm 8.x or higher</li>
            </ul>
            
            <p style={{ color: currentColors.textSecondary, marginBottom: '1rem' }}>
              <strong style={{ color: currentColors.text }}>Installation Steps:</strong>
            </p>
            <div style={{ color: currentColors.textSecondary }}>
              <p>1. Clone the repository:</p>
              <code style={{ 
                display: 'block', 
                backgroundColor: currentColors.inputBg, 
                padding: '0.5rem', 
                borderRadius: '0.25rem',
                marginBottom: '1rem',
                border: `1px solid ${currentColors.inputBorder}`
              }}>
                git clone [repository-url]<br/>
                cd generate-xls
              </code>
              
              <p>2. Install dependencies:</p>
              <code style={{ 
                display: 'block', 
                backgroundColor: currentColors.inputBg, 
                padding: '0.5rem', 
                borderRadius: '0.25rem',
                marginBottom: '1rem',
                border: `1px solid ${currentColors.inputBorder}`
              }}>
                npm install
              </code>
              
              <p>3. Start development server:</p>
              <code style={{ 
                display: 'block', 
                backgroundColor: currentColors.inputBg, 
                padding: '0.5rem', 
                borderRadius: '0.25rem',
                marginBottom: '1rem',
                border: `1px solid ${currentColors.inputBorder}`
              }}>
                npm run dev
              </code>
              
              <p>4. Build for production:</p>
              <code style={{ 
                display: 'block', 
                backgroundColor: currentColors.inputBg, 
                padding: '0.5rem', 
                borderRadius: '0.25rem',
                border: `1px solid ${currentColors.inputBorder}`
              }}>
                npm run build
              </code>
            </div>
          </div>
        </motion.section>

        {/* Usage Guide */}
        <motion.section
          id="usage"
          style={{
            backgroundColor: currentColors.surface,
            padding: '2rem',
            borderRadius: '1rem',
            marginBottom: '2rem',
            boxShadow: currentColors.shadow,
            border: `1px solid ${currentColors.border}`
          }}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 style={{ color: currentColors.primary, marginBottom: '1rem' }}>📖 Usage Guide</h2>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: currentColors.background, 
              borderRadius: '0.5rem',
              border: `1px solid ${currentColors.border}`
            }}>
              <h3 style={{ color: currentColors.text, marginBottom: '0.5rem' }}>1. Form Filling</h3>
              <p style={{ color: currentColors.textSecondary }}>
                Fill in all required fields including developer information, CR details, and dates. 
                The form includes real-time validation to ensure all data is properly entered.
              </p>
            </div>

            <div style={{ 
              padding: '1rem', 
              backgroundColor: currentColors.background, 
              borderRadius: '0.5rem',
              border: `1px solid ${currentColors.border}`
            }}>
              <h3 style={{ color: currentColors.text, marginBottom: '0.5rem' }}>2. Preview Options</h3>
              <p style={{ color: currentColors.textSecondary }}>
                Use the preview buttons to review your release notes and test cases before final generation. 
                Preview windows allow editing and direct download of files.
              </p>
            </div>

            <div style={{ 
              padding: '1rem', 
              backgroundColor: currentColors.background, 
              borderRadius: '0.5rem',
              border: `1px solid ${currentColors.border}`
            }}>
              <h3 style={{ color: currentColors.text, marginBottom: '0.5rem' }}>3. File Generation</h3>
              <p style={{ color: currentColors.textSecondary }}>
                Choose between individual Excel file download or ZIP package containing multiple files. 
                The ZIP option includes organized folder structure with all necessary documentation.
              </p>
            </div>

            <div style={{ 
              padding: '1rem', 
              backgroundColor: currentColors.background, 
              borderRadius: '0.5rem',
              border: `1px solid ${currentColors.border}`
            }}>
              <h3 style={{ color: currentColors.text, marginBottom: '0.5rem' }}>4. Data Persistence</h3>
              <p style={{ color: currentColors.textSecondary }}>
                Enable "Save details for next time" to automatically populate form fields in future sessions. 
                Only CR number and title are reset after successful generation.
              </p>
            </div>
          </div>
        </motion.section>

        {/* File Structure */}
        <motion.section
          id="file-structure"
          style={{
            backgroundColor: currentColors.surface,
            padding: '2rem',
            borderRadius: '1rem',
            marginBottom: '2rem',
            boxShadow: currentColors.shadow,
            border: `1px solid ${currentColors.border}`
          }}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <h2 style={{ color: currentColors.primary, marginBottom: '1rem' }}>📁 File Structure</h2>
          
          <div style={{ 
            backgroundColor: currentColors.background, 
            padding: '1.5rem', 
            borderRadius: '0.5rem',
            border: `1px solid ${currentColors.border}`,
            fontFamily: 'monospace',
            fontSize: '0.9rem'
          }}>
            <pre style={{ color: currentColors.textSecondary, margin: 0 }}>
{`generate-xls/
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
└── README.md`}
            </pre>
          </div>
        </motion.section>

        {/* API Reference */}
        <motion.section
          id="api-reference"
          style={{
            backgroundColor: currentColors.surface,
            padding: '2rem',
            borderRadius: '1rem',
            marginBottom: '2rem',
            boxShadow: currentColors.shadow,
            border: `1px solid ${currentColors.border}`
          }}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <h2 style={{ color: currentColors.primary, marginBottom: '1rem' }}>🔧 API Reference</h2>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: currentColors.background, 
              borderRadius: '0.5rem',
              border: `1px solid ${currentColors.border}`
            }}>
              <h3 style={{ color: currentColors.text, marginBottom: '0.5rem' }}>exportReleaseNoteExcel(formData, logo)</h3>
              <p style={{ color: currentColors.textSecondary, marginBottom: '0.5rem' }}>
                Generates a release note Excel file with SBI branding.
              </p>
              <p style={{ color: currentColors.textSecondary, fontSize: '0.9rem' }}>
                <strong>Parameters:</strong> formData (object), logo (string)<br/>
                <strong>Returns:</strong> Promise that resolves when file is downloaded
              </p>
            </div>

            <div style={{ 
              padding: '1rem', 
              backgroundColor: currentColors.background, 
              borderRadius: '0.5rem',
              border: `1px solid ${currentColors.border}`
            }}>
              <h3 style={{ color: currentColors.text, marginBottom: '0.5rem' }}>exportReleaseNoteZip(formData)</h3>
              <p style={{ color: currentColors.textSecondary, marginBottom: '0.5rem' }}>
                Creates a ZIP package containing multiple files with organized structure.
              </p>
              <p style={{ color: currentColors.textSecondary, fontSize: '0.9rem' }}>
                <strong>Parameters:</strong> formData (object)<br/>
                <strong>Returns:</strong> Promise that resolves when ZIP is downloaded
              </p>
            </div>

            <div style={{ 
              padding: '1rem', 
              backgroundColor: currentColors.background, 
              borderRadius: '0.5rem',
              border: `1px solid ${currentColors.border}`
            }}>
              <h3 style={{ color: currentColors.text, marginBottom: '0.5rem' }}>openExcelPreview(formData, type)</h3>
              <p style={{ color: currentColors.textSecondary, marginBottom: '0.5rem' }}>
                Opens a preview window with editable Excel-like interface.
              </p>
              <p style={{ color: currentColors.textSecondary, fontSize: '0.9rem' }}>
                <strong>Parameters:</strong> formData (object), type ('releaseNote' | 'testCases')<br/>
                <strong>Returns:</strong> Promise that resolves when preview window opens
              </p>
            </div>
          </div>
        </motion.section>

        {/* Contributing */}
        <motion.section
          id="contributing"
          style={{
            backgroundColor: currentColors.surface,
            padding: '2rem',
            borderRadius: '1rem',
            marginBottom: '2rem',
            boxShadow: currentColors.shadow,
            border: `1px solid ${currentColors.border}`
          }}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          <h2 style={{ color: currentColors.primary, marginBottom: '1rem' }}>🤝 Contributing</h2>
          
          <p style={{ color: currentColors.textSecondary, marginBottom: '1rem' }}>
            We welcome contributions to improve Generate XLS! Please follow these guidelines:
          </p>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: currentColors.background, 
              borderRadius: '0.5rem',
              border: `1px solid ${currentColors.border}`
            }}>
              <h3 style={{ color: currentColors.text, marginBottom: '0.5rem' }}>Development Setup</h3>
              <ul style={{ color: currentColors.textSecondary, marginLeft: '1rem' }}>
                <li>Fork the repository</li>
                <li>Create a feature branch</li>
                <li>Make your changes</li>
                <li>Run tests and linting</li>
                <li>Submit a pull request</li>
              </ul>
            </div>

            <div style={{ 
              padding: '1rem', 
              backgroundColor: currentColors.background, 
              borderRadius: '0.5rem',
              border: `1px solid ${currentColors.border}`
            }}>
              <h3 style={{ color: currentColors.text, marginBottom: '0.5rem' }}>Code Standards</h3>
              <ul style={{ color: currentColors.textSecondary, marginLeft: '1rem' }}>
                <li>Follow ESLint configuration</li>
                <li>Use meaningful commit messages</li>
                <li>Add comments for complex logic</li>
                <li>Maintain consistent code style</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.div
          style={{
            textAlign: 'center',
            padding: '2rem',
            borderTop: `1px solid ${currentColors.border}`,
            marginTop: '3rem'
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <p style={{ color: currentColors.textSecondary, marginBottom: '0.5rem' }}>
            © 2024 Generate XLS - SBI General Insurance. Built with ❤️ using React and modern web technologies.
          </p>
          <p style={{ color: currentColors.primary, fontWeight: '600', fontSize: '1.1rem' }}>
            Developed by <a 
              href="https://ksaha.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: currentColors.primary, 
                textDecoration: 'none',
                fontWeight: 'bold',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.opacity = '0.8';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Koushik Saha
            </a>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Documentation; 