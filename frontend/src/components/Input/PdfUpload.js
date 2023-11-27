import ChatContext from "../../store/chat-context";
import classes from "./PdfUpload.module.css";
import { useState, Fragment, useRef, useContext } from "react";

const PdfUpload = (props) => {

  const chatCtx = useContext(ChatContext);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const inputRef = useRef();

  const changeHandler = (event) => {
    setSelectedFiles(event.target.files);
    setShowUploadOptions(true);
  }

  const cancelHandler = () => {
    setError(null);
    setShowUploadOptions(false);
    setSelectedFiles(null);
  }

  const uploadHandler = async () => {
    if (selectedFiles) {
      const form = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
        form.append('pdf', selectedFiles[i]);
      }

      try {
        const response = await fetch("http://localhost:8000/upload", {
          method: "POST",
          body: form
        });

        const data = await response.json();
        chatCtx.setUploadedFiles(data.filenames);

        setShowUploadOptions(false);
        setSuccess("Upload successful");
        setTimeout(() => setSuccess(null), 2000);

      } catch (err) {
        console.error(err);
        setError("Failed to upload file. Please try again.")
      }
    }
  }

  return <div>
    <div className={classes['file-upload-container']}>
      <label htmlFor="file-upload" className={classes['file-upload']}>Select PDFs to upload</label>
      <input ref={inputRef} id="file-upload" type="file" accept=".pdf" multiple onChange={changeHandler} />
    </div>
    
    
    { showUploadOptions && <div className={classes['upload-control-container']}>
          <button className={`${classes.upload} ${classes['controls']}`} onClick={uploadHandler}>Upload</button>
          <button id="cancel" className={`${classes.cancel} ${classes['controls']}`} onClick={cancelHandler}>Cancel</button>
        </div>
    }
        
    
    { error && <p className={classes['error-msg']}>{error}</p>}
    { success && <p className={classes['success-msg']}>{success}</p>}
    
  </div>
}

export default PdfUpload;