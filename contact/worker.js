async function createResponse(body, status, corsHeaders) {
    const response = new Response(body, { status });
    for (const [key, value] of Object.entries(corsHeaders)) {
      response.headers.set(key, value);
    }
    return response;
  }
  
  async function sanitizeInput(input) {
    if (!input || typeof input !== "string") return "";
    return input
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(/&(?!(lt|gt|quot|amp|#039);)/g, "&")
      .replace(/"/g, "\"")
      .replace(/'/g, "'");
  }
  
  async function sendEmail(formData, serviceId, templateId, userId, accessToken) {
    const payload = {
      service_id: serviceId,
      template_id: templateId,
      user_id: userId,
      template_params: formData,
      accessToken: accessToken,
    };
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response.ok;
  }
  
  async function readRequestBody(request) {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return await request.json();
    }
    return null;
  }
  
  export default {
    async fetch(request, env, ctx) {
      const origin = request.headers.get("Origin");
      const allowedOrigins = [
        /^http:\/\/127\.0\.0\.1:5502$/               // Thêm link local mới
      ];
      const isAllowed = origin && allowedOrigins.some((pattern) => pattern.test(origin));
  
      let corsHeaders = {};
      if (isAllowed) {
        corsHeaders["Access-Control-Allow-Origin"] = origin;
        corsHeaders["Access-Control-Allow-Methods"] = "POST, OPTIONS";
        corsHeaders["Access-Control-Allow-Headers"] = "Content-Type";
        corsHeaders["Vary"] = "Origin";
      }
  
      if (request.method === "OPTIONS") {
        return createResponse(null, 204, corsHeaders);
      }
  
      if (request.method !== "POST") {
        return createResponse("Method not allowed", 405, corsHeaders);
      }
  
      try {
        const data = await readRequestBody(request);
  
        const formData = {
          from_name: await sanitizeInput(data.from_name),
          to_email: await sanitizeInput(data.to_email),
          phone: await sanitizeInput(data.phone),
          message: await sanitizeInput(data.message),
        };
  
        if (formData.message) {
          formData.message = formData.message.replace(/\n/g, "<br>");
        }
  
        const emailSent = await sendEmail(
          formData,
          env.EMAILJS_SERVICE_ID,
          env.EMAILJS_TEMPLATE_ID,
          env.EMAILJS_USER_ID,
          env.EMAILJS_SECRET_KEY
        );
  
        if (emailSent) {
          return createResponse("Email sent successfully", 200, corsHeaders);
        } else {
          return createResponse("Failed to send email", 500, corsHeaders);
        }
      } catch (error) {
        console.error(error);
        return createResponse("Invalid JSON in request body", 400, corsHeaders);
      }
    },
  };