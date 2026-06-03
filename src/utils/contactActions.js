function encode(value = "") {
  return encodeURIComponent(value.trim());
}

export function getEmailHref(email = "") {
  const cleanEmail = email.trim();
  return cleanEmail ? `mailto:${cleanEmail}` : "";
}

export function sendContactEmail(event, recipientEmail, portfolioName = "Portfolio") {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = new FormData(form);
  const senderName = formData.get("name")?.toString() || "";
  const senderEmail = formData.get("email")?.toString() || "";
  const message = formData.get("message")?.toString() || "";
  const email = recipientEmail?.trim();

  if (!email) {
    return false;
  }

  const body = [
    senderName ? `Name: ${senderName}` : "",
    senderEmail ? `Email: ${senderEmail}` : "",
    "",
    message,
  ].filter((line, index) => line || index === 2).join("\n");

  window.location.href = `mailto:${email}?subject=${encode(`Message from ${portfolioName}`)}&body=${encode(body)}`;
  form.reset();
  return true;
}

export function getContactFormData(form) {
  const formData = new FormData(form);

  return {
    name: formData.get("name")?.toString().trim() || "",
    email: formData.get("email")?.toString().trim() || "",
    message: formData.get("message")?.toString().trim() || "",
  };
}
