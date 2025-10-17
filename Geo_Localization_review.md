# **MUST know of Geo-localization research**
This document is a concise introduction of foundamental knowledge kind of 'How to start the research of Geo-localization'. Mainly based on the following review paper:
* [Game4Loc: A UAV Geo-Localization Benchmark from Game Data](https://arxiv.org/abs/2409.16925)
* [Exploring the best way for UAV visual localization under Low-altitude Multi-view Observation Condition: a Benchmark](http://arxiv.org/abs/2503.10692)


# **Priliminary approaches for image registration**

Geo-localization for UAV is to establish geometric relationships between UAV images and geo-tagged reference maps,  outputing the absolute position online.

## **what is image registration in UAV Geo-localization?**
To make sure every pixel in the UAV image corresponds to the correct latitude and longitude on the reference map. Essentially the process is to align an image taken by a drone (UAV) with a real-world map that has GPS coordinates (geotagged reference map). 

There are two mathematical models: the Homography model or the sRt model to estimate the geometric transformation needed to accurately overlay the UAV image onto the reference map.

## **Homography Model (Projective Transformation)**
**What it is?**  
Homography is a 3×3 matrix that represents a general projective transformation. It is the most flexible transformation model.

**What is the assumption in this model?**  
It assumes the scene being photographed is flat (planar), or that the UAV is flying directly above the plane.

**When use it:**   
It accounts for complex geometric distortions like perspective (e.g., parallel lines appearing to converge) and changes in scale, rotation, and translation. If the drone is viewing the scene from an angle, Homography is often required for an accurate fit.

**Drawback:**   
It requires a minimum of four corresponding points (known as Ground Control Points or tie points) between the UAV image and the map.

## **sRt Model (Similarity Transformation)**
**What it is:**   
The "sRt" model stands for scale (s), rotation (R), and translation (t). It is a simpler, less flexible transformation.

**What it means:**  
It assumes that the scene is effectively orthorectified (no perspective distortion) or that the drone is flying straight down (nadir view) and that the terrain is relatively flat.

**Why use it:** 
It only accounts for uniform scaling, rotation, and shifting (translation). It is computationally simpler and requires a minimum of only two corresponding points. It's often sufficient for a quick, approximate alignment when perspective is negligible.

**Drawback:** 
It cannot correct for perspective distortion or complex viewing angles. If the terrain is hilly or the drone image has strong perspective, the sRt model will produce inaccurate results.


## **Limitations for these two models**
  * They all assume the observed regions by UAV are planar, which is not acceptable under Low attitude (less than 300m) and multi-view(pitch angles varies between 20deg-90deg)
  * The significant viewpoint changes at low altitude will introduce severe nonlinear ransformation beween uav images and reference maps, which make geo-localization difficult.

# **Approaches for matching uav view with referenc images with geotag**
## **Image level retrieval**
### **General concepts**
Need to construct feature patterns to measure similarity between drone and regerence images.
General pipline is :
* Database preparation------feature extraction
  Extract a global feature vector for every image in database. Deep Convlutional Neural Networks(CNNs like ResNet or VGG) to produce a robust, compact high-dimensional vector that respresents the content in image.
  This step can be viewed as creating a 'fingerprint' that is invariant to common image transformations, such as JPEG compression, slight color changes.  
  **Open source library**: [ResNet50 v1 model](https://arxiv.org/abs/1512.03385).    [VGGs in TensorFlow](https://github.com/deep-diver/VGG)
* Database preparation------Indexing and Storage
  All extracted feature vectors are packed into a specialized data structure. This is vital step to achieve efficient search for the nearest neighbors.  
  **Open source library** [Annoy](https://github.com/spotify/annoy?tab=readme-ov-file) is a kind f Approximate Nearest Neighbor (ANN) algorithm. It is for searching points in space that close to a given query point.

* Online retrieval------query feature extraction
  The uav image is processed through the same CNN model to generate its feature vector
* Online retrieval------candidate retrieval( initial search)  
  The uav images feature vector is compared against the indexed feature vectors using a similartity metric(like Cosine similarity or eucidean distance).  The ANN index returns a ranked list of top K candiate images.
* Online retrieval------geometric verification
  Local features like SIFT or SURF are detected and matched between uav image and each of the top K candidate images. A robust estimation algorithm like RANSAC is used to fit a geometric model---either a Homography or sRt model to match the local features.

  **Note** 
  * SIFT and SURF are local feature descriptors. They can detect and secribes local image features that are invariant to changes in scale, rotation and illumination.  SURF can run with faster speed than SIFT.
  * An Inlier Match is defined by a successful pair of SIFT feature points: One SIFT feature point from the UAV image (the query image), and one SIFT feature point from the image library (the reference image).
    This confirmed match proves two critical things:
    * Visual Similarity: The two SIFT descriptors are mathematically very close.
    * Geometric Consistency: The positional relationship between these two points adheres to a single, consistent geometric transformation (such as a change in viewpoint from the UAV). This confirms that they are projections of the same physical scene point.
* Online rerieval------final result ranking
  Images that pass the geometric verification(those with enough 'inlier' matches) are considered true near-duplicate.  Present the confirmed and highly accurate results.

### **Two category methods discussed here**

When using image level retrieval for geo-localization, that is estimate position of a uav image on a reference map. Two main methods are Template Matching and Visual Geo-localization based on deep learning.
Both rely on constructing feature patterns to measure the similarity between the UAV image (Query) and the reference map images (Gallery).
* Template matching
  It is tranditional way that calculates similarity by sliding a template block across the image.  This method is not robust to viewpoint changes.
* Visual geo-localization based on deep learning
  More flexible and better able to adapt to viewpoint changes. It learns robust feature representations through training. NetVLAD is a CNN architecture used in geo-localization.

  The research with this method focus on 'Refining Network Architectures' and 'Enhancing Training and Sampling Strategies'.

## **Pixel-Level Image Matching**

Pixel-Level Image Matching and Image-Level Retrieval (ILR) are two distinct approaches for vision-based geo-localization, primarily differentiated by their **precision, speed, and method of feature comparison.**


### **Comparison of Pixel-Level Matching and Image-Level Retrieval**

| Feature | Pixel-Level Image Matching | Image-Level Retrieval (ILR) |
| :--- | :--- | :--- |
| **Primary Goal** | **Precise 6-DOF Localization (High Accuracy).** Determine the UAV's exact position and orientation. | **Rough Position Estimation (High Speed).** Quickly narrow down the search area in a large database. |
| **Matching Scope** | **Local, Fine-Grained.** Compares features/pixels to establish **point-to-point correspondences**. | **Global, Coarse-Grained.** Compares **entire image embeddings** (visual fingerprints). |
| **Output** | A set of verified 2D-to-3D correspondences used to solve the **PnP problem**. | A ranked list of visually similar reference images (potential map regions). |
| **Relative Precision** | **Always Achieves Higher Precision.** Due to explicit point-to-point geometric modeling. | Lower precision than Pixel-Level Matching. |
| **Typical Speed** | Slower (especially dense methods) due to local feature extraction and RANSAC/PnP. | Faster (especially the initial search) due to efficient ANN indexing. |
| **Technology** | Sparse (SIFT, SuperGlue) or Dense (Direct image comparison) matching. | Deep learning-based embeddings (NetVLAD) + Geometric Verification. |

**Note** Image-Level Retrieval often acts as a fast filter to narrow the search space, while Pixel-Level Matching is the highly precise stage that converts the visual match into a numerical location.


### **How to conduct Pixel-Level Image Matching**

The goal of Pixel-Level Image Matching is to establish enough accurate 2D-to-3D correspondences between the UAV image and the 3D reference map/model to precisely locate the camera (UAV).

The **sparse matching** approache is as follows:

#### **1. Feature Detection and Description**
* **Action:** Apply a **keypoint detector** (e.g., traditional SIFT/SURF or learning-based detectors) to the UAV image. At the same locations, a corresponding **descriptor** (feature vector) is computed.
* **Challenge:** Traditional detectors are sensitive to large viewpoint differences, which is why learning-based approaches are now mainstream.

#### **2. Feature Matching (Correspondence Establishment)**
* **Action:** The descriptor from each keypoint in the UAV image is compared to the descriptors of known keypoints in the reference map/model.
* **Goal:** Find a set of **putative (potential) 2D-to-3D matches**. This step may use simple ratio tests or, for more robust results, deep learning-based methods like **SuperGlue** or **LightGlue** to model the global relationship among keypoints.

#### **3. Geometric Verification and Outlier Rejection**
* **Action:** A robust estimation technique (often **RANSAC**) is applied to the putative matches to enforce geometric consistency.
* **Output:** The result is a set of high-confidence **inlier 2D-to-3D correspondences** where the 2D point is the feature location in the UAV image, and the 3D point is the corresponding world coordinate from the map/model.

#### **4. Pose Estimation (PnP Problem)**
* **Action:** The confirmed inlier correspondences are fed into the **Perspective-n-Point (PnP) algorithm**.
* **PnP Solution:** The PnP algorithm mathematically determines the **6-Degree-of-Freedom (6-DOF) pose** of the UAV camera (3 position coordinates: $X, Y, Z$, and 3 orientation angles: roll, pitch, yaw) that best aligns the 2D image points with the 3D world points.Concise Three-Step Pose Estimation stemps are given:
  * **Robust Filtering (RANSAC):** The **RANSAC (Random Sample Consensus)** framework is used to reject mismatched points (**outliers**); 
  * **Initial Pose Calculation (PnP):** Inside the RANSAC loop, an efficient **PnP solver** (such as **EPnP**) is used to quickly calculate the initial rotation ($R$) and translation ($t$) of the camera. 
2.  **High-Precision Refinement (LM Optimization):** Finally, all the **inliers** confirmed by RANSAC are fed into a **nonlinear optimization algorithm** like **Levenberg-Marquardt (LM)**. LM minimizes the reprojection error by iteratively adjusting the initial pose, ultimately yielding the **highest accuracy** 6-DOF pose.

    **Conclusion:** The process flows from **RANSAC** ensuring data reliability, to a **PnP solver** providing the initial guess, and finally to **LM optimization** for the ultimate precision.

**Note**  
  * **Dense Approaches**: Dense methods skip steps 1 and 2, directly finding dense correspondences across the entire image, but cost more computational resources.
  * **PnP Problem**: determine the 3D position and orientation (pose) of a camera from a set of n 3D points in the world and their corresponding 2D projections in the image plane. 

# **How to get database for research and practical implements**

## **Opensource dataset**
* [Game4Loc Project](https://github.com/Yux1angJi/GTA-UAV)
Game4Loc is a UAV Geo-Localization benchmark from Game Data(GTA), which includes a large-range contiguous area UAV geo-localization dataset named GTA-UAV, featuring multiple flight altitudes, attitudes, scenes, and targets using modern computer games. 


## **Build own dataset**

Building a robust dataset for UAV Autonomous Visual Localization (AVL) requires a meticulous, dual-track pipeline to ensure high-quality ground truth and diverse visual conditions.

---

### **Step 1: UAV Image Acquisition (Query/Ground Truth)**
Collect UAV images and ground truth data.  
1.  Collect a large volume of images from camera mounted on UAV
    Try to vary the flight altitude and atitude;  collect data in different environments, such as multiple scenes, weather, illumination, and seasons.

2.  Use RTK GPS to record UAV positon for each image. 
    Meanwhile, intrinsic and extrinsic parameters of the camera are needed.
---

### **Step 2: Reference Map Generation (Gallery Data)**

This track creates geo-referenced map data that serves as the visual reference against which the UAV images will be matched.

#### **Option-1: High-Resolution Map** 
   * 2D orthophoto + 3D DSM  
    DJI Terra software can generate 2D orthphto from images capurted by UAV camera;
    It also can output 3D DSM (Digital surface model) representing the surface of the earth, including the height of objects on it.
    
#### **Option-2: Low-Resolution/Historical Map**  
   * Satellite imagery + public DSM


     * **Satallite imagery:**  Use Google Earch Engine.

     * **public DSM**:  [ALOS DSM 30m](https://portal.opentopography.org/raster?opentopoID=OTALOS.112016.4326.2) 
      The ALOS Global Digital Surface Model (AW3D30) is a global dataset generated from images collected using the Panchromatic Remote-sensing Instrument for Stereo Mapping (PRISM) aboard the Advanced Land Observing Satellite (ALOS) from 2006 to 2011.  This dataset is included in [Google Earth Engine](https://developers.google.com/earth-engine/datasets/tags/alos).  
      
        The dataset is published based on the DSM dataset (5-meter mesh version) of the "World 3D Topographic Data", which is the most precise global-scale elevation data at this time, and its elevation precision is also at a world-leading level as a 30-meter mesh version.  The 5-meter mesh version is not publicly distributed.

     * **public DSM:** [NASADEM 30m](https://developers.google.com/earth-engine/datasets/catalog/NASA_NASADEM_HGT_001)  
      It is a public dataset provided by NASA / USGS / JPL-Caltech.

  **Note:**  
      * [QGIS](https://qgis.org/) is an open-source tool. It provides an intuitive interface for creating, editing, visualizing, analyzing, and publishing geospatial information.  
      * [Google Earth Engine](https://earthengine.google.com/) can provide the data sources, while QGIS handles the high-precision, professional-grade geometric processing and data integration required to merge the two independent 2D and 3D resources into a usable 2.5D reference dataset.





