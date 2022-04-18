import * as firebase from 'firebase';
import fs from 'fs'
import fetch from 'node-fetch'


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyC3bvlOlY1gGFWUiSDMg9YA94E8hwGSwuo",
  authDomain: "mtaa-autobazar-storage.firebaseapp.com",
  projectId: "mtaa-autobazar-storage",
  storageBucket: "mtaa-autobazar-storage.appspot.com",
  messagingSenderId: "276629828442",
  appId: "1:276629828442:web:876afc5961294466e47963",
  measurementId: "G-XL77BC1PLX"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

const storage = getStorage();
const storageRef = ref(storage, 'images/img.jpg');

const uploadPhoto = () => {
    const file = fs.readFileSync('./Nitra.png')
    console.log('test')
    console.log(file)
    uploadBytes(storageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (downloadURL) => {
            let obj = {
                author: "623cd15374172b6bd7104090",
                year: 1944,
                mileage: 16681,
                price: 15555,
                doors: 5,
                description: "huhu",
                engine_cap: "160kW",
                car_brand: "VW",
                body: "combi",
                image_photos: [downloadURL.toString(), downloadURL.toString()]
            }
            console.log(obj)
            const response = await fetch('http://localhost:8080/api/autobazar/cars/', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(obj)})
            //const data = await response.json()
            console.log(response)
        });
    });
}

uploadPhoto()