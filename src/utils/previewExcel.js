import ExcelJS from "exceljs";
import sbiLogo from "../images/sbig-logo.png";

export const generatePreviewReleaseNote = async (params) => {
  const {
    releaseDate,
    sitPassDate,
    developerName,
    developerEmail,
    developerPhone,
    crNumber,
    crTitle,
    supervisorName,
    supervisorEmail,
    supervisorPhone,
    applicationName = "website portal"
  } = params;

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Release Note");

  // Set column widths
  ws.columns = Array(10).fill({ width: 25 });

  // Styles
  const logoHeaderStyle = {
    font: { bold: true, size: 14, color: { argb: "FF000000" } },
    alignment: { vertical: "middle", horizontal: "center" },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } },
    border: {
      top: { style: "none" },
      left: { style: "none" },
      bottom: { style: "none" },
      right: { style: "none" }
    }
  };

  const tealSectionStyle = {
    font: { bold: true, size: 11, color: { argb: "FFFFFFFF" } },
    alignment: { vertical: "middle", horizontal: "left", indent: 1 },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF4F9A94" } },
    border: {
      top: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } }
    }
  };

  const grayHeaderStyle = {
    font: { bold: true, size: 10 },
    alignment: { vertical: "middle", horizontal: "center", wrapText: true },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFD9D9D9" } },
    border: {
      top: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } }
    }
  };

  const dataStyle = {
    font: { size: 10 },
    alignment: { vertical: "middle", horizontal: "left", wrapText: true },
    border: {
      top: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } }
    }
  };

  let currentRow = 1;

  // Add Logo
  try {
    const response = await fetch(sbiLogo);
    const blob = await response.blob();
    const base64Logo = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(blob);
    });

    const logoImageId = wb.addImage({
      base64: base64Logo,
      extension: 'png'
    });

    // Add logo to columns A-B (left side)
    ws.addImage(logoImageId, {
      tl: { col: 0, row: currentRow - 1 },
      ext: { width: 120, height: 40 }
    });

    // Merge cells for logo area (A1-B1)
    ws.mergeCells(`A${currentRow}:B${currentRow}`);
    
    // Merge cells for title area (C1-J1)
    ws.mergeCells(`C${currentRow}:J${currentRow}`);

    // Apply white background with no borders to all cells in first row
    for (let col = 1; col <= 10; col++) {
      const cell = ws.getCell(currentRow, col);
      cell.style = {
        ...logoHeaderStyle,
        fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } },
        border: {
          top: { style: "none" },
          left: { style: "none" },
          bottom: { style: "none" },
          right: { style: "none" }
        }
      };
    }

    // Set the title in merged cells C1-J1 (center of the sheet)
    ws.getCell(`C${currentRow}`).value = "SBI General - Release Note";
    ws.getCell(`C${currentRow}`).style = {
      ...logoHeaderStyle,
      font: { bold: true, size: 14, color: { argb: "FF000000" } },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } },
      alignment: { vertical: "middle", horizontal: "center" },
      border: {
        top: { style: "none" },
        left: { style: "none" },
        bottom: { style: "none" },
        right: { style: "none" }
      }
    };

    ws.getRow(currentRow).height = 45;
    currentRow++;
  } catch (error) {
    console.error("Error loading logo:", error);
    ws.mergeCells(`A${currentRow}:J${currentRow}`);
    ws.getCell(`A${currentRow}`).value = "SBI General - Release Note";
    ws.getCell(`A${currentRow}`).style = {
      ...logoHeaderStyle,
      font: { bold: true, size: 14, color: { argb: "FF000000" } },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } },
      border: {
        top: { style: "none" },
        left: { style: "none" },
        bottom: { style: "none" },
        right: { style: "none" }
      }
    };
    ws.getRow(currentRow).height = 45;
    currentRow++;
  }

  const addSection = (title) => {
    ws.mergeCells(`A${currentRow}:J${currentRow}`);
    ws.getCell(`A${currentRow}`).value = title;
    ws.getCell(`A${currentRow}`).style = tealSectionStyle;
    ws.getRow(currentRow).height = 25;
    currentRow++;
  };

  const addTable = (headers, data, rowHeight = 25) => {
    // Header row
    headers.forEach((header, i) => {
      ws.getCell(currentRow, i + 1).value = header;
      ws.getCell(currentRow, i + 1).style = grayHeaderStyle;
    });
    // Fill remaining cells in header row
    for (let i = headers.length; i < 10; i++) {
      ws.getCell(currentRow, i + 1).style = grayHeaderStyle;
    }
    ws.getRow(currentRow).height = rowHeight;
    currentRow++;

    // Data row
    for (let i = 0; i < 10; i++) {
      const value = i < data.length ? data[i] : "";
      ws.getCell(currentRow, i + 1).value = value;
      ws.getCell(currentRow, i + 1).style = dataStyle;
    }
    ws.getRow(currentRow).height = 25;
    currentRow++;
  };

  addSection("1.0 Release Details");
  addTable(
    [
      "Release Note Date*",
      "Application/ Track Name*",
      "Environment*",
      "Developer Email Id*",
      "Regular/Sync-up/Regression*",
      "Mumbai SVN Path*"
    ],
    [
      releaseDate || "6/6/2025",
      applicationName,
      "Production",
      developerEmail,
      "Sync-up/Retrofit",
      ""
    ],
    35
  );

  addSection("1.1 SIT Details");
  addTable(
    [
      "Request ID",
      "List of known Issues if any",
      "If yes, Work around if any",
      "SIT status",
      "SIT Pass Date",
      "Reason If SIT not Passed",
      "Customization/ Configuration"
    ],
    [
      crNumber,
      crTitle || `${crNumber} Add Multiple Nominee and their Bank Details`,
      "",
      "Passed",
      sitPassDate || releaseDate || "6/6/2025",
      "",
      ""
    ],
    35
  );

  addSection("1.2 List of Fixed Defects");
  addTable(
    [
      "Request ID*",
      "Issue Description/Requirement Description*",
      "Name of the Product/ Process",
      "Service Impact area",
      "Impact on Other Application/Track(s)",
      "If Yes, List of services/track(s) getting impacted",
      "SVN - Developer Path & SVN Revision no*"
    ],
    [
      crNumber,
      crTitle,
      crTitle,
      applicationName,
      "",
      "",
      ""
    ],
    40
  );

  addSection("1.3 Test Summary Report");
  addTable(
    [
      "Request ID*",
      "Expected Result",
      "Actual Result",
      "Scope of the Delivery",
      "Business Benefits",
      "Testing Scope & Functionality Impacted",
      "Reference Document and Comments if any"
    ],
    [
      crNumber,
      crTitle,
      "",
      "NA",
      "NA",
      "",
      "NA"
    ],
    35
  );

  addSection("1.4 Release Dependencies");
  addTable(
    [
      "Partial Release",
      "Downtime & Service Impact Duration",
      "Interim/Full build",
      "Developer Name",
      "Developer Contact No",
      "Track Lead Name and Contact no",
      "AIX/Window OS Team support Required",
      "DBA Support required"
    ],
    [
      "NA",
      "NA",
      "Interim",
      developerName || "Koushik Saha",
      developerPhone || "8637538774",
      `${supervisorName || "Raju Singh"} ${supervisorPhone || supervisorEmail || "9830306821"}`,
      "NO",
      "No"
    ],
    40
  );

  addSection("1.5 Release Object Details DC PROD/UAT/Pre-Prod");
  addTable(
    [
      "Request ID*",
      "Total No of Files*",
      "Object Details (Sequence is Mandatory for DB scripts/ FMS/IMS/other imports)*",
      "Application File Path/Impacted Tables Names*",
      "Developer Instructions & Server (APP/DB/Batch/Print)*",
      "Backup and Rollback Details*",
      "Dependency Release Note*"
    ],
    [
      crNumber,
      "1",
      "react build",
      // If backend, show numbered file paths, else default to "react build"
      params.rnType === 'backend' && Array.isArray(params.filePaths) && params.filePaths.length > 0
        ? params.filePaths.map((p, i) => `${i + 1}. ${p}`).join('\n')
        : "react build",
      "react build",
      "rollback.txt",
      ""
    ],
    50
  );

  ws.pageSetup = {
    paperSize: 9,
    orientation: 'landscape',
    fitToPage: true,
    margins: {
      left: 0.5, right: 0.5,
      top: 0.75, bottom: 0.75,
      header: 0.3, footer: 0.3
    }
  };

  const buffer = await wb.xlsx.writeBuffer();
  return buffer;
};

export const generatePreviewTestCases = async (params) => {
  try {
    console.log('generatePreviewTestCases called with params:', params);
    const {
      crNumber,
      crTitle,
      sitPassDate
    } = params;

    console.log('Extracted values:', { crNumber, crTitle, sitPassDate });
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Test Cases");

  // Set column widths
  ws.columns = [
    { width: 15 }, // CRNumber/PMNumber
    { width: 30 }, // CRDetails/PMDetails
    { width: 40 }, // Description
    { width: 10 }, // Priority
    { width: 25 }, // Pre-requisite
    { width: 20 }, // Expected Result
    { width: 15 }, // Regression
    { width: 20 }, // Reference
    { width: 15 }, // Test Date
    { width: 15 }, // Test Case Status
    { width: 20 }, // Area
    { width: 15 }  // Type
  ];

  // Styles
  const headerStyle = {
    font: { bold: true, size: 11, color: { argb: "FFFFFFFF" } },
    alignment: { vertical: "middle", horizontal: "center", wrapText: true },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF4F9A94" } },
    border: {
      top: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } }
    }
  };

  const dataStyle = {
    font: { size: 10 },
    alignment: { vertical: "middle", horizontal: "left", wrapText: true },
    border: {
      top: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } }
    }
  };

  // Headers
  const headers = [
    "CRNumber/PMNumber",
    "CRDetails/PMDetails",
    "Description",
    "Priority",
    "Pre-requisite",
    "Expected Result",
    "Regression",
    "Reference",
    "Test Date",
    "Test Case Status",
    "Area",
    "Type"
  ];

  headers.forEach((header, i) => {
    ws.getCell(1, i + 1).value = header;
    ws.getCell(1, i + 1).style = headerStyle;
  });

  // Format date properly
  const formatDate = (date) => {
    if (!date) return "";
    try {
      return new Date(date).toLocaleDateString("en-GB");
    } catch {
      return "";
    }
  };

  // Data row
  const data = [
    crNumber,
    crTitle,
    `Verify ${crTitle} functionality in Customer Portal`,
    "",
    "",
    "Pass",
    "",
    "",
    formatDate(sitPassDate) || formatDate(new Date()),
    "Pass",
    "Customer Portal",
    "Manual"
  ];

  data.forEach((value, i) => {
    ws.getCell(2, i + 1).value = value;
    ws.getCell(2, i + 1).style = dataStyle;
  });

  ws.pageSetup = {
    paperSize: 9,
    orientation: 'landscape',
    fitToPage: true,
    margins: {
      left: 0.5, right: 0.5,
      top: 0.75, bottom: 0.75,
      header: 0.3, footer: 0.3
    }
  };

  const buffer = await wb.xlsx.writeBuffer();
  return buffer;
  } catch (error) {
    console.error("Error generating test cases Excel:", error);
    throw error;
  }
};

export const openExcelPreview = async (params, type) => {
  try {
    // Create a new window with Excel viewer
    const newWindow = window.open('', '_blank', 'width=1400,height=900,scrollbars=yes,resizable=yes');
    
    // Write HTML content to display the Excel file
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${type === 'releaseNote' ? 'Release Note Editor' : 'Test Cases Editor'}</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            text-align: center;
          }
          .button-group {
            text-align: center;
            margin-bottom: 20px;
          }
          .btn {
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(0,0,0,0.15);
          }
          .btn-secondary {
            background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
          }
          .excel-preview {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            margin-bottom: 20px;
          }
          .excel-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          .excel-table th {
            background-color: #4F9A94;
            color: white;
            padding: 12px;
            text-align: center;
            border: 1px solid #ddd;
            font-weight: bold;
          }
          .excel-table td {
            padding: 8px;
            border: 1px solid #ddd;
            text-align: left;
          }
          .excel-table input, .excel-table textarea {
            width: 100%;
            border: none;
            background: transparent;
            font-size: 10px;
            font-family: inherit;
            resize: none;
            outline: none;
          }
          .excel-table input:focus, .excel-table textarea:focus {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
          }
          .excel-table tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .section-header {
            background-color: #4F9A94;
            color: white;
            padding: 10px;
            margin: 15px 0 10px 0;
            border-radius: 5px;
            font-weight: bold;
          }
          .status-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #333;
            color: white;
            padding: 10px;
            text-align: center;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${type === 'releaseNote' ? 'Release Note Editor' : 'Test Cases Editor'}</h1>
          <p>CR Number: ${params.crNumber} | CR Title: ${params.crTitle}</p>
          <p style="font-size: 14px; margin-top: 10px;">Edit the data below and click Save & Download to get the updated Excel file</p>
        </div>
        
        <div class="button-group">
          <button class="btn btn-secondary" onclick="saveChanges()">
            💾 Save Changes
          </button>
          <button class="btn" onclick="downloadOriginal()">
            📥 Download Original
          </button>
        </div>
        
        <div class="excel-preview">
          ${type === 'releaseNote' ? generateEditableReleaseNoteHTML(params) : generateEditableTestCasesHTML(params)}
        </div>
        
        <div class="status-bar">
          <span id="status">Ready to edit. Make changes and click Save & Download.</span>
        </div>
        
        <script>
          let editedData = ${JSON.stringify(params)};
          
          function updateStatus(message) {
            document.getElementById('status').textContent = message;
          }
          
          function collectFormData() {
            const inputs = document.querySelectorAll('input, textarea');
            inputs.forEach(input => {
              const fieldName = input.getAttribute('data-field');
              if (fieldName) {
                editedData[fieldName] = input.value;
              }
            });
            return editedData;
          }
          
          async function saveChanges() {
            try {
              const updatedData = collectFormData();
              
              const confirmMessage = 'Your data will be replaced by these changes for the ${type === 'releaseNote' ? 'Release Note' : 'Test Cases'}. Do you want to continue?';
              
              if (confirm(confirmMessage)) {
                updateStatus('Saving changes...');
                
                // Send updated data to parent window to update form
                window.opener.postMessage({
                  type: 'updateFormData',
                  data: updatedData,
                  excelType: '${type}'
                }, '*');
                
                updateStatus('Changes saved successfully! Closing window...');
                
                // Close the popup window after a short delay
                setTimeout(() => {
                  window.close();
                }, 1500);
              }
            } catch (error) {
              console.error('Error saving:', error);
              updateStatus('Error saving changes. Please try again.');
            }
          }
          
          async function downloadOriginal() {
            try {
              updateStatus('Generating Excel file with current form data...');
              
              // Send current form data to parent window to generate Excel
              window.opener.postMessage({
                type: 'generateExcel',
                data: ${JSON.stringify(params)},
                excelType: '${type}'
              }, '*');
              
              updateStatus('Excel file generated successfully!');
            } catch (error) {
              console.error('Error downloading:', error);
              updateStatus('Error generating file. Please try again.');
            }
          }
          
          // Auto-save functionality
          let autoSaveTimer;
          function setupAutoSave() {
            const inputs = document.querySelectorAll('input, textarea');
            inputs.forEach(input => {
              input.addEventListener('input', () => {
                clearTimeout(autoSaveTimer);
                updateStatus('Changes detected...');
                autoSaveTimer = setTimeout(() => {
                  updateStatus('Changes saved locally.');
                }, 1000);
              });
            });
          }
          
          // Initialize auto-save
          setTimeout(setupAutoSave, 100);
        </script>
      </body>
      </html>
    `);
    
    newWindow.document.close();
    
    // Listen for messages from the popup
    window.addEventListener('message', async (event) => {
      if (event.data.type === 'generateExcel') {
        try {
          console.log('Generating Excel file:', event.data.excelType, event.data.data);
          let buffer;
          let fileName;
          
          if (event.data.excelType === 'releaseNote') {
            buffer = await generatePreviewReleaseNote(event.data.data);
            fileName = `Preview-Release-Note-${event.data.data.crNumber}.xlsx`;
          } else {
            console.log('Generating test cases Excel...');
            buffer = await generatePreviewTestCases(event.data.data);
            fileName = `Preview-Test-Cases-${event.data.data.crNumber}.xlsx`;
          }
          
          const blob = new Blob([buffer], { 
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
          });
          
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 1000);
          
        } catch (error) {
          console.error("Error generating Excel:", error);
          alert("Error generating Excel file. Please try again.");
        }
      } else if (event.data.type === 'updateFormData') {
        try {
          // Send message to parent window to update form data
          window.postMessage({
            type: 'updateFormFromPreview',
            data: event.data.data,
            excelType: event.data.excelType
          }, '*');
        } catch (error) {
          console.error("Error updating form data:", error);
        }
      }
    });

    return newWindow;
  } catch (error) {
    console.error("Error generating preview:", error);
    alert("Error generating preview. Please try again.");
  }
};

// Helper function to generate HTML for Release Note preview
const generateReleaseNoteHTML = (params) => {
  const formatDate = (date) => {
    if (!date) return "";
    try {
      return new Date(date).toLocaleDateString("en-GB");
    } catch {
      return "";
    }
  };

  return `
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="color: #4F9A94;">SBI General - Release Note</h2>
    </div>
    
    <div class="section-header">1.0 Release Details</div>
    <table class="excel-table">
      <thead>
        <tr>
          <th>Release Note Date*</th>
          <th>Application/ Track Name*</th>
          <th>Environment*</th>
          <th>Developer Email Id*</th>
          <th>Regular/Sync-up/Regression*</th>
          <th>Mumbai SVN Path*</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${formatDate(params.releaseDate) || "6/6/2025"}</td>
          <td>${params.applicationName || "website portal"}</td>
          <td>Production</td>
          <td>${params.developerEmail || ""}</td>
          <td>Sync-up/Retrofit</td>
          <td></td>
        </tr>
      </tbody>
    </table>
    
    <div class="section-header">1.1 SIT Details</div>
    <table class="excel-table">
      <thead>
        <tr>
          <th>Request ID</th>
          <th>List of known Issues if any</th>
          <th>If yes, Work around if any</th>
          <th>SIT status</th>
          <th>SIT Pass Date</th>
          <th>Reason If SIT not Passed</th>
          <th>Customization/ Configuration</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${params.crNumber || ""}</td>
          <td>${params.crTitle || `${params.crNumber} Add Multiple Nominee and their Bank Details`}</td>
          <td></td>
          <td>Passed</td>
          <td>${formatDate(params.sitPassDate) || formatDate(params.releaseDate) || "6/6/2025"}</td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
    
    <div class="section-header">1.2 List of Fixed Defects</div>
    <table class="excel-table">
      <thead>
        <tr>
          <th>Request ID*</th>
          <th>Issue Description/Requirement Description*</th>
          <th>Name of the Product/ Process</th>
          <th>Service Impact area</th>
          <th>Impact on Other Application/Track(s)</th>
          <th>If Yes, List of services/track(s) getting impacted</th>
          <th>SVN - Developer Path & SVN Revision no*</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${params.crNumber || ""}</td>
          <td>${params.crTitle || ""}</td>
          <td>${params.crTitle || ""}</td>
          <td>${params.applicationName || "website portal"}</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
    
    <div class="section-header">1.3 Test Summary Report</div>
    <table class="excel-table">
      <thead>
        <tr>
          <th>Request ID*</th>
          <th>Expected Result</th>
          <th>Actual Result</th>
          <th>Scope of the Delivery</th>
          <th>Business Benefits</th>
          <th>Testing Scope & Functionality Impacted</th>
          <th>Reference Document and Comments if any</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${params.crNumber || ""}</td>
          <td>${params.crTitle || ""}</td>
          <td></td>
          <td>NA</td>
          <td>NA</td>
          <td></td>
          <td>NA</td>
        </tr>
      </tbody>
    </table>
    
    <div class="section-header">1.4 Release Dependencies</div>
    <table class="excel-table">
      <thead>
        <tr>
          <th>Partial Release</th>
          <th>Downtime & Service Impact Duration</th>
          <th>Interim/Full build</th>
          <th>Developer Name</th>
          <th>Developer Contact No</th>
          <th>Track Lead Name and Contact no</th>
          <th>AIX/Window OS Team support Required</th>
          <th>DBA Support required</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>NA</td>
          <td>NA</td>
          <td>Interim</td>
          <td>${params.developerName || "Koushik Saha"}</td>
          <td>${params.developerPhone || "8637538774"}</td>
          <td>${params.supervisorName || "Raju Singh"} ${params.supervisorPhone || params.supervisorEmail || "9830306821"}</td>
          <td>NO</td>
          <td>No</td>
        </tr>
      </tbody>
    </table>
    
    <div class="section-header">1.5 Release Object Details DC PROD/UAT/Pre-Prod</div>
    <table class="excel-table">
      <thead>
        <tr>
          <th>Request ID*</th>
          <th>Total No of Files*</th>
          <th>Object Details (Sequence is Mandatory for DB scripts/ FMS/IMS/other imports)*</th>
          <th>Application File Path/Impacted Tables Names*</th>
          <th>Developer Instructions & Server (APP/DB/Batch/Print)*</th>
          <th>Backup and Rollback Details*</th>
          <th>Dependency Release Note*</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${params.crNumber || ""}</td>
          <td>1</td>
          <td>react build</td>
          <td>${params.rnType === 'backend' && Array.isArray(params.filePaths) && params.filePaths.length > 0
            ? params.filePaths.map((p, i) => `${i + 1}. ${p}`).join('<br>')
            : "react build"}</td>
          <td>react build</td>
          <td>rollback.txt</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  `;
};

// Helper function to generate HTML for Test Cases preview
const generateTestCasesHTML = (params) => {
  const formatDate = (date) => {
    if (!date) return "";
    try {
      return new Date(date).toLocaleDateString("en-GB");
    } catch {
      return "";
    }
  };

  return `
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="color: #4F9A94;">${params.crNumber} - Test Cases</h2>
    </div>
    
    <table class="excel-table">
      <thead>
        <tr>
          <th>CRNumber/PMNumber</th>
          <th>CRDetails/PMDetails</th>
          <th>Description</th>
          <th>Priority</th>
          <th>Pre-requisite</th>
          <th>Expected Result</th>
          <th>Regression</th>
          <th>Reference</th>
          <th>Test Date</th>
          <th>Test Case Status</th>
          <th>Area</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${params.crNumber || ""}</td>
          <td>${params.crTitle || ""}</td>
          <td>Verify ${params.crTitle || "functionality"} in Customer Portal</td>
          <td></td>
          <td></td>
          <td>Pass</td>
          <td></td>
          <td></td>
          <td>${formatDate(params.sitPassDate) || new Date().toLocaleDateString("en-GB")}</td>
          <td>Pass</td>
          <td>Customer Portal</td>
          <td>Manual</td>
        </tr>
      </tbody>
    </table>
  `;
};

// Helper function to generate editable HTML for Release Note
const generateEditableReleaseNoteHTML = (params) => {
  const formatDate = (date) => {
    if (!date) return "";
    try {
      return new Date(date).toLocaleDateString("en-GB");
    } catch {
      return "";
    }
  };

  return `
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="color: #4F9A94;">SBI General - Release Note</h2>
    </div>
    
    <div class="section-header">1.0 Release Details</div>
    <table class="excel-table">
      <thead>
        <tr>
          <th>Release Note Date*</th>
          <th>Application/ Track Name*</th>
          <th>Environment*</th>
          <th>Developer Email Id*</th>
          <th>Regular/Sync-up/Regression*</th>
          <th>Mumbai SVN Path*</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><input type="text" value="${formatDate(params.releaseDate) || "6/6/2025"}" data-field="releaseDate" /></td>
          <td><input type="text" value="${params.applicationName || "website portal"}" data-field="applicationName" /></td>
          <td><input type="text" value="Production" readonly /></td>
          <td><input type="text" value="${params.developerEmail || ""}" data-field="developerEmail" /></td>
          <td><input type="text" value="Sync-up/Retrofit" readonly /></td>
          <td><input type="text" value="" data-field="svnPath" /></td>
        </tr>
      </tbody>
    </table>
    
    <div class="section-header">1.1 SIT Details</div>
    <table class="excel-table">
      <thead>
        <tr>
          <th>Request ID</th>
          <th>List of known Issues if any</th>
          <th>If yes, Work around if any</th>
          <th>SIT status</th>
          <th>SIT Pass Date</th>
          <th>Reason If SIT not Passed</th>
          <th>Customization/ Configuration</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><input type="text" value="${params.crNumber || ""}" data-field="crNumber" /></td>
          <td><input type="text" value="${params.crTitle || `${params.crNumber} Add Multiple Nominee and their Bank Details`}" data-field="crTitle" /></td>
          <td><input type="text" value="" data-field="workaround" /></td>
          <td><input type="text" value="Passed" readonly /></td>
          <td><input type="text" value="${formatDate(params.sitPassDate) || formatDate(params.releaseDate) || "6/6/2025"}" data-field="sitPassDate" /></td>
          <td><input type="text" value="" data-field="sitReason" /></td>
          <td><input type="text" value="" data-field="customization" /></td>
        </tr>
      </tbody>
    </table>
    
    <div class="section-header">1.2 List of Fixed Defects</div>
    <table class="excel-table">
      <thead>
        <tr>
          <th>Request ID*</th>
          <th>Issue Description/Requirement Description*</th>
          <th>Name of the Product/ Process</th>
          <th>Service Impact area</th>
          <th>Impact on Other Application/Track(s)</th>
          <th>If Yes, List of services/track(s) getting impacted</th>
          <th>SVN - Developer Path & SVN Revision no*</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><input type="text" value="${params.crNumber || ""}" data-field="crNumber" /></td>
          <td><input type="text" value="${params.crTitle || ""}" data-field="crTitle" /></td>
          <td><input type="text" value="${params.crTitle || ""}" data-field="productName" /></td>
          <td><input type="text" value="${params.applicationName || "website portal"}" data-field="applicationName" /></td>
          <td><input type="text" value="" data-field="impactOther" /></td>
          <td><input type="text" value="" data-field="impactedServices" /></td>
          <td><input type="text" value="" data-field="svnPath" /></td>
        </tr>
      </tbody>
    </table>
    
    <div class="section-header">1.3 Test Summary Report</div>
    <table class="excel-table">
      <thead>
        <tr>
          <th>Request ID*</th>
          <th>Expected Result</th>
          <th>Actual Result</th>
          <th>Scope of the Delivery</th>
          <th>Business Benefits</th>
          <th>Testing Scope & Functionality Impacted</th>
          <th>Reference Document and Comments if any</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><input type="text" value="${params.crNumber || ""}" data-field="crNumber" /></td>
          <td><input type="text" value="${params.crTitle || ""}" data-field="expectedResult" /></td>
          <td><input type="text" value="" data-field="actualResult" /></td>
          <td><input type="text" value="NA" readonly /></td>
          <td><input type="text" value="NA" readonly /></td>
          <td><input type="text" value="" data-field="testingScope" /></td>
          <td><input type="text" value="NA" readonly /></td>
        </tr>
      </tbody>
    </table>
    
    <div class="section-header">1.4 Release Dependencies</div>
    <table class="excel-table">
      <thead>
        <tr>
          <th>Partial Release</th>
          <th>Downtime & Service Impact Duration</th>
          <th>Interim/Full build</th>
          <th>Developer Name</th>
          <th>Developer Contact No</th>
          <th>Track Lead Name and Contact no</th>
          <th>AIX/Window OS Team support Required</th>
          <th>DBA Support required</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><input type="text" value="NA" readonly /></td>
          <td><input type="text" value="NA" readonly /></td>
          <td><input type="text" value="Interim" readonly /></td>
          <td><input type="text" value="${params.developerName || "Koushik Saha"}" data-field="developerName" /></td>
          <td><input type="text" value="${params.developerPhone || "8637538774"}" data-field="developerPhone" /></td>
          <td><input type="text" value="${params.supervisorName || "Raju Singh"} ${params.supervisorPhone || params.supervisorEmail || "9830306821"}" data-field="supervisorContact" /></td>
          <td><input type="text" value="NO" readonly /></td>
          <td><input type="text" value="No" readonly /></td>
        </tr>
      </tbody>
    </table>
    
    <div class="section-header">1.5 Release Object Details DC PROD/UAT/Pre-Prod</div>
    <table class="excel-table">
      <thead>
        <tr>
          <th>Request ID*</th>
          <th>Total No of Files*</th>
          <th>Object Details (Sequence is Mandatory for DB scripts/ FMS/IMS/other imports)*</th>
          <th>Application File Path/Impacted Tables Names*</th>
          <th>Developer Instructions & Server (APP/DB/Batch/Print)*</th>
          <th>Backup and Rollback Details*</th>
          <th>Dependency Release Note*</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><input type="text" value="${params.crNumber || ""}" data-field="crNumber" /></td>
          <td><input type="text" value="1" readonly /></td>
          <td><input type="text" value="react build" readonly /></td>
          <td>
            ${params.rnType === 'backend' && Array.isArray(params.filePaths) && params.filePaths.length > 0
              ? params.filePaths.map((p, i) => `<div style='display:flex;align-items:center;gap:0.5rem;margin-bottom:2px;'><span style='font-weight:bold;'>${i + 1}.</span><input type='text' value='${p}' data-field='filePath${i}' style='width:90%;padding:2px 6px;border-radius:4px;border:1px solid #ccc;font-size:0.95em;'/></div>`).join('')
              : `<input type='text' value='react build' readonly />`
            }
          </td>
          <td><input type="text" value="react build" readonly /></td>
          <td><input type="text" value="rollback.txt" readonly /></td>
          <td><input type="text" value="" data-field="dependencyNote" /></td>
        </tr>
      </tbody>
    </table>
  `;
};

// Helper function to generate editable HTML for Test Cases
const generateEditableTestCasesHTML = (params) => {
  return `
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="color: #000;">${params.crNumber} - Test Cases</h2>
    </div>
    <table class="excel-table">
      <thead>
        <tr>
          <th colspan="17" style="background:#fff;font-size:1.1rem;font-weight:bold;text-align:center;height:30px;">${params.crNumber} - Test Cases</th>
        </tr>
        <tr>
          <th colspan="17" style="background:#f0f0f0;color:#000;font-size:1rem;font-weight:bold;text-align:center;height:25px;">${params.crNumber} | ${params.crTitle}</th>
        </tr>
        <tr>
          <th>Test Scenario</th>
          <th>Scenario Id</th>
          <th>Subject</th>
          <th>Common/product</th>
          <th>Business Rule/Test Cases</th>
          <th>Test Case Id</th>
          <th>Reference</th>
          <th>Regression</th>
          <th>Priority</th>
          <th>Test Case Status</th>
          <th>Pre-requisite</th>
          <th>Test Data</th>
          <th>Expected Result</th>
          <th>TestCaseId_TestCaseStatus</th>
          <th>Designer</th>
          <th>Area</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="2"><input type="text" value="${params.crTitle || ''}" data-field="testScenario" /></td>
          <td colspan="2"><input type="text" value="${params.crTitle || ''}" data-field="scenarioId" /></td>
          <td colspan="2"><input type="text" value="${params.crTitle || ''}" data-field="businessRule" /></td>
          <td><input type="text" value="" data-field="reference" /></td>
          <td><input type="text" value="" data-field="regression" /></td>
          <td><input type="text" value="" data-field="priority" /></td>
          <td><input type="text" value="Pass" data-field="testCaseStatus" readonly /></td>
          <td><input type="text" value="" data-field="preRequisite" /></td>
          <td><input type="text" value="" data-field="testData" /></td>
          <td colspan="2"><input type="text" value="${params.crTitle || ''}" data-field="expectedResult" /></td>
          <td><input type="text" value="" data-field="designer" /></td>
          <td><input type="text" value="Customer Portal" data-field="area" readonly /></td>
          <td><input type="text" value="Manual" data-field="type" readonly /></td>
        </tr>
      </tbody>
    </table>
  `;
}; 