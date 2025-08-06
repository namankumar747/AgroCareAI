# AgroCareAI : AI-Powered Mobile App for Plant Disease Detection and Grid Mapping

> A Mobile application for detecting plant diseases using images captured via drones and mobile devices. The system leverages AI for disease prediction and provides location-based treatment suggestions.

## ⚙️ Features

- Capture images using mobile camera and import drone images from a shared drive.
- Store all images securely in cloud storage like Google Drive.
- Preprocess captured images for optimal model performance.
- Use a pretrained deep learning model to detect plant diseases in images.
- Identify and tell the specific plant disease present in the field.
- Assign GPS-based grid locations to each image and detected disease.
- Display a map of the field with highlighted disease-affected grids.
- Provide AI-generated treatment and remedy recommendations using LLMs.

## 🛠️ Tech Stack Used

#### 🖥️ Frontend
- HTML
- CSS
- JavaScript

#### ⚙️ Backend
- FastAPI
- Uvicorn
- python-multipart
- httpx

#### 🧠 Machine Learning & Deep Learning
- TensorFlow==2.10.0
- scikit-learn==1.3.0
- numpy==1.24.3
- pandas==2.1.0
- matplotlib==3.7.2
- seaborn==0.13.0

#### 🖼️ Image Processing
- pillow
- exifread

#### ☁️ Cloud & LLM Integration
- gdown
- google-generativeai

## 📂 Project Structure

```plaintext
AgroCareAI/
├── backend1/                          # Backend Server for LLM model
│   ├── config1.py
│   ├── main.py
│   └── requirements.txt
│
├── backend2/                          # Backend Server for Mobile Image and Drone Images Processing
│   ├── drone_images/                  # Directory for storing drone-captured images from gdrive
│   ├── config2.py
│   ├── DriveExtraction.py             # code for drone images extraction from public google drive
│   ├── main.py                        # FastAPI code
│   ├── requirements.txt
│   └── uav_image_detection.py         # DL model for drone image processing
│
├── frontend/                          # HTML, CSS, JavaScript based frontend
│   ├── index.html
│   ├── CaptureImage.html
│   ├── CaptureImageScript.js
│   ├── DronePanel.html
│   ├── DronePanelScript.js
│   ├── GridMap.html
│   ├── GridMapScript.js
│   └── style.css
│
├── Notebooks/                         # Jupyter notebooks for training and inference
│   ├── requirements.txt  
│   ├── CNN model Notebooks/
│   │   ├── Test_plant_disease.ipynb
│   │   └── Train_plant_disease.ipynb
│   │
│   ├── YOLO + CNN Pipelines Notebook/
│   │   ├── Bounding_Box.ipynb
│   │   └── Predict_Disease_List.ipynb
│   │
│   ├── YOLO Fine Tuned Notebooks/
│   │   └── Training_yolo_uav_model.ipynb
│   │
│   └── YOLO based one shot model Notebooks/
│       └── One_Shot_model.ipynb
│
└── README.md

```
## Getting Started

## 🛠️ Project Setup

Follow the steps below to set up the project on your local machine.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/AgroCareAI.git
cd AgroCareAI
```
### 2. Install Miniconda
Download and install Miniconda3 from the official [Anaconda website](https://www.anaconda.com/download/success).

### 3. Setup Backend 1 (FastAPI + AI-based Recommendation System)
```bash
# Open Anaconda Prompt
conda create --name backend1 python=3.9
conda activate backend1
cd path/to/AgroCareAI/backend1

pip install --upgrade pip
pip install -r requirements.txt

conda deactivate
```
### 4. Setup Backend 2 (GPU-based Disease Detection with YOLO & CNN)
```bash
# Open new Anaconda Prompt
conda create --name backend2 python=3.9
conda activate backend2

conda install -c conda-forge cudatoolkit=11.2 cudnn=8.1.0
cd path/to/AgroCareAI/backend2

pip install --upgrade pip
pip install -r requirements.txt

conda deactivate
```
### 5. Train and Save Pretrained Models
Run the Jupyter Notebooks provided in the repository to:
- Train and save the YOLO models for object detection.
- Train and save the CNN model for plant disease classification.


## 🚀 Starting the Project
### Step 1: Add your Google Generative AI API key to `backend1/config1.py`
```python
# backend1/config1.py
GOOGLEAPI = "YOUR_API_KEY"
```
### Step 2: Add the public Google Drive link to `backend2/config2.py`
```python
# config2.py
DRIVEFOLDER = "YOUR_PUBLIC_GOOGLE_DRIVE_URL"
```
### Step 3: Add path to pretrained CNN model in `backend2/main.py`

```python
# backend2/main.py
cnn = tf.keras.models.load_model('/path/to/trained_plant_disease_model.keras')  # Replace with actual path
```
### Step 4: Add path to YOLO model in `backend2/uav_image_detection.py`

```python
# backend2/uav_image_detection.py
model = YOLO("/path/to/runs/detect/soyabean_disease_detector6/weights/best.pt")  # Replace with actual path
```
### Step 5: Start Backend 1
```bash
# Open Anaconda Prompt
conda activate backend1
cd path/to/AgroCareAI/backend1

uvicorn main:app --reload --port 9000
```
### Step 6: Start Backend 2
```bash
# Open another Anaconda Prompt
conda activate backend2
cd path/to/AgroCareAI/backend2

uvicorn main:app --reload
```
### Step 7: Launch Frontend
Open the [index.html]() file using Live Server (in VS Code or any compatible IDE).

## ✅ Notes
- Ensure all dependencies are correctly installed as per requirements.txt files in both backend folders.
- GPU support is essential for backend2 to work efficiently.
- Make sure that all models (CNN and YOLO) are properly trained on their respective datasets before deployment.
