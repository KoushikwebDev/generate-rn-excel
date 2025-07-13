import JSZip from "jszip";
import { saveAs } from "file-saver";
import sbiLogo from "../images/sbig-logo.png"; // Direct PNG import

// Import static files - we'll fetch them dynamically
const STATIC_FILES = {
  buildZip: "/static-files/Objects/build.zip",
  rollbackTxt: "/static-files/Rollback_Plan/Rollback.txt"
};

export const exportReleaseNoteZip = async (params) => {
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
    applicationName = "website portal",
    userTestFile // <-- added
  } = params;

  const zip = new JSZip();

  // Create folder structure
  const crFolder = zip.folder(crNumber);
  const releaseNoteFolder = crFolder.folder("ReleaseNote");
  const objectsFolder = crFolder.folder("Objects");
  const rollbackPlanFolder = crFolder.folder("RollBack_Plan");

  try {
    // 1. Generate and add Release Note Excel
    const releaseNoteBuffer = await generateReleaseNoteBuffer(params);
    releaseNoteFolder.file(
      `Release-Note-${crNumber}-${new Date().toISOString().split('T')[0]}.xlsx`,
      releaseNoteBuffer
    );

    // 2. Add Test Cases file
    if (userTestFile) {
      // If user uploaded a test file, include it in the ZIP (do not include demo)
      // Read the file as ArrayBuffer
      const fileBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(userTestFile);
      });
      crFolder.file(userTestFile.name, fileBuffer);
    } else {
      // Otherwise, generate and include the demo test case file
      const testCasesBuffer = await generateTestCasesBuffer(params);
      crFolder.file(
        `Test_Cases-${crNumber}-${new Date().toISOString().split('T')[0]}.xlsx`,
        testCasesBuffer
      );
    }

    // 3. Add static build.zip to Objects folder
    try {
      const buildZipResponse = await fetch(STATIC_FILES.buildZip);
      if (buildZipResponse.ok) {
        const buildZipBlob = await buildZipResponse.blob();
        objectsFolder.file("build.zip", buildZipBlob);
      } else {
        console.warn("Could not load build.zip, creating empty file");
        objectsFolder.file("build.zip", "");
      }
    } catch (error) {
      console.warn("Error loading build.zip:", error);
      objectsFolder.file("build.zip", "");
    }

    // 4. Add static Rollback.txt to RollBack_Plan folder
    try {
      const rollbackResponse = await fetch(STATIC_FILES.rollbackTxt);
      if (rollbackResponse.ok) {
        const rollbackText = await rollbackResponse.text();
        rollbackPlanFolder.file("Rollback.txt", rollbackText);
      } else {
        console.warn("Could not load Rollback.txt, using default content");
        rollbackPlanFolder.file("Rollback.txt", "we are keeping backup of old file on server with date. So if anything wrong then we just replace new file with old one.");
      }
    } catch (error) {
      console.warn("Error loading Rollback.txt:", error);
      rollbackPlanFolder.file("Rollback.txt", "we are keeping backup of old file on server with date. So if anything wrong then we just replace new file with old one.");
    }

    // Generate and download the zip file
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const fileName = `${crNumber}.zip`;
    saveAs(zipBlob, fileName);

  } catch (error) {
    console.error("Error generating zip file:", error);
    throw error;
  }
};

// Helper function to generate release note buffer
const generateReleaseNoteBuffer = async (params) => {
  const wb = new (await import("exceljs")).Workbook();
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
      params.releaseDate || "6/6/2025",
      params.applicationName,
      "Production",
      params.developerEmail,
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
      params.crNumber,
      params.crTitle || `${params.crNumber} Add Multiple Nominee and their Bank Details`,
      "",
      "Passed",
      params.sitPassDate || params.releaseDate || "6/6/2025",
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
      params.crNumber,
      params.crTitle,
      params.crTitle,
      params.applicationName,
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
      params.crNumber,
      params.crTitle,
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
      params.developerName || "Koushik Saha",
      params.developerPhone || "8637538774",
      `${params.supervisorName || "Amlan"} ${params.supervisorPhone || params.supervisorEmail || "9830940648"}`,
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
      params.crNumber,
      "1",
      "react build",
      "react build",
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

  return await wb.xlsx.writeBuffer();
};

// Helper function to generate test cases buffer
const generateTestCasesBuffer = async (params) => {
  const wb = new (await import("exceljs")).Workbook();
  const ws = wb.addWorksheet("Test Cases");

  // Set column widths
  ws.columns = [
    { width: 15 }, // CRNumber/PMNumber
    { width: 25 }, // CRDetails/PMDetails
    { width: 35 }, // CR Description
    { width: 12 }, // Priority
    { width: 20 }, // Pre-requisite
    { width: 25 }, // Expected Result
    { width: 15 }, // Regression
    { width: 20 }, // Reference
    { width: 15 }, // Test Date
    { width: 15 }, // Test Case Status
    { width: 20 }, // Area
    { width: 12 }, // Type
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
    font: { size: 9 },
    alignment: { vertical: "middle", horizontal: "left", wrapText: true },
    border: {
      top: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } }
    }
  };

  const titleStyle = {
    font: { bold: true, size: 14, color: { argb: "FF000000" } },
    alignment: { vertical: "middle", horizontal: "center" },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } }
  };

  // Add title and project info
  ws.mergeCells('A1:L1');
  ws.getCell('A1').value = `${params.crNumber} - Test Cases`;
  ws.getCell('A1').style = titleStyle;
  ws.getRow(1).height = 30;

  ws.mergeCells('A2:L2');
  ws.getCell('A2').value = `${params.crNumber} | ${params.crTitle}`;
  ws.getCell('A2').style = {
    font: { bold: true, size: 11, color: { argb: "FF000000" } },
    alignment: { vertical: "middle", horizontal: "center" },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F0F0" } }
  };
  ws.getRow(2).height = 25;

  // Add headers
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

  headers.forEach((header, index) => {
    ws.getCell(4, index + 1).value = header;
    ws.getCell(4, index + 1).style = headerStyle;
  });
  ws.getRow(4).height = 25;

  // Generate single test case row with the specified structure
  const testCase = {
    crNumber: params.crNumber,
    crDetails: params.crTitle,
    crDescription: `Verify ${params.crTitle} functionality in Customer Portal`,
    priority: "",
    prerequisite: "",
    expectedResult: "Pass",
    regression: "",
    reference: "",
    testDate: params.sitPassDate ? new Date(params.sitPassDate).toLocaleDateString() : new Date().toLocaleDateString(),
    testCaseStatus: "Pass",
    area: "Customer Portal",
    type: "Manual"
  };

  // Add single test case row
  const row = 5;
  ws.getCell(row, 1).value = testCase.crNumber;
  ws.getCell(row, 2).value = testCase.crDetails;
  ws.getCell(row, 3).value = testCase.crDescription;
  ws.getCell(row, 4).value = testCase.priority;
  ws.getCell(row, 5).value = testCase.prerequisite;
  ws.getCell(row, 6).value = testCase.expectedResult;
  ws.getCell(row, 7).value = testCase.regression;
  ws.getCell(row, 8).value = testCase.reference;
  ws.getCell(row, 9).value = testCase.testDate;
  ws.getCell(row, 10).value = testCase.testCaseStatus;
  ws.getCell(row, 11).value = testCase.area;
  ws.getCell(row, 12).value = testCase.type;

  // Apply styles to all cells in the row
  for (let col = 1; col <= 12; col++) {
    ws.getCell(row, col).style = dataStyle;
  }
  ws.getRow(row).height = 30;

  return await wb.xlsx.writeBuffer();
}; 