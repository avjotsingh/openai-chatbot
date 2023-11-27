import OpenAI from "openai";
import csv from 'csv-parser';


const openai = new OpenAI();
import fs from 'fs';

const textArray = [
  'I am Avjot Singh',
  'I am a software engineer'
]

async function getOpenAIEmbeddings(textArray) {
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

async function storeEmbeddings(filename, textArray, embeddingsArray) {
  let dataToWrite = []
  for (let i = 0; i < textArray.length; i++) {
    dataToWrite.push([textArray[i], embeddingsArray[i]])
  }

  const csvContent = dataToWrite.map(x => x.join(",")).join("\n");
  await fs.writeFile(filename, csvContent, 'utf-8', () => {
    console.log('embeddings saved')
  })
}

async function readEmbeddings(filename) {
  const texts = [];
  const embeddings = [];

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

  const similarity = dotProduct / (magnitudeA * magnitudeB);
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

  return textArray[i];
}

async function getOpenAIContextualResponse(prompt, info) {

}

// getOpenAIEmbeddigns(textArray).then(res => {
//   storeEmbeddings('embeddings.csv', textArray, res)
// })

readEmbeddings('embeddings.csv').then(res => console.log(res))