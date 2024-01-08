import React from 'react';
// dev.js

import * as XLSX from 'xlsx';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Translation dictionary for mapping Excel column names to Firestore field names
const translationDict = {
  'חותמת זמן': 'timestamp',
  'שם פרטי': 'firstName',
  'שם משפחה': 'lastName',
  'מספר פלאפון ליצירת קשר': 'phoneNumber',
  'יישוב מגורים': 'settlementName',
  'גיל': 'ageRange',
  'כתובת אימייל': 'emailAddress',
  'איך הגעת אלינו? (ניתן לבחור יותר מתשובה אחת)': 'howDidYouFindUs',
  'האם את/ה גר/ה בעוטף?': 'livingInSurroundings',
};

// Function to read XLSX file and convert it to JSON
const readExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.readAsArrayBuffer(file);

    fileReader.onload = (e) => {
      const bufferArray = e.target.result;
      const wb = XLSX.read(bufferArray, { type: 'buffer' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });

      resolve(jsonData);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

// Function to upload JSON data to Firestore
const uploadDataToFirestore = async (jsonData) => {
  const firestore = getFirestore();
  const collectionRef = collection(firestore, 'users'); // Replace with your collection name

  // Assuming the first row contains headers
  const headers = jsonData[0];

  // Start from index 1 to skip the headers
  for (let i = 1; i < jsonData.length; i++) {
    const record = jsonData[i];
    const recordObject = {};

    headers.forEach((header, index) => {
      // Use the translation dictionary to map Excel column names to Firestore field names
      const firestoreFieldName = translationDict[header] || header;
      recordObject[firestoreFieldName] = record[index];
    });
    recordObject['phoneCall'] = 'no';
    try {
      await addDoc(collectionRef, recordObject);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }
};

// Function to handle file upload
const handleFileUpload = async (file) => {
  try {
    const jsonData = await readExcelFile(file);
    await uploadDataToFirestore(jsonData);
    console.log('Data uploaded successfully!');
  } catch (error) {
    console.error('Error uploading data: ', error);
  }
};

export { handleFileUpload };

const YourComponent = () => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div>
      <input type="file" accept=".xlsx" onChange={handleFileChange} />
    </div>
  );
};

export default YourComponent;