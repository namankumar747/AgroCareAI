from ultralytics import YOLO
import os

# Load the trained YOLOv8 model once
model = YOLO("/path/to/runs/detect/soyabean_disease_detector6/weights/best.pt")

def detect_diseases_in_image(image_path, conf_threshold=0.1):
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found: {image_path}")

    # Run inference
    results = model(image_path, conf=conf_threshold, save=False)

    # Process results
    detected_diseases = []
    boxes = results[0].boxes

    if boxes is None or len(boxes) == 0:
        print("⚠️ No diseases detected.")
        return detected_diseases

    for box in boxes:
        cls_id = int(box.cls)
        conf = float(box.conf)
        label = model.names[cls_id]
        if label == "Healthy_Soyabean":
            continue
        detected_diseases.append(label)

    return detected_diseases