# AgroCareAI : AI-Powered Mobile App for Plant Disease Detection and Grid Mapping

> A Mobile application for detecting plant diseases using images captured via drones and mobile devices. The system leverages AI for disease prediction and provides location-based treatment suggestions.

## Project Structure

AgroCareAI/
├── backend1/                     # FastAPI backend for core APIs
│   ├── config1.py
│   ├── main.py
│   └── requirements.txt
│
├── backend2/                     # Drone image processing and detection service
│   ├── drone_images/             # Directory for storing drone-captured images
│   ├── config2.py
│   ├── DriveExtraction.py        # Google Drive integration for image storage
│   ├── main.py                   # FastAPI backend for drone service
│   ├── requirements.txt
│   └── uav_image_detection.py    # ML model-based disease detection logic
│
├── frontend/                     # HTML, JS, CSS-based frontend
│   ├── index.html
│   ├── CaptureImage.html
│   ├── CaptureImageScript.js
│   ├── DronePanel.html
│   ├── DronePanelScript.js
│   ├── GridMap.html
│   ├── GridMapScript.js
│   └── style.css
│
└── README.md

<pre> AgroCareAI/ ├── <b>backend1/</b> # FastAPI backend for core APIs │ ├── config1.py │ ├── main.py │ └── requirements.txt │ ├── <b>backend2/</b> # Drone image handling + disease detection │ ├── drone_images/ # Folder for storing drone images │ ├── config2.py │ ├── DriveExtraction.py # Upload/download from Google Drive │ ├── main.py # FastAPI entry point │ ├── requirements.txt │ └── uav_image_detection.py # UAV image disease detection logic │ ├── <b>frontend/</b> # Frontend UI (HTML + JS + CSS) │ ├── index.html │ ├── CaptureImage.html │ ├── CaptureImageScript.js │ ├── DronePanel.html │ ├── DronePanelScript.js │ ├── GridMap.html │ ├── GridMapScript.js │ └── style.css │ ├── LICENSE └── README.md </pre>
