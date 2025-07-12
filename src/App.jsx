import { useFormik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { exportReleaseNoteExcel } from "./utils/exportReleaseNoteExcel";
import { exportReleaseNoteZip } from "./utils/exportReleaseNoteZip";
import { openExcelPreview } from "./utils/previewExcel";
import sbiLogo from "./images/sbig-logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./context/ThemeContext";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Documentation from "./components/Documentation";

const initialValues = {
  releaseDate: new Date(),
  sitPassDate: new Date(),
  developerName: "",
  developerEmail: "",
  developerPhone: "",
  crNumber: "",
  crTitle: "",
  supervisorName: "Amlan",
  supervisorEmail: "amlan.chakraborty@intglobal.com",
  supervisorPhone: "9830940648",
  saveDetails: true,
  downloadZip: false,
};

const validationSchema = Yup.object({
  releaseDate: Yup.date().required("Release Date is required"),
  sitPassDate: Yup.date().required("SIT Pass Date is required"),
  developerName: Yup.string().required("Developer name is required"),
  developerEmail: Yup.string()
    .email("Invalid email")
    .required("Developer email is required"),
  developerPhone: Yup.string()
    .matches(/^\d{10}$/, "Must be 10 digits")
    .required("Developer phone is required"),
  crNumber: Yup.string().required("CR Number is required"),
  crTitle: Yup.string().required("CR Title is required"),
  supervisorName: Yup.string().required("Supervisor name is required"),
  supervisorEmail: Yup.string()
    .email("Invalid email")
    .required("Supervisor email is required"),
  supervisorPhone: Yup.string()
    .matches(/^\d{10}$/, "Must be 10 digits")
    .required("Supervisor phone is required"),
});

// Format dates for preview display
const formatDate = (date) => {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("en-GB");
  } catch {
    return "";
  }
};

const FormComponent = () => {
  const { isDark, toggleTheme, colors } = useTheme();
  const currentColors = isDark ? colors.dark : colors.light;

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (values.downloadZip) {
          await exportReleaseNoteZip(values);
        } else {
          exportReleaseNoteExcel(values, sbiLogo);
        }
        handleSaveDetails(values.saveDetails);
        // Reset only CR Number and CR Title
        formik.setFieldValue('crNumber', '');
        formik.setFieldValue('crTitle', '');
      } catch (error) {
        console.error("Error during export:", error);
        alert("Error generating file. Please try again.");
      }
    },
  });

  // save details
  function handleSaveDetails(isSaveDetails) {
    const detailsToSave = formik.values;
    delete detailsToSave.crNumber;
    delete detailsToSave.crTitle;

    isSaveDetails
      ? localStorage.setItem("formDetails", JSON.stringify(detailsToSave))
      : localStorage.removeItem("formDetails");
  }

  // pre-populate form details
  useEffect(() => {
    const savedFormDetails = localStorage.getItem("formDetails")
      ? JSON.parse(localStorage.getItem("formDetails"))
      : null;

    if (savedFormDetails) {
      savedFormDetails.crNumber = "";
      savedFormDetails.crTitle = "";
      formik.setValues(savedFormDetails);
    }
  }, []);

  // Check if form is valid and complete
  const isFormValid = () => {
    return formik.isValid && 
           formik.values.developerName && 
           formik.values.developerEmail && 
           formik.values.developerPhone && 
           formik.values.crNumber && 
           formik.values.crTitle;
  };

  // Handle preview button clicks
  const handlePreview = async (type) => {
    if (!isFormValid()) {
      alert("Please fill all required fields before previewing.");
      return;
    }
    
    try {
      await openExcelPreview(formik.values, type);
    } catch (error) {
      console.error("Error opening preview:", error);
      alert("Error opening preview. Please try again.");
    }
  };

  // Listen for form updates from preview
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'updateFormFromPreview') {
        const updatedData = event.data.data;
        
        // Update form with the new data
        formik.setValues(prevValues => ({
          ...prevValues,
          ...updatedData
        }));
        
        // Show success message
        alert('Form data updated successfully! Your changes will be included in the next download.');
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [formik]);

  const renderInput = (name, label, type = "text") => {
    const isSupervisorField = name.startsWith("supervisor");

    return (
      <motion.div 
        className="form-group mb-4"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <label
          htmlFor={name}
          className="block font-semibold mb-1"
          style={{ color: currentColors.text }}
        >
          {label}
        </label>
        <input
          id={name}
          type={type}
          name={name}
          placeholder={label}
          onChange={(e) => {
            if (!isSupervisorField) {
              formik.handleChange(e);
            } else {
              e.preventDefault();
            }
          }}
          onBlur={formik.handleBlur}
          value={formik.values[name]}
          className="input-field"
          disabled={isSupervisorField}
          style={{
            backgroundColor: currentColors.inputBg,
            border: `1px solid ${currentColors.inputBorder}`,
            color: currentColors.text,
            boxShadow: currentColors.shadow
          }}
        />
        {formik.touched[name] && formik.errors[name] && (
          <motion.p 
            className="error-text"
            style={{ color: currentColors.error }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {formik.errors[name]}
          </motion.p>
        )}
      </motion.div>
    );
  };

  const renderDatePicker = (name, label) => (
    <motion.div 
      className="form-group mb-4"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <label htmlFor={name} className="block font-semibold mb-1" style={{ color: currentColors.text }}>
        {label}
      </label>
      <DatePicker
        id={name}
        selected={formik.values[name]}
        onChange={(val) => formik.setFieldValue(name, val)}
        onBlur={formik.handleBlur}
        className="input-field"
        dateFormat="dd/MM/yyyy"
        style={{
          backgroundColor: currentColors.inputBg,
          border: `1px solid ${currentColors.inputBorder}`,
          color: currentColors.text,
          boxShadow: currentColors.shadow
        }}
      />
      {formik.touched[name] && formik.errors[name] && (
        <motion.p 
          className="error-text"
          style={{ color: currentColors.error }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {formik.errors[name]}
        </motion.p>
      )}
    </motion.div>
  );

  return (
    <motion.div 
      className="app-container"
      style={{
        backgroundColor: currentColors.background,
        color: currentColors.text
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >


      <motion.form 
        onSubmit={formik.handleSubmit} 
        className="form-section"
        style={{
          backgroundColor: currentColors.surface,
          boxShadow: currentColors.shadow,
          border: `1px solid ${currentColors.border}`
        }}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.h2 
          className="form-title"
          style={{ color: currentColors.primary }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Release Note Details
        </motion.h2>

        {/* Developer Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="section-title" style={{ color: currentColors.text }}>Developer Info:</h3>
          {renderInput("developerName", "Developer Name")}
          {renderInput("developerEmail", "Developer Email", "email")}
          {renderInput("developerPhone", "Developer Phone")}
        </motion.div>

        {/* CR Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="section-title" style={{ color: currentColors.text }}>CR Details:</h3>
          {renderInput("crNumber", "CR Number")}
          {renderInput("crTitle", "CR Title")}
        </motion.div>

        {/* Dates */}
        <motion.div 
          className="date-grid"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {renderDatePicker("releaseDate", "Release Date")}
          {renderDatePicker("sitPassDate", "SIT Pass Date")}
        </motion.div>

        {/* Supervisor Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h3 className="section-title" style={{ color: currentColors.text }}>Supervisor Info:</h3>
          {renderInput("supervisorName", "Supervisor Name")}
          {renderInput("supervisorEmail", "Supervisor Email", "email")}
          {renderInput("supervisorPhone", "Supervisor Phone")}
        </motion.div>

        {/* Checkboxes Container */}
        <motion.div 
          style={{ 
            display: 'flex', 
            gap: '2rem', 
            marginTop: '1rem',
            flexWrap: 'wrap'
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {/* Save Details Checkbox */}
          <div className="save-checkbox">
            <input
              type="checkbox"
              id="saveDetails"
              name="saveDetails"
              checked={formik.values.saveDetails}
              onChange={formik.handleChange}
            />
            <label htmlFor="saveDetails" style={{ color: currentColors.text }}>Save details for next time</label>
          </div>

          {/* Download Zip Checkbox */}
          <div className="save-checkbox">
            <input
              type="checkbox"
              id="downloadZip"
              name="downloadZip"
              checked={formik.values.downloadZip}
              onChange={formik.handleChange}
            />
            <label htmlFor="downloadZip" style={{ color: currentColors.text }}>Download Zip</label>
          </div>
        </motion.div>

        {/* Preview Buttons - Only show when form is valid */}
        {isFormValid() && (
          <motion.div 
            style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginTop: '1rem',
              flexDirection: 'column'
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <motion.button 
              type="button"
              onClick={() => handlePreview('releaseNote')}
              style={{
                background: currentColors.gradient,
                color: '#ffffff',
                boxShadow: currentColors.shadow,
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Preview RN
            </motion.button>
            
            <motion.button 
              type="button"
              onClick={() => handlePreview('testCases')}
              style={{
                background: currentColors.gradient,
                color: '#ffffff',
                boxShadow: currentColors.shadow,
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Preview Test Cases
            </motion.button>
          </motion.div>
        )}

        <motion.button 
          type="submit" 
          className="submit-btn"
          style={{
            background: currentColors.gradient,
            color: '#ffffff',
            boxShadow: currentColors.shadow
          }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          {formik.values.downloadZip ? "Download Release Package (ZIP)" : "Download Release Note XLSX"}
        </motion.button>
      </motion.form>

      <motion.div 
        className="preview-section"
        style={{
          backgroundColor: currentColors.surface,
          boxShadow: currentColors.shadow,
          border: `1px solid ${currentColors.border}`
        }}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <motion.h2 
          className="preview-title"
          style={{ color: currentColors.primary }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Preview Filled Details
        </motion.h2>
        
        <AnimatePresence>
          <motion.div 
            className="preview-group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className="preview-subtitle" style={{ color: currentColors.text }}>Developer Info</h3>
            <p style={{ color: currentColors.textSecondary }}>
              <strong style={{ color: currentColors.text }}>Name:</strong> {formik.values.developerName || "-"}
            </p>
            <p style={{ color: currentColors.textSecondary }}>
              <strong style={{ color: currentColors.text }}>Email:</strong> {formik.values.developerEmail || "-"}
            </p>
            <p style={{ color: currentColors.textSecondary }}>
              <strong style={{ color: currentColors.text }}>Phone:</strong> {formik.values.developerPhone || "-"}
            </p>
          </motion.div>

          <motion.div 
            className="preview-group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h3 className="preview-subtitle" style={{ color: currentColors.text }}>CR Details:</h3>
            <p style={{ color: currentColors.textSecondary }}>
              <strong style={{ color: currentColors.text }}>CR Number:</strong> {formik.values.crNumber || "-"}
            </p>
            <p style={{ color: currentColors.textSecondary }}>
              <strong style={{ color: currentColors.text }}>CR Title:</strong> {formik.values.crTitle || "-"}
            </p>
          </motion.div>

          <motion.div 
            className="preview-group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h3 className="preview-subtitle" style={{ color: currentColors.text }}>Dates</h3>
            <p style={{ color: currentColors.textSecondary }}>
              <strong style={{ color: currentColors.text }}>Release Date:</strong>{" "}
              {formatDate(formik.values.releaseDate) || "-"}
            </p>
            <p style={{ color: currentColors.textSecondary }}>
              <strong style={{ color: currentColors.text }}>SIT Pass Date:</strong>{" "}
              {formatDate(formik.values.sitPassDate) || "-"}
            </p>
          </motion.div>

          <motion.div 
            className="preview-group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <h3 className="preview-subtitle" style={{ color: currentColors.text }}>Supervisor Info:</h3>
            <p style={{ color: currentColors.textSecondary }}>
              <strong style={{ color: currentColors.text }}>Name:</strong> {formik.values.supervisorName || "-"}
            </p>
            <p style={{ color: currentColors.textSecondary }}>
              <strong style={{ color: currentColors.text }}>Email:</strong> {formik.values.supervisorEmail || "-"}
            </p>
            <p style={{ color: currentColors.textSecondary }}>
              <strong style={{ color: currentColors.text }}>Phone:</strong> {formik.values.supervisorPhone || "-"}
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.div>

    </motion.div>
  );
};

// Main App component with routing
const App = () => {
  const { isDark, toggleTheme, colors } = useTheme();
  const currentColors = isDark ? colors.dark : colors.light;
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;

  return (
    <Router>
      <div style={{ backgroundColor: currentColors.background, minHeight: '100vh' }}>
        {/* Navigation Header */}
        <motion.nav
          style={{
            backgroundColor: currentColors.surface,
            padding: isMobile ? '0.5rem 0.5rem' : '1rem 2rem',
            boxShadow: currentColors.shadow,
            borderBottom: `1px solid ${currentColors.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '0.5rem' : '2rem'
            }}
          >
            <Link to="/" style={{ textDecoration: 'none' }}>
              <motion.h1
                style={{
                  color: currentColors.primary,
                  fontSize: isMobile ? '1rem' : 'clamp(1.1rem, 4vw, 1.5rem)',
                  fontWeight: 'bold',
                  margin: 0
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                 {isMobile ? 'Generate RN' : 'Generate Release Note'}
              </motion.h1>
            </Link>
            
            <motion.div style={{ display: 'flex', gap: isMobile ? '0.3rem' : '1rem' }}>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <motion.button
                  style={{
                    background: 'transparent',
                    color: currentColors.text,
                    border: `1px solid ${currentColors.border}`,
                    borderRadius: '0.5rem',
                    padding: isMobile ? '0.3rem 0.6rem' : '0.5rem 1rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: isMobile ? '0.9rem' : undefined
                  }}
                  whileHover={{ scale: 1.02, backgroundColor: currentColors.background }}
                  whileTap={{ scale: 0.98 }}
                >
                  Home
                </motion.button>
              </Link>
              
              <Link to="/docs" style={{ textDecoration: 'none' }}>
                <motion.button
                  style={{
                    background: 'transparent',
                    color: currentColors.text,
                    border: `1px solid ${currentColors.border}`,
                    borderRadius: '0.5rem',
                    padding: isMobile ? '0.3rem 0.6rem' : '0.5rem 1rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: isMobile ? '0.9rem' : undefined
                  }}
                  whileHover={{ scale: 1.02, backgroundColor: currentColors.background }}
                  whileTap={{ scale: 0.98 }}
                >
                  Documentation
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              background: currentColors.gradient,
              border: 'none',
              borderRadius: '50%',
              width: isMobile ? '32px' : '40px',
              height: isMobile ? '32px' : '40px',
              cursor: 'pointer',
              boxShadow: currentColors.shadow,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '1rem' : '16px'
            }}
          >
            {isDark ? '☀️' : '🌙'}
          </motion.button>
        </motion.nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<FormComponent />} />
          <Route path="/docs" element={<Documentation />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
