const fs = require('fs');
const https = require('https');

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
        } else {
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

function fetchWordsList() {
  return new Promise((resolve, reject) => {
    const url = 'https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-no-swears.txt';
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data.split('\n').filter(Boolean)));
    }).on('error', reject);
  });
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function main() {
  console.log("Downloading top English words list...");
  const words = await fetchWordsList();
  
  // Skip letters/particles that often don't resolve well
  const validWords = words.filter(w => w.length > 1);
  const top1200 = validWords.slice(0, 1500); 
  
  console.log(`Starting dictionary fetch for up to 1200 words... This will take a few minutes.`);

  let sql = 'INSERT INTO public.words (word, meaning, phonetic, examples)\nVALUES\n';
  let successfulWords = 0;

  for (let i = 0; i < top1200.length; i++) {
    if (successfulWords >= 1200) break;
    
    const word = top1200[i];
    
    const dictData = await fetchJson(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    await delay(250); // 250ms to avoid rate limit HTTP 429

    if (dictData && Array.isArray(dictData) && dictData.length > 0) {
      const entry = dictData[0];
      const meanings = entry.meanings || [];
      const firstMeaning = meanings[0];
      const firstDef = firstMeaning?.definitions?.[0];
      
      let meaningText = firstDef?.definition || '';
      let examplesText = [];
      if (firstDef?.example) {
        examplesText.push(firstDef.example);
      }
      
      let phonetic = entry.phonetic || entry.phonetics?.find(p => p.text)?.text || `/${word}/`;
      
      if (meaningText) {
        const cleanWord = word.replace(/'/g, "''");
        const cleanMeaning = meaningText.replace(/'/g, "''");
        const cleanPhonetic = phonetic.replace(/'/g, "''");
        const cleanExamples = JSON.stringify(examplesText).replace(/'/g, "''");

        sql += `('${cleanWord}', '${cleanMeaning}', '${cleanPhonetic}', '${cleanExamples}'::jsonb),\n`;
        successfulWords++;
        
        if (successfulWords % 50 === 0) {
          console.log(`... Fetched ${successfulWords}/1200 words`);
        }
      }
    }
  }

  sql = sql.trim();
  if (sql.endsWith(',')) sql = sql.slice(0, -1) + ' ON CONFLICT (word) DO NOTHING;';

  fs.writeFileSync('supabase/1200_words.sql', sql);
  console.log(`\nDONE! Saved ${successfulWords} actual definitions to supabase/1200_words.sql`);
}

main().catch(console.error);
