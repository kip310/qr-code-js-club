// export const template1 = `
//   <div class="modal">
//     <div class="modal-content">
//       <i class="fa fa-times modal-close"></i>
//       <h2>Login</h2>
//       <form>
//         <label for="username">Username</label>
//         <input type="text" id="username" placeholder="Enter Username">
//         <label for="password">Password</label>
//         <input type="password" id="password" placeholder="Enter Password">
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   </div>`;

export const template1 =
  `<div class="modal">
    <div class="modal-content">
      <i class="fa fa-times modal-close"></i>
        <form>
            <label>Email</label>
            <input type="email" id="email" placeholder="Enter email" required>
            <label>Password</label>
            <input type="password" id="password" placeholder="Enter password" required>
            <button id="login-btn">Login</button>
            <button id="signup-btn">Sign Up</button>
            <button id="google-login-btn">Login with Google</button>
        </form>
    </div>
  </div>`;