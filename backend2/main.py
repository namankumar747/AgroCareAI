from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import numpy as np
import tensorflow as tf
import io
import os
from PIL import Image
import httpx
from config2 import DRIVEFOLDER
from DriveExtraction import download_images_from_drive, get_image_location
from uav_image_detection import detect_diseases_in_image

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
cnn = tf.keras.models.load_model('"/path/to/trained_plant_disease_model.keras"')

# Class names from the trained model
class_name = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy', 'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy',
    'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight',
    'Potato___Late_blight', 'Potato___healthy', 'Raspberry___healthy', 'Soybean___healthy',
    'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Strawberry___healthy',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight',
    'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 'Tomato___healthy'
]

# Global output list
analysis_array = []

async def LLM_disease_response(disease_name: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://127.0.0.1:9000/explain/",
                json={"disease": disease_name},
                timeout=15.0
            )
            if response.status_code == 200:
                return response.json().get("explanation", "No explanation returned.")
            else:
                return f"Error: Gemini API returned status {response.status_code}"
    except Exception as e:
        return f"Error contacting Gemini server: {str(e)}"

#For Camera Mode
@app.post("/predict-disease/")
async def predict_disease(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".jpg"):
        raise HTTPException(status_code=400, detail="Only .jpg images are allowed.")

    try:
        # Read image bytes and convert to PIL Image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        image = image.resize((128, 128))

        # Convert image to array
        input_arr = tf.keras.preprocessing.image.img_to_array(image)
        input_arr = np.expand_dims(input_arr, axis=0)  # shape: (1, 128, 128, 3)

        # Predict
        predictions = cnn.predict(input_arr)
        result_index = np.argmax(predictions)
        model_prediction = class_name[result_index]
        description = await LLM_disease_response(model_prediction)

        return {
            "model_prediction" : model_prediction,
            "description" : description
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

#@app.post("/analyse-gdrive/")
def download_process_predict():
    folder_url = DRIVEFOLDER
    output_dir = "drone_images"
    print("\nDownloading from Google Drive......\n")
    #Downloading Images from drive
    #download_images_from_drive(folder_url, output_dir)

    print("\nProcessing images...\n")
    # Step 2: Process each image
    for filename in os.listdir(output_dir):
        if filename.lower().endswith((".jpg", ".jpeg", ".png")):
            image_path = os.path.join(output_dir, filename)

            #extracting EXIF location
            location = get_image_location(image_path)

            try:
                prediction_label = detect_diseases_in_image(image_path)  # return UAV image disease

                # Only append if location is valid
                if location and "latitude" in location and "longitude" in location:
                    analysis_array.append({
                        "lat": location["latitude"],
                        "lon": location["longitude"],
                        "disease": prediction_label
                    })
            except Exception as e:
                print(f"{filename} -> Error in prediction: {e}")

download_process_predict()

@app.get("/analysis/")
def get_analysis():
    return analysis_array