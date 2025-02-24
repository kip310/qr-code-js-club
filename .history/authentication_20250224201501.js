import { supabase } from "./supabaseClient.js";

async function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { user, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert(error.message);
  } else {
    alert("Login successful!");
    document.querySelector(".modal").remove();
  }
}

document.getElementById("login-btn").addEventListener("click", loginUser);

async function signUpUser(event) {
    event.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });
  
    if (error) {
      alert(error.message);
    } else {
      alert("Sign-up successful! Check your email for verification.");
    }
  }
  
  document.getElementById("signup-btn").addEventListener("click", signUpUser);

  async function loginWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  
    if (error) {
      alert(error.message);
    }
  }
  
  document.getElementById("google-login-btn").addEventListener("click", loginWithGoogle);

  async function logoutUser() {
    const { error } = await supabase.auth.signOut();
  
    if (error) {
      alert(error.message);
    } else {
      alert("Logged out!");
    }
  }
  
  document.getElementById("logout-btn").addEventListener("click", logoutUser);

  supabase.auth.getSession().then(({ data: { session } }) => {
    if (!session) {
      alert("You need to log in first!");
      window.location.href = "login.html"; // Redirect to login page
    }
  });
  