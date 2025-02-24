import { supabase } from "./supabaseClient.js"; // Import Supabase client

// LOGIN FUNCTION
async function loginUser(event) {
  event.preventDefault();
  
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    alert(error.message);
  } else {
    alert("Login successful!");
    document.querySelector(".modal").remove();
  }
}

// SIGNUP FUNCTION
async function signUpUser(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    alert(error.message);
  } else {
    alert("Sign-up successful! Check your email for verification.");
  }
}

// LOGOUT FUNCTION
async function logoutUser() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    alert(error.message);
  } else {
    alert("Logged out!");
  }
}

// GOOGLE LOGIN FUNCTION
async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });

  if (error) {
    alert(error.message);
  }
}

// EVENT LISTENERS
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login-btn")?.addEventListener("click", loginUser);
  document.getElementById("signup-btn")?.addEventListener("click", signUpUser);
  document.getElementById("google-login-btn")?.addEventListener("click", loginWithGoogle);
  document.getElementById("logout-btn")?.addEventListener("click", logoutUser);
});
