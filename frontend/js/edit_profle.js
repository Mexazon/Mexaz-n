const profilePhotoInput = document.getElementById("profilePhoto");
const photoPreview = document.getElementById("profilePhotoPreview");

profilePhotoInput?.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.src = e.target.result;
      photoPreview.classList.remove("d-none");
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById("editProfileForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("profileName").value.trim();
  const description = document.getElementById("profileDescription").value.trim();

  // Simulación: mostrar en consola los datos editados
  console.log({
    name,
    description,
    photo: photoPreview.src || "Sin cambio"
  });

  // Cierra el modal
  const modal = bootstrap.Modal.getInstance(document.getElementById("editProfileModal"));
  modal.hide();

});



