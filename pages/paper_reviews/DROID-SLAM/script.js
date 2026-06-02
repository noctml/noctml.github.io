(() => {
  const root = document.documentElement;

  const storageGet = (key) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const storageSet = (key, value) => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Storage can be unavailable for local files in some browser modes.
    }
  };

  const year = document.getElementById("year");
  const updated = document.getElementById("updated");
  if (year) year.textContent = new Date().getFullYear();
  if (updated) updated.textContent = new Date().toISOString().slice(0, 10);

  const themeBtn = document.getElementById("themeBtn");
  const themeIcon = document.getElementById("themeIcon");
  const themes = ["light", "dark-gray", "dark"];
  const themeLabels = {
    light: "Light",
    "dark-gray": "Dark gray",
    dark: "Dark"
  };
  const themeIcons = {
    light: "☀",
    "dark-gray": "◐",
    dark: "☾"
  };

  const saved = storageGet("theme");
  let currentTheme = themes.includes(saved) ? saved : "light";

  const applyTheme = (theme, persist = true) => {
    currentTheme = themes.includes(theme) ? theme : "light";
    if (currentTheme === "light") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", currentTheme);
    }

    if (persist) storageSet("theme", currentTheme);
    if (themeIcon) themeIcon.textContent = themeIcons[currentTheme];
    if (themeBtn) {
      const label = `${themeLabels[currentTheme]} theme`;
      themeBtn.setAttribute("aria-label", label);
      themeBtn.setAttribute("title", label);
    }
  };

  applyTheme(currentTheme, false);

  themeBtn?.addEventListener("click", () => {
    const nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
    applyTheme(themes[nextIndex]);
  });
})();

(() => {
  const root = document.documentElement;
  const langBtn = document.getElementById("langBtn");

  const storageGet = (key) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const storageSet = (key, value) => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Storage can be unavailable for local files in some browser modes.
    }
  };

  const languages = ["ko", "en"];
  const richTranslations = [
    [".paper-map-head > p", "DROID-SLAM is a deep visual SLAM system that passes flow revisions predicted by an update operator into a Dense Bundle Adjustment (DBA) layer, then jointly and repeatedly updates camera pose and pixelwise inverse depth."],
    [".map-card-wide p", "<strong>The network does not replace SLAM</strong>; it ties learned correspondence updates and <strong>geometric Bundle Adjustment into one recurrent loop</strong> that repeatedly improves pose-depth estimation."],
    [".paper-map .map-card:nth-of-type(2) p", "Jointly and repeatedly updates camera poses and inverse depths over a frame graph with an arbitrary number of frames."],
    [".paper-map .map-card:nth-of-type(3) p", "Turns flow revisions and confidence into a reprojection objective, then performs Gauss-Newton pose-depth updates."],
    [".paper-map .map-card:nth-of-type(4) p", "Builds the system with asynchronous frontend local BA and backend global BA / loop closure threads."],
    [".paper-map .map-card:nth-of-type(5) p", "Uses one model trained on monocular synthetic video for stereo and RGB-D inputs without retraining."],
    [".paper-map > .insight-box p", "The key idea in DROID-SLAM is not that deep learning removes geometry, but that <strong>geometric optimization becomes an internal operation of the recurrent network</strong>. This is why a model trained with monocular video can naturally accept extra stereo/RGB-D constraints inside the test-time optimization objective."],
    [".compare-grid article:nth-child(1) p", "Scale is ambiguous, but recurrent updates and DBA jointly estimate pose and depth."],
    [".compare-grid article:nth-child(2) p", "Stereo correspondences can strengthen depth and scale constraints without retraining."],
    [".compare-grid article:nth-child(3) p", "Depth measurements are added as test-time observation constraints to improve robustness and accuracy."],
    [".paper-map > .section-note p", "When reading DROID-SLAM, first track <strong>which variables the DBA layer updates</strong> (pose and depth) and <strong>which observations it fits them to</strong> (flow/correspondence). That makes the architecture much easier to parse than starting from the network diagram alone."],
    [".deep-dive-note", "From here, the detailed notes preserve as much of the paper content as possible. Background knowledge, notation, and supplementary material that interrupt the core reading flow are folded away."],
    ["[id=\"2d0f65f1-13f4-8028-aa6f-f85e802b222a\"]", "DROID-SLAM is a deep-learning-based SLAM system that repeatedly updates camera pose and pixelwise depth through a Dense Bundle Adjustment layer. It achieves a large accuracy improvement over prior methods, is robust enough to reduce catastrophic failures, and improves further when stereo or RGB-D video is provided at test time, even though the model is trained with monocular video."],
    ["[id=\"2d0f65f1-13f4-80e4-892b-f8f9edd422e5\"]", "SLAM is a special form of Structure-from-Motion (SfM) focused on long-term trajectory tracking, and it plays an important role in robotics, especially autonomous driving. DROID-SLAM addresses visual SLAM, where the usual camera sensors are monocular, stereo, and RGB-D cameras."],
    ["[id=\"2d6f65f1-13f4-800a-a4c3-e2422db297d6\"]", "The SLAM problem has been approached from many directions. Early methods used probabilistic and filtering-based approaches, alternating between map optimization and camera-pose optimization."],
    ["[id=\"2d6f65f1-13f4-80a5-a44f-e7408cffc49d\"]", "Modern SLAM methods are often formulated as least-squares optimization problems. A central source of accuracy is full BA, which jointly optimizes camera poses and the 3D map in one optimization problem. Optimization-based SLAM is also easy to adapt to different sensors; for example, RGB-D or stereo information can be added as extra constraints in the objective."],
    ["[id=\"2d6f65f1-13f4-8064-be85-eea738b4aeb1\"]", "Deep learning has offered ways to address common failure modes. Prior work replaced hand-crafted features with learned 3D representations, or combined learned energy terms with classical optimization backends. These systems were sometimes more robust, but on standard benchmarks they often did not surpass classical SLAM."],
    ["[id=\"2d6f65f1-13f4-80cb-9678-eca11f465d38\"]", "This paper introduces DROID-SLAM, a deep-learning-based SLAM system that achieves state-of-the-art performance with a large margin over both classical and learning-based systems on challenging benchmarks."],
    [".summary-panel[aria-labelledby='contribution-detail-title'] .summary-head p", "The Introduction's claims become clearer when they are separated into accuracy, failure rate, and generalization."],
    ["[id=\"2d6f65f1-13f4-8002-9e62-e48dd249ee27\"]", "DROID-SLAM's strong performance and generalization come from DROID, short for Differentiable Recurrent Optimization-Inspired Design. It is a differentiable end-to-end architecture that combines the benefits of classical approaches and deep networks. It follows a recurrent iterative update structure inspired by RAFT, but introduces two key ideas."],
    [".summary-panel[aria-labelledby='raft-droid-map-title'] .summary-head p", "The important point is not merely that DROID-SLAM borrows a RAFT-like structure; the update target changes from optical flow to the <span class=\"keyterm\">SLAM state</span>."],
    ["[id=\"2d6f65f1-13f4-802d-9e42-d7f3bd666f03\"]", "First, unlike RAFT, which repeatedly updates optical flow, DROID updates camera pose and depth. RAFT operates on two frames, whereas DROID can be applied to an arbitrary number of frames, enabling joint global refinement of all poses and depth maps. This is essential for reducing drift in long trajectories and loop closure."],
    ["[id=\"2d6f65f1-13f4-80f6-94be-fc0639c5a108\"]", "Second, each DROID-SLAM update of camera pose and depth map is performed by a differentiable DBA layer. The layer runs Gauss-Newton updates so that the current pose and per-pixel depth match the current optical-flow estimate as closely as possible. Because DBA respects geometric constraints, it improves accuracy and robustness and lets a monocular system handle stereo or RGB-D input without retraining."],
    ["[id=\"2d6f65f1-13f4-8020-9bf2-d7aa4f68f045\"]", "DROID-SLAM's architecture is novel. Similar earlier deep architectures include DeepV2D and BA-Net, but both focus on depth estimation and show limited results."],
    ["[id=\"2d6f65f1-13f4-8083-809c-cbe7bf770480\"]", "DeepV2D alternates between depth updates and camera-pose updates rather than directly performing bundle adjustment. BA-Net includes a bundle-adjustment layer, but it is not dense: it optimizes only a small number of coefficients that linearly combine pre-predicted depth-basis maps. DROID-SLAM's DBA layer is not limited by such a depth basis and directly optimizes every pixel's depth."],
    ["[id=\"2d7f65f1-13f4-805e-a655-e4e720ce0ba3\"]", "The paper performs extensive evaluation across four datasets and three sensor modalities, showing state-of-the-art-level performance in all cases. It also includes ablation studies explaining important design choices and hyperparameters."],
    ["[id=\"2d7f65f1-13f4-803a-925f-e85590c3f58e\"]", "Modern SLAM systems are treated as joint optimization problems that optimize localization and mapping at the same time. Visual SLAM focuses on monocular, stereo, and RGB-D image observations and is usually divided into direct and indirect approaches."],
    ["[id=\"2d7f65f1-13f4-8027-ba5a-e62c1aa62fa0\"]", "Indirect methods first transform images into intermediate representations, detect features, attach feature descriptors, and match features across images. They then optimize camera poses and a 3D point cloud by minimizing reprojection error between projected 3D points and their observed image locations."],
    ["[id=\"2d7f65f1-13f4-80af-8eb6-e81ecb6b74f8\"]", "Direct methods model the image-formation process and define an objective that minimizes photometric error. Compared with indirect methods, they can use more image information, such as lines and intensity changes, but the resulting optimization is difficult and sensitive to geometric distortions such as rolling shutter. They also need careful optimization strategies, such as coarse-to-fine image pyramids, to avoid local minima."],
    ["[id=\"2d7f65f1-13f4-80a2-aa0a-f3dc9f91e4e9\"]", "The proposed method does not belong cleanly to either the direct or indirect family. Like direct methods, it uses the full image and therefore richer information than sparse features. Like indirect methods, it minimizes reprojection error, which makes optimization possible without complex image-pyramid representations."],
    ["[id=\"2d7f65f1-13f4-8081-ae3e-e5f7e9070882\"]", "This approach therefore combines the smoother objective of indirect methods with the high modeling capacity of direct methods."],
    ["[id=\"2d7f65f1-13f4-8035-924b-eb335ae11d3a\"]", "→ This is the original text from the paper, but near the end I suspect it should say <code>capacity of direct approaches</code>, not <code>capacity of indirect approaches</code>."],
    ["[id=\"2d7f65f1-13f4-8004-bdf5-d45355d59ae1\"]", "Recently, many works have applied deep learning to SLAM systems. Prior work has focused on learning specific SLAM subproblems such as feature detection, feature matching, outlier rejection, and localization."],
    ["[id=\"2d7f65f1-13f4-800d-942d-c2b9278957a7\"]", "For example, SuperGlue performs feature matching and verification, making two-view pose estimation more robust. The network proposed in this paper is inspired by Dusmanu et al., who integrated neural networks into an SfM pipeline to improve keypoint-localization accuracy."],
    ["[id=\"2d7f65f1-13f4-805b-bd02-c67443731f2d\"]", "Some works have attempted end-to-end learning for SLAM, but most focus on small reconstructions with only 2 to 12 frames rather than full SLAM systems. They lack core modern SLAM capabilities such as loop closure and global bundle adjustment, which are necessary for the large-scale reconstruction handled by DROID-SLAM."],
    ["[id=\"2d7f65f1-13f4-8084-bf65-e5fcc1ddb1e3\"]", "∇SLAM implements a classical SLAM algorithm as a differentiable computation graph, allowing reconstruction errors to backpropagate to sensor measurements. However, because it has no trainable parameters, its accuracy depends on the classical algorithm it imitates."],
    ["[id=\"2d7f65f1-13f4-80ba-bb71-dff2a9fc7c89\"]", "DeepFactors, built on CodeSLAM, is one of the most complete deep SLAM systems. It jointly optimizes pose and depth variables and supports short- and long-range loop closure. However, like BA-Net, it optimizes parameters of a learned depth basis during inference, whereas DROID-SLAM directly optimizes dense per-pixel depth without relying on a learned basis."],
    ["[id=\"2d7f65f1-13f4-808f-a754-ce9817d870e2\"]", "DROID-SLAM takes a video as input and aims to estimate the camera trajectory and build a 3D map of the surrounding environment. It first explains the monocular setting, then explains in Section 3.4 how the same system generalizes to stereo and RGB-D systems."],
    ["[id=\"2d7f65f1-13f4-802b-aeec-fe1fea330610\"]", "Features are extracted from each new image and added to the system. The key components in this stage come from <strong>RAFT</strong>."],
    ["[id=\"2d7f65f1-13f4-800f-9c83-f2ef3ecbfa5c\"]", "Each input image is processed by a feature-extraction network composed of six residual blocks and three downsampling layers, producing a dense feature map at 1/8 of the input resolution. As in RAFT, DROID-SLAM uses two separate networks: a feature network for the correlation volume and a context network for the update operator."],
    ["[id=\"2d7f65f1-13f4-80be-9f8a-d733254d779a\"]", "Then, average pooling is applied to the last two dimensions of this 4D correlation volume to form a 4-level correlation pyramid."],
    ["[id=\"2d7f65f1-13f4-803f-b11d-c4ece2c72288\"]", "The lookup operator takes an H×W coordinate grid and retrieves values from the correlation volume using bilinear interpolation. It is applied to the correlation volume at each pyramid level, and the level-wise outputs are concatenated into the final feature."],
    ["[id=\"2d7f65f1-13f4-805c-8c79-ecc2b5389a85\"]", "The update operator is not a black box that directly completes pose and depth. It repeatedly predicts correspondence revisions and confidence from correlation plus flow/residual signals, then connects them to DBA so they can be converted into pose-depth updates."],
    ["[id=\"2d9f65f1-13f4-800f-b703-cf10b63a55f0\"]", "Before entering the GRU, the correlation features and flow features pass through two convolution layers. Context features extracted by the context network are also fed into the GRU through element-wise addition."],
    ["[id=\"2daf65f1-13f4-802d-97d3-edf072f1b95c\"]", "DBA maps a set of flow revisions to a set of pose and per-pixel depth updates."],
    ["[id=\"2daf65f1-13f4-80da-a5e0-e034f3426fd8\"]", "The cost function over the entire frame graph is defined as follows."],
    ["[id=\"2daf65f1-13f4-80be-8d9d-d0ff20154e6e\"]", "The DBA layer is implemented as part of the computation graph, so backpropagation can be performed during training."],
    ["[id=\"2daf65f1-13f4-80c2-924b-f89f1b691217\"]", "The DROID-SLAM system is implemented in PyTorch and uses the LieTorch extension to backpropagate through the tangent spaces of all group elements."],
    ["[id=\"2daf65f1-13f4-80f9-8f85-c27b70227dd4\"]", "Each training example is a 7-frame video sequence. Stable training and strong downstream performance require video samples that are neither too easy nor too difficult."],
    ["[id=\"2daf65f1-13f4-8021-bb19-ee28a14f42cb\"]", "The network is supervised with a mixture of pose loss and flow loss."],
    ["[id=\"2daf65f1-13f4-800b-b4eb-c3ce8051f0a5\"]", "The flow loss is applied to neighboring frame pairs and is computed as the average L2 distance between the optical flow induced by the predicted depth/pose and the flow induced by ground-truth depth/pose."],
    ["[id=\"2daf65f1-13f4-80c4-80af-de54ad5c2a2b\"]", "At inference time, the network is assembled into a full SLAM system that takes a video stream as input and performs reconstruction and localization in real time. The proposed system uses two asynchronous threads: a frontend thread that receives new frames, extracts features, selects keyframes, and performs local BA, and a backend thread that performs global BA and loop closure."],
    ["[id=\"2daf65f1-13f4-80e3-a5d9-fbcaf536b064\"]", "DROID-SLAM proposes a simple initialization procedure."],
    ["[id=\"2daf65f1-13f4-802d-98d6-cdcfa3c4963d\"]", "The frontend directly processes the video stream and maintains a frame graph containing the set of keyframes and edges between covisible keyframes. Keyframe poses and depths are actively optimized."],
    ["[id=\"2daf65f1-13f4-8034-a2c4-ffe07e17bf65\"]", "The backend performs global BA simultaneously over the full history of keyframes."],
    ["[id=\"2daf65f1-13f4-809e-b30a-eb9c07464c15\"]", "During training, dense bundle adjustment is implemented in PyTorch to use the automatic differentiation engine. During inference, a custom CUDA kernel exploits the block-sparse structure and performs sparse Cholesky decomposition on the reduced camera block."],
    ["[id=\"2daf65f1-13f4-80fe-b761-c3b4e44625c4\"]", "At test time, evaluation uses the full camera trajectory rather than only a subset of keyframes."],
    ["[id=\"2daf65f1-13f4-806e-9fed-c2d20c192f56\"]", "The system can also be easily applied to stereo or RGB-D video."],
    ["[id=\"2daf65f1-13f4-8099-bb10-fcbbfe8bb92a\"]", "The experiments use multiple datasets and sensor modalities, compare against both learning-based and classical SLAM algorithms, and treat cross-dataset generalization as an important question."],
    ["[id=\"2daf65f1-13f4-80cc-9be3-d33d3fac239b\"]", "Camera-trajectory accuracy is evaluated with Average Trajectory Error (ATE), which was commonly used in prior work. 3D reconstruction is excluded except for datasets with clear ground truth, since it is usually considered part of the Multiview Stereo domain."],
    ["[id=\"2daf65f1-13f4-800d-94a4-d6dd1c16906b\"]", "All networks are trained on monocular video from the synthetic TartanAir dataset. The training setup can be summarized as follows."],
    ["[id=\"2daf65f1-13f4-80a6-8e8f-e59396a7823e\"]", "TartanAir is a challenging synthetic benchmark for evaluating SLAM algorithms and was used in the ECCV 2020 SLAM competition. The official test split is used, and the results for all “Hard” sequences are shown below."],
    ["[id=\"2daf65f1-13f4-8084-a2ad-c3ac5f0f0f95\"]", "The table shows that DROID-SLAM has both robustness, with no catastrophic failure, and accuracy, with very low drift. DeepV2D retrained on TartanAir is used as a baseline. DROID-SLAM outperforms existing methods by a large margin on most sequences, achieving about 8× lower average error than TartanVO and 20× lower average error than DeepV2D."],
    ["[id=\"2daf65f1-13f4-80e7-8b20-ed642c1ec9ef\"]", "The figure below compares DROID-SLAM with the systems ranked 1st to 3rd in the ECCV 2020 SLAM competition."],
    ["[id=\"2daf65f1-13f4-8090-b666-c14c129794c3\"]", "The 1st- and 2nd-place systems both use COLMAP, which is about 40× slower than a real-time system. DROID-SLAM is 16× faster than those systems while achieving 62% lower error on the monocular benchmark and 60% lower error on the stereo benchmark."],
    ["[id=\"2daf65f1-13f4-8096-b221-dcd725b859fd\"]", "During the experiments, the authors became interested in DROID-SLAM's ability to generalize to new cameras and environments."],
    ["[id=\"2daf65f1-13f4-8087-bd54-c1df8b470622\"]", "The EuRoC dataset consists of videos captured by a Micro Aerial Vehicle (MAV) and is widely used for SLAM benchmarking. The table below shows monocular-input results on EuRoC."],
    ["[id=\"2daf65f1-13f4-8043-b49d-f0f72c930dad\"]", "In the table, DROID-SLAM achieves an average error of 2.2 cm across all sequences, reduces error by 82% compared with other zero-failure methods, has no failures, and still reduces error by 43% compared with the successful ORB-SLAM3 runs. The paper also compares against several learning-based methods trained on TartanAir, ScanNet, and NYUv2. These recent learning-based methods perform poorly on EuRoC compared with classical SLAM, largely due to dataset bias and weak generalization, while DROID-SLAM remains robust."],
    ["[id=\"2daf65f1-13f4-8017-8a58-c7f800d34e0b\"]", "D3VO combines a neural frontend with a DSO backend and achieves both robustness and accuracy. However, 6 of the 11 sequences are used for evaluation and the remaining 5 for unsupervised training, and the training sequences include the same scenes as the evaluation sequences."],
    ["[id=\"2dbf65f1-13f4-801a-8ef8-f9d4a00c6064\"]", "TUM-RGBD is an indoor RGB-D dataset captured with a handheld camera. For monocular systems, it is notoriously difficult because of rolling-shutter artifacts, motion blur, and heavy rotation."],
    ["[id=\"2dbf65f1-13f4-808a-99fb-d294e0009e27\"]", "This paper benchmarks only the freiburg 1 results used in prior work. The results are shown below."],
    ["[id=\"2dbf65f1-13f4-8031-ac67-f731fe0c3cf9\"]", "Classical SLAM algorithms such as ORB-SLAM fail on most sequences. Learning-based methods are more robust than classical ones, but they show low accuracy on most evaluated sequences. DROID-SLAM is both robust and accurate, successfully tracking all 9 sequences and achieving 83% and 90% lower ATE than DeepFactors and DeepV2D, respectively, among methods that succeed on all sequences."],
    ["[id=\"2dbf65f1-13f4-80b4-822e-ed1d4a11ec5d\"]", "Finally, the paper evaluates RGB-D performance on the ETH3D-SLAM benchmark. The network is trained with RGB-D camera measurements from TartanAir, and the optimization adds a penalty term on the distance between predicted inverse depth and sensor-measured inverse depth."],
    ["[id=\"2dbf65f1-13f4-80dd-b1c0-c8b8733a4505\"]", "Without finetuning, DROID-SLAM ranks first on both the train and test splits. Some datasets containing unusable images are excluded from evaluation. On the test set, it successfully tracks 30 of 32 RGB-D sequences, improving substantially over the previous best result of 19 successful sequences out of 32."],
    ["[id=\"2dbf65f1-13f4-8002-a016-e2ac135af682\"]", "DROID-SLAM can run in real time using two RTX 3090 GPUs: the first GPU handles tracking and local BA, while the second handles global BA and loop closure."],
    ["[id=\"2dbf65f1-13f4-8041-b6fd-c117be6ee8b2\"]", "For EuRoC, the images are downsampled to 320×512 and frames are skipped to reach an average of 20 fps. Table 3 reports results under this setting."],
    ["[id=\"2dbf65f1-13f4-80ff-a441-c9ddf414602f\"]", "For TUM-RGBD, the images are downsampled to 240×320 and frames are skipped to reach an average of 30 fps. Table 4 reports results under the same type of setting."],
    ["[id=\"2dbf65f1-13f4-807e-960e-cf579bd00e93\"]", "TartanAir cannot run in real time because of much faster camera motion, so it is processed at an average of 8 fps. Even so, DROID-SLAM is still 16× faster than the COLMAP-based methods ranked 1st and 2nd in the TartanAir SLAM challenge."],
    ["[id=\"2dbf65f1-13f4-8072-a9bb-ead715856b9b\"]", "The DROID-SLAM frontend can run with 8 GB of GPU memory, but the backend requires more memory because it stores feature maps for all images. All TUM-RGBD results can be produced with a single 1080Ti GPU, while EuRoC, TartanAir, and ETH3D, whose video sequences can contain up to 5000 frames, require a GPU with 24 GB of memory."],
    ["[id=\"2dbf65f1-13f4-80e5-a906-c38b34f9fb47\"]", "DROID-SLAM's largest current limitation is its memory and resource requirement, which could be dramatically reduced through culling redundant computation and using more efficient representations."],
    ["[id=\"2dbf65f1-13f4-804f-9dc8-eb7bfa8f7b0b\"]", "This paper introduces DROID-SLAM, an end-to-end neural architecture for visual SLAM. It is accurate, robust, versatile, works with monocular, stereo, and RGB-D video, and outperforms prior work by a large margin on difficult benchmarks."],
    ["[id=\"2dbf65f1-13f4-803a-ae76-f1a9c3c652a9\"]", "The table below shows stereo SLAM results on EuRoC using DROID-SLAM trained only on synthetic monocular video. In the stereo setting, scale information can be used to improve the camera trajectory."],
    ["[id=\"2dbf65f1-13f4-80af-b9f9-ee17bdd49642\"]", "The table shows that DROID-SLAM reduces average ATE by 71% compared with ORB-SLAM3."],
    ["[id=\"2dbf65f1-13f4-80c4-b0be-f8beb806064f\"]", "The paper ablates various design choices in the proposed SLAM system and neural architecture using a validation split from TartanAir. The figure below visualizes keyframe images, keyframe depths, optical flow, and the associated confidence weights on the validation set."],
    ["[id=\"2dbf65f1-13f4-80e8-8fa2-fb5e08db4476\"]", "In the results below, the left plot shows the benefit of using both stereo video and global optimization in the SLAM system. Even though the network is trained on monocular video, it can use stereo frames whenever they are available. The right plot tests how the number of keyframes affects odometry performance."],
    ["[id=\"2dbf65f1-13f4-80f0-86c1-e01043e3e958\"]", "The results below ablate components of the neural architecture. The left plot shows the effect of using global context in the GRU through spatial pooling. The right plot shows the importance of DBA by comparing training with DBA against training on flow and applying BA only at inference time. Without DBA during training, the SLAM system becomes unstable and less accurate."],
    ["[id=\"2dcf65f1-13f4-80cb-81d1-ce9bcde3a130\"]", "The figure shows the feature and context encoder architecture. Features are extracted at 1/8 of the input image size, and the network contains six residual blocks."],
    ["[id=\"2dcf65f1-13f4-807e-ad5c-d921a0822574\"]", "The information for each encoder is summarized below."],
    [".summary-panel[aria-labelledby='encoder-map-title'] .summary-head p", "As in RAFT-style architectures, the feature encoder and context encoder are separated. The feature encoder builds matching/correlation information, while the context encoder provides state information used by the update operator during recurrent refinement."],
    ["[id=\"2dcf65f1-13f4-80e3-97bf-d9d8a42d0c4a\"]", "The figure shows the update-operator architecture. Context, correlation, and flow enter the GRU, and the updated hidden state predicts revision and confidence weights."],
    ["[id=\"2dcf65f1-13f4-80e7-a990-fd0554de54dc\"]", "What stood out to me was how DROID-SLAM integrates backend SLAM optimization into a differentiable DBA layer, repeatedly updates pose and depth, and rebuilds the frame graph. I also found its generalization impressive: even with monocular-only training, performance improves when stereo or RGB-D input is available. Fixing the first two poses to remove gauge freedom also made the training-stability story easier to understand."],
    ["[id=\"2dcf65f1-13f4-809f-95be-fc999ce02f84\"]", "Because this paper was published in 2021, deep-learning techniques have advanced substantially since then. I plan to look for follow-up work that improves the memory and resource issues mentioned here, and also for examples that combine VLM or semantic information with SLAM pipelines."]
  ];

  const textTranslations = {
    "핵심 요약": "Key Summary",
    "한 문장 요약": "One-sentence Summary",
    "내가 얻은 인사이트": "My Insight",
    "학습의 기본 입력": "Base Training Input",
    "추가 기하 제약": "Additional Geometry Constraint",
    "깊이 관측 활용": "Using Depth Observations",
    "정리 노트": "Reading Note",
    "논문 상세 정리": "Detailed Paper Notes",
    "더보기": "Read More",
    "Introduction 핵심 주장": "Introduction Core Claims",
    "Training 요약": "Training Summary",
    "Full SLAM 구성 요약": "Full SLAM Structure Summary",
    "Encoder 역할 정리": "Encoder Roles",
    "RAFT에서 DROID로": "From RAFT to DROID",
    "Approach 읽는 순서": "Approach Reading Order",
    "본문으로 바로가기": "Skip to content",
    "특히 아래와 같은 이점을 가진다.": "In particular, it has the following advantages.",
    "Introduction에서 제시한 장점은 정확도, 실패율, 일반화 성능으로 나눠 읽으면 논문의 주장 구조가 선명해진다.": "The Introduction's claims become clearer when separated into accuracy, failure rate, and generalization.",
    "RAFT 계열 구조처럼 feature encoder와 context encoder를 분리한다. feature는 matching/correlation을 만들고, context는 update operator가 반복 수정할 때 쓰는 상태 정보를 제공한다.": "As in RAFT-style architectures, the feature encoder and context encoder are separated. Features build matching/correlation, while context provides the state information used by the update operator during recurrent refinement.",
    "와": "and",
    "주장": "Claim",
    "핵심 근거": "Core Evidence",
    "읽는 포인트": "Reading Point",
    "세부 근거": "Detailed Evidence",
    "Contribution 세부 수치 보기": "View Contribution Evidence Details",
    "DeepV2D / BA-Net 비교 메모 보기": "View DeepV2D / BA-Net Comparison Notes",
    "Related Work 자세히 보기": "View Related Work Details",
    "TartanAir 세부 결과 보기": "View TartanAir Detailed Results",
    "EuRoC 세부 결과 보기": "View EuRoC Detailed Results",
    "TUM-RGBD 세부 결과 보기": "View TUM-RGBD Detailed Results",
    "ETH3D-SLAM 세부 결과 보기": "View ETH3D-SLAM Detailed Results",
    "Timing / Memory 세부 조건 보기": "View Timing / Memory Details",
    "이 대목의 핵심은": "The core of this section is that",
    "RAFT를 SLAM 변수 업데이트로 바꾸고, 그 업데이트를 DBA layer가 기하적으로 검증": "RAFT is converted into a SLAM-variable update, and the DBA layer geometrically verifies that update",
    "한다는 점이다. 즉 flow prediction, pose update, depth update가 따로 노는 구조가 아니라 하나의 반복 최적화 loop로 묶인다.": ". In other words, flow prediction, pose update, and depth update are not separate modules; they are tied into one recurrent optimization loop.",
    "DROID-SLAM은 direct/indirect 중 하나를 고르는 대신, full image 기반 matching signal과 reprojection objective를 결합한다.": "DROID-SLAM combines full-image matching signals with a reprojection objective instead of choosing strictly between direct and indirect SLAM.",
    "Approach는 “state representation → frame graph → update operator → DBA → full SLAM system” 순서로 보면 된다.": "Read the Approach section as: state representation → frame graph → update operator → DBA → full SLAM system.",
    "DROID-SLAM이 앞부분에서 주장하는 장점은 성능 수치보다 “같은 모델이 여러 센서/데이터셋에서 무너지지 않는다”는 방향으로 읽는 것이 좋다.": "Read the Introduction's claims less as isolated benchmark numbers and more as evidence that the same model does not collapse across sensors and datasets.",
    "이 부분은 “RAFT 구조를 가져왔다”보다, update 대상이 optical flow에서": "The important point here is not simply that DROID borrows a RAFT-like structure, but that the update target changes from optical flow to",
    "로 바뀌었다는 점이 핵심이다.": ".",
    "비교 축": "Comparison Axis",
    "계열": "Family",
    "단계": "Stage",
    "요약": "Summary",
    "핵심 기준": "Core Criterion",
    "flow 자체보다 SLAM 변수 개선이 목표": "Goal is improving SLAM variables, not flow itself",
    "long trajectory와 loop closure까지 확장": "Extends to long trajectories and loop closure",
    "learned update를 기하 최적화로 검증": "Geometrically verifies the learned update",
    "두 frame 사이 optical flow": "Optical flow between two frames",
    "camera pose와 pixelwise inverse depth": "Camera pose and pixelwise inverse depth",
    "pairwise image matching": "Pairwise image matching",
    "임의 개수의 frame graph": "Frame graph with an arbitrary number of frames",
    "matching signal 중심": "Centered on matching signals",
    "DBA layer의 reprojection objective": "DBA-layer reprojection objective",
    "학습 섹션은 성능 수치보다 gauge freedom 제거와 supervision 설계가 핵심이다.": "In the training section, gauge-freedom removal and supervision design matter more than raw performance numbers.",
    "첫 pose 고정: 6-DoF 제거": "Fix first pose: remove 6-DoF",
    "두 번째 pose 고정: scale 제거": "Fix second pose: remove scale",
    "monocular training의 선형 시스템 conditioning과 gradient 안정화": "Stabilizes linear-system conditioning and gradients in monocular training",
    "인접 frame 평균 flow 8-96px 범위": "Neighbor-frame average flow in the 8-96 px range",
    "너무 쉽거나 어려운 sequence를 피해서 recurrent update 학습": "Avoids sequences that are too easy or too hard when training recurrent updates",
    "iteration별 가중치 적용": "Apply per-iteration weighting",
    "최종 결과뿐 아니라 반복 과정 전체가 수렴하도록 유도": "Encourages not only final output quality but convergence across the full iteration process",
    "이후 모든 modality 결과가 단일 monocular-trained model에서 출발": "All later modality results start from this single monocular-trained model",
    "논문 모델이 실제 SLAM 시스템이 되는 구간이다. frontend는 최근 frame 안정화, backend는 전체 keyframe graph 정렬을 담당한다.": "This is where the paper model becomes a real SLAM system. The frontend stabilizes recent frames; the backend aligns the full keyframe graph.",
    "flow 16px 이상 frame 수집": "Collect frames with flow above 16 px",
    "12개 frame 확보": "Secure 12 frames",
    "10회 update": "Run 10 updates",
    "간단한 bootstrap으로 초기 frame graph 생성": "Create the initial frame graph with a simple bootstrap",
    "new frame feature 추출": "Extract new-frame features",
    "3개 가까운 neighbor edge 추가": "Add 3 nearest-neighbor edges",
    "local BA 수행": "Run local BA",
    "실시간 tracking과 keyframe 유지 담당": "Handles real-time tracking and keyframe maintenance",
    "전체 keyframe history 기반 frame graph 재구성": "Rebuild the frame graph from the full keyframe history",
    "global BA 수행": "Run global BA",
    "loop closure와 장기 drift 감소 담당": "Handles loop closure and long-term drift reduction",
    "non-keyframe pose는 인접 keyframe과의 flow로 보완": "Fill non-keyframe poses using flow to neighboring keyframes",
    "평가는 keyframe이 아닌 full trajectory 기준": "Evaluation uses the full trajectory, not only keyframes",
    "stereo: 좌우 relative pose 고정": "Stereo: fix left-right relative pose",
    "RGB-D: measured depth penalty 추가": "RGB-D: add measured-depth penalty",
    "재학습 없이 sensor constraint만 objective에 추가": "Add only sensor constraints to the objective without retraining",
    "Evaluation Brief": "Evaluation Brief",
    "모델/학습": "Model / Training",
    "모든 실험은 TartanAir monocular로 학습한 하나의 모델에서 출발": "All experiments start from one model trained on TartanAir monocular video",
    "cross-dataset generalization을 보려는 설정": "Designed to test cross-dataset generalization",
    "평가지표": "Metric",
    "ATE 중심, reconstruction은 GT가 명확한 경우가 아니면 제외": "Centered on ATE; reconstruction excluded unless clear ground truth exists",
    "SLAM 논문답게 trajectory reliability가 핵심": "Trajectory reliability is the main concern, as expected in a SLAM paper",
    "비교 대상": "Baselines",
    "classical SLAM, learned SLAM, offline competition submission 모두 비교": "Compares classical SLAM, learned SLAM, and offline competition submissions",
    "DROID가 accuracy/robustness/speed 중 어디서 이기는지 분리해서 읽기": "Separate where DROID wins: accuracy, robustness, or speed",
    "센서 확장": "Sensor Extension",
    "monocular-trained model을 stereo/RGB-D로 test": "Tests a monocular-trained model on stereo/RGB-D",
    "network 재학습보다 DBA objective 확장이 중요": "DBA-objective extension matters more than network retraining",
    "synthetic hard benchmark에서 DROID-SLAM이 정확도와 failure robustness를 동시에 가져가는지 확인하는 파트다.": "This section checks whether DROID-SLAM achieves both accuracy and failure robustness on a hard synthetic benchmark.",
    "monocular와 stereo track 모두 비교": "Compares both monocular and stereo tracks",
    "monocular 62%, stereo 60% error 감소": "Reduces error by 62% in monocular and 60% in stereo",
    "TartanVO 대비 8배, DeepV2D 대비 20배 낮은 평균 오차": "Average error is 8× lower than TartanVO and 20× lower than DeepV2D",
    "deep SLAM이 classical/offline system보다 느슨한 대체가 아니라, hard sequence에서도 drift와 failure를 같이 줄이는지 보는 표.": "This table checks whether deep SLAM is more than a loose substitute for classical/offline systems, reducing both drift and failure on hard sequences.",
    "상위 COLMAP 기반 submission은 더 느린 offline 성격이므로 속도 비교까지 함께 봐야 함.": "The top COLMAP-based submissions are slower and offline-like, so speed must be considered too.",
    "synthetic monocular 학습 모델이 실제 MAV 카메라와 새로운 환경으로 얼마나 일반화되는지 보는 구간이다.": "This section checks how well a synthetic-monocular-trained model generalizes to real MAV cameras and new environments.",
    "monocular와 stereo setting 모두 평가": "Evaluates both monocular and stereo settings",
    "monocular 평균 ATE 2.2cm": "Monocular average ATE: 2.2 cm",
    "zero failure 방법 중 82% error 감소": "82% error reduction among zero-failure methods",
    "stereo input에서 ORB-SLAM3 대비 71% error 감소": "71% error reduction over ORB-SLAM3 with stereo input",
    "DROID의 일반화 주장은 dataset 외삽뿐 아니라 sensor constraint를 test-time objective에 넣을 수 있다는 구조와 연결됨.": "DROID's generalization claim is tied not only to dataset extrapolation, but also to the structure that accepts sensor constraints in the test-time objective.",
    "D3VO 비교는 train/test scene overlap과 평가 sequence 사용 방식까지 함께 확인해야 함.": "For D3VO, also check train/test scene overlap and how the evaluation sequences are used.",
    "rolling shutter, motion blur, heavy rotation이 있는 실내 sequence에서 catastrophic failure를 줄이는지 보는 파트다.": "This section checks whether catastrophic failure is reduced on indoor sequences with rolling shutter, motion blur, and heavy rotation.",
    "대부분 monocular input 기준 비교": "Mostly compared under monocular input",
    "9개 sequence 모두 tracking 성공": "Tracks all 9 sequences successfully",
    "DeepFactors 대비 83%, DeepV2D 대비 90% 낮은 ATE": "ATE is 83% lower than DeepFactors and 90% lower than DeepV2D",
    "정확도 평균보다 먼저 failure 없이 끝까지 추적했는지 확인.": "Before average accuracy, check whether tracking reaches the end without failure.",
    "network correspondence와 DBA가 motion blur/rotation 조건에서 front-end 실패를 줄이는지 보여줌.": "Shows whether network correspondence and DBA reduce frontend failure under motion blur and rotation.",
    "RGB-D sensor measurement를 optimization objective에 추가했을 때, monocular-trained model이 얼마나 잘 적응하는지 확인하는 구간이다.": "This section checks how well a monocular-trained model adapts when RGB-D sensor measurements are added to the optimization objective.",
    "TartanAir 학습 모델에 depth penalty 항 추가": "Adds a depth-penalty term to the TartanAir-trained model",
    "train/test split 모두 1위": "Ranks first on both train and test splits",
    "test set 32개 중 30개 tracking 성공": "Successfully tracks 30 of 32 test-set sequences",
    "이전 최고 19/32 성공 대비 failure robustness가 크게 개선됨.": "Failure robustness improves substantially over the previous best of 19/32 successful sequences.",
    "RGB-D depth도 고정 진리가 아니라 noisy/missing measurement라서 optimization constraint로 다룸.": "RGB-D depth is treated as an optimization constraint because it can be noisy or missing, not as fixed truth.",
    "성능 개선의 반대편에서 DROID-SLAM이 어떤 compute/memory cost를 요구하는지 확인하는 파트다.": "This section checks the compute and memory cost required on the other side of DROID-SLAM's performance gains.",
    "실시간 조건": "Real-time Setup",
    "RTX 3090 2개 사용": "Uses two RTX 3090 GPUs",
    "frontend local BA와 backend global BA를 분리 운용": "Runs frontend local BA and backend global BA separately",
    "EuRoC 평균 20fps": "EuRoC average: 20 fps",
    "TUM-RGBD 평균 30fps": "TUM-RGBD average: 30 fps",
    "TartanAir는 빠른 camera motion으로 평균 8fps": "TartanAir average: 8 fps due to fast camera motion",
    "backend가 전체 image feature map을 저장하므로 long sequence에서 메모리 요구량 증가.": "Memory demand grows on long sequences because the backend stores feature maps for all images.",
    "정확도와 robustness는 강하지만, classical SLAM 대비 resource cost가 중요한 trade-off.": "Accuracy and robustness are strong, but resource cost is an important trade-off against classical SLAM.",
    "단순 평균 오차뿐 아니라 failure가 포함된 결과인지 확인": "Check whether the result includes failures, not just the mean error",
    "catastrophic failure가 줄었는지가 DROID-SLAM의 핵심 주장": "The reduction of catastrophic failure is a central DROID-SLAM claim",
    "backend가 feature map을 저장하므로 긴 sequence에서는 memory가 병목": "Memory becomes a bottleneck on long sequences because the backend stores feature maps",
    "Appendix는 결과 보강과 ablation 확인용이다. 세부 Jacobian은 구현/수식 검증이 필요할 때만 펼쳐 보면 된다.": "The appendix is mainly for additional results and ablation checks. Open the detailed Jacobian only when implementation or equation verification is needed.",
    "synthetic monocular 학습 모델로 EuRoC stereo SLAM 수행": "Runs EuRoC stereo SLAM with a synthetic-monocular-trained model",
    "stereo constraint가 scale 정보를 보완하며 ORB-SLAM3 대비 평균 ATE 감소": "Stereo constraints complement scale information and reduce average ATE versus ORB-SLAM3",
    "stereo input, global optimization, 5 keyframes, global pooling, training-time DBA 영향 확인": "Checks the effect of stereo input, global optimization, 5 keyframes, global pooling, and training-time DBA",
    "성능 수치보다 어떤 구성요소가 안정성에 필수인지 확인": "Focus on which components are essential for stability, not only on raw scores",
    "projection/inverse projection derivative 제공": "Provides projection / inverse-projection derivatives",
    "DBA layer 구현이나 수식 검증이 필요할 때 참고": "Reference for DBA-layer implementation or equation verification",
    "correlation volume 생성": "Builds the correlation volume",
    "GRU update에 context 주입": "Injects context into the GRU update",
    "TartanAir SLAM competition: monocular 62%, stereo 60% error 감소": "TartanAir SLAM competition: 62% lower monocular error and 60% lower stereo error",
    "ETH3D RGB-D leaderboard 1위, AUC metric 기준 35% 개선": "1st on the ETH3D RGB-D leaderboard, with a 35% AUC-metric improvement",
    "EuRoC monocular: zero-failure method 대비 82% error 감소": "EuRoC monocular: 82% error reduction versus zero-failure methods",
    "EuRoC: ORB-SLAM3가 성공한 10/11 sequence 기준 43% 이상 개선, stereo input 기준 71% error 감소": "EuRoC: more than 43% improvement on the 10/11 sequences where ORB-SLAM3 succeeds, and 71% lower error with stereo input",
    "TUM-RGBD: 실패 없이 83% error 감소": "TUM-RGBD: 83% error reduction without failures",
    "catastrophic failure가 이전 시스템들보다 크게 감소": "Catastrophic failure is greatly reduced compared with previous systems",
    "ETH3D RGB-D 32개 sequence 중 30개 추적 성공": "Successfully tracks 30 of 32 ETH3D RGB-D sequences",
    "이전 최고 기록은 19/32개 추적 성공": "The previous best tracked 19 of 32 sequences",
    "TartanAir, EuRoC, TUM-RGBD에서 failure 없이 평가": "Evaluated on TartanAir, EuRoC, and TUM-RGBD without failure",
    "feature detection, descriptor, matching 후 reprojection error 최적화": "Detect features, build descriptors, match them, then optimize reprojection error",
    "corner/edge 중심 정보에 의존하지만 objective는 비교적 smooth": "Relies on corner/edge-centered information, but has a relatively smooth objective",
    "image intensity/photometric error를 직접 모델링": "Directly models image intensity / photometric error",
    "정보량은 많지만 local minimum, rolling shutter, pyramid 설계에 민감": "Uses more information, but is sensitive to local minima, rolling shutter, and pyramid design",
    "full image feature/correlation으로 correspondence를 만들고 reprojection error 최적화": "Builds correspondence from full-image feature/correlation and optimizes reprojection error",
    "direct의 표현력과 indirect의 기하 objective를 recurrent DBA loop로 결합": "Combines direct-style representation capacity with an indirect-style geometric objective in a recurrent DBA loop",
    "DROID-SLAM은 순차적인 이미지 집합": "DROID-SLAM receives a sequential image set",
    "을 입력으로 받으며, 각 이미지 t는": "as input, and each image t has",
    "inverse depth(역깊이)": "inverse depth",
    "라는 2개의 상태 변수(state variables)를 보유한다.": "as its two state variables.",
    "camera pose의 집합": "The set of camera poses",
    "와 inverse depth의 집합": "and the set of inverse depths",
    "은 알려지지 않은(unknown) 상태 변수들이며, 이는 추론 단계에서 새로운 프레임들을 처리하면서 반복적으로 업데이트 된다.": "are unknown state variables, and they are repeatedly updated as new frames are processed at inference time.",
    "(또한 앞으로 해당 논문에서 언급되는 depth는 inverse depth를 의미한다고 한다)": "(From this point on, depth in the paper refers to inverse depth.)",
    "또한 프레임들간의": "To represent",
    "를 표현하기 위해": "between frames, the paper introduces",
    "를 도입하였으며,": ".",
    "인": "The edge",
    "은 이미지": "means that image",
    "가 특징점을 공유하는 서로 겹치는 영역을 가진다는 것을 의미한다.": "and the other image share feature points in an overlapping region.",
    "는 훈련과 추론시에 동적으로 구축되며, 각 pose나 inverse depth가 업데이트되면 frame graph를 업데이트 하기 위해 visibility를 다시 계산할 수 있다. 또한 만약 카메라가 이전에 매핑한 지역으로 돌아오면, frame graph에 long range connection을 추가하여 loop closure를 수행한다.": "is built dynamically during both training and inference. Whenever poses or inverse depths are updated, visibility can be recomputed to update the frame graph. If the camera returns to a previously mapped region, long-range connections are added to the frame graph to perform loop closure.",
    "Frame graph에서 각 edge": "For each edge in the frame graph",
    "에 대해,": ",",
    "의 모든 쌍의 feature vector들 간에 dot product를 취하여 4D correlation volume을 계산한다.": "a 4D correlation volume is computed by taking dot products between all pairs of feature vectors.",
    "(위 수식은 4D correlation volume을 의미한다)": "(The equation above denotes the 4D correlation volume.)",
    "위 수식은 반지름 r의 격자(grid)를 이용하여 correlation volume을 인덱싱(indexing)하는 lookup 연산자를 정의한 것이다.": "The equation above defines a lookup operator that indexes the correlation volume using a grid with radius r.",
    "이 그림에서 볼 것": "What to Look For",
    "update operator는 pose/depth를 직접 출력하는 black box가 아니라, correlation과 residual을 보고": "The update operator is not a black box that directly outputs pose/depth. It reads correlation and residual signals to produce",
    "과 confidence를 만든다. 실제 pose-depth 갱신은 이어지는 DBA layer가 담당한다.": "and confidence. The actual pose-depth update is handled by the following DBA layer.",
    "위 그림은 DROID-SLAM의 핵심 요소인": "The figure above shows",
    "를 보여준다. 해당 update operator는 hidden state(은닉 상태) h를 가지는 3x3 크기의 convolutional GRU이며, operator가 적용될때마다 hidden state를 업데이트하고 추가적으로": ", a key component of DROID-SLAM. The update operator is a 3x3 convolutional GRU with hidden state h; each time it is applied, it updates the hidden state and additionally performs",
    ") 및": ") and",
    ")를 수행한다.": ").",
    "이러한 pose 및 depth update는 SE3 manifold(다양체)에서의 retraction과 vector addition을 통해 현재 depth와 pose 추정에 사용된다.": "These pose and depth updates are applied to the current depth and pose estimates through retraction on the SE(3) manifold and vector addition.",
    "각 반복의 시작에서 correspondence를 추정하기 위해 pose와 depth의 현재 추정을 이용하는데, i번째 프레임의 픽셀 좌표 격자": "At the beginning of each iteration, the current pose and depth estimates are used to estimate correspondence. Given the pixel-coordinate grid of the i-th frame",
    "가 주어지면,": ",",
    "를 계산한다.": "is computed.",
    "위 수식에서": "In the equation above,",
    "는 3D point를 이미지로 mapping하는 camera model이며,": "is the camera model that maps a 3D point to the image, and",
    "은 inverse depth map": "maps the inverse-depth map",
    "와 coordinate grid": "and coordinate grid",
    "를 3D pointcloud로 mapping하는 inverse projection function이다.": "to a 3D point cloud as an inverse projection function.",
    "따라서": "Therefore,",
    "는 추정된 pose와 depth를 이용하여 frame i의 픽셀 좌표": "represents the mapping of frame i pixel coordinates",
    "를 frame j로 mapping한 것을 나타낸다.": "to frame j using the estimated pose and depth.",
    "correlation volume에 인덱싱(index)하기 위해 correspondence field(": "To index the correlation volume, the correspondence field (",
    ")를 사용하는데, 각 edge": ") is used. For each edge",
    "에 대해 correlation volume": ", the correlation volume",
    "에서 correlation feature를 조회하기 위해": "is queried for correlation features using",
    "를 사용한다.": ".",
    "correspondence field를 사용하여 카메라 움직임(motion)에 의해 생기는 optical flow를 계산하는데, 이는": "The correspondence field is used to compute optical flow induced by camera motion, defined as",
    "로 정의된다. 또한 이전 BA solution의 residual을 해당 flow field와 결합하여 신경망이 이전 iteration에서의 정보를 feedback을 사용할 수 있도록 한다.": ". The residual from the previous BA solution is also combined with this flow field so the network can receive feedback from the previous iteration.",
    "correlation feature는": "The correlation feature provides",
    "의 주변의 visual similarity(시각적 유사성)를 제공하여, 신경망이 시각적으로 유사한(visually similar) 이미지 영역을 정렬(align)하도록 학습할 수 있게 한다. 하지만 correspondence는 때때로 모호할 수 있는데, 이때 flow는 보완적인 정보를 제공하며, motion fields에서 연속성(smoothness)을 활용하여 신경망이 강건한 예측을 할 수 있게 돕는다.": "nearby visual similarity, allowing the network to learn to align visually similar image regions. Correspondence can be ambiguous, so flow provides complementary information and uses smoothness in motion fields to help the network make robust predictions.",
    "ConvGRU는 작은 receptive field를 가지는 local operation이다. 이미지의 공간적 차원(spatial dimension)에 대한 정보를 가지는 hidden state의 평균을 구함으로써 global context를 추출하고, 해당 feature vector를 GRU의 추가적인 입력으로 사용한다. Gobal context는 SLAM에서 중요한데, 예를들어 큰 규모의 움직이는 물체는 불완전한 correspondence로 인해 시스템에 성능저하를 가져오며, network에서는 이를 인지하고 제거하는 것이 중요하다.": "ConvGRU is a local operation with a small receptive field. Global context is extracted by averaging the hidden state over the spatial dimensions of the image, and that feature vector is used as an additional GRU input. Global context matters in SLAM: large moving objects can degrade the system through imperfect correspondence, so the network needs to identify and suppress them.",
    "GRU는 업데이트된 hidden state (": "The GRU outputs the updated hidden state (",
    ")를 내놓는데, 이 때 depth나 pose의 업데이트를 직접 예측하는 것 대신, dense flow fields 공간에서의 업데이트를 예측한다. 또한 hidden state를 2개의 추가적인 convolution layer에 통과시켜 2개의 출력값을 만드는데, 하나는": "). Instead of directly predicting updates to depth or pose, it predicts updates in dense-flow-field space. The hidden state is then passed through two additional convolution layers to produce two outputs: one is",
    ")이고, 다른 하나는": "), and the other is",
    ")이다.": ").",
    "는 dense correspondence field(": "is predicted by the network as a term that corrects errors in the dense correspondence field (",
    ")의 오차를 교정(correct)하기 위한 항(term)으로 신경망에 의해서 예측되며, 교정된 correspondence를": "). The corrected correspondence is written as",
    "로 나타낼 수 있다.": ".",
    "이후에, hidden state에서 동일한 source view": "Then, all features sharing the same source view",
    "를 공유하는 모든 feature들을 pooling하고, 각 픽셀별 damping factor": "are pooled from the hidden state, and a per-pixel damping factor",
    "를 예측한다. 또한 damping factor": "is predicted. To guarantee that the damping factor",
    "가 양수(positive)임을 보장하기 위해 softplus 연산자를 사용한다. 추가적으로 pooling된 feature들을 이용해 8x8 마스크를 예측하며, 이는 inverse depth 추정에 대한 결과를 upsampling 하는데에 사용된다.": "is positive, the softplus operator is used. The pooled features are also used to predict an 8x8 mask, which upsamples the inverse-depth estimate.",
    "는 Mahalanobis distance를 의미하며, confidence weight": "denotes the Mahalanobis distance and defines an error term based on confidence weight",
    "에 기반한 오차 항(error term)을 정의한다. 따라서 위 수식은 reprojected points(": ". Thus, the equation means that the reprojected points (",
    ")가 update operator에 의해 예측되는 revised correspondence": ") should be matched as closely as possible to the revised correspondence",
    "에 가까워지게끔(match) pose": "predicted by the update operator by updating pose",
    "과 depth": "and depth",
    "을 업데이트 해야 한다는 것을 의미한다.": ".",
    "위 수식을 선형화(linearize)하기 위해 local parameterization을 사용하고 업데이트(": "To linearize the equation above, local parameterization is used, and Gauss-Newton is used for the updates (",
    ")를 위해 Gauss-Newton 알고리즘을 사용한다. 또한 수식에서 각 항은 단일(single) depth variable만 포함하고 있기 때문에 Hessian matrix가 diagonal structure(대각 행렬)이다. pose와 depth variable들을 분리하여 Schur complement(슈어 보상행렬)을 적용할 수 있고, 픽셀별 damping factor": "). Since each term in the equation contains only a single depth variable, the Hessian matrix has a diagonal structure. Pose and depth variables can be separated and handled with the Schur complement, and the per-pixel damping factor",
    "가 대각행렬인 depth block": "is added to the diagonal depth block",
    "에 더해져 손쉽게 역행렬을 구할 수 있다는 점에서 효율적인 시스템을 제공한다.": ", making inversion easy and providing an efficient system.",
    "monocular setting에서 신경망은 오직 similarity transform만을 통해 카메라의 궤적을 보정(recover)할 수 있고, 이를 통한 하나의 방법이 similarity transform에 불변한(invariant) loss를 정의하는 것이다.": "In the monocular setting, the network can recover the camera trajectory only up to a similarity transform. One way to handle this is to define a loss invariant to similarity transforms.",
    "하지만 gauge-freedom은 훈련중에 여전히 존재하고 있으며, 선형(linear) 시스템의 조건형성(conditioning)과 기울기(graident)의 안정성에 안좋은 영향을 준다. 이는 각 훈련 시퀀스에서 첫 2개의 pose를 ground-truth pose로 고정시킴으로써 해결 가능한데, 첫 번째 pose를 고정하면 6-dof gauge freedom을 제거되고, 두 번째 pose를 고정하면 scale freedom이 제거된다.": "However, gauge freedom still exists during training and harms the conditioning of the linear system and the stability of gradients. This is addressed by fixing the first two poses in each training sequence to ground truth: fixing the first pose removes the 6-DoF gauge freedom, and fixing the second pose removes scale freedom.",
    "훈련 데이터셋은 비디오의 집합으로 이루어져 있고,": "The training dataset is a set of videos. For each video",
    "의 길이를 가지는 각 비디오": "with length",
    "에 대해서": ",",
    "의 distance matrix를 계산하는데, 이는 각 프레임쌍들간에 average optical flow magnitude를 저장한다. 그러나 모든 프레임들이 covisible 한 것은 아니기 때문에, 프레임쌍들간에 겹치는(overlap) 부분이 50% 미만이면, distance를 무한(infinity)로 설정한다. 또한 훈련중에 distance matrix에서 path들을 샘플링함으로써 동적으로 비디오를 생성하며, 인접 비디오 프레임들 사이의 평균 flow는 8px~96px 사이의 값을 가진다.": "a distance matrix is computed, storing the average optical-flow magnitude between all frame pairs. Since not all frames are covisible, pairs with less than 50% overlap are assigned infinite distance. During training, videos are generated dynamically by sampling paths through the distance matrix; neighboring video frames have average flow between 8 px and 96 px.",
    "pose loss는 ground truth pose의 집합": "Given the set of ground-truth poses",
    "와 예측된 pose의 집합": "and the set of predicted poses",
    "이 주어졌을 때": ", the pose loss is defined as follows.",
    "위와 같이 수식으로 나타낼 수 있다.": "It can be written as the equation above.",
    "두 losses(flow loss + pose loss)는 매 iteration마다 기하급수적(exponentially)으로 증가하는 가중치 (": "The two losses, flow loss and pose loss, are applied to the outputs with an exponentially increasing per-iteration weight (",
    ")를 적용하여 출력값에 적용된다.": ").",
    "프레임이 12개가 될 때까지 프레임을 계속 축적하고, optical flow가 16px 이상인 이전 프레임에 대해서만 유지한다(여기서 optical flow는 한 번의 update iteration을 통해 추정된다). 12개의 프레임이 축적되면, keyframe(프레임)간의 edge를 형성하여 frame graph를 초기화하고, 이때 특정 keyframe 기준 edge를 형성할 keyframe은 3 timestep 내에 있어야 한다. 초기화가 끝나면 update operator를 10번 iteration 돌린다.": "Frames are accumulated until 12 frames are available, keeping only previous frames with optical flow above 16 px, where the flow is estimated with one update iteration. Once 12 frames have been accumulated, edges are created between keyframes to initialize the frame graph; keyframes connected to a given keyframe must be within 3 timesteps. After initialization, the update operator is run for 10 iterations.",
    "먼저 받아오는 프레임에서 특징을 추출하고, 해당 keyframe(프레임)을 기준으로 mean optical flow 기반의 3개의 closest neighbor를 찾아 frame graph에 추가해 edge를 연결한다.": "First, features are extracted from the incoming frame. Then the three closest neighbors based on mean optical flow are found for that keyframe and added as edges in the frame graph.",
    "pose는 linear motion model을 통해 초기화되며, 그 후에 keyframe의 pose와 depth를 업데이트하기 위해 update operator에 몇 번의 iteration을 적용한다. 여기서 첫 2개의 pose를 고정(fix)하여 guage freedom을 제거하며, depth는 free variable로 처리한다.": "The pose is initialized with a linear motion model. Several iterations of the update operator are then applied to update keyframe pose and depth. The first two poses are fixed to remove gauge freedom, while depth is treated as a free variable.",
    "새로운 프레임이 추적된 후에 지울 keyframe을 선택하는데, 프레임쌍들간의 average optical flow magnitude를 계산함으로써 거리를 계산하고 중복 프레임을 제거하며, 만약 지울만한 후보가 없으면 가장 오래된 keyframe을 제거한다.": "After a new frame is tracked, a keyframe is selected for removal. Distance is computed using average optical-flow magnitude between frame pairs to remove redundant frames; if no good candidate exists, the oldest keyframe is removed.",
    "각 반복(iteration)마다 키프레임 쌍들간의 flow를 기반으로 frame graph를 재건축(rebuild)하며, 해당 flow는": "At each iteration, the frame graph is rebuilt from flow between keyframe pairs. This flow is represented as an",
    "크기의 distance matrix로 표현된다. 먼저 시간적으로(temporally) 인접한 keyframe들간의 edge를 추가하고, flow값에 대해 오름차순으로 정렬된 distance matrix에서 새로운 edge들을 샘플링한다. 각 선택된 edge에 대해 distance가 2 이내인 이웃하는 edge들을 suppress하며, 여기서 distance는 인덱스 쌍 간의Chebyshev distance를 의미하며": "distance matrix. Edges are first added between temporally adjacent keyframes, then new edges are sampled from the distance matrix sorted by flow value in ascending order. For each selected edge, neighboring edges within distance 2 are suppressed; here distance means the Chebyshev distance between index pairs and is written as",
    "의 수식으로 나타낸다.": ".",
    "이후에, 수천 frame 및 edge로 구성된 전체 frame graph에 update를 적용하는데, 여기서 correlation volume의 전체 집합을 저장하면 빠르게 비디오 메모리를 초과하기 때문에, 대신 RAFT에서 제안한 메모리 효율적인 방법을 사용한다.": "The update is then applied to the full frame graph, which may contain thousands of frames and edges. Storing the full set of correlation volumes would quickly exceed video memory, so the memory-efficient method proposed in RAFT is used instead.",
    "full BA는 keyframe 이미지에 대해서만 적용하며, non-keyframe들의 pose를 보완하기 위해, keyframe들과 해당 keyframe이 이웃하는 non-keyframe들간의 flow를 반복적으로 추정함으로써 motion-only BA를 수행한다.": "Full BA is applied only to keyframe images. To fill in poses for non-keyframes, motion-only BA is performed by repeatedly estimating flow between keyframes and neighboring non-keyframes.",
    "RGB-D의 경우, 센서 depth의 노이즈나 관측 오류 때문에 여전히 depth를 변수로써 다루고, 간단하게 최적화 단계에서 측정된 depth와 예측된 depth 사이의 squared distance로 페널티를 주는 항을 추가한다.": "For RGB-D, depth is still treated as a variable because sensor depth can be noisy or missing. A simple penalty term is added during optimization for the squared distance between measured and predicted depth.",
    "stereo의 경우, monocular 시스템에서 언급했던 것과 동일한 시스템을 사용하며, 프레임이 2배가 되고, DBA layer에서 좌우 프레임간의 상대 pose를 고정한다. 또한 frame graph에서 cross camera edges(좌우 프레임간 edges)를 통해 stereo 정보를 활용할 수 있다.": "For stereo, the same system as the monocular case is used, but the number of frames doubles and the relative pose between left and right frames is fixed in the DBA layer. Stereo information is used through cross-camera edges between left and right frames in the frame graph.",
    "여러 데이터셋에 대한 DROID-SLAM의 3D reconstruction 결과": "DROID-SLAM 3D reconstruction results on multiple datasets",
    "synthetic TartanAir monocular video로만 학습한 설정이다. 이후 stereo/RGB-D 평가는 같은 모델이 테스트 시점의 추가 제약을 받아들일 수 있는지 확인하는 근거로 읽으면 된다.": "This setting trains only on synthetic TartanAir monocular video. Later stereo/RGB-D results should be read as evidence that the same model can accept additional test-time constraints.",
    "설정값": "Setting Value",
    "입력 해상도 고정": "Fixed input resolution",
    "짧은 video clip 단위 학습": "Training on short video clips",
    "synthetic trajectory에서 반복 최적화 학습": "Learns recurrent optimization on synthetic trajectories",
    "recurrent update가 보는 시간 창": "Temporal window seen by recurrent updates",
    "한 clip 안에서 pose-depth update 반복": "Repeats pose-depth updates within a clip",
    "학습 비용이 큰 편": "Relatively high training cost",
    "단일 모델 학습에 소요": "Time required to train one model",
    "평가 섹션은 dataset 이름보다, 각 dataset이 어떤 실패 모드를 시험하는지와 DROID가 그 실패를 어떻게 줄였는지 먼저 보면 흐름이 잡힌다.": "In the evaluation section, focus first on which failure mode each dataset tests and how DROID reduces that failure, rather than on dataset names alone.",
    "synthetic hard sequence. monocular 0.129, stereo 0.047로 competition top methods 대비 62%/60% error 감소": "Synthetic hard sequences. Monocular 0.129 and stereo 0.047, reducing error by 62% / 60% versus the competition top methods",
    "새 카메라/환경 일반화. monocular 평균 ATE 2.2cm, ORB-SLAM3 성공 sequence 기준 43% error 감소": "Generalization to new cameras/environments. Monocular average ATE is 2.2 cm, with 43% lower error on sequences where ORB-SLAM3 succeeds",
    "rolling shutter, motion blur, heavy rotation이 강한 실내 sequence. 9개 모두 tracking, 평균 ATE 0.038m": "Indoor sequences with strong rolling shutter, motion blur, and heavy rotation. Tracks all 9 sequences, average ATE 0.038 m",
    "RGB-D generalization. train/test split 1위, image 사용 가능 test set 30/32 tracking 성공": "RGB-D generalization. Ranks first on train/test splits and tracks 30/32 usable-image test sequences",
    "EuRoC 데이터셋에서의 Monocular SLAM 결과 (평가: ATE[m])": "Monocular SLAM results on EuRoC (metric: ATE [m])",
    "TUM-RGBD 데이터셋에서의 벤치마크 결과 (평가: ATE[m])": "Benchmark results on TUM-RGBD (metric: ATE [m])",
    "DeepTAM과 TartanVO를 제외한 나머지 방법론들에는 monocular input만 이용하여 평가를 진행했다고 한다.": "Except for DeepTAM and TartanVO, the other methods are evaluated using only monocular input.",
    "RGB-D ETH3D-SLAM 벤치마크의 결과를 보여주고 있다. DROID-SLAM은 32개의 시퀀스중 30개의 시퀀스를 추적 성공했으며, 왼쪽 표는 각 방법론별 AUC 값을 의미하고, 오른쪽 그래프는 성공한 데이터셋의 개수와 ATE를 각 축으로 하여 그린 것이다.": "This shows results on the RGB-D ETH3D-SLAM benchmark. DROID-SLAM successfully tracks 30 of 32 sequences; the left table reports each method's AUC, and the right plot uses the number of successful datasets and ATE as its axes.",
    ": 단순 평균 오차뿐 아니라 failure가 포함된 결과인지 확인": ": Check whether failures are included, not only the mean error",
    ": catastrophic failure가 줄었는지가 DROID-SLAM의 핵심 주장": ": Reducing catastrophic failure is a core DROID-SLAM claim",
    ": backend가 feature map을 저장하므로 긴 sequence에서는 memory가 병목": ": Memory is a bottleneck on long sequences because the backend stores feature maps",
    "본 연구에서는 3D Point를 동차(homogeneous) 좌표계": "The paper represents a 3D point in homogeneous coordinates",
    "로 나타내며, inverse depth": ". Given inverse depth",
    "를 가진 image point": "and image point",
    "가 frame": "is reprojected from frame",
    "에서 frame": "to frame",
    "로 재투영(re-project)되는데, 이를 아래 warping function으로 정의할 수 있다.": ", which is defined as the warping function below.",
    "는 pinhole projection function이고,": "is the pinhole projection function, and",
    "은 inverse projection function이며, camear intrinsic parameter": "is the inverse projection function. Given camera intrinsic parameters",
    "가 주어졌을 때, 각 function을 아래 수식으로 정의할 수 있다.": ", each function is defined by the equations below.",
    "최적화 단계에서는": "During optimization, Jacobians with respect to",
    "에 대한 Jacobian이 필요하며, 본 연구에서는 local parameterization": "are required. The paper uses the local parameterization",
    "를 사용하고,": ", and",
    "는": "is treated as a vector in",
    "(1차원)상의 벡터로써 다룬다. projection, inverse projection function의 Jacobian은 아래와 같이 주어지며,": "(one dimension). The Jacobians of the projection and inverse-projection functions are given as follows.",
    "local parameterization을 통해서, 아래처럼 3D point transformation의 Jacobian을 계산하였고,": "Using local parameterization, the Jacobian of the 3D point transformation is computed as follows.",
    "adjoint 연산자를 이용해 아래처럼": "Using the adjoint operator, the",
    "항을 앞으로 꺼내주었는데,": "term is moved forward as follows.",
    "이를 통해 아래처럼 generator를 이용한 Jacobian 연산이 가능했다.": "This enables the Jacobian computation using generators as shown below.",
    "마지막으로 아래처럼 chain rule을 이용해 변수들에 대한 full Jacobian을 계산할 수 있었고,": "Finally, the full Jacobian with respect to the variables can be computed using the chain rule as follows.",
    "의 translation vector이다.": "is the translation vector.",
    "논문 오타?": "Paper Typo?",
    "구성": "Component",
    "핵심 역할": "Core Role",
    "논문에서 중요한 이유": "Why It Matters in the Paper",
    "학습 설정": "Training Setting",
    "내용": "Content",
    "의미": "Meaning",
    "항목": "Item",
    "설정": "Setting",
    "평가 조건": "Evaluation Setup",
    "주요 결과": "Main Result",
    "해석": "Interpretation",
    "주의": "Caution",
    "비교 의미": "Comparison Meaning",
    "실시간 조건": "Real-time Setup",
    "Memory 병목": "Memory Bottleneck",
    "평가 결과를 읽는 방식": "How to Read the Results",
    "Appendix / Additional Results / Ablations / Jacobian 세부 내용 보기": "View Appendix / Additional Results / Ablations / Jacobian Details",
    "구간": "Part",
    "담고 있는 내용": "What It Contains",
    "역할": "Role",
    "느낀점": "Takeaway",
    "향후계획": "Future Work",
    "향후 계획": "Future Work",
    "업데이트 대상": "Update Target",
    "적용 범위": "Scope",
    "기하 제약": "Geometric Constraint",
    "무엇을 쓰나": "What It Uses",
    "약점 / DROID의 선택": "Weakness / DROID's Choice",
    "State": "State",
    "Frame Graph": "Frame Graph",
    "Update Operator": "Update Operator",
    "DBA Layer": "DBA Layer",
    "SLAM System": "SLAM System",
    "각 frame마다 camera pose와 inverse depth 유지": "Maintain camera pose and inverse depth for each frame",
    "depth를 모든 pixel 단위 변수로 직접 최적화": "Directly optimize depth as per-pixel variables",
    "covisible frame edge로 correlation/BA 대상 정의": "Define correlation/BA targets with covisible-frame edges",
    "long-range edge 추가 시 loop closure 가능": "Long-range edges enable loop closure",
    "correlation, flow, residual, context로 revision/confidence 예측": "Predict revision/confidence from correlation, flow, residual, and context",
    "pose/depth를 직접 찍지 않고 DBA가 풀 수 있는 correspondence target 생성": "Create correspondence targets that DBA can solve instead of directly predicting pose/depth",
    "reprojection objective를 Gauss-Newton으로 풀어 pose/depth update 산출": "Solve the reprojection objective with Gauss-Newton to produce pose/depth updates",
    "network 안에 기하학적 최적화가 들어가는 핵심 장치": "Key mechanism that embeds geometric optimization inside the network",
    "frontend local BA, backend global BA/loop closure, motion-only BA 구성": "Composed of frontend local BA, backend global BA / loop closure, and motion-only BA",
    "논문 모델을 실제 video stream에서 돌아가는 SLAM으로 완성": "Turns the paper model into a SLAM system that runs on real video streams",
    "frame-local map matching으로 current frame pose 추정": "Estimate current-frame pose through frame-local map matching",
    "새 keyframe 추가, local BA, 중복 keyframe 제거": "Add new keyframes, run local BA, remove redundant keyframes",
    "long trajectory drift 누적을 global BA와 loop closure로 줄임": "Reduce long-trajectory drift with global BA and loop closure",
    "이미지 pair의 visual similarity를 dense하게 보관": "Densely stores visual similarity for image pairs",
    "ConvGRU가 correspondence revision과 confidence 예측": "ConvGRU predicts correspondence revision and confidence",
    "Gauss-Newton으로 pose/depth를 jointly update": "Jointly updates pose/depth with Gauss-Newton",
    "monocular ambiguity 제거": "Remove monocular ambiguity",
    "frame selection 안정화": "Stabilize frame selection",
    "pose와 flow를 함께 사용": "Use pose and flow together",
    "한쪽 supervision만으로는 scale/geometry/generalization을 모두 잡기 어려움": "One supervision signal alone is not enough for scale, geometry, and generalization",
    "synthetic TartanAir monocular input으로 한 번만 학습": "Trained once on synthetic TartanAir monocular input",
    "재학습 없이 4개 dataset과 3개 modality에서 평가": "Evaluated on 4 datasets and 3 modalities without retraining",
    "test-time stereo/RGB-D constraint를 DBA objective에 추가 가능": "Test-time stereo/RGB-D constraints can be added to the DBA objective",
    "deep SLAM이 단순히 robust한 대체재가 아니라, classical SLAM 대비 accuracy도 강하게 주장한다는 근거": "Evidence that deep SLAM is not only a robust alternative, but also claims strong accuracy against classical SLAM",
    "평균 오차보다 먼저 tracking loss가 얼마나 줄었는지 확인해야 하는 주장": "For this claim, check tracking-loss reduction before average error",
    "network가 모든 센서에 따로 맞춰진 것이 아니라, optimization layer가 추가 관측 제약을 받아들이는 구조라는 점이 핵심": "The key is that the optimization layer accepts additional observation constraints, not that the network is separately tuned for every sensor",
    "TartanAir, ETH3D, EuRoC, TUM-RGBD에서 기존 방법 대비 큰 오차 감소": "Large error reductions over prior methods on TartanAir, ETH3D, EuRoC, and TUM-RGBD",
    "딥러닝 기반이지만 classical SLAM 대비 정확도도 밀리지 않음": "Learning-based, but still competitive with classical SLAM in accuracy",
    "ETH3D 30/32 시퀀스 추적, 주요 벤치마크에서 catastrophic failure 감소": "Tracks 30/32 ETH3D sequences and reduces catastrophic failure on major benchmarks",
    "tracking loss와 drift 누적 문제를 줄이는지가 핵심": "The key is whether it reduces tracking loss and drift accumulation",
    "synthetic TartanAir monocular 학습 후 여러 real dataset/sensor에 적용": "Trained on synthetic TartanAir monocular video, then applied to multiple real datasets/sensors",
    "DBA layer가 test-time sensor constraint를 받아들이는 구조적 장점": "Structural advantage: the DBA layer can accept test-time sensor constraints",
    "High Accuracy": "High Accuracy",
    "High Robustness": "High Robustness",
    "Strong Generalization": "Strong Generalization",
    "공식 구현, pretrained model, 실행 가이드를 확인할 수 있는 GitHub 저장소": "GitHub repository for the official implementation, pretrained models, and run instructions",
    "Contribution 근거": "Contribution Evidence",
    "Appendix 구성": "Appendix Structure",
    "이 토글은 DROID-SLAM이 기존 deep geometry 방법과 어떻게 다른지 확인하는 짧은 비교 구간이다.": "This short supplement compares DROID-SLAM with earlier deep geometry methods.",
    "video depth와 pose를 반복적으로 다듬는 흐름을 제공.": "Provides an iterative refinement flow for video depth and pose.",
    "학습 네트워크 안에 optimization 구조를 넣는 방향을 보여줌.": "Shows the direction of inserting an optimization structure into a learned network.",
    "correspondence와 confidence를 예측하고 DBA가 pose/depth를 함께 갱신.": "Predicts correspondence and confidence, then lets DBA jointly update pose and depth.",
    "Related Work는 DROID-SLAM이 RAFT식 correspondence update와 classical BA를 어떻게 연결하는지 확인하는 보충 구간이다.": "This supplement shows how DROID-SLAM connects RAFT-style correspondence updates with classical BA.",
    "Backend implementation 세부 보기": "View backend implementation details",
    "global BA가 실제 비디오 길이에서 동작하도록 만드는 frame graph, memory, solver 구현을 접어둔 구간이다.": "This supplement keeps the frame-graph, memory, and solver implementation details that make global BA work on full video sequences.",
    "flow distance로 edge를 다시 고르고 loop closure 후보를 구성.": "Re-selects edges from flow distance and builds loop-closure candidates.",
    "전체 correlation volume 대신 RAFT식 memory-efficient lookup 사용.": "Uses RAFT-style memory-efficient lookup instead of storing the full correlation volume.",
    "test-time에는 custom CUDA와 sparse Cholesky로 block-sparse BA를 처리.": "At test time, custom CUDA and sparse Cholesky handle block-sparse BA.",
    "이어받은 점": "Inherited idea",
    "DROID-SLAM의 차이": "DROID-SLAM difference",
    "correlation volume과 recurrent update": "Correlation volume and recurrent update",
    "flow 자체보다 SLAM state update에 사용": "Used to update SLAM state rather than optical flow itself",
    "학습 기반 pose/depth 추정": "Learning-based pose/depth estimation",
    "pose/depth를 직접 출력하지 않고 optimization target을 생성": "Creates optimization targets instead of directly outputting pose/depth",
    "reprojection error 기반 기하 최적화": "Geometry optimization based on reprojection error",
    "differentiable dense BA layer로 network 안에 결합": "Integrated into the network as a differentiable dense BA layer"  };
  Object.assign(textTranslations, {
    "Problem: learned SLAM은 무엇을 다시 묻는가": "Problem: what does learned SLAM rethink?",
    "Context: classical SLAM은 어디서 실패하나": "Context: where classical SLAM still fails",
    "Gap: learned VO와 Bundle Adjustment 사이에 무엇이 비어 있나": "Gap: what is missing between learned VO and Bundle Adjustment?",
    "Mechanism: recurrent update와 DBA로 어떻게 푸나": "Mechanism: how recurrent updates and DBA solve it",
    "Evidence: 어떤 sensor와 SLAM 조건에서 검증했나": "Evidence: which SLAM settings are tested?",
    "Usage / Limits: 어떤 SLAM 기준선으로 남았나": "Usage / Limits: what baseline does DROID-SLAM leave behind?",
    "ConvGRU는 작은 receptive field를 가지는 local operation이다. 이미지의 공간적 차원(spatial dimension)에 대한 정보를 가지는 hidden state의 평균을 구함으로써 global context를 추출하고, 해당 feature vector를 GRU의 추가적인 입력으로 사용한다. Global context는 SLAM에서 중요한데, 예를 들어 큰 규모의 움직이는 물체는 불완전한 correspondence로 인해 시스템에 성능 저하를 가져오며, network에서는 이를 인지하고 제거하는 것이 중요하다.": "ConvGRU is a local operation with a small receptive field. Global context is extracted by averaging the hidden state over the spatial dimensions of the image, and that feature vector is used as an additional GRU input. Global context matters in SLAM because large moving objects can degrade the system through imperfect correspondence, so the network needs to identify and suppress them.",
    ")를 내놓는데, 이때 depth나 pose의 업데이트를 직접 예측하는 것 대신, dense flow fields 공간에서의 업데이트를 예측한다. 또한 hidden state를 2개의 추가적인 convolution layer에 통과시켜 2개의 출력값을 만드는데, 하나는 revision flow field (": ") as outputs. Instead of directly predicting depth or pose updates, it predicts updates in dense flow-field space. It also passes the hidden state through two additional convolution layers to produce two outputs: one is the revision flow field (",
    "를 공유하는 모든 features를 pooling하고, 각 픽셀별 damping factor ": " are pooled across all features that share the same source view, and a per-pixel damping factor ",
    "가 양수(positive)임을 보장하기 위해 softplus 연산자를 사용한다. 추가적으로 pooling된 features를 이용해 8x8 마스크를 예측하며, 이는 inverse depth 추정에 대한 결과를 upsampling하는 데 사용된다.": " is constrained to be positive with a softplus operator. It also predicts an 8x8 mask from the pooled features, which is used to upsample inverse-depth estimates.",
    "에 가까워지도록(match) pose ": " to match the target, so pose ",
    "을 업데이트해야 한다는 것을 의미한다.": " must be updated."
  });
  Object.assign(textTranslations, {
    "문제": "Problem",
    "해결": "Solution",
    "근거": "Evidence",
    "실세계 조건에서 SLAM failure 발생": "Real-world SLAM failure modes",
    "learned correspondence + DBA loop": "Learned correspondence + DBA loop",
    "4개 benchmark, 3개 sensor로 검증": "4 benchmarks, 3 sensor modes",
    "처리 흐름": "Processing Flow",
    "update operator가 correspondence revision을 만들고, DBA가 이를 pose-depth 갱신으로 바꾸는 순서.": "The update operator produces correspondence revisions, and DBA converts them into pose-depth updates.",
    "입력별 확장": "Input Extension",
    "학습은 monocular에서 출발하지만, test-time objective에 stereo/RGB-D 관측 제약을 추가할 수 있다.": "Training starts from monocular video, but stereo/RGB-D observation constraints can be added to the test-time objective.",
    "DROID-SLAM의 문제의식은 “정확한 기하 최적화”와 “실세계 robustness” 사이의 간극에서 출발한다.": "DROID-SLAM starts from the gap between accurate geometric optimization and real-world robustness.",
    "BA 기반 최적화는 정확하지만 tracking failure, drift, optimization divergence에 취약.": "BA-based optimization is accurate, but vulnerable to tracking failure, drift, and optimization divergence.",
    "일부 failure에는 강하지만 benchmark accuracy와 full SLAM capability가 부족.": "Robust to some failures, but limited in benchmark accuracy and full-SLAM capability.",
    "learned correspondence를 dense BA 안에서 pose-depth update로 바꿀 수 있는가?": "Can learned correspondences be turned into pose-depth updates inside dense BA?",
    "recurrent update와 DBA를 결합하면 accuracy, robustness, sensor generalization을 동시에 얻을 수 있음.": "Combining recurrent updates with DBA can provide accuracy, robustness, and sensor generalization together.",
    "논문이 선택한 핵심 방향은 pose/depth를 직접 회귀하지 않고, DBA가 풀 수 있는 correspondence target을 반복적으로 갱신하는 것이다.": "The key design choice is not to directly regress pose/depth, but to repeatedly update the correspondence targets that DBA can solve.",
    "직접 회귀하지 않음": "No Direct Regression",
    "pose와 depth를 한 번에 출력하면 long trajectory와 loop closure에서 기하 일관성을 유지하기 어렵다.": "Outputting pose and depth in one shot makes geometric consistency difficult over long trajectories and loop closure.",
    "flow revision 예측": "Flow Revision Prediction",
    "update operator는 correlation/residual/context를 보고 correspondence correction과 confidence를 예측한다.": "The update operator reads correlation, residual, and context to predict correspondence corrections and confidence.",
    "DBA로 검증": "DBA Verification",
    "DBA layer가 reprojection objective를 풀어 pose와 inverse depth를 jointly update한다.": "The DBA layer solves a reprojection objective and jointly updates pose and inverse depth.",
    "update operator는 pose와 depth를 직접 완성하는 black box가 아니라, correlation과 flow/residual을 바탕으로 correspondence revision과 confidence를 반복 예측하고, DBA가 이를 pose-depth update로 바꾸도록 연결하는 모듈이다.": "The update operator is not a black box that directly completes pose and depth. It repeatedly predicts correspondence revisions and confidence from correlation plus flow/residual signals, then connects them to DBA so they can be converted into pose-depth updates.",
    "Fig. 1. DROID-SLAM 개요.": "Fig. 1. DROID-SLAM overview.",
    "dense correspondence, recurrent update, BA 기반 trajectory/depth refinement가 하나의 SLAM loop로 연결된다.": "Dense correspondence, recurrent updates, and BA-based trajectory/depth refinement are connected into one SLAM loop.",
    "Fig. 2. Update operator.": "Fig. 2. Update operator.",
    "correlation과 residual 입력을 flow revision 및 confidence로 바꾸고, 이어지는 DBA가 pose-depth 갱신을 수행한다.": "Correlation and residual inputs are converted into flow revisions and confidence; the following DBA performs pose-depth updates.",
    "Fig. 3. DROID-SLAM 3D reconstruction 결과.": "Fig. 3. DROID-SLAM 3D reconstruction results.",
    "Tanks & Temples, ETH3D, TartanAir 등 서로 다른 데이터셋에서 reconstruction 품질과 일반화를 보여주는 예시.": "Examples showing reconstruction quality and generalization across datasets such as Tanks & Temples, ETH3D, and TartanAir.",
    "Table 1. TartanAir monocular benchmark 결과.": "Table 1. TartanAir monocular benchmark results.",
    "challenging synthetic sequence에서 DROID-SLAM의 낮은 drift와 zero failure를 확인하는 표.": "This table checks DROID-SLAM's low drift and zero failures on challenging synthetic sequences.",
    "Table 2. TartanAir test set competition 비교.": "Table 2. TartanAir test-set competition comparison.",
    "ECCV 2020 SLAM competition 상위 submission과 error 및 runtime 성격을 함께 비교한다.": "Compares error and runtime characteristics against top ECCV 2020 SLAM competition submissions.",
    "Table 3. EuRoC monocular SLAM 결과.": "Table 3. EuRoC monocular SLAM results.",
    "ATE[m] 기준으로 real MAV sequence에서 cross-dataset generalization을 평가한다.": "Evaluates cross-dataset generalization on real MAV sequences using ATE[m].",
    "Table 4. TUM-RGBD benchmark 결과.": "Table 4. TUM-RGBD benchmark results.",
    "ATE[m] 기준 평가이며, DeepTAM과 TartanVO를 제외한 나머지 방법은 monocular input으로 비교된다.": "Evaluation is based on ATE[m]; except for DeepTAM and TartanVO, the compared methods use monocular input.",
    "Fig. 4. ETH3D-SLAM RGB-D benchmark 결과.": "Fig. 4. ETH3D-SLAM RGB-D benchmark results.",
    "DROID-SLAM은 test set 32개 sequence 중 30개를 tracking 성공하며, 왼쪽은 AUC, 오른쪽은 성공 sequence 수와 ATE 관계를 보여준다.": "DROID-SLAM successfully tracks 30 of 32 test-set sequences; the left plot shows AUC, and the right plot relates successful sequences to ATE.",
    "평가 섹션은 dataset 이름보다, 각 dataset이 어떤 실패 모드를 시험하는지와 DROID가 그 실패를 어떻게 줄였는지 먼저 보면 흐름이 잡힌다.": "In the evaluation section, first read which failure mode each dataset tests and how DROID reduces it, rather than memorizing dataset names."
  });

  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const phraseTranslations = Object.entries(textTranslations)
    .filter(([ko]) => /[가-힣]/.test(ko) && ko.replace(/\s+/g, " ").trim().length >= 8)
    .sort((a, b) => b[0].length - a[0].length);
  const originalTextNodes = new WeakMap();

  if (!langBtn) return;
  if (langBtn.tagName === "A") {
    const staticLang = root.lang || "ko";
    root.dataset.pageLang = staticLang;
    langBtn.dataset.lang = staticLang;
    return;
  }

  const saved = storageGet("paper-lang");
  let currentLang = languages.includes(saved) ? saved : (root.lang || "ko");

  const applyLang = (lang, persist = true) => {
    currentLang = languages.includes(lang) ? lang : "ko";
    root.lang = currentLang;
    root.dataset.pageLang = currentLang;
    langBtn.dataset.lang = currentLang;
    langBtn.setAttribute("aria-label", currentLang === "ko" ? "Switch to English" : "한국어로 전환");
    langBtn.setAttribute("title", currentLang === "ko" ? "Switch to English" : "한국어로 전환");

    richTranslations.forEach(([selector, en]) => {
      let matches = [];
      try {
        matches = document.querySelectorAll(selector);
      } catch {
        return;
      }
      matches.forEach((el) => {
        if (!el.dataset.i18nKo) el.dataset.i18nKo = el.innerHTML;
        el.innerHTML = currentLang === "en" ? en : el.dataset.i18nKo;
      });
    });

    document.querySelectorAll(".paper-identity :not(script):not(style), .post-body :not(script):not(style), .brandtext, .skip").forEach((el) => {
      Array.from(el.childNodes).forEach((node) => {
        if (node.nodeType !== Node.TEXT_NODE) return;
        if (!originalTextNodes.has(node)) originalTextNodes.set(node, node.nodeValue);
        const original = originalTextNodes.get(node);
        const key = original.replace(/\s+/g, " ").trim();
        if (currentLang === "en" && textTranslations[key]) {
          node.nodeValue = textTranslations[key];
        } else if (currentLang === "en") {
          let translated = original;
          phraseTranslations.forEach(([ko, en]) => {
            translated = translated.replace(new RegExp(escapeRegExp(ko), "g"), en);
          });
          if (/[가-힣]/.test(translated) && key.includes("depth나 pose의 업데이트를 직접 예측하는 것 대신")) {
            translated = ") as outputs. Instead of directly predicting depth or pose updates, it predicts updates in dense flow-field space. It also passes the hidden state through two additional convolution layers to produce two outputs: one is the revision flow field (";
          }
          node.nodeValue = translated;
        } else {
          node.nodeValue = original;
        }
      });
    });

    document.querySelectorAll('script[src*="giscus.app/client.js"]').forEach((script) => {
      script.setAttribute("data-lang", currentLang);
    });

    if (persist) storageSet("paper-lang", currentLang);
    document.dispatchEvent(new CustomEvent("paper-lang-change", {
      detail: { lang: currentLang }
    }));
  };

  applyLang(currentLang, false);

  langBtn.addEventListener("click", () => {
    const nextIndex = (languages.indexOf(currentLang) + 1) % languages.length;
    applyLang(languages[nextIndex]);
  });
})();

(() => {
  const content = document.getElementById("deepDiveContent");
  const button = document.getElementById("deepDiveReveal");
  const wrap = document.getElementById("deepDiveRevealWrap");
  const body = wrap?.closest(".deep-dive-body");

  if (!content || !button || !wrap) return;

  const syncRevealState = () => {
    const collapsed = content.classList.contains("is-collapsed");
    body?.classList.toggle("has-collapsed-active", collapsed);
    button.setAttribute("aria-expanded", String(!collapsed));
    wrap.hidden = !collapsed;
    wrap.classList.toggle("is-visible", collapsed);
    if (collapsed) {
      wrap.removeAttribute("aria-hidden");
    } else {
      wrap.setAttribute("aria-hidden", "true");
    }
  };

  const reveal = () => {
    content.classList.remove("is-collapsed");
    syncRevealState();
    document.dispatchEvent(new CustomEvent("paper-deep-dive-reveal"));
  };

  content.classList.add("is-collapsed");
  syncRevealState();
  button.addEventListener("click", reveal);
  window.addEventListener("pageshow", syncRevealState);
  window.revealDeepDive = reveal;
  window.syncDeepDiveReveal = syncRevealState;
})();

(() => {
  const detailsList = Array.from(document.querySelectorAll("details.supplement-toggle"));
  if (!detailsList.length) return;

  const backdrop = document.createElement("div");
  backdrop.className = "supplement-focus-backdrop";
  backdrop.hidden = true;
  backdrop.setAttribute("aria-hidden", "true");
  document.body.appendChild(backdrop);

  const scrollIndicator = document.createElement("div");
  scrollIndicator.className = "supplement-scroll-indicator";
  scrollIndicator.hidden = true;
  scrollIndicator.setAttribute("aria-hidden", "true");

  const scrollThumb = document.createElement("span");
  scrollThumb.className = "supplement-scroll-indicator-thumb";
  scrollIndicator.appendChild(scrollThumb);
  document.body.appendChild(scrollIndicator);

  const scrollSpacer = document.createElement("div");
  scrollSpacer.className = "supplement-scroll-spacer";
  scrollSpacer.hidden = true;
  scrollSpacer.setAttribute("aria-hidden", "true");
  document.body.appendChild(scrollSpacer);

  let indicatorFrameId = 0;

  const isVisible = (details) => !details.closest("[hidden]");

  const focusedDetails = () => detailsList.find((details) => details.open && isVisible(details));

  const getPanelTopOffset = () => {
    const topbar = document.querySelector(".topbar");
    const topbarHeight = topbar?.offsetHeight || 0;
    const panelGap = 4;
    return Math.max(12, Math.ceil(topbarHeight + panelGap));
  };

  const setWindowScrollTop = (top) => {
    const targetTop = Math.max(0, top);
    const rootStyle = document.documentElement.style;
    const previousScrollBehavior = rootStyle.scrollBehavior;
    const previousOverflowAnchor = rootStyle.overflowAnchor;
    const applyScroll = () => {
      const scroller = document.scrollingElement || document.documentElement;
      rootStyle.scrollBehavior = "auto";
      rootStyle.overflowAnchor = "none";
      document.documentElement.scrollTop = targetTop;
      document.body.scrollTop = targetTop;
      if (scroller) scroller.scrollTop = targetTop;
      window.scrollTo(0, targetTop);
    };

    applyScroll();
    window.setTimeout(applyScroll, 0);
    window.setTimeout(() => {
      applyScroll();
      rootStyle.scrollBehavior = previousScrollBehavior;
      rootStyle.overflowAnchor = previousOverflowAnchor;
    }, 120);
  };

  const reserveScrollRoom = (details) => {
    if (!details || !details.open || !isVisible(details)) {
      scrollSpacer.hidden = true;
      scrollSpacer.style.height = "0px";
      return;
    }

    const panelTopOffset = getPanelTopOffset();
    const bottomInset = window.innerWidth <= 700 ? 14 : 24;
    const reserveHeight = Math.max(0, window.innerHeight - panelTopOffset - bottomInset + 120);
    scrollSpacer.hidden = false;
    scrollSpacer.style.height = `${reserveHeight}px`;
  };

  const alignDetailsToViewport = (details) => {
    const shouldRelock = document.documentElement.classList.contains("supplement-scroll-lock");
    if (shouldRelock) setPageScrollLock(false);
    reserveScrollRoom(details);
    const panelTopOffset = getPanelTopOffset();
    const bottomInset = window.innerWidth <= 700 ? 14 : 24;
    const rect = details.getBoundingClientRect();
    const targetTop = Math.max(0, window.scrollY + rect.top - panelTopOffset);
    setWindowScrollTop(targetTop);
    const alignedRect = details.getBoundingClientRect();
    details.style.setProperty("--supplement-panel-top", `${Math.round(panelTopOffset)}px`);
    details.style.setProperty("--supplement-panel-left", `${Math.round(alignedRect.left)}px`);
    details.style.setProperty("--supplement-panel-width", `${Math.round(alignedRect.width)}px`);
    details.style.setProperty("--supplement-panel-bottom", `${bottomInset}px`);
    if (shouldRelock) setPageScrollLock(true);
  };

  const scheduleOpenAlignment = (details) => {
    const alignAndMeasure = () => {
      if (!details.open || !isVisible(details)) return;
      details.scrollTop = 0;
      alignDetailsToViewport(details);
      updatePanelBounds();
    };

    requestAnimationFrame(() => {
      alignAndMeasure();
      requestAnimationFrame(alignAndMeasure);
    });
    window.setTimeout(alignAndMeasure, 80);
    window.setTimeout(alignAndMeasure, 180);
    window.setTimeout(requestScrollIndicatorUpdate, 220);
  };

  const updatePanelBounds = () => {
    const details = focusedDetails();
    detailsList.forEach((item) => {
      if (item !== details) item.style.removeProperty("--supplement-panel-max-height");
    });
    if (!details) return;

    const panelTopOffset = getPanelTopOffset();
    const bottomInset = window.innerWidth <= 700 ? 14 : 24;
    const availableHeight = window.innerHeight - panelTopOffset - bottomInset;
    details.style.setProperty("--supplement-panel-max-height", `${Math.max(320, availableHeight)}px`);
    const rect = details.getBoundingClientRect();
    details.style.setProperty("--supplement-panel-top", `${Math.round(panelTopOffset)}px`);
    details.style.setProperty("--supplement-panel-left", `${Math.round(rect.left)}px`);
    details.style.setProperty("--supplement-panel-width", `${Math.round(rect.width)}px`);
    details.style.setProperty("--supplement-panel-bottom", `${bottomInset}px`);
  };

  const setPageScrollLock = (shouldLock) => {
    document.documentElement.classList.toggle("supplement-scroll-lock", shouldLock);
    if (shouldLock) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : "";
    } else {
      document.body.style.paddingRight = "";
    }
  };

  const updateScrollIndicator = () => {
    const details = focusedDetails();
    if (!details) {
      scrollIndicator.hidden = true;
      scrollIndicator.classList.remove("is-visible");
      return;
    }

    const maxScroll = details.scrollHeight - details.clientHeight;
    if (maxScroll <= 4) {
      scrollIndicator.hidden = true;
      scrollIndicator.classList.remove("is-visible");
      return;
    }

    const rect = details.getBoundingClientRect();
    const summaryRect = details.querySelector("summary")?.getBoundingClientRect();
    const top = Math.max(14, rect.top + (summaryRect?.height || 48) + 14);
    const height = Math.max(56, Math.min(rect.bottom - top - 16, window.innerHeight - top - 16));
    const right = Math.max(12, window.innerWidth - rect.right + 12);
    const scrollRatio = details.scrollTop / maxScroll;
    const thumbHeight = Math.max(30, height * (details.clientHeight / details.scrollHeight));
    const thumbOffset = (height - thumbHeight) * scrollRatio;

    scrollIndicator.style.setProperty("--supplement-indicator-top", `${top}px`);
    scrollIndicator.style.setProperty("--supplement-indicator-right", `${right}px`);
    scrollIndicator.style.setProperty("--supplement-indicator-height", `${height}px`);
    scrollIndicator.style.setProperty("--supplement-thumb-height", `${thumbHeight}px`);
    scrollIndicator.style.setProperty("--supplement-thumb-offset", `${thumbOffset}px`);
    scrollIndicator.hidden = false;
    scrollIndicator.classList.add("is-visible");
  };

  const requestScrollIndicatorUpdate = () => {
    if (indicatorFrameId) return;
    indicatorFrameId = window.requestAnimationFrame(() => {
      indicatorFrameId = 0;
      updateScrollIndicator();
    });
  };

  const hideScrollIndicator = () => {
    if (indicatorFrameId) {
      window.cancelAnimationFrame(indicatorFrameId);
      indicatorFrameId = 0;
    }
    scrollIndicator.hidden = true;
    scrollIndicator.classList.remove("is-visible");
  };

  const scheduleClosedAlignment = (details) => {
    const alignClosedDetails = () => {
      if (!details || details.open || !isVisible(details)) return;
      const panelTopOffset = getPanelTopOffset();
      const previousScrollMargin = details.style.scrollMarginTop;
      details.style.scrollMarginTop = `${panelTopOffset}px`;
      details.scrollIntoView(true);
      let rect = details.getBoundingClientRect();
      const nativeDelta = rect.top - panelTopOffset;
      if (Math.abs(nativeDelta) > 1) {
        details.style.scrollMarginTop = `${Math.max(0, panelTopOffset - nativeDelta)}px`;
        details.scrollIntoView(true);
        rect = details.getBoundingClientRect();
      }
      const targetTop = Math.max(0, window.scrollY + rect.top - panelTopOffset);
      setWindowScrollTop(targetTop);
      details.style.scrollMarginTop = previousScrollMargin;
    };

    alignClosedDetails();
    window.setTimeout(alignClosedDetails, 0);
    window.setTimeout(alignClosedDetails, 80);
    window.setTimeout(alignClosedDetails, 180);
  };

  const updateFocus = ({ deferIndicator = false } = {}) => {
    const openDetails = detailsList.filter((details) => details.open && isVisible(details));
    const hasOpenDetail = openDetails.length > 0;
    document.body.classList.toggle("supplement-focus-active", hasOpenDetail);
    reserveScrollRoom(openDetails[0]);
    setPageScrollLock(hasOpenDetail);
    backdrop.hidden = !hasOpenDetail;
    detailsList.forEach((details) => {
      details.classList.toggle("is-focused-supplement", details.open && isVisible(details));
    });
    requestAnimationFrame(() => {
      updatePanelBounds();
      if (!hasOpenDetail) {
        hideScrollIndicator();
      } else if (deferIndicator) {
        hideScrollIndicator();
        window.setTimeout(requestScrollIndicatorUpdate, 160);
      } else {
        requestScrollIndicatorUpdate();
      }
    });
  };

  const closeOpenDetails = () => {
    const detailToRestore = detailsList.find((details) => details.open && isVisible(details));
    detailsList.forEach((details) => {
      details.open = false;
    });
    updateFocus();
    if (detailToRestore) scheduleClosedAlignment(detailToRestore);
  };

  const syncLabels = () => {
    const lang = document.documentElement.lang === "en" ? "en" : "ko";
    document.querySelectorAll(".supplement-close-btn").forEach((button) => {
      button.textContent = lang === "en" ? "Close section" : "접기";
      button.setAttribute("aria-label", lang === "en" ? "Close this supplement" : "이 보충 설명 접기");
    });
    document.querySelectorAll(".supplement-lazy-placeholder").forEach((placeholder) => {
      placeholder.textContent = lang === "en" ? "Preparing detailed notes..." : "세부 내용을 준비하는 중...";
    });
  };

  const markSupplementSubheadings = (scope = document) => {
    scope.querySelectorAll("details.supplement-toggle :is(p, blockquote, li, h4)").forEach((node) => {
      if (node.closest("summary, .summary-panel, .result-brief, .section-note, .supplement-close-row")) return;
      const strong = node.querySelector(":scope > strong");
      const text = node.textContent.trim().replace(/\s+/g, " ");
      const strongText = strong?.textContent.trim().replace(/\s+/g, " ");
      const isStandaloneHeading = Boolean(
        strong &&
        node.children.length === 1 &&
        text &&
        text === strongText &&
        text.length <= 90 &&
        !text.startsWith("→") &&
        !text.startsWith("+") &&
        !text.includes("✅") &&
        !text.includes("❌")
      );

      node.classList.toggle("toggle-subheading-line", isStandaloneHeading);
    });
  };

  const skipCloseRestore = new WeakSet();

  const createLazyBody = (details, closeRow) => {
    const contentNodes = Array.from(details.children).filter((node) => (
      node.tagName !== "SUMMARY" && !node.classList.contains("supplement-close-row")
    ));
    const nodeCount = contentNodes.reduce((total, node) => total + node.querySelectorAll("*").length + 1, 0);
    if (nodeCount < 1500) return null;

    const fragment = document.createDocumentFragment();
    const placeholder = document.createElement("div");
    placeholder.className = "supplement-lazy-placeholder";
    let mounted = true;

    const detach = () => {
      if (!mounted) return;
      contentNodes.forEach((node) => fragment.appendChild(node));
      details.insertBefore(placeholder, closeRow);
      mounted = false;
      syncLabels();
    };

    const mount = () => {
      if (mounted) return;
      placeholder.remove();
      details.insertBefore(fragment, closeRow);
      mounted = true;
      markSupplementSubheadings(details);
    };

    detach();
    details.classList.add("has-lazy-supplement-body");
    return { detach, mount };
  };

  detailsList.forEach((details) => {
    if (details.querySelector(":scope > .supplement-close-row")) return;

    const row = document.createElement("div");
    row.className = "supplement-close-row";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "supplement-close-btn";
    button.addEventListener("click", () => {
      details.open = false;
      updateFocus();
      scheduleClosedAlignment(details);
    });

    row.appendChild(button);
    details.appendChild(row);

    details.querySelectorAll("img").forEach((image) => {
      image.loading = "lazy";
      image.decoding = "async";
    });

    const lazyBody = createLazyBody(details, row);

    details.addEventListener("toggle", () => {
      let shouldAlignOnOpen = false;
      if (details.open) {
        details.scrollTop = 0;
        detailsList.forEach((other) => {
          if (other !== details && other.open) {
            skipCloseRestore.add(other);
            other.open = false;
          }
        });
        alignDetailsToViewport(details);
        shouldAlignOnOpen = true;
        if (lazyBody) {
          details.classList.add("is-loading-supplement");
          window.setTimeout(() => {
            if (!details.open || !isVisible(details)) return;
            lazyBody.mount();
            details.classList.remove("is-loading-supplement");
            details.scrollTop = 0;
            scheduleOpenAlignment(details);
            updateFocus({ deferIndicator: true });
          }, 60);
        }
      } else {
        const shouldRestoreOnClose = !skipCloseRestore.has(details);
        skipCloseRestore.delete(details);
        if (lazyBody) {
          lazyBody.detach();
          details.classList.remove("is-loading-supplement");
        }
        updateFocus({ deferIndicator: shouldAlignOnOpen });
        if (shouldRestoreOnClose) scheduleClosedAlignment(details);
        return;
      }
      updateFocus({ deferIndicator: shouldAlignOnOpen });
      if (shouldAlignOnOpen) scheduleOpenAlignment(details);
    });
    details.addEventListener("scroll", requestScrollIndicatorUpdate, { passive: true });
  });

  backdrop.addEventListener("click", closeOpenDetails);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("supplement-focus-active")) {
      closeOpenDetails();
    }
  });
  window.addEventListener("resize", () => {
    updatePanelBounds();
    requestScrollIndicatorUpdate();
  });

  syncLabels();
  markSupplementSubheadings();
  updateFocus();

  new MutationObserver(() => {
    syncLabels();
    markSupplementSubheadings();
    updateFocus();
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"]
  });
})();


(() => {
  const post = document.querySelector(".post-body");
  const sidebarList = document.getElementById("sectionBookmarkList");
  const labels = [
    document.getElementById("currentSectionLabel")
  ].filter(Boolean);

  if (!post || !sidebarList || labels.length === 0) return;

  const normalizeLabel = (text) => text.replace(/\s+/g, " ").trim();
  const collectHeadings = () => Array.from(
    post.querySelectorAll(".paper-map h2, .deep-dive > h2, .deep-dive h3[id], .deep-dive blockquote[id]")
  ).filter((el) => {
    const label = normalizeLabel(el.textContent || "");
    return label && !el.closest("details") && !el.closest(".deep-dive-content.is-collapsed");
  });

  let sections = [];
  let links = [];

  const buildLinks = () => {
    sidebarList.innerHTML = "";
    sections = collectHeadings().map((el, index) => {
      if (!el.id) el.id = `paper-section-${index + 1}`;
      const label = normalizeLabel(el.textContent || "");
      const level = el.matches("blockquote") ? "minor" : "major";
      return { el, id: el.id, label, level };
    });

    links = sections.map((section) => {
      const link = document.createElement("a");
      link.className = `bookmark-link ${section.level}`;
      link.href = `#${section.id}`;
      link.textContent = section.label;
      link.dataset.targetSection = section.id;
      sidebarList.appendChild(link);
      link.addEventListener("click", (event) => {
        event.preventDefault();

        if (section.el.closest(".deep-dive-content.is-collapsed")) {
          window.revealDeepDive?.();
        }

        const targetTop = section.el.getBoundingClientRect().top + window.pageYOffset - topOffset();

        lockedSection = section;
        window.clearTimeout(unlockTimer);
        setActive(section);

        if (typeof window.scrollTo === "function") {
          window.scrollTo({ top: targetTop, behavior: "smooth" });
        } else {
          document.documentElement.scrollTop = targetTop;
          document.body.scrollTop = targetTop;
        }

        history.replaceState(null, "", `#${section.id}`);
        unlockTimer = window.setTimeout(() => {
          lockedSection = null;
          update();
        }, 900);
      });
      return link;
    });
  };

  buildLinks();
  if (sections.length === 0) return;

  const ensureBookmarkVisible = (link) => {
    const listRect = sidebarList.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const pad = 8;

    if (linkRect.top < listRect.top + pad) {
      sidebarList.scrollTop -= (listRect.top + pad) - linkRect.top;
    } else if (linkRect.bottom > listRect.bottom - pad) {
      sidebarList.scrollTop += linkRect.bottom - (listRect.bottom - pad);
    }
  };

  const topOffset = () => {
    const topbar = document.querySelector(".topbar");
    return (topbar?.getBoundingClientRect().height || 0) + 22;
  };

  let activeSectionId = "";
  let lockedSection = null;
  let unlockTimer = 0;

  const setActive = (active) => {
    labels.forEach((label) => {
      label.textContent = active.label;
    });

    let activeLink = null;
    links.forEach((link) => {
      const isActive = link.dataset.targetSection === active.id;
      link.classList.toggle("active", isActive);
      if (isActive) activeLink = link;
    });

    if (activeLink && activeSectionId !== active.id) {
      activeSectionId = active.id;
      ensureBookmarkVisible(activeLink);
    }
  };

  let ticking = false;
  const update = () => {
    ticking = false;
    const probeY = topOffset() + 8;

    if (lockedSection) {
      setActive(lockedSection);
      const distance = Math.abs(lockedSection.el.getBoundingClientRect().top - topOffset());
      if (distance > 3) return;
      window.clearTimeout(unlockTimer);
      lockedSection = null;
    }

    let active = sections[0];
    for (const section of sections) {
      const top = section.el.getBoundingClientRect().top;
      if (top <= probeY) active = section;
      else break;
    }
    setActive(active);
  };

  const scheduleUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  document.addEventListener("paper-lang-change", () => {
    sections.forEach((section, index) => {
      const label = normalizeLabel(section.el.textContent || "");
      if (!label) return;
      section.label = label;
      links[index].textContent = label;
    });
    const active = sections.find((section) => section.id === activeSectionId) || sections[0];
    setActive(active);
    scheduleUpdate();
  });
  document.addEventListener("paper-deep-dive-reveal", () => {
    buildLinks();
    lockedSection = null;
    activeSectionId = "";
    update();
  });
  update();
})();

(() => {
  const splitTopLevelCommas = (tex) => {
    const parts = [];
    let buffer = "";
    let depth = 0;

    for (const char of tex) {
      if ("([{".includes(char)) depth += 1;
      if (")]}".includes(char)) depth = Math.max(0, depth - 1);
      if (char === "," && depth === 0) {
        parts.push(buffer.trim());
        buffer = "";
      } else {
        buffer += char;
      }
    }

    if (buffer.trim()) parts.push(buffer.trim());
    return parts;
  };

  const prettifyTex = (tex) => tex
    .replace(/\\mathbb\{R\}/g, "ℝ")
    .replace(/\\Delta/g, "Δ")
    .replace(/\\delta/g, "δ")
    .replace(/\\lambda/g, "λ")
    .replace(/\\xi/g, "ξ")
    .replace(/\\theta/g, "θ")
    .replace(/\\rho/g, "ρ")
    .replace(/\\sigma/g, "σ")
    .replace(/\\Sigma/g, "Σ")
    .replace(/\\Pi/g, "Π")
    .replace(/\\infty/g, "∞")
    .replace(/\\times/g, "×")
    .replace(/\\_/g, "_")
    .replace(/_\{([^{}]+)\}/g, "_$1")
    .replace(/\^\{([^{}]+)\}/g, "^$1")
    .replace(/\\(?:mathrm|mathit|text)\{([^{}]*)\}/g, "$1")
    .replace(/\\,/g, " ")
    .replace(/\s+/g, " ")
    .replace(/Δ\s+([A-Za-zξ])/g, "Δ$1")
    .trim();

  document.querySelectorAll(".notion-text-equation-token").forEach((token) => {
    if (token.classList.contains("equation-split-source")) return;
    if (token.closest("figure.equation, .equation-container, .katex-display")) return;

    const annotation = token.querySelector('annotation[encoding="application/x-tex"]');
    const tex = annotation?.textContent?.trim();
    if (!tex || !tex.includes(",")) return;

    const parts = splitTopLevelCommas(tex).filter(Boolean);
    if (parts.length < 2) return;
    const prettyParts = parts.map(prettifyTex);
    if (prettyParts.some((part) => /\\[A-Za-z]+/.test(part))) return;
    if (prettyParts.some((part) => part.length > 18 || /[=⟨⟩]/.test(part))) return;

    const group = document.createElement("span");
    group.className = "equation-chip-group";
    group.setAttribute("aria-label", prettifyTex(tex));

    prettyParts.forEach((part, index) => {
      if (index > 0) {
        const comma = document.createElement("span");
        comma.className = "equation-chip-comma";
        comma.setAttribute("aria-hidden", "true");
        comma.textContent = ",";
        group.appendChild(comma);
      }

      const chip = document.createElement("span");
      chip.className = "equation-chip-part";
      chip.textContent = part;
      group.appendChild(chip);
    });

    token.classList.add("equation-split-source");
    token.setAttribute("aria-hidden", "true");
    token.after(group);
  });
})();

(function setupLightbox() {
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  const lbClose = document.getElementById("lightboxClose");
  if (!lb || !lbImg) return;

  function open(src) {
    lbImg.src = src;
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    lbImg.src = "";
    document.body.style.overflow = "";
  }

  lbClose?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    close();
  });

  document.addEventListener("click", (event) => {
    const img = event.target.closest(".post-body img");
    if (!img) return;
    event.preventDefault();
    open(img.src);
  });

  lb.addEventListener("click", (event) => {
    if (event.target === lb) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
})();

// Paper body copy guard: 2026-06-02
(() => {
  const protectedSelector = ".post-body";
  const insideProtectedBody = (node) => {
    if (!node) return false;
    const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    return Boolean(element?.closest?.(protectedSelector));
  };
  const protectedSelectionActive = () => {
    const selection = window.getSelection?.();
    if (!selection || selection.isCollapsed) return false;
    return insideProtectedBody(selection.anchorNode) || insideProtectedBody(selection.focusNode);
  };
  const clearSelection = () => window.getSelection?.()?.removeAllRanges?.();

  document.addEventListener("selectstart", (event) => {
    if (insideProtectedBody(event.target)) event.preventDefault();
  });
  document.addEventListener("dragstart", (event) => {
    if (insideProtectedBody(event.target)) event.preventDefault();
  });
  ["copy", "cut"].forEach((eventName) => {
    document.addEventListener(eventName, (event) => {
      if (!protectedSelectionActive()) return;
      event.preventDefault();
      event.clipboardData?.setData("text/plain", "");
      clearSelection();
    });
  });
})();
