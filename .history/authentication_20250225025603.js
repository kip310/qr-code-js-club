// console.log("working");

// import { supabase } from "./supabaseClient.js"; // Import Supabase client

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


// cach 2
// async function loginUser(event) {
//   event.preventDefault();  // Prevents page refresh

//   const email = document.getElementById("email").value;
//   const password = document.getElementById("password").value;

//   if (!email || !password) {
//     alert("Please enter an email and password!");
//     return;
//   }

//   const { data, error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });

//   if (error) {
//     alert("Login failed: " + error.message);
//   } else {
//     alert("Login successful!");
//     localStorage.setItem("user", JSON.stringify(data.user));  
//     document.querySelector(".modal").remove();
//     window.location.reload();  
//   }
// }

// async function signUpUser(event) {
//   event.preventDefault();

//   const email = document.getElementById("email").value;
//   const password = document.getElementById("password").value;

//   if (!email || !password) {
//     alert("Please enter an email and password!");
//     return;
//   }

//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//   });

//   if (error) {
//     alert("Sign-up failed: " + error.message);
//   } else {
//     alert("Sign-up successful! Check your email for verification.");
//   }
// }

// async function logoutUser() {
//   const { error } = await supabase.auth.signOut();

//   if (error) {
//     alert("Logout failed: " + error.message);
//   } else {
//     localStorage.removeItem("user");  
//     alert("Logged out!");
//     window.location.reload();  // 
// }


// document.addEventListener("DOMContentLoaded", async () => {
//   const { data: { user } } = await supabase.auth.getUser();
//   const loginButton = document.querySelector(".login-button");

//   if (user) {
//     localStorage.setItem("user", JSON.stringify(user));
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

// document.addEventListener("DOMContentLoaded", () => {
//   document.getElementById("login-btn")?.addEventListener("click", loginUser);
//   document.getElementById("signup-btn")?.addEventListener("click", signUpUser);
// });

// cach 3
// authentication.js
// import { supabase } from "./supabaseClient.js";
// import { template1 } from "./loginTemplate.js";

// // LOGIN FUNCTION
// async function loginUser(event) {
//   event.preventDefault();

//   const email = document.getElementById("email")?.value;
//   const password = document.getElementById("password")?.value;

//   if (!email || !password) {
//     alert("Please enter an email and password!");
//     return;
//   }

//   const { data, error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });

//   if (error) {
//     alert("Login failed: " + error.message);
//   } else {
//     alert("Login successful!");
//     localStorage.setItem("user", JSON.stringify(data.user));
//     const modal = document.querySelector(".modal");
//     if (modal) modal.remove();
//     window.location.reload();
//   }
// }

// // SIGNUP FUNCTION
// async function signUpUser(event) {
//   event.preventDefault();

//   const email = document.getElementById("email")?.value;
//   const password = document.getElementById("password")?.value;

//   if (!email || !password) {
//     alert("Please enter an email and password!");
//     return;
//   }

//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//   });

//   if (error) {
//     alert("Sign-up failed: " + error.message);
//   } else {
//     alert("Sign-up successful! Check your email for verification.");
//   }
// }

// // LOGOUT FUNCTION
// async function logoutUser() {
//   const { error } = await supabase.auth.signOut();

//   if (error) {
//     alert("Logout failed: " + error.message);
//   } else {
//     localStorage.removeItem("user");
//     alert("Logged out!");
//     window.location.reload();
//   }
// }

// // HELPER: Attach modal event listeners
// function attachModalListeners() {
//   const loginBtn = document.getElementById("login-btn");
//   const signupBtn = document.getElementById("signup-btn");
//   const closeBtn = document.querySelector(".modal-close");

//   if (loginBtn) loginBtn.addEventListener("click", loginUser);
//   if (signupBtn) signupBtn.addEventListener("click", signUpUser);
//   if (closeBtn) {
//     closeBtn.addEventListener("click", () => {
//       const modal = document.querySelector(".modal");
//       if (modal) modal.remove();
//     });
//   }
// }

// // INITIALIZATION
// document.addEventListener("DOMContentLoaded", async () => {
//   const { data: { user } } = await supabase.auth.getUser();
//   const loginButton = document.querySelector(".login-button");

//   if (user) {
//     localStorage.setItem("user", JSON.stringify(user));
//     loginButton.textContent = "Logout";
//     loginButton.addEventListener("click", logoutUser);
//   } else {
//     loginButton.textContent = "LOGIN HERE";
//     loginButton.addEventListener("click", () => {
//       if (!document.body.contains(document.querySelector(".modal"))) {
//         document.body.insertAdjacentHTML("afterbegin", template1);
//         const modal = document.querySelector(".modal");
//         modal.style.opacity = "1";
//         modal.style.visibility = "visible";
//         attachModalListeners(); // Attach listeners after modal is added
//       }
//     });
//   }
// });

// document.addEventListener("DOMContentLoaded", async () => {
//   const { data: { user } } = await supabase.auth.getUser();
//   const loginButton = document.querySelector(".login-button");

//   // Check if the user just authenticated via OAuth
//   const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
//   if (sessionData?.session && !sessionError) {
//     localStorage.setItem("user", JSON.stringify(sessionData.session.user));
//     const modal = document.querySelector(".modal");
//     if (modal) modal.remove();
//     window.location.reload(); // Refresh to update UI
//   }

//   if (user) {
//     localStorage.setItem("user", JSON.stringify(user));
//     loginButton.textContent = "Logout";
//     loginButton.addEventListener("click", logoutUser);
//   } else {
//     loginButton.textContent = "LOGIN HERE";
//     loginButton.addEventListener("click", () => {
//       if (!document.body.contains(document.querySelector(".modal"))) {
//         document.body.insertAdjacentHTML("afterbegin", template1);
//         const modal = document.querySelector(".modal");
//         modal.style.opacity = "1";
//         modal.style.visibility = "visible";
//         attachModalListeners();
//       }
//     });
//   }
// });

// login with gmail
// authentication.js
// authentication.js
// authentication.js
// authentication.js
// authentication.js
import { supabase } from "./supabaseClient.js";
import { template1 } from "./loginTemplate.js";

console.log("authentication.js loaded. Template1:", template1);

// LOGOUT FUNCTION
async function logoutUser() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error);
    alert("Logout failed: " + error.message);
  } else {
    localStorage.removeItem("user");
    alert("Logged out!");
    window.location.reload();
  }
}

// LOGIN WITH GMAIL FUNCTION
async function loginWithGmail(event) {
  event.preventDefault();
  console.log("Login with Gmail button clicked");

  try {
    console.log("Supabase instance:", supabase);
    console.log("Initiating OAuth with Google...");
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://127.0.0.1:5502",
      },
    });

    if (error) {
      console.error("OAuth error:", error);
      alert("Gmail login failed: " + error.message);
      return;
    }

    console.log("OAuth redirect initiated:", data);
  } catch (err) {
    console.error("Unexpected error during Gmail login:", err);
    alert("An unexpected error occurred: " + err.message);
  }
}

// HELPER: Attach modal event listeners
function attachModalListeners() {
  const gmailLoginBtn = document.getElementById("gmail-login-btn");
  const closeBtn = document.querySelector(".modal-close");

  console.log("Attaching listeners. Gmail button found:", gmailLoginBtn);

  if (gmailLoginBtn) {
    gmailLoginBtn.addEventListener("click", loginWithGmail);
    console.log("Listener attached to Gmail button");
  } else {
    console.error("Error: Gmail login button not found in modal");
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      const modal = document.querySelector(".modal");
      if (modal) modal.remove();
    });
  }
}

// INITIALIZATION
document.addEventListener("DOMContentLoaded", async () => {
  console.log("Page loaded, checking user session...");

  const loginButton = document.querySelector(".login-button");
  console.log("Login button element:", loginButton);

  if (!loginButton) {
    console.error("Error: .login-button not found in DOM");
    return;
  }

  // Check if this is a fresh OAuth redirect (e.g., has code in URL)
  const urlParams = new URLSearchParams(window.location.search);
  const isOAuthRedirect = urlParams.has("code");

  let user = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    user = data.user;
  } catch (err) {
    if (err.message === "Auth session missing!") {
      console.log("No active session (expected if not logged in)");
    } else {
      console.error("Get user error:", err);
    }
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) console.error("Get session error:", sessionError);

  // Handle fresh OAuth redirect
  if (sessionData?.session && !sessionError && isOAuthRedirect) {
    console.log("Fresh OAuth redirect detected:", sessionData.session.user);
    localStorage.setItem("user", JSON.stringify(sessionData.session.user));
    const modal = document.querySelector(".modal");
    if (modal) modal.remove();
    // Remove the 'code' from URL to prevent loop
    window.history.replaceState({}, document.title, window.location.pathname);
    loginButton.textContent = "Logout";
    loginButton.replaceWith(loginButton.cloneNode(true)); // Clear old listeners
    loginButton.addEventListener("click", logoutUser);
    return; // Exit to prevent further processing
  }

  // Normal session check
  if (user) {
    console.log("User already logged in:", user);
    localStorage.setItem("user", JSON.stringify(user));
    loginButton.textContent = "Logout";
    loginButton.replaceWith(loginButton.cloneNode(true)); // Clear old listeners
    loginButton.addEventListener("click", logoutUser);
  } else {
    console.log("No user logged in, setting up login button");
    loginButton.textContent = "LOGIN HERE";
    loginButton.replaceWith(loginButton.cloneNode(true)); // Clear old listeners
    loginButton.addEventListener("click", () => {
      console.log("LOGIN HERE clicked");
      if (!document.body.contains(document.querySelector(".modal"))) {
        console.log("Inserting modal...");
        document.body.insertAdjacentHTML("afterbegin", template1);
        const modal = document.querySelector(".modal");
        if (modal) {
          modal.style.opacity = "1";
          modal.style.visibility = "visible";
          console.log("Modal inserted and visible");
          attachModalListeners();
        } else {
          console.error("Error: Modal not inserted into DOM");
        }
      } else {
        console.log("Modal already exists in DOM");
      }
    });
  }
});