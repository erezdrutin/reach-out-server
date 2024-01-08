import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs,query,where,updateDoc } from 'firebase/firestore';
import FormModal from '../components/FormModal';
import Popup from '../components/Popup'; // Create a Popup component
import '../styles/userTablePage.css';

function AnotherPage() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [hidePhoneCallYes, setHidePhoneCallYes] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchColumn, setSearchColumn] = useState('firstName'); // Default to 'firstName'

  useEffect(() => {
    const fetchData = async () => {
      const firestore = getFirestore();
      const collectionRef = collection(firestore, 'users');

      try {
        const querySnapshot = await getDocs(collectionRef);
        const newData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData(newData);
      } catch (error) {
        console.error('Error fetching data from Firebase:', error.message);
      }
    };

    fetchData();
  }, []);

  const handleButtonClick = async (rowData) => {
    const emailAddress = rowData.emailAddress; // Assuming the email address is available in rowData


    // Create a new Firestore instance
    const firestore = getFirestore();
    const collectionRef = collection(firestore, 'users');

    const q = query(collectionRef, where('emailAddress', '==', emailAddress));

    try {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();

        if (data['readORwrite'] === 'write') {
          // If the read/write field is 'write', show an error alert
          alert('You do not have permission to edit this user.');
        } else {
          // If the read/write field is not 'write', open the form
          await updateDoc(doc.ref, { ...data, 'readORwrite': 'write' });
          setSelectedRowData(rowData);
          setShowForm(true);
        }
      } else {
        // Handle the case when no matching documents are found
        console.log('No matching documents found.');
      }
    } catch (error) {
      console.error('Error getting documents:', error);
    }
  };

  const handleCloseForm = async () => {
    try {
      if (selectedRowData) {
        const emailAddress = selectedRowData.emailAddress;
        // Create a new Firestore instance
        const firestore = getFirestore();
        const collectionRef = collection(firestore, 'users');

        const q = query(collectionRef, where('emailAddress', '==', emailAddress));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const data = doc.data();

          // Update the document with the desired changes
          await updateDoc(doc.ref, { ...data, 'readORwrite': 'read' });
        } else {
          // Handle the case when no matching documents are found
          console.log('No matching documents found.');
        }
      }
    } catch (error) {
      console.error('Error updating document:', error);
    } finally {
      // Regardless of success or failure, close the form
      setSelectedRowData(null);
      setShowForm(false);
    }
  };

  function formatTimestamp(timestamp) {
    // Convert days to milliseconds
    const milliseconds = timestamp * 24 * 60 * 60 * 1000;

    // Create a new Date object
    const date = new Date(milliseconds);

    // Format the date as a string
    const formattedDate = date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    return formattedDate;
  }

  const handleSort = (key) => {
    let direction = 'ascending';

    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    setSortConfig({ key, direction });
  };

  const handleToggleHidePhoneCallYes = () => {
    setHidePhoneCallYes(!hidePhoneCallYes);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchColumnChange = (e) => {
    setSearchColumn(e.target.value);
  };

  const formattedData = () => {
    const sortableData = [...filteredData()];

    if (sortConfig.key !== null) {
      sortableData.sort((a, b) => {
        const key = sortConfig.key;

        if (key === 'timestamp') {
          // If sorting by timestamp, convert timestamps to milliseconds before comparing
          const aValue = a[key] * 24 * 60 * 60 * 1000;
          const bValue = b[key] * 24 * 60 * 60 * 1000;

          if (aValue < bValue) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        } else {
          // For other keys, use regular string comparison
          if (a[key] < b[key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (a[key] > b[key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        }
      });
    }

    return sortableData;
  };

  const filteredData = () => {
    let filtered = [...data];

    // Filter based on hidePhoneCallYes state
    filtered = hidePhoneCallYes ? filtered.filter((item) => item.phoneCall !== 'yes') : filtered;

    // Filter based on searchQuery
    if (searchQuery) {
      filtered = filtered.filter((item) => {
        const columnValue = item[searchColumn];
        return columnValue && columnValue.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    return filtered;
  };

  return (
    <div>
      <h1>מכרז מתנדבים</h1>

      <label>
        Search:
        <input type="text" value={searchQuery} onChange={handleSearch} />
      </label>

      <label>
        Search Column:
        <select value={searchColumn} onChange={handleSearchColumnChange}>
          <option value="firstName">שם פרטי</option>
          <option value="lastName">שם משפחה</option>
          <option value="settlementName">יישוב</option>
        </select>
      </label>

      <button onClick={handleToggleHidePhoneCallYes}>
        {hidePhoneCallYes ? 'Show All' : 'Hide PhoneCall Yes'}
      </button>

      <table>
        <thead>
          <tr>
            <th></th>
            <th onClick={() => handleSort('phoneCall')}>האם נעשה שיחה</th>
            <th onClick={() => handleSort('timestamp')}>מילוי טופס</th>
            <th onClick={() => handleSort('phoneNumber')}>מספר טלפון</th>
            <th onClick={() => handleSort('settlementName')}>מקום מגורים</th>
            <th onClick={() => handleSort('lastName')}>שם משפחה</th>
            <th onClick={() => handleSort('firstName')}>שם פרטי</th>
          </tr>
        </thead>
        <tbody>
          {formattedData().map((item) => (
            <tr key={item.id} className={item.phoneCall === 'yes' ? 'marked-row' : ''}>
              <td>
                <button onClick={() => handleButtonClick(item)}>Open Form</button>
              </td>
              <td>{item.phoneCall}</td>
              <td>{formatTimestamp(item.timestamp)}</td>
              <td>{item.phoneNumber}</td>
              <td>{item.settlementName}</td>
              <td>{item.lastName}</td>
              <td>{item.firstName}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Render the Popup component with FormModal inside if showForm is true */}
      {showForm && (
        <Popup onClose={handleCloseForm}>
          <FormModal onClose={handleCloseForm} preFilledData={selectedRowData} />
        </Popup>
      )}
    </div>
  );
}

export default AnotherPage;
