
export const template1 =

  // loginTemplate.js
`<div class="modal">
  <div class="modal-content">
    <h2 class="modal-title">Welcome Back!</h2>
    <p class="modal-subtitle">Sign in to continue</p>
    <form>
      <button id="gmail-login-btn" class="google-login-btn">
        <img src="/img/logogoogle.png" alt="Google Logo" class="google-logo">
        <span>Sign in with Google</span>
      </button>
    </form>
  </div>
</div>

<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes buttonClick {
    0% { transform: scale(1); }
    50% { transform: scale(0.95); }
    100% { transform: scale(1); }
  }

  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: rgba(0, 0, 0, 0.9);
    animation: fadeIn 0.5s ease-in-out;
  }
  .modal-content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: white;
    padding: 50px;
    border-radius: 12px;
    font-size: 20px;
    color: black;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    animation: fadeIn 0.6s ease-in-out;
  }
  .modal-title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .modal-subtitle {
    font-size: 18px;
    margin-bottom: 20px;
    color: #555;
  }
  .google-login-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border: 2px solid #000;
    padding: 15px;
    border-radius: 50px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    width: 320px;
    transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  .google-login-btn:hover {
    background-color: #4ac4e3;
    color: #fff !important;
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.4);
  }
  .google-login-btn:active {
    animation: buttonClick 0.2s ease-in-out;
  }
  .google-logo {
    width: 35px;
    height: 35px;
    margin-right: 12px;
  }
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    color: black;
  }
</style>

`;