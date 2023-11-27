import PdfUpload from "../Input/PdfUpload";
import classes from "./ContextPane.module.css";
import UploadedFiles from "./UploadedFiles";

const ContextPane = (props) => {
  return <div className={classes['context-pane']}>
      <div className={classes['pdf-input']}>
        <PdfUpload />
      </div>
      <div className={classes['uploaded-pdfs']}>
        <UploadedFiles />
      </div>
  </div>
}

export default ContextPane;