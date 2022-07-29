import './App.css';
import {useState, useEffect, Fragment} from "react"
import db from "./firebase/firebase"
import { collection, getDocs, getFirestore, query, QuerySnapshot, doc, getDoc, onSnapshot, addDoc, setDoc, Timestamp, serverTimestamp, deleteDoc, where } from "firebase/firestore";
import { async } from '@firebase/util';

function App() {
  const [users, setUsers] = useState([]);
  const db = getFirestore();

  useEffect(() =>{
    //Multiple data
    const usersCollectionRef = query(collection(db, 'users'));
    // getDocs(usersCollectionRef)
    //   .then((QuerySnapshot) => {
    //     setUsers(QuerySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    //   });

    //Fetch data every time, the database updates
    const unsub = onSnapshot(usersCollectionRef, (QuerySnapshot) =>{
      setUsers(QuerySnapshot.docs.map((doc) => ({
        ...doc.data(), id: doc.id
      })));
    });
    return unsub;

    //Get Single data
    // const singleUserData = query(doc(db, "users", "9QW3rE0GbIgBD3PWoOSJ"));
    // getDoc(singleUserData).then((userData) => {
    //   //exist method: Check if there is a data stored
    //   if(userData.exists()){
    //     console.log(userData.data(), userData.exists());
    //   }else{
    //     console.log('No data found')
    //   }
    // })

  }, []);

  const submitHandler = async(e) =>{
    e.preventDefault();
    console.log(e.target.elements)
    const {name, email} = e.target.elements;
    console.log(name.value, email.value);
    //addDoc function: Store the data with auto generated ID
    const usersRef = query(collection(db, "users"));
    const documentRef = await addDoc(usersRef, {
      name: name.value,
      email: email.value,
      Timestamp: serverTimestamp(),
    });
    console.log(documentRef);

    //setDoc function: Store the data with any ID you set
    // const usersRef = query(doc(db, "users", 'ABCDEF'));
    // const documentRef = await setDoc(usersRef, {
    //   name: name.value,
    //   email: email.value
    // });
    // console.log(documentRef);
  }

  const deleteUserWithId = async (id)=>{
    const usersRef = doc(db, 'users', id);
    console.log(usersRef);
    await deleteDoc(usersRef);
  }

  const deleteUserWithName = async (name) => {
    const userRef = collection(db, 'users');
    const q = query(userRef, where('name', '==', name));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot)
    querySnapshot.forEach(async (document) => {
      const userDocumentRef = doc(db, 'users', document.id);
      await deleteDoc(userDocumentRef);
    })
  }

  console.log(users);
  return (
    <Fragment>
      <form onSubmit={submitHandler} style={{ margin: "50px" }}>
        <div>
          <label>Name</label>
          <input name="name" type="text" placeholder="name" required></input>
        </div>
        <div>
          <label>email</label>
          <input name="email" type="email" placeholder="email" required></input>
        </div>
        <div>
          <button>Register</button>
        </div>
      </form>
      <h2>User list</h2>
      <div className="App">
        {users && users.map((user) =>(
          <div key={user.id}>
            <span>{user.name}</span>
            <button onClick={() => deleteUserWithId(user.id)}>Delete with ID</button>
            <button onClick={() => deleteUserWithName(user.name)}>Delete with where, name</button>
          </div>
        ))}
      </div>
    </Fragment>
  );
}

export default App;
