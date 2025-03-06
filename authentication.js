import { supabase } from "./supabaseClient.js";
import { template1 } from "./loginTemplate.js";


console.log("authentication.js loaded. Template1:", template1);

// Logout Function
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

// History Button Function (Placeholder)
function showHistory() {
  window.location.href = "./historyPage/history.html";
}

// Login with Gmail Function
async function loginWithGmail(event) {
  event.preventDefault();
  console.log("Login with Gmail button clicked");
  try {
    console.log("Initiating OAuth with Google...");
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
    console.log("OAuth redirect initiated:", data);
  } catch (err) {
    console.error("Unexpected error during Gmail login:", err);
    alert("An unexpected error occurred: " + err.message);
  }
}

// Helper: Attach modal event listeners
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

// Helper: Toggle content interactivity
function toggleContentInteractivity(isLoggedIn) {
  const restrictedContent = document.querySelector(".restricted-content");
  if (isLoggedIn) {
    restrictedContent.classList.remove("restricted");
  } else {
    restrictedContent.classList.add("restricted");
  }
}

// Helper: Toggle Avatar and Dropdown
function toggleUserMenu(isLoggedIn) {
  const loginButton = document.querySelector(".login-button");
  const avatarButton = document.querySelector(".avatar-button");
  const avatarDropdown = document.querySelector(".avatar-dropdown");

  if (isLoggedIn) {
    console.log("User data:", JSON.parse(localStorage.getItem("user")));
    if (loginButton) loginButton.style.display = "none";
    if (avatarButton) {
      avatarButton.style.display = "block";
      const avatarImg = avatarButton.querySelector(".avatar-img2");
      if (avatarImg) {
        const user = JSON.parse(localStorage.getItem("user"));
        avatarImg.src = user?.user_metadata?.avatar_url || "./default-avatar.jpg";
      }
    }
  } else {
    if (loginButton) loginButton.style.display = "block";
    if (avatarButton) avatarButton.style.display = "none";
    if (avatarDropdown) avatarDropdown.classList.remove("active");
  }
}

// Initialization and Event Listeners
document.addEventListener("DOMContentLoaded", async () => {
  console.log("Page loaded, checking user session...");

  const loginButton = document.querySelector(".login-button");
  const avatarButton = document.querySelector(".avatar-button");
  const avatarDropdown = document.querySelector(".avatar-dropdown");
  const userMenu = document.querySelector(".user-menu");

  // Setup avatar button and dropdown listeners
  if (avatarButton) {
    avatarButton.addEventListener("click", (e) => {
      e.stopPropagation();
      avatarDropdown.classList.toggle("active");
    });
  }

  document.addEventListener("click", (e) => {
    if (!userMenu.contains(e.target) && !avatarButton.contains(e.target)) {
      avatarDropdown.classList.remove("active");
    }
  });

  const historyButton = document.querySelector(".history-button");
  if (historyButton) historyButton.addEventListener("click", showHistory);

  const logoutButton = document.querySelector(".logout-button");
  if (logoutButton) logoutButton.addEventListener("click", logoutUser);

  if (!loginButton) {
    console.error("Error: .login-button not found in DOM");
    return;
  }

  // Check for redirect with tokens in URL fragment
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const isOAuthRedirect = hashParams.has("access_token");

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

  if (isOAuthRedirect && sessionData?.session && !sessionError) {
    console.log("OAuth redirect detected with tokens:", sessionData.session.user);
    localStorage.setItem("user", JSON.stringify(sessionData.session.user));
    const modal = document.querySelector(".modal");
    if (modal) modal.remove();
    window.history.replaceState({}, document.title, window.location.pathname);
    toggleUserMenu(true);
    toggleContentInteractivity(true);
    return;
  }

  if (user) {
    console.log("User already logged in:", user);
    localStorage.setItem("user", JSON.stringify(user));
    toggleUserMenu(true);
    toggleContentInteractivity(true);
  } else {
    console.log("No user logged in, setting up login button");
    loginButton.textContent = "Log in";
    loginButton.replaceWith(loginButton.cloneNode(true));
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
      }
    });
    toggleContentInteractivity(false);
    toggleUserMenu(false);
  }
});

// Real-time auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth state changed:", event, session);
  if (event === "SIGNED_IN") {
    localStorage.setItem("user", JSON.stringify(session.user));
    toggleUserMenu(true);
    toggleContentInteractivity(true);
    const modal = document.querySelector(".modal");
    if (modal) modal.remove();
  } else if (event === "SIGNED_OUT") {
    localStorage.removeItem("user");
    toggleUserMenu(false);
    toggleContentInteractivity(false);
    const loginButton = document.querySelector(".login-button");
    loginButton.textContent = "LOGIN HERE";
    loginButton.replaceWith(loginButton.cloneNode(true));
    document.querySelector(".login-button").addEventListener("click", () => {
      document.body.insertAdjacentHTML("afterbegin", template1);
      const modal = document.querySelector(".modal");
      modal.style.opacity = "1";
      modal.style.visibility = "visible";
      attachModalListeners();
    });
  }
});

