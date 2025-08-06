//Giving Error
async function analyseGDriveImages() {
  try {
    const response = await fetch("http://localhost:8000/analyse-gdrive/", { method: "POST",});

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.text();  // Since FastAPI returns a string
    console.log("Analysis result:", result);
    alert("Analysis completed: " + result);
  } catch (error) {
    console.error("Error during GDrive analysis:", error);
    alert("Error during analysis: " + error.message);
  }
}