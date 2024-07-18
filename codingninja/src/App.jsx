
import React, { useState, useEffect } from "react";
import { auth, provider, db } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import axios from "axios";

const App = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userWhatsApp, setUserWhatsApp] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  const handleSignIn = () => {
    signInWithPopup(auth, provider);
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        name: userName,
        whatsapp: userWhatsApp,
        email: user.email,
      });

      axios
        .post("http://localhost:3000/save-to-excel", {
          name: userName,
          whatsapp: userWhatsApp,
          email: user.email,
        })
        .then((response) => {
          console.log(response.data);
          alert("Details submitted successfully and saved to Excel!");
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Failed to save data to Excel.");
        });
    } else {
      alert("No user is signed in.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Google Sign In</h1>
      {!user ? (
        <button
          onClick={handleSignIn}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        >
          <i className="fab fa-google mr-2"></i> Sign in with Google
        </button>
      ) : (
        <div>
          <div className="mb-4">
            <h3 className="text-xl">Hello, {user.displayName}!</h3>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <input
              type="text"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="mb-2 p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="text"
              placeholder="WhatsApp Number"
              value={userWhatsApp}
              onChange={(e) => setUserWhatsApp(e.target.value)}
              className="mb-2 p-2 border border-gray-300 rounded"
              required
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded mb-4"
            >
              Submit
            </button>
          </form>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
