# QR Code Generator
![image](https://github.com/user-attachments/assets/688c5813-ab92-430f-bce6-185e5a52a1f7)

A customizable QR code generator built with JavaScript, Supabase, and QRCodeStyling. This project allows users to create, customize, track, and manage QR codes with a user-friendly interface. It supports authentication via Google OAuth, history tracking, and scan analytics, making it a powerful tool for generating and managing QR codes.

## Features

- **Customizable QR Codes**: Adjust size, margin, colors, dots style, corners, background, and add a logo.
- **Authentication**: Log in with Google OAuth via Supabase for secure user management.
- **History Tracking**: Save generated QR codes to a user's history with options to:
- **Edit URL**: Modify the destination URL associated with a QR code without changing the QR code itself (e.g., update the redirect target while keeping the QR image intact).
- **Scan Tracking**: Optionally track the number of scans for each QR code using a redirect mechanism.
- **State Persistence**: Save and load QR code settings using `sessionStorage`.
- **File Validation**: Upload custom logos with validation for PNG, JPEG, and WEBP formats.
- **Responsive Design**: Adapts to both desktop and mobile devices.
- **Download Option**: Export QR codes as PNG images.
- **Contact Form**: Integrated contact form using EmailJS for user feedback.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Libraries**:
  - [QRCodeStyling](https://github.com/qr-code-styling/qr-code-styling) for QR code generation
  - [Supabase](https://supabase.com/) for authentication and database
  - [html2canvas](https://html2canvas.hertzen.com/) for QR code image export
  - [EmailJS](https://www.emailjs.com/) for contact form submissions
- **Deployment**: Hosted on Vercel (example: `https://qr-code-js-club.vercel.app/`)

## Prerequisites

- Node.js (for local development)
- A Supabase account and project
- An EmailJS account for the contact form
- A web browser

## Setup Instruction

### Clone the Repository
Clone the project from GitHub to your local machine and navigate into the project directory:
```bash
git clone git@github.com:kip310/qr-code-js-club.git
cd qr-code-js-club
