import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import sbiLogo from "../images/sbig-logo.png"; // Direct PNG import

export const exportReleaseNoteExcel = async (params) => {
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
    font: { bold: true, size: 14, color: { argb: "FF000000" } }, // Black text
    alignment: { vertical: "middle", horizontal: "center" },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } }, // White background
    border: {
      top: { style: "none" }, // No border
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

  const yellowWarningStyle = {
    font: { bold: true, size: 11 },
    alignment: { horizontal: "left", vertical: "middle", indent: 1 },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFF00" } },
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

  // ... rest of the code remains the same ...
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
      `${supervisorName || "Amlan"} ${supervisorPhone || supervisorEmail || "9830940648"}`,
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
      "react build",
      "react build",
      "rollback.txt",
      ""
    ],
    50
  );

  addSection("Please select object status");
  currentRow++;

  ws.mergeCells(`A${currentRow}:J${currentRow}`);
  ws.getCell(`A${currentRow}`).value = "IF DR objects NOT delivered, please provide Reason :-";
  ws.getCell(`A${currentRow}`).style = yellowWarningStyle;
  ws.getRow(currentRow).height = 25;
  currentRow++;

  addTable(
    [
      "Request ID",
      "Total No of Files",
      "Object Details",
      "Application File Path",
      "Changed Files with path",
      "Developer Instructions & Server (APP/Batch/Print)",
      "Backup & Rollback Details"
    ],
    ["", "", "", "", "", "", ""],
    35
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
  const blob = new Blob([buffer], { 
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
  });

  const fileName = `Release-Note-${crNumber}-${new Date().toISOString().split('T')[0]}.xlsx`;
  saveAs(blob, fileName);
};