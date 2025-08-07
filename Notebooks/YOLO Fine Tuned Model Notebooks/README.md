The annotated dataset was created using the Roboflow website on a real UAV image dataset, and exported in **YOLOv8 format** for training.

🔗 **Download Real UAV Dataset**: [Click here to download](https://data.mendeley.com/datasets/hkbgh5s3b7/1)

Annotated Dataset Directory Structure:
```planetext
uav_leaf_yolo_dataset/
├── train/
│ ├── images/
│ └── labels/
├── valid/
│ ├── images/
│ └── labels/
├── test/
│ ├── images/
│ └── labels/
├── data.yaml
```
```yaml
# data.yaml - Generalized YOLOv8 dataset configuration

# Paths to image folders
train: <path_to_dataset>/train/images
val: <path_to_dataset>/valid/images
test: <path_to_dataset>/test/images

# Number of classes
nc: <number_of_classes>

# Class names (use consistent indexing starting from 0)
names:
  0: <class_name_0>
  1: <class_name_1>
  2: <class_name_2>
  ...
  n: <class_name_n>
```
