console.log("working");

import { supabase } from "./supabaseClient.js"; // Import Supabase client

// LOGIN FUNCTION
// async function loginUser(event) {
//   event.preventDefault();
  
//   const email = document.getElementById("email").value;
//   const password = document.getElementById("password").value;

//   const { error } = await supabase.auth.signInWithPassword({ email, password });

//   if (error) {
//     alert(error.message);
//   } else {
//     alert("Login successful!");
//     document.querySelector(".modal").remove();
//   }
// }

// SIGNUP FUNCTION
// async function signUpUser(event) {
//   event.preventDefault();

//   const email = document.getElementById("email").value;
//   const password = document.getElementById("password").value;

//   const { error } = await supabase.auth.signUp({ email, password });

//   if (error) {
//     alert(error.message);
//   } else {
//     alert("Sign-up successful! Check your email for verification.");
//   }
// }

// // LOGOUT FUNCTION
// async function logoutUser() {
//   const { error } = await supabase.auth.signOut();

//   if (error) {
//     alert(error.message);
//   } else {
//     alert("Logged out!");
//   }
// }

// GOOGLE LOGIN FUNCTION
// async function loginWithGoogle() {
//   const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });

//   if (error) {
//     alert(error.message);
//   }
// }

// "Logout" when the user is logged in
// document.addEventListener("DOMContentLoaded", async () => {
//   const { data: { user } } = await supabase.auth.getUser();
//   const loginButton = document.querySelector(".login-button");

//   if (user) {
//     loginButton.textContent = "Logout";
//     loginButton.addEventListener("click", logoutUser);
//   } else {
//     loginButton.textContent = "LOGIN HERE";
//     loginButton.addEventListener("click", function () {
//       if (!document.body.contains(document.querySelector(".modal"))) {
//         document.body.insertAdjacentHTML("afterbegin", template1);
//         document.querySelector(".modal").style.opacity = "1";
//         document.querySelector(".modal").style.visibility = "visible";
//       }
//     });
//   }
// });


// EVENT LISTENERS
// document.addEventListener("DOMContentLoaded", () => {
//   document.getElementById("login-btn")?.addEventListener("click", loginUser);
//   document.getElementById("signup-btn")?.addEventListener("click", signUpUser);
//   document.getElementById("google-login-btn")?.addEventListener("click", loginWithGoogle);
//   document.getElementById("logout-btn")?.addEventListener("click", logoutUser);
// });


async function loginUser(event) {
  event.preventDefault();  // Prevents page refresh

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please enter an email and password!");
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert("Login failed: " + error.message);
  } else {
    alert("Login successful!");
    localStorage.setItem("user", JSON.stringify(data.user));  // ✅ Store user in localStorage
    document.querySelector(".modal").remove();
    window.location.reload();  // ✅ Reload page to update UI
  }
}

async function signUpUser(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please enter an email and password!");
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    alert("Sign-up failed: " + error.message);
  } else {
    alert("Sign-up successful! Check your email for verification.");
  }
}

async function logoutUser() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    alert("Logout failed: " + error.message);
  } else {
    localStorage.removeItem("user");  // ✅ Clear stored user
    alert("Logged out!");
    window.location.reload();  // ✅ Refresh page
  }
}

// ✅ Auto-check login state on page load
document.addEventListener("DOMContentLoaded", async () => {
  const { data: { user } } = await supabase.auth.getUser();
  const loginButton = document.querySelector(".login-button");

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    loginButton.textContent = "Logout";
    loginButton.addEventListener("click", logoutUser);
  } else {
    loginButton.textContent = "LOGIN HERE";
    loginButton.addEventListener("click", function () {
      if (!document.body.contains(document.querySelector(".modal"))) {
        document.body.insertAdjacentHTML("afterbegin", template1);
        document.querySelector(".modal").style.opacity = "1";
        document.querySelector(".modal").style.visibility = "visible";
      }
    });
  }
});

// ✅ Attach event listeners for login and signup
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login-btn")?.addEventListener("click", loginUser);
  document.getElementById("signup-btn")?.addEventListener("click", signUpUser);
});
