
// import { supabase } from "./supabaseClient.js";
// import { template1 } from "./loginTemplate.js";

// // LOGOUT FUNCTION
// async function logoutUser() {
//   const { error } = await supabase.auth.signOut();

//   if (error) {
//     console.error("Logout error:", error);
//     alert("Logout failed: " + error.message);
//   } else {
//     localStorage.removeItem("user");
//     alert("Logged out!");
//     window.location.reload();
//   }
// }

// // LOGIN WITH GMAIL FUNCTION
// async function loginWithGmail(event) {
//   event.preventDefault();
//   console.log("Login with Gmail button clicked"); // Confirm click

//   try {
//     console.log("Attempting Supabase OAuth with Google...");
//     const { data, error } = await supabase.auth.signInWithOAuth({
//       provider: "google",
//       options: {
//         redirectTo: window.location.origin,
//       },
//     });

//     if (error) {
//       console.error("OAuth error:", error);
//       alert("Gmail login failed: " + error.message);
//       return;
//     }

//     console.log("OAuth response:", data); // Should log before redirect
//   } catch (err) {
//     console.error("Unexpected error in loginWithGmail:", err);
//     alert("An unexpected error occurred: " + err.message);
//   }
// }

// // HELPER: Attach modal event listeners
// function attachModalListeners() {
//   const gmailLoginBtn = document.getElementById("gmail-login-btn");
//   const closeBtn = document.querySelector(".modal-close");

//   console.log("Attaching listeners. Gmail button found:", gmailLoginBtn);

//   if (gmailLoginBtn) {
//     gmailLoginBtn.addEventListener("click", loginWithGmail);
//   } else {
//     console.error("Error: Gmail login button not found in modal");
//   }

//   if (closeBtn) {
//     closeBtn.addEventListener("click", () => {
//       const modal = document.querySelector(".modal");
//       if (modal) modal.remove();
//     });
//   }
// }

// // INITIALIZATION
// document.addEventListener("DOMContentLoaded", async () => {
//   console.log("Page loaded, checking user session...");

//   const { data: { user }, error: userError } = await supabase.auth.getUser();
//   if (userError) console.error("Get user error:", userError);

//   const loginButton = document.querySelector(".login-button");

//   // Check if the user just authenticated via OAuth
//   const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
//   if (sessionError) console.error("Get session error:", sessionError);

//   if (sessionData?.session && !sessionError) {
//     console.log("User authenticated via OAuth:", sessionData.session.user);
//     localStorage.setItem("user", JSON.stringify(sessionData.session.user));
//     const modal = document.querySelector(".modal");
//     if (modal) modal.remove();
//     window.location.reload();
//   }

//   if (user) {
//     console.log("User already logged in:", user);
//     localStorage.setItem("user", JSON.stringify(user));
//     loginButton.textContent = "Logout";
//     loginButton.addEventListener("click", logoutUser);
//   } else {
//     console.log("No user logged in, setting up login button");
//     loginButton.textContent = "LOGIN HERE";
//     loginButton.addEventListener("click", () => {
//       if (!document.body.contains(document.querySelector(".modal"))) {
//         console.log("Inserting modal...");
//         document.body.insertAdjacentHTML("afterbegin", template1);
//         const modal = document.querySelector(".modal");
//         modal.style.opacity = "1";
//         modal.style.visibility = "visible";
//         attachModalListeners();
//       }
//     });
//   }
// });

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

  // Check if this is a fresh OAuth redirect using URL parameters
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

  // Handle OAuth redirect only once
  if (isOAuthRedirect && sessionData?.session && !sessionError) {
    console.log("Fresh OAuth redirect detected:", sessionData.session.user);
    localStorage.setItem("user", JSON.stringify(sessionData.session.user));
    const modal = document.querySelector(".modal");
    if (modal) modal.remove();
    // Clean URL to prevent reprocessing
    window.history.replaceState({}, document.title, window.location.pathname);
    loginButton.textContent = "Logout";
    loginButton.replaceWith(loginButton.cloneNode(true)); // Remove old listeners
    document.querySelector(".login-button").addEventListener("click", logoutUser);
    return; // Exit to prevent further execution
  }

  // Normal session check
  if (user) {
    console.log("User already logged in:", user);
    localStorage.setItem("user", JSON.stringify(user));
    loginButton.textContent = "Logout";
    loginButton.replaceWith(loginButton.cloneNode(true)); // Remove old listeners
    document.querySelector(".login-button").addEventListener("click", logoutUser);
  } else {
    console.log("No user logged in, setting up login button");
    loginButton.textContent = "LOGIN HERE";
    loginButton.replaceWith(loginButton.cloneNode(true)); // Remove old listeners
    document.querySelector(".login-button").addEventListener("click", () => {
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

