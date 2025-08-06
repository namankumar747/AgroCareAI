from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import google.generativeai as genai
from config1 import GOOGLEAPI
import uvicorn

app = FastAPI()

# Configure Gemini
genai.configure(api_key=GOOGLEAPI)
model = genai.GenerativeModel("gemini-1.5-flash")

@app.post("/explain/")
async def explain_disease(request: Request):
    data = await request.json()
    disease = data.get("disease")

    prompt = f"""You are an expert agricultural advisor helping farmers understand and manage crop diseases.
            I will give you the name of a plant disease, and you will provide a detailed, easy-to-understand explanation for farmers.
            Your answer should include:

            1. A brief description of the disease and how it affects the plant.
            2. Visible symptoms farmers should look for.
            3. Causes of the disease (e.g., fungus, bacteria, virus, etc.).
            4. Effective methods to prevent or control the disease, including organic or chemical treatments.
            5. Any additional tips for farmers to protect their crops from this disease in the future.

            Disease name: {disease}
            """

    response = model.generate_content(
        prompt,
        generation_config={
            "temperature": 0.8,
            "max_output_tokens": 500
        }
    )

    return JSONResponse(content={"explanation": response.text})
