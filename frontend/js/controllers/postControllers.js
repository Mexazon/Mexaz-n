async function createDish(newDish) {
  try {
    const response = await fetch("http://localhost:8080/api/dishes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newDish)
    });

    if (!response.ok) {
      // Si el backend devuelve un error, lo procesamos
      const errorData = await response.json();
      throw new Error(`${errorData.error}: ${errorData.message}`);
    }

    const createdDish = await response.json();
    console.log("Dish created successfully:", createdDish);
    return createdDish;

  } catch (error) {
    console.error("Error creating dish:", error.message);
    alert("Error: " + error.message);
  }
}