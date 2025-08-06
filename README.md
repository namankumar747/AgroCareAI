# AgroCareAI : AI-Powered Mobile App for Plant Disease Detection and Grid Mapping

> A Mobile application for detecting plant diseases using images captured via drones and mobile devices. The system leverages AI for disease prediction and provides location-based treatment suggestions.

## 📂 Project Structure

```plaintext
AgroCareAI/
├── backend1/                          # FastAPI backend for core APIs
│   ├── config1.py
│   ├── main.py
│   └── requirements.txt
│
├── backend2/                          # Drone image processing and detection service
│   ├── drone_images/                  # Directory for storing drone-captured images
│   ├── config2.py
│   ├── DriveExtraction.py             # Google Drive integration for image storage
│   ├── main.py                        # FastAPI backend for drone service
│   ├── requirements.txt
│   └── uav_image_detection.py         # ML model-based disease detection logic
│
├── frontend/                          # HTML, JS, CSS-based frontend
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


