import './App.css';
import {useState, useEffect} from "react"
import db from "./firebase/firebase"
import { collection, getDocs, getFirestore, query, QuerySnapshot } from "firebase/firestore";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() =>{
    const db = getFirestore();
    const usersCollectionRef = query(collection(db, 'users'));
    getDocs(usersCollectionRef)
      .then((QuerySnapshot) => {
        setUsers(QuerySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });
  }, []);
  console.log(users);
  return (
    <div className="App">
      {users && users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}

export default App;
