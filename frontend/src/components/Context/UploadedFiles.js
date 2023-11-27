import { useContext } from "react";
import classes from "./UploadedFiles.module.css";
import ChatContext from "../../store/chat-context";

const UploadedFiles = (props) => {
  const chatCtx = useContext(ChatContext);
  const filenames = chatCtx.uploadedFiles;
  console.log(filenames);
  return <div className={classes['file-list']}>
    {filenames && filenames.length > 0 && <p>The following PDFs have been uploaded for the context</p>}
    <ol>
      {
        filenames && filenames.length > 0 &&
        filenames.map(f => (
          <li key={f}>{f}</li>
        ))
      }
    </ol>
  </div>
}

export default UploadedFiles;