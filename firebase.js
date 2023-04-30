import firebase from "firebase";

const firebaseConfig = {
	apiKey: "AIzaSyBPpmQQ3fN0tuLlVZoNA7OYQlbRoF6OIhI",
	authDomain: "video-trailer-dacs3.firebaseapp.com",
	projectId: "video-trailer-dacs3",
	storageBucket: "video-trailer-dacs3.appspot.com",
	messagingSenderId: "886951387310",
	appId: "1:886951387310:web:c538a09aed592bb9e44d3f",
	measurementId: "G-TLXSRNS6ZV",
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
export default storage;
