const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(bookingForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const checkin = formData.get("checkin");
    const checkout = formData.get("checkout");
    const message = formData.get("message") || "";

    const contactEmail = "contact@votre-mail.com"; // Remplacez par votre email
    const subject = encodeURIComponent("Demande de réservation - Eyragues");
    const body = encodeURIComponent(
      `Nom : ${name}\nEmail : ${email}\nArrivée : ${checkin}\nDépart : ${checkout}\nMessage : ${message}`
    );

    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
