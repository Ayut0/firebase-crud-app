import './App.css';
import {useState, useEffect, Fragment} from "react"
import db from "./firebase/firebase";
import { collection, getDocs, getFirestore, query, QuerySnapshot, doc, getDoc, onSnapshot, addDoc, setDoc, Timestamp, serverTimestamp, deleteDoc, where, updateDoc } from "firebase/firestore";
import { async } from '@firebase/util';
import { app, storage } from './firebase/firebase';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

function App() {
  const [users, setUsers] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    //Multiple data
    const usersCollectionRef = query(collection(db, "users"));
    // getDocs(usersCollectionRef)
    //   .then((QuerySnapshot) => {
    //     setUsers(QuerySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    //   });

    //Fetch data every time, the database updates
    const unsub = onSnapshot(usersCollectionRef, (QuerySnapshot) => {
      setUsers(
        QuerySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
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

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(e.target.elements);
    const { name, email } = e.target.elements;
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
  };

  const deleteUserWithId = async (id) => {
    const usersRef = doc(db, "users", id);
    console.log(usersRef);
    await deleteDoc(usersRef);
  };

  const deleteUserWithName = async (name) => {
    const userRef = collection(db, "users");
    const q = query(userRef, where("name", "==", name));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);
    querySnapshot.forEach(async (document) => {
      const userDocumentRef = doc(db, "users", document.id);
      await deleteDoc(userDocumentRef);
    });
  };

  // console.log(users);

  const changeAdmin = async (id) => {
    const userDocumentRef = doc(db, "users", id);
    await updateDoc(userDocumentRef, {
      admin: false,
    });
  };

  //Image
  const [image, setImage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const handleImage = (e) =>{
    const image = e.target.files[0];
    console.log(image, e)
    setImage(image)
  };

  const onSubmit = (e) =>{
    e.preventDefault();
    if(image === ''){
      console.log('No image found');
    }

    //Upload image
    const metadata = {
      contentType: 'image/jpeg'
    }
    const storageRef = ref(storage, `/images/${image.name}`);
    console.log(storageRef);

    const uploadTask = uploadBytesResumable(storageRef, image, metadata);
    uploadTask.on(
      'state_changed',
      (snapshot) =>{
        const percent = (snapshot.byteTransferred / snapshot.totalBytes) * 100;
        console.log(percent + "% done");
        console.log(snapshot);
        // eslint-disable-next-line default-case
        switch(snapshot.state){
          case 'paused':
            console.log('Upload is paused');
            break
          case 'running':
            console.log('Upload is ruuning');
            break
        }
      },
      (error) =>{
        // eslint-disable-next-line default-case
        switch(error.code){
          case 'storage/unauthorized':
            break;
          case 'storage/canceled':
            break
          case 'storage/unknown':
            break;
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((fireBaseUrl) => {
          setImageUrl(fireBaseUrl);
          console.log(imageUrl);
        });
      }
    )
  };

  const getImage = (e) =>{
    console.log(e.target)
  }

  const deleteImage = () =>{
    const deleteRef = ref(storage, `/images/${image.name}`);
    deleteObject(deleteRef).then(() => {
      console.log('Deleted successfully')
    }).catch((error) =>{
      console.log(error)
    })
  }


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
      <section>
        <h2>Image upload</h2>
        <form onSubmit={onSubmit}>
          <input type="file" onChange={handleImage}></input>
          <button>Upload</button>
        </form>
        <form onSubmit={deleteImage}>
          <button>Delete</button>
        </form>
        <img src={imageUrl} alt="uploaded" onClick={getImage}></img>
      </section>

      <h2>User list</h2>
      <div className="App">
        {users &&
          users.map((user) => (
            <div key={user.id}>
              <span>{user.name}</span>
              <button onClick={() => deleteUserWithId(user.id)}>
                Delete with ID
              </button>
              <button onClick={() => deleteUserWithName(user.name)}>
                Delete with where, name
              </button>
              {user.admin && (
                <button onClick={() => changeAdmin(user.id)}></button>
              )}
            </div>
          ))}
      </div>
    </Fragment>
  );
}

export default App;
