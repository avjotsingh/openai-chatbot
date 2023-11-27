import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import fs from 'fs';
import { extractTextData, getOpenAIResponse, getOpenAIEmbeddings, storeEmbeddings, setUseEmbeddings } from "./utils.js";

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const app = express();
export default app;

const port = 8000;
app.use(bodyParser.json());
app.use(cors());


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Specify your upload directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.originalname + '-' + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
});

app.post("/chats", async (request, response) => {
  // const { chats } = request.body;
  // console.log(chats);
  // try {
  //   const openaiResponse = await getOpenAIResponse(chats);
  //   response.status(200).json(openaiResponse);
  // } catch (err) {
  //   response.status(500).json({ message: err });
  // }
  const { prompt } = request.body;
  console.log(prompt);
  try {
    const openaiResponse = await getOpenAIResponse(prompt);
    response.status(200).json({
      message: openaiResponse
    });
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: err });
  }
});

app.post('/upload', upload.array('pdf'), async (request, response) => {

  let superText = []
  
  try {
    for (let i = 0; i < request.files.length; i++) {
      const originalName = request.files[i].originalname;
      const filename = request.files[i].path;
      
      const text = await extractTextData(filename);
      superText = superText.concat(text);   
    }

    console.log(`Length of superText: ${superText.length}`);
    const embeddings = await getOpenAIEmbeddings(superText);
    console.log(`embeddings: ${embeddings.length}`)
    await storeEmbeddings(superText, embeddings);
    setUseEmbeddings(true);

    response.status(200).json({
      filenames: request.files.map(f => f.originalname)
    });

  } catch (err) {
    console.error(err);
    response.status(500).json({
      message: "Internal Server Error"
    });
  }
});