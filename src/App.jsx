import { useFormik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { exportReleaseNoteExcel } from "./utils/exportReleaseNoteExcel";
import sbiLogo from "./images/sbig-logo.svg";
import "./App.css";

const App = () => {
  const formik = useFormik({
    initialValues: {
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
    },
    validationSchema: Yup.object({
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
    }),
    onSubmit: (values) => {
      console.log(values);
      exportReleaseNoteExcel(values, sbiLogo);
    },
  });

  const renderInput = (name, label, type = "text") => {
    const isSupervisorField = name.startsWith("supervisor");

    return (
      <div className="form-group mb-4">
        <label
          htmlFor={name}
          className="block font-semibold mb-1 text-gray-700"
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
        />
        {formik.touched[name] && formik.errors[name] && (
          <p className="error-text">{formik.errors[name]}</p>
        )}
      </div>
    );
  };

  const renderDatePicker = (name, label) => (
    <div className="form-group mb-4">
      <label htmlFor={name} className="block font-semibold mb-1 text-gray-700">
        {label}
      </label>
      <DatePicker
        id={name}
        selected={formik.values[name]}
        onChange={(val) => formik.setFieldValue(name, val)}
        onBlur={formik.handleBlur}
        className="input-field"
        dateFormat="dd/MM/yyyy"
      />
      {formik.touched[name] && formik.errors[name] && (
        <p className="error-text">{formik.errors[name]}</p>
      )}
    </div>
  );

  // Format dates for preview display
  const formatDate = (date) => {
    if (!date) return "";
    try {
      return new Date(date).toLocaleDateString("en-GB");
    } catch {
      return "";
    }
  };

  return (
    <div className="app-container">
      <form onSubmit={formik.handleSubmit} className="form-section">
        <h2 className="form-title">Release Note Details</h2>

        {/* Developer Section */}
        <h3 className="section-title">Developer Info:</h3>
        {renderInput("developerName", "Developer Name")}
        {renderInput("developerEmail", "Developer Email", "email")}
        {renderInput("developerPhone", "Developer Phone")}

        {/* CR Title */}
        <h3 className="section-title">CR Details:</h3>
        {renderInput("crNumber", "CR Number")}
        {renderInput("crTitle", "CR Title")}

        {/* Dates */}
        <div className="date-grid">
          {renderDatePicker("releaseDate", "Release Date")}
          {renderDatePicker("sitPassDate", "SIT Pass Date")}
        </div>

        {/* Supervisor Section */}
        <h3 className="section-title">Supervisor Info:</h3>
        {renderInput("supervisorName", "Supervisor Name")}
        {renderInput("supervisorEmail", "Supervisor Email", "email")}
        {renderInput("supervisorPhone", "Supervisor Phone")}

        <button type="submit" className="submit-btn">
          Download Release Note XLSX
        </button>
      </form>

      <div className="preview-section">
        <h2 className="preview-title">Preview Filled Details</h2>
        <div className="preview-group">
          <h3 className="preview-subtitle">Developer Info</h3>
          <p>
            <strong>Name:</strong> {formik.values.developerName || "-"}
          </p>
          <p>
            <strong>Email:</strong> {formik.values.developerEmail || "-"}
          </p>
          <p>
            <strong>Phone:</strong> {formik.values.developerPhone || "-"}
          </p>
        </div>

        <div className="preview-group">
          <h3 className="preview-subtitle">CR Details:</h3>
          <p>
            <strong>CR Number:</strong> {formik.values.crNumber || "-"}
          </p>
          <p>
            <strong>CR Title:</strong> {formik.values.crTitle || "-"}
          </p>
        </div>

        <div className="preview-group">
          <h3 className="preview-subtitle">Dates</h3>
          <p>
            <strong>Release Date:</strong>{" "}
            {formatDate(formik.values.releaseDate) || "-"}
          </p>
          <p>
            <strong>SIT Pass Date:</strong>{" "}
            {formatDate(formik.values.sitPassDate) || "-"}
          </p>
        </div>

        <div className="preview-group">
          <h3 className="preview-subtitle">Supervisor Info:</h3>
          <p>
            <strong>Name:</strong> {formik.values.supervisorName || "-"}
          </p>
          <p>
            <strong>Email:</strong> {formik.values.supervisorEmail || "-"}
          </p>
          <p>
            <strong>Phone:</strong> {formik.values.supervisorPhone || "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
