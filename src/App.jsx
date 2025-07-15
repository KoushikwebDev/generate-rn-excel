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
import MailModal from "./components/MailModal";

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
  downloadZip: true, // changed from false to true
  testFileMode: 'demo', // 'demo' or 'user'
  userTestFile: null,
  rnType: 'frontend', // 'frontend' or 'backend'
  filePaths: [''], // for backend, at least one
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
  testFileMode: Yup.string().oneOf(['demo', 'user']).when('downloadZip', {
    is: true,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.nullable()
  }),
  userTestFile: Yup.mixed().when(['downloadZip', 'testFileMode'], {
    is: (downloadZip, testFileMode) => downloadZip && testFileMode === 'user',
    then: (schema) => schema.required('Please upload a test file (.csv or .xls)').test('fileType', 'Only .csv or .xls files are accepted', (value) => {
      if (!value) return false;
      const allowed = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      return allowed.includes(value.type) || value.name.endsWith('.csv') || value.name.endsWith('.xls') || value.name.endsWith('.xlsx');
    }),
    otherwise: (schema) => schema.nullable()
  }),
  rnType: Yup.string().oneOf(['frontend', 'backend']).required(),
  filePaths: Yup.array().when('rnType', {
    is: 'backend',
    then: (schema) => schema
      .of(Yup.string().trim().required('Please enter file path'))
      .min(1, 'Please enter file path')
      .test('unique', 'Path should be unique', function (value) {
        if (!Array.isArray(value)) return true;
        const seen = new Map();
        let hasDuplicate = false;
        value.forEach((v, idx) => {
          const norm = (v || '').trim().toLowerCase();
          if (seen.has(norm)) {
            hasDuplicate = true;
          } else {
            seen.set(norm, idx);
          }
        });
        return !hasDuplicate;
      }),
    otherwise: (schema) => schema.notRequired(),
  }),
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
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);
  const [filePaths, setFilePaths] = useState(initialValues.filePaths);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        // Check if user selected 'user' mode but didn't upload a file (only when downloadZip is true)
        if (values.downloadZip && values.testFileMode === 'user' && !values.userTestFile) {
          formik.setFieldTouched('userTestFile', true, true);
          alert("Please upload a test file when selecting 'I have Test File' mode.");
          return;
        }
        
        if (values.downloadZip) {
          await exportReleaseNoteZip({ ...values, userTestFile: values.testFileMode === 'user' ? values.userTestFile : null });
        } else {
      exportReleaseNoteExcel(values, sbiLogo);
        }
      handleSaveDetails(values.saveDetails);
        // Reset only CR Number and CR Title
        formik.setFieldValue('crNumber', '');
        formik.setFieldValue('crTitle', '');
        if (values.downloadZip && values.testFileMode === 'user') {
          formik.setFieldValue('userTestFile', null);
        }
      } catch (error) {
        console.error("Error during export:", error);
        alert("Error generating file. Please try again.");
      }
    },
  });

  // save details
  function handleSaveDetails(isSaveDetails) {
    const detailsToSave = { rnType: formik.values.rnType };
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
      const newValues = { ...initialValues, rnType: savedFormDetails.rnType || 'frontend' };
      if (savedFormDetails.rnType === 'backend') {
        newValues.filePaths = [''];
      }
      formik.setValues(newValues);
    }
  }, []);

  // Sync filePaths state with formik
  useEffect(() => {
    setFilePaths(formik.values.filePaths);
  }, [formik.values.filePaths]);

  const handleAddFilePath = () => {
    const updated = [...formik.values.filePaths, ''];
    formik.setFieldValue('filePaths', updated);
  };

  const handleRemoveFilePath = (idx) => {
    if (formik.values.filePaths.length <= 1) return; // Prevent removing last
    const updated = formik.values.filePaths.filter((_, i) => i !== idx);
    formik.setFieldValue('filePaths', updated);
  };

  const handleFilePathChange = (idx, value) => {
    const updated = [...formik.values.filePaths];
    updated[idx] = value;
    formik.setFieldValue('filePaths', updated);
  };

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
    // If user selected their own test file but didn't upload, show error (only when downloadZip is true)
    if (type === 'testCases' && formik.values.downloadZip && formik.values.testFileMode === 'user' && !formik.values.userTestFile) {
      formik.setFieldTouched('userTestFile', true, true);
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
        formik.setValues(prevValues => ({
          ...prevValues,
          ...updatedData
        }));
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
        <motion.div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: isMobile ? '0.5rem' : '1.5rem' }}>
          <motion.h2 
            className="form-title"
            style={{ color: currentColors.primary, margin: 0, padding: 0, lineHeight: 1.2 }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {isMobile ? 'RN Details' : 'Release Note Details'}
          </motion.h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.5rem' : '1rem', marginTop: isMobile ? 0 : '0.2rem' }}>
            <span style={{ fontWeight: 500, color: currentColors.text, opacity: formik.values.rnType === 'frontend' ? 1 : 0.6 }}>Frontend</span>
            <div 
              onClick={() => formik.setFieldValue('rnType', formik.values.rnType === 'frontend' ? 'backend' : 'frontend')}
              style={{
                position: 'relative',
                width: isMobile ? '2.2rem' : '3rem',
                height: isMobile ? '1.1rem' : '1.5rem',
                backgroundColor: formik.values.rnType === 'backend' ? currentColors.primary : currentColors.inputBorder,
                borderRadius: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                padding: '0.125rem'
              }}
            >
              <motion.div
                style={{
                  width: isMobile ? '0.9rem' : '1.25rem',
                  height: isMobile ? '0.9rem' : '1.25rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '50%',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
                animate={{
                  x: formik.values.rnType === 'backend' ? (isMobile ? '1.1rem' : '1.5rem') : '0rem'
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              />
            </div>
            <span style={{ fontWeight: 500, color: currentColors.text, opacity: formik.values.rnType === 'backend' ? 1 : 0.6 }}>Backend</span>
          </div>
        </motion.div>

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

        {/* File Paths for Backend - Only show when Backend is selected */}
        {formik.values.rnType === 'backend' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: '1.5rem' }}
          >
            <label style={{ fontWeight: 600, color: currentColors.text, marginBottom: '0.5rem', display: 'block' }}>File Path(s)</label>
            {(formik.values.filePaths || ['']).map((path, idx, arr) => {
              let fieldError = undefined;
              // Required error
              if (formik.touched.filePaths && Array.isArray(formik.errors.filePaths)) {
                fieldError = formik.errors.filePaths[idx];
              }
              // Uniqueness error: show under all but the first occurrence
              if (
                formik.touched.filePaths &&
                typeof formik.errors.filePaths === 'string' &&
                formik.errors.filePaths === 'Path should be unique'
              ) {
                const norm = (path || '').trim().toLowerCase();
                const firstIdx = arr.findIndex(p => (p || '').trim().toLowerCase() === norm);
                if (firstIdx !== idx) {
                  fieldError = 'Path should be unique';
                }
              }
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={path}
                      onChange={e => handleFilePathChange(idx, e.target.value)}
                      onBlur={formik.handleBlur}
                      className="input-field"
                      placeholder="File path"
                      style={{ flex: 1, backgroundColor: currentColors.inputBg, border: `1px solid ${currentColors.inputBorder}`, color: currentColors.text, boxShadow: currentColors.shadow }}
                    />
                    {idx === 0 ? (
                      <button type="button" onClick={handleAddFilePath} style={{ background: currentColors.gradient, color: '#fff', border: 'none', borderRadius: '0.4rem', padding: '0.25rem 0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '1rem', lineHeight: 1 }}>+</button>
                    ) : (
                      <button type="button" onClick={() => handleRemoveFilePath(idx)} style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: '0.4rem', padding: '0.25rem 0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '1rem', lineHeight: 1 }}>–</button>
                    )}
                  </div>
                  {/* Show error for this field if present */}
                  {fieldError && (
                    <motion.p style={{ color: currentColors.error, fontSize: '0.9rem', marginTop: '0.1rem', marginBottom: 0 }}>{fieldError}</motion.p>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}

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

        {/* Test File Switch - Only show when Download Zip is checked */}
        {formik.values.downloadZip && (
          <motion.div 
            style={{ 
              margin: '1.5rem 0 1rem 0', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              padding: '1rem',
              borderRadius: '0.75rem',
              backgroundColor: currentColors.inputBg,
              border: `1px solid ${currentColors.inputBorder}`,
              boxShadow: currentColors.shadow
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <span style={{ 
              fontWeight: '500', 
              color: currentColors.text,
              fontSize: '0.9rem',
              opacity: formik.values.testFileMode === 'demo' ? 1 : 0.6
            }}>
              Demo Test Cases File
            </span>
            
            <div 
              onClick={() => formik.setFieldValue('testFileMode', formik.values.testFileMode === 'demo' ? 'user' : 'demo')}
              style={{
                position: 'relative',
                width: '3rem',
                height: '1.5rem',
                backgroundColor: formik.values.testFileMode === 'user' ? currentColors.primary : currentColors.inputBorder,
                borderRadius: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                padding: '0.125rem'
              }}
            >
              <motion.div
                style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '50%',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
                animate={{
                  x: formik.values.testFileMode === 'user' ? '1.5rem' : '0rem'
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              />
            </div>
            
            <span style={{ 
              fontWeight: '500', 
              color: currentColors.text,
              fontSize: '0.9rem',
              opacity: formik.values.testFileMode === 'user' ? 1 : 0.6
            }}>
              I have Test Cases File
            </span>
          </motion.div>
        )}

        {/* User Test File Input - Only show when Download Zip is checked and user mode is selected */}
        {formik.values.downloadZip && formik.values.testFileMode === 'user' && (
          <motion.div 
            style={{ 
              marginBottom: '1rem',
              padding: '1rem',
              borderRadius: '0.75rem',
              backgroundColor: currentColors.inputBg,
              border: `1px solid ${currentColors.inputBorder}`,
              boxShadow: currentColors.shadow
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <label 
              htmlFor="userTestFile" 
              style={{ 
                display: 'block', 
                fontWeight: '500', 
                color: currentColors.text, 
                marginBottom: '0.5rem',
                fontSize: '0.9rem'
              }}
            >
              Upload Test File (.csv, .xls, .xlsx)
            </label>
            <input
              id="userTestFile"
              name="userTestFile"
              type="file"
              accept=".csv,.xls,.xlsx"
              onChange={e => {
                formik.setFieldValue('userTestFile', e.currentTarget.files[0]);
              }}
              style={{ 
                color: currentColors.text,
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: `1px solid ${currentColors.inputBorder}`,
                backgroundColor: currentColors.background,
                fontSize: '0.9rem'
              }}
            />
            {formik.touched.userTestFile && formik.errors.userTestFile && (
              <motion.p 
                style={{ 
                  color: currentColors.error, 
                  fontSize: '0.9rem',
                  marginTop: '0.5rem'
                }}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {formik.errors.userTestFile}
              </motion.p>
            )}
          </motion.div>
        )}

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
            
            {formik.values.downloadZip && formik.values.testFileMode === 'demo' && (
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
            )}
          </motion.div>
        )}

        <motion.button 
          type="submit" 
          className="submit-btn"
          style={{
            background: currentColors.gradient,
            color: '#ffffff',
            boxShadow: currentColors.shadow,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.7rem',
            opacity: formik.isSubmitting ? 0.7 : 1
          }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? (
            <span style={{
              width: '1.2em',
              height: '1.2em',
              border: '2.5px solid #fff',
              borderTop: '2.5px solid #4F9A94',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin 0.8s linear infinite',
            }} />
          ) : (
            formik.values.downloadZip ? "Download Release Package (ZIP)" : "Download Release Note XLSX"
          )}
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
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
        {/* Title and Copy Mail Body button row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
          <motion.h2 
            className="preview-title"
            style={{ color: currentColors.primary, margin: 0 }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Preview Filled Details
          </motion.h2>
          <motion.button
            onClick={() => setIsMailModalOpen(true)}
            style={{
              background: currentColors.gradient,
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.75rem',
              padding: '0.75rem 1.5rem',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: currentColors.shadow
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            📧 Copy Mail Body
          </motion.button>
        </div>

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

          {/* File Paths Preview for Backend (moved here) */}
          {formik.values.rnType === 'backend' && (
            <motion.div 
              className="preview-group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.75 }}
            >
              <h3 className="preview-subtitle" style={{ color: currentColors.text }}>File Paths</h3>
              {formik.values.filePaths && formik.values.filePaths.length > 0 ? (
                <ol style={{ margin: 0, paddingLeft: '1.2rem', color: currentColors.textSecondary }}>
                  {formik.values.filePaths.map((p, i) => (
                    <li key={i} style={{ marginBottom: '0.2rem', wordBreak: 'break-all' }}>{p}</li>
                  ))}
                </ol>
              ) : (
                <p style={{ color: currentColors.textSecondary }}>No file paths provided.</p>
              )}
            </motion.div>
          )}

          {/* Test Case File Name Preview (after file paths) */}
          {formik.values.downloadZip && (
            <motion.div 
              className="preview-group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <h3 className="preview-subtitle" style={{ color: currentColors.text }}>Test Case File Name:</h3>
              <p style={{ color: currentColors.textSecondary }}>
                {formik.values.testFileMode === 'demo'
                  ? `Test_Cases-${formik.values.crNumber || 'CR'}-${new Date().toISOString().split('T')[0]}.xlsx`
                  : (formik.values.userTestFile ? formik.values.userTestFile.name : 'No file uploaded')}
              </p>
            </motion.div>
          )}

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

      {/* Mail Modal */}
      <MailModal 
        isOpen={isMailModalOpen}
        onClose={() => setIsMailModalOpen(false)}
        crNumber={formik.values.crNumber}
        crTitle={formik.values.crTitle}
      />

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
            padding: isMobile ? '0.7rem 0.5rem' : '1.2rem 2rem',
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
              aspectRatio: '1',
              cursor: 'pointer',
              boxShadow: currentColors.shadow,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '1rem' : '16px',
              padding: 0,
              margin: 0
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
