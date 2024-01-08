import React, { useState, useEffect } from 'react';
import { getFirestore,where,collection,getDocs,updateDoc,query } from 'firebase/firestore';
const FormModal = ({ onClose, preFilledData  }) => {
const [formData, setFormData] = useState({});

useEffect(() => {
  // Set initial form data when preFilledData changes
  if (preFilledData) {
    setFormData(preFilledData);
  }
}, [preFilledData]);

const handleSubmit = (event) => {
  event.preventDefault();
  // Create a new Firestore instance
  
  const firestore = getFirestore();
  const collectionRef = collection(firestore, 'users');

  const emailAddress = formData.emailAddress;
  const q = query(collectionRef, where('emailAddress', "==", emailAddress));
  
  getDocs(q)
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();

        console.log('Document ID before update:', doc.id);
        console.log('Document Data before update:', data);

        // Update the document with the desired changes
        updateDoc(doc.ref, { ...formData, phoneCall: 'yes' ,readORwrite: 'read'})
          .then(() => {
            console.log('Document successfully updated!');
            onClose(); // Assuming you want to close the modal after submission
            alert('change successfully');
            window.location.reload()
          })
          .catch((error) => {
            console.error('Error updating document:', error);
            alert('error : do not change');
          });
      } else {
        console.log('No matching documents found.');
        alert('error : do not change');
        onClose(); // Assuming you want to close the modal after submission
      }
    })
    .catch((error) => {
      console.error('Error getting documents:', error);
    });
};

const getOptionsForField = (field) => {
  switch (field) {
      case 'livingInSurroundings':
        return ['כן', 'לא'];
      case 'ageRange':
        return ['18-25', '26-45', '46-65', '65+'];
      case 'howDidYouFindUs':
        return ['הודעה בWhatsApp', 'פוסט בפיסבוק', 'פוסט בלינקדאין', 'אינסטגרם', 'חברים העבירו לי ישירות', 'מנהל קהילה', 'מרכז חוסן', 'קופת החולים'];
      case 'isGarminWatch':
          return ['כן', 'לא'];
      case 'isGarminApp':
          return ['כן', 'לא'];
      case 'appUseBool':
        return ['כן', 'לא'];
      case 'appUse':
          return [0,1,2,3,4,5];
      case 'distress':
          return [0,1,2,3,4,5];
      default:
        return [];
    }
};
const englishToHebrew = {
  firstName: 'שם פרטי',
  lastName: 'שם משפחה',
  phoneNumber: 'מספר טלפון',
  livingInSurroundings: 'האם גר בסביבה',
  settlementName: 'שם היישוב',
  ageRange: 'קבוצת גיל',
  emailAddress: 'כתובת אימייל',
  howDidYouFindUs: 'איך מצאת אותנו',
  isGarminWatch: 'האם יש לך כבר שעון Garmin',
  isGarminApp: 'האם את/ה משתמש באפליקציה של Garmin',
  appUseBool: 'השתתפות במיזם כוללת לבישה של צמיד חכם ושימוש באפליקציה על בסיס יום-יומי.אם זה משהו שמתאים לך ?',
  appUse: 'כמה ימים מהשבוע לא כולל שישי שבת לדעתך תשתמש/י באפליקציה',
  distress: 'כמה האדם בצד השני של הקו הרגיש לכם במצוקה',
};
return (
  <div className="form-modal">
    <h2>שיחת אינטייק</h2>
    <p>
    היי, קוראים לי  ואני מהמיזם "הושיטו יד", [אתה זוכר שנרשמת? עם הצמידים החכמים] מה שלומך? 
    </p>
    <p>
    האם זה זמן טוב? אני צריכה 5 דקות מזמנך.
    </p>
    <p>
    קודם כל אני שמחה שהתעניינת במיזם שלנו, אני מתקשרת כי אני רוצה להסביר קצת על איך התהליך עובד - ומה בעצם זה אומר לקבל שעון ואפליקציה. בנוסף, אצטרך לברר מולך עוד כמה פרטים לוודא שאכן יש התאמה ושאפשר להמשיך הלאה.
    </p>
    <p>
    המטרה של המיזם היא לעזור לכם בצורה אקטיבית להוריד את רמות הסטרס באמצעות שימוש יום יומי בצמיד ואפליקציה. הצמיד בעצם מחובר לאפליקציה בטלפון חכם והיא יודעת לתת לכם פידבק בשביל שתוכלו לעבוד בצורה אקטיבית. הצמיד מעביר לאפליקציה את הנתונים שהוא אוסף, והיא יודעת בזמן אמת לזהות מצבים של סטרס וגם להציע שיטות להרגיע ולהשתלט על המצב.
    </p>
    <p>
    ** חשוב להעביר לאנשים שהשעון והאפליקציה עובדות ביחד **
    </p>
    <p>
      רגע נעבור על הפרטים שכבר נמצאים אצלי
    </p>
    <form onSubmit={handleSubmit}>
      {[
        'firstName',
        'lastName',
        'phoneNumber',
        'livingInSurroundings',
        'settlementName',
        'ageRange',
        'emailAddress',
        'howDidYouFindUs',
        'isGarminWatch',
        'isGarminApp',
        'appUseBool',
        'appUse',
        "distress"
      ].map((field, index) => (
        <div key={field}>
          <label>{englishToHebrew[field]}</label>
          {['howDidYouFindUs', 'livingInSurroundings', 'ageRange', 'isGarminWatch', 
          'isGarminApp', 'appUseBool','appUse',"distress"].includes(field) ? (
            <select
              name={field}
              value={formData[field] || ''}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            >
              {getOptionsForField(field).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              name={field}
              value={formData[field] || ''}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            />
          )}
          {field === 'howDidYouFindUs' && (
            <p>
              הסבר או טקסט נוסף כאן בין שדות 'איך מצאת אותנו' ל-'האם יש לך כבר שעון Garmin'
            </p>
          )}
          {field === 'appUseBool' && (
            <p>
              'אם מישהו אומר בכלל לא - אז לענות בסדר אין בעיה ולסמן 0 '
            </p>
          )}
        </div>
      ))}
      <button type="submit">שמור</button>
    </form>
  </div>
);
};

export default FormModal;