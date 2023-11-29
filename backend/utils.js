import fs from 'fs';
import pdfParse from 'pdf-parse';
import { OpenAI } from "openai"
import csv from 'csv-parser';

const openai = new OpenAI();
let USE_EMBEDDINGS = false;
const EMBEDDINGS_FILENAME = 'embeddings.csv';

export function setUseEmbeddings(val) {
  USE_EMBEDDINGS = val;
}

export async function getOpenAIResponse(prompt) {
  try {
    let completion
    if (!USE_EMBEDDINGS) {
      completion = await openai.completions.create({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 64
      });

      // const completion = await openai.chat.completions.create({
      //   model: '',
      //   messages: chats
      // });
    } else {
      const { texts, embeddings } = await readEmbeddings();
      // const prompt = chats[chats.length - 1].content;
      const info = await getMostSimilarText(prompt, texts, embeddings);
      console.log(`Context: ${info}`)
      const newPrompt = `You are given this info - ${info}. Answer this question - ${prompt} `
      completion = await openai.completions.create({
        model: 'text-davinci-003',
        prompt: newPrompt,
        max_tokens: 64
      });
      // chats[chats.length - 1].content = newPrompt;
      // const completion = await openai.chat.completions.create({
      //   model: 'gpt-3.5-turbo',
      //   messages: chats
      // });
    }
  
    const response = completion.choices[0].text;
    return response;
  } catch (err) {
    console.error(err);
    return {}
  } 
}

export async function extractTextData(pathStr) {
  const buffer = await new Promise((resolve, reject) => {
    fs.readFile(pathStr, (err, data) => {
      if (err) reject(err);
      resolve(data);
    })
  });
  
  const data = await pdfParse(buffer);
  const text = data.text;
  const textArray = text.split("\n");
  return textArray.map(t => t.trim()).filter(t => t !== '');
}

export async function getOpenAIEmbeddings(textArray) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: textArray
  })

  return response.data.map(x => x.embedding);
}

async function getPromptEmbedding(prompt) {
  const response = await getOpenAIEmbeddings([prompt]);
  return response[0];
}

export async function storeEmbeddings(textArray, embeddingsArray) {
  let dataToWrite = []
  console.log(`Embedding array dimesnsions: ${embeddingsArray.length}, ${embeddingsArray[0].length}`)
  for (let i = 0; i < textArray.length; i++) {
    const text = textArray[i].replace(/,/g, '');
    dataToWrite.push([text, embeddingsArray[i]])
  }

  const csvContent = dataToWrite.map(x => x.join(",")).join("\n");
  await fs.writeFile(EMBEDDINGS_FILENAME, csvContent, 'utf-8', () => {
    console.log('embeddings saved')
  })
}

async function readEmbeddings() {
  const texts = [];
  const embeddings = [];
  const filename = EMBEDDINGS_FILENAME;

  return new Promise((resolve, reject) => {
    fs.createReadStream(filename)
    .pipe(csv({ headers: false }))
    .on('data', row => {
      const values = Object.values(row);
      const [text, ...embedding] = values;
      texts.push(text);
      embeddings.push(embedding);
    })
    .on('end', () => {
      console.log(`${filename} read successfully`)
      resolve({
        texts,
        embeddings
      })
    })
    .on('error', err => reject(err))
  });
}

function cosineSimilarity(embeddingA, embeddingB) {
  
  const dotProduct = embeddingA.reduce((acc, val, index) => acc + val * embeddingB[index], 0);

  const modA = Math.sqrt(embeddingA.reduce((acc, val) => acc + val ** 2, 0));
  const modB = Math.sqrt(embeddingB.reduce((acc, val) => acc + val ** 2, 0));

  const similarity = dotProduct / (modA * modB);
  return similarity;
}

async function getMostSimilarText(prompt, textArray, embeddingsArray) {
  const promptEmbedding = await getPromptEmbedding(prompt);
  let idx = -1;
  let maxCosineSimilarity = -Infinity;

  for (let i = 0; i < textArray.length; i++) {
    const similarity = cosineSimilarity(promptEmbedding, embeddingsArray[i]);
    if (idx === -1) {
      maxCosineSimilarity = similarity;
      idx = i;
    } else if (similarity > maxCosineSimilarity) {
      idx = i;
      maxCosineSimilarity = similarity;
    }
  }

  console.log(`Prompt: ${prompt}, Closest text: ${textArray[idx]}`)
  return textArray[idx];
}
