import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const MailModal = ({ isOpen, onClose, crNumber, crTitle }) => {
  const { isDark, colors } = useTheme();
  const currentColors = isDark ? colors.dark : colors.light;
  
  const [subject, setSubject] = useState('');
  const [mailBody, setMailBody] = useState('');

  // Update content when modal opens or CR number changes
  const updateContent = () => {
    const newSubject = `Release Note for the ${crNumber || 'CR'}`;
    const newBody = `Hello Customer Portal,\n\nPlease process the Release Note for the ${crNumber || 'CR'}.\n\nPFA.`;
    setSubject(newSubject);
    setMailBody(newBody);
  };

  // Update content when modal opens or CR number changes
  useEffect(() => {
    if (isOpen) {
      updateContent();
    }
  }, [isOpen, crNumber]);

  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      // Show temporary success message
      const button = document.getElementById(`copy-${type}`);
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      button.style.backgroundColor = '#10b981';
      setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = currentColors.primary;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy to clipboard');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95, y: 40 }}
          transition={{ duration: 0.28, ease: 'easeInOut' }}
          onClick={onClose}
        >
          <motion.div
            style={{
              backgroundColor: currentColors.surface,
              borderRadius: '1rem',
              padding: '2rem',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: `1px solid ${currentColors.border}`
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ 
                color: currentColors.text, 
                margin: 0, 
                fontSize: '1.5rem',
                fontWeight: '600'
              }}>
                📧 Mail Template
              </h2>
              <motion.button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: currentColors.textSecondary,
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                whileHover={{ scale: 1.1, backgroundColor: currentColors.background }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </motion.button>
            </div>

            {/* Subject Section */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ 
                  color: currentColors.text, 
                  fontWeight: '600',
                  fontSize: '1rem'
                }}>
                  Subject:
                </label>
                <motion.button
                  id="copy-subject"
                  onClick={() => handleCopy(subject, 'subject')}
                  style={{
                    background: currentColors.primary,
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📋 Copy
                </motion.button>
              </div>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: `1px solid ${currentColors.inputBorder}`,
                  backgroundColor: currentColors.inputBg,
                  color: currentColors.text,
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter mail subject..."
              />
            </div>

            {/* Mail Body Section */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ 
                  color: currentColors.text, 
                  fontWeight: '600',
                  fontSize: '1rem'
                }}>
                  Mail Body:
                </label>
                <motion.button
                  id="copy-body"
                  onClick={() => handleCopy(mailBody, 'body')}
                  style={{
                    background: currentColors.primary,
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📋 Copy
                </motion.button>
              </div>
              <textarea
                value={mailBody}
                onChange={(e) => setMailBody(e.target.value)}
                rows={8}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: `1px solid ${currentColors.inputBorder}`,
                  backgroundColor: currentColors.inputBg,
                  color: currentColors.text,
                  fontSize: '1rem',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter mail body..."
              />
            </div>

            {/* Note */}
            <motion.div
              style={{
                backgroundColor: currentColors.background,
                border: `1px solid ${currentColors.border}`,
                borderRadius: '0.5rem',
                padding: '0.75rem',
                marginTop: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.8 }}
            >
              <span style={{ fontSize: '1.2rem' }}>💡</span>
              <span style={{ 
                color: currentColors.textSecondary, 
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                <strong style={{ color: currentColors.text }}>Note:</strong> Please enter the CR Number in the form above before copying the mail content.
              </span>
            </motion.div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MailModal; 