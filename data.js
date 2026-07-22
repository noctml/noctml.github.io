window.SITE_DATA = {
        paperGroups: [
            "Visual SLAM",
            "Dynamic SLAM",
            "3D Perception",
            "3D Reconstruction",
            "Semantic / Scene Graph",
            "Change Detection",
            "Neural Rendering"
        ],
        paperReviews: [


            {
                title: "SLAM-Former: Putting SLAM into One Transformer",
                desc: "하나의 transformer로 dense SLAM의 frontend와 backend global refinement를 묶는 시스템.",
                href: "pages/paper_reviews/SLAM-Former/",
                thumb: "pages/paper_reviews/SLAM-Former/assets/slam-former-putting-slam-into-one-transformer/media/media_97253105ec63.png",
                published: true,
                date: "2026-06-24",
                group: "Visual SLAM",
                tags: ["Visual SLAM", "Dense SLAM", "Transformer", "Global Refinement"]
            },{
                title: "Flash-Mono: Feed-Forward Accelerated Gaussian Splatting Monocular SLAM",
                desc: "feed-forward prediction과 hidden-state loop closure로 monocular GS-SLAM을 실시간화",
                href: "pages/paper_reviews/FLASH-MONO/",
                thumb: "pages/paper_reviews/FLASH-MONO/assets/flash-mono-feed-forward-accelerated-gaussian-splatting-monocular-slam/media/media_6d217a34da2d.png",
                published: true,
                date: "2026-06-13",
                group: "Visual SLAM",
                tags: ["Visual SLAM", "Gaussian Splatting", "Monocular SLAM", "Feed-forward"]
            },{
                title: "RoDyn-SLAM: Robust Dynamic Dense RGB-D SLAM with Neural Radiance Fields",
                desc: "동적 RGB-D 장면에서 motion mask와 edge reprojection으로 neural dense SLAM을 안정화",
                href: "pages/paper_reviews/RoDyn-SLAM/",
                thumb: "pages/paper_reviews/RoDyn-SLAM/assets/rodyn-slam-robust-dynamic-dense-rgb-d-slam-with-neural-radiance-fields/media/media_64afa20cc5e5.png",
                published: true,
                date: "2026-06-09",
                group: "Dynamic SLAM",
                tags: ["Dynamic SLAM", "RGB-D SLAM", "Neural Field", "Motion Mask"]
            },{
                title: "VINS-Mono: A Robust and Versatile Monocular Visual-Inertial State Estimator",
                desc: "monocular camera와 IMU를 결합해 initialization, sliding-window VIO, relocalization을 하나로 묶은 state estimator",
                href: "pages/paper_reviews/VINS-Mono/",
                thumb: "pages/paper_reviews/VINS-Mono/assets/vins-mono-a-robust-and-versatile-monocular-visual-inertial-state-estimator/media/media_9e222b96c7bd.png",
                published: true,
                date: "2026-06-08",
                group: "Visual SLAM",
                tags: ["Visual SLAM", "VIO", "IMU Preintegration", "Loop Closure"]
            },
            {
                title: "TTT3R: 3D Reconstruction as Test-Time Training",
                desc: "test-time state update로 long-context 3D reconstruction의 forgetting을 완화",
                href: "pages/paper_reviews/TTT3R/",
                thumb: "pages/paper_reviews/TTT3R/assets/ttt3r-3d-reconstruction-as-test-time-training/media/TTT3R_Figure1_figure_only_safe_1200dpi.png",
                published: true,
                date: "2026-05-31",
                group: "3D Reconstruction",
                tags: ["3D Reconstruction", "Test-Time Training", "Recurrent State", "CUT3R"]
            },
            {
                title: "GRS-SLAM3R: Real-Time Dense SLAM with Gated Recurrent State",
                desc: "gated recurrent state와 submap alignment로 RGB-only dense SLAM을 실시간화",
                href: "pages/paper_reviews/GRS-SLAM3R/",
                thumb: "pages/paper_reviews/GRS-SLAM3R/assets/grs-slam3r-real-time-dense-slam-with-gated-recurrent-state/media/media_ca9430b6fee1.png",
                published: true,
                date: "2026-05-30",
                group: "Visual SLAM",
                tags: ["Dense SLAM", "DUSt3R", "Gated Recurrent State", "Submap"]
            },{
                title: "4D Spatio-Temporal ConvNets: Minkowski Convolutional Neural Networks",
                desc: "Sparse tensor와 generalized sparse convolution으로 3D/4D 데이터를 효율적으로 처리하는 Minkowski Engine",
                href: "pages/paper_reviews/MinkowskiCNN/",
                thumb: "pages/paper_reviews/MinkowskiCNN/assets/4d-spatio-temporal-convnets-minkowski-convolutional-neural-networks/media/media_c45702943ee2.png",
                published: true,
                date: "2026-05-29",
                group: "3D Perception",
                tags: ["Sparse CNN", "Minkowski Engine", "3D/4D Perception", "Sparse Tensor"]
            },{
                title: "MapAnything: Universal Feed-Forward Metric 3D Reconstruction",
                desc: "다양한 기하 입력을 통합하는 universal metric 3D reconstruction",
                href: "pages/paper_reviews/MapAnything/",
                thumb: "pages/paper_reviews/MapAnything/assets/논문-스터디/media/media_6bee02b26bbe.png",
                published: true,
                date: "2026-05-27",
                group: "3D Reconstruction",
                tags: ["3D Reconstruction", "Metric 3D", "Feed-forward", "Foundation Model"]
            },{
                title: "MonST3R: A Simple Approach for Estimating Geometry in the Presence of Motion",
                desc: "동적 장면으로 확장한 DUSt3R 기반 video geometry 모델",
                href: "pages/paper_reviews/MonST3R/",
                thumb: "pages/paper_reviews/MonST3R/assets/monst3r-a-simple-approach-for-estimating-geometry-in-the-presence-of-motion/media/media_7339fc70b774.png",
                published: true,
                date: "2026-05-27",
                group: "3D Reconstruction",
                tags: ["3D Reconstruction", "Dynamic Scene", "Video Geometry", "DUSt3R"]
            },{
                title: "DUSt3R: Geometric 3D Vision Made Easy",
                desc: "Calibration 없이 pointmap으로 푸는 범용 3D reconstruction",
                href: "pages/paper_reviews/DUSt3R/",
                thumb: "pages/paper_reviews/DUSt3R/assets/dust3r/media/media_57b92f159fa8.png",
                published: true,
                date: "2026-05-27",
                group: "3D Reconstruction",
                tags: ["3D Reconstruction", "Pointmap", "Calibration-free", "Stereo"]
            },{
                title: "WildPose: A Unified Framework for Robust Pose Estimation in the Wild",
                desc: "Dynamic distractor에 강한 monocular camera pose estimation 방법",
                href: "pages/paper_reviews/WildPose/",
                thumb: "pages/paper_reviews/WildPose/assets/1차-수정본/media/media_4223930ab3c8.jpg",
                published: true,
                date: "2026-05-26",
                group: "Dynamic SLAM",
                tags: ["Dynamic Scene", "Pose Estimation", "Motion Mask", "Visual SLAM"]
            },
            {
                title: "WildGS-SLAM: Monocular Gaussian Splatting SLAM in Dynamic Environments",
                desc: "동적 환경에서 3D Gaussian map을 안정적으로 구성하는 monocular SLAM",
                href: "pages/paper_reviews/WildGS-SLAM/",
                thumb: "pages/paper_reviews/WildGS-SLAM/assets/1차-수정본/media/media_e1c5b9eba121.png",
                published: true,
                date: "2026-05-26",
                group: "Dynamic SLAM",
                tags: ["Dynamic Scene", "3DGS", "Uncertainty", "SLAM"]
            },
            {
                title: "Continuous 3D Perception Model with Persistent State",
                desc: "Persistent state로 연속 이미지의 3D 구조와 카메라를 예측하는 모델",
                href: "pages/paper_reviews/CUT3R/",
                thumb: "pages/paper_reviews/CUT3R/assets/1차-수정본/media/media_c95129ba6731.png",
                published: true,
                date: "2026-05-26",
                group: "3D Reconstruction",
                tags: ["3D Reconstruction", "Persistent State", "Video Geometry", "Feed-forward"]
            },
            {
                title: "Dynamic Visual SLAM using a General 3D Prior",
                desc: "geometric SLAM + feed-forward reconstruction model",
                href: "pages/paper_reviews/3D-Prior/",
                thumb: "pages/paper_reviews/3D-Prior/assets/dynamic-visual-slam-using-a-general-3d-prior/media/media_526d869c2e2b.png",
                published: true,
                date: "2026-05-22",
                group: "Dynamic SLAM",
                tags: ["Dynamic SLAM", "3D Prior", "Feed-forward", "Bundle Adjustment"]
            },
            {
                title: "DROID-SLAM in the Wild",
                desc: "dynamic uncertainty를 DBA에 넣어 in-the-wild RGB SLAM을 안정화",
                href: "pages/paper_reviews/DROID-W/",
                thumb: "pages/paper_reviews/DROID-W/assets/droid-slam-in-the-wild/media/media_93795521defc.jpg",
                published: true,
                date: "2026-05-22",
                group: "Dynamic SLAM",
                tags: ["Dynamic SLAM", "DROID-SLAM", "Uncertainty", "Metric Depth"]
            },
            {
                title: "DynaSLAM: Tracking, Mapping and Inpainting in Dynamic Scenes",
                desc: "근본 Dynamic SLAM",
                href: "pages/paper_reviews/DynaSLAM/",
                thumb: "pages/paper_reviews/DynaSLAM/assets/dynaslam-tracking-mapping-and-inpainting-in-dynamic-scenes/media/media_d8edd9fb5f2d.png",
                published: true,
                date: "2026-05-22",
                group: "Dynamic SLAM",
                tags: ["Dynamic SLAM", "ORB-SLAM2", "Segmentation", "Inpainting"]
            },
            {
                title: "Chamelion: Reliable Change Detection for Long-Term LiDAR Mapping in Transient Environments",
                desc: "4D CNN을 사용한 scan-map 변화탐지 및 장기 map 업데이트 시스템",
                href: "pages/paper_reviews/Chamelion/",
                thumb: "pages/paper_reviews/Chamelion/assets/chamelion-reliable-change-detection-for-long-term-lidar-mapping-in-transient-environments/media/media_3c5b4f92d139.png",
                published: true,
                date: "2026-05-03",
                group: "Change Detection",
                tags: ["Change Detection", "LiDAR Mapping", "4D Sparse CNN", "Long-term Mapping"]
            },
            {
                title: "VGGT-SLAM: Dense RGB SLAM Optimized on the SL(4) Manifold",
                desc: "VGGT submap을 SL(4)에서 최적화해 monocular projective ambiguity를 해결하는 SLAM",
                href: "pages/paper_reviews/VGGT-SLAM/",
                thumb: "pages/paper_reviews/VGGT-SLAM/assets/%EB%85%BC%EB%AC%B8-%EC%8A%A4%ED%84%B0%EB%94%94/media/media_1f425cdcdbf8.png",
                published: true,
                date: "2026-03-25",
                group: "Visual SLAM",
                tags: ["Visual SLAM", "Dense SLAM", "VGGT", "SL(4)", "Projective Geometry"]
            },
            {
                title: "VGGT: Visual Geometry Grounded Transformer",
                desc: "multi-view geometry를 single feed-forward transformer로 해결하는 모델",
                href: "pages/paper_reviews/VGGT/",
                thumb: "pages/paper_reviews/VGGT/assets/%EB%85%BC%EB%AC%B8-%EC%8A%A4%ED%84%B0%EB%94%94/media/media_960e81560e52.png",
                published: true,
                date: "2026-03-07",
                group: "3D Reconstruction",
                tags: ["3D Reconstruction", "Transformer", "Multi-view Geometry", "Foundation Model"]
            },
            {
                title: "NeRF: Representing Scenes as Neural Radiance Fields for View Synthesis",
                desc: "MLP를 이용해 3D 장면을 연속적으로 표현하고 novel view에서 새로운 시점을 합성",
                href: "pages/paper_reviews/NeRF/",
                thumb: "pages/paper_reviews/NeRF/assets/%EB%85%BC%EB%AC%B8-%EC%8A%A4%ED%84%B0%EB%94%94/media/media_7f98f396ea3d.png",
                published: true,
                date: "2026-02-24",
                group: "Neural Rendering",
                tags: ["Neural Rendering", "Radiance Field", "View Synthesis", "Volume Rendering"]
            },
            {
                title: "Khronos: A Unified Approach for Spatio-Temporal Metric-Semantic SLAM in Dynamic Environments",
                desc: "시공간 지도를 형성하며 동시에 위치를 추정하는 변화 탐지 SLAM",
                href: "pages/paper_reviews/Khronos/",
                thumb: "pages/paper_reviews/Khronos/assets/%EB%85%BC%EB%AC%B8-%EC%8A%A4%ED%84%B0%EB%94%94/media/media_92ee26026671.png",
                published: true,
                date: "2026-02-16",
                group: "Semantic / Scene Graph",
                tags: ["Metric-Semantic SLAM", "Dynamic Scene", "Scene Graph", "Spatio-temporal"]
            },
            {
                title: "SLIM-VDB: A Real-Time 3D Probabilistic Semantic Mapping Framework",
                desc: "OpenVDB를 이용하여 효율적인 메모리 활용 및 연산을 이끌어낸 경량 Semantic Mapping 시스템",
                href: "pages/paper_reviews/SLIM-VDB/",
                thumb: "pages/paper_reviews/SLIM-VDB/assets/%EB%85%BC%EB%AC%B8-%EC%8A%A4%ED%84%B0%EB%94%94/media/media_c530c0da14c7.png",
                published: true,
                date: "2026-01-30",
                group: "Semantic / Scene Graph",
                tags: ["Semantic Mapping", "OpenVDB", "Probabilistic Mapping", "Real-time"]
            },
            {
                title: "3D Dynamic Scene Graphs: Actionable Spatial Perception with Places, Objects, and Humans",
                desc: "3D Scene Graph에서 동적 객체 처리를 보완",
                href: "pages/paper_reviews/3D_DSG/",
                thumb: "pages/paper_reviews/3D_DSG/assets/%EB%85%BC%EB%AC%B8-%EC%8A%A4%ED%84%B0%EB%94%94/media/media_275d2cf844ae.png",
                published: true,
                date: "2026-01-25",
                group: "Semantic / Scene Graph",
                tags: ["Dynamic Scene Graph", "Spatial Perception", "Humans", "Objects"]
            },
            {
                title: "3D Scene Graph: A Structure for Unified Semantics, 3D Space, and Camera",
                desc: "Sementic SLAM의 기반",
                href: "pages/paper_reviews/3D_SG/",
                thumb: "pages/paper_reviews/3D_SG/assets/%EB%85%BC%EB%AC%B8-%EC%8A%A4%ED%84%B0%EB%94%94/media/media_527fc720dfd5.png",
                published: true,
                date: "2026-01-25",
                group: "Semantic / Scene Graph",
                tags: ["Scene Graph", "Semantic SLAM", "3D Space", "Camera"]
            },
            {
                title: "DROID-SLAM: Deep Visual SLAM for Monocular, Stereo, and RGB-D Cameras",
                desc: "딥러닝을 이용한 SLAM 최적화 방식 제안",
                href: "pages/paper_reviews/DROID-SLAM/",
                thumb: "pages/paper_reviews/DROID-SLAM/assets/%EB%85%BC%EB%AC%B8-%EC%8A%A4%ED%84%B0%EB%94%94/media/media_ccc922409c76.png",
                published: true,
                date: "2026-01-25",
                group: "Visual SLAM",
                tags: ["Visual SLAM", "DROID-SLAM", "Differentiable BA", "Deep Learning"]
            },
            {
                title: "ORB-SLAM2: an Open-Source SLAM System for Monocular, Stereo and RGB-D Cameras",
                desc: "근본 Visual SLAM",
                href: "pages/paper_reviews/ORB-SLAM2/",
                thumb: "pages/paper_reviews/ORB-SLAM2/assets/논문-스터디/media/media_f09800510a62.png",
                published: true,
                date: "2026-01-25",
                group: "Visual SLAM",
                tags: ["Visual SLAM", "ORB-SLAM2", "Classical SLAM", "Bundle Adjustment"]
            },
        ],
        study: [
            {
                title: "VGGT-SLAM 2.0: Real-time Dense Feed-forward Scene Reconstruction",
                desc: "RAISE LAB Study",
                href: "pages/study/VGGT-SLAM2.0/",
                thumb: "pages/study/VGGT-SLAM2.0/assets/thumbnail.png?v=20260716",
                published: true,
                date: "2026-07-16",
                tags: ["Study", "Visual SLAM", "VGGT", "Dense Reconstruction"]
            },
            {
                title: "VGGT4D: Mining Motion Cues in Visual Geometry Transformers for 4D Scene Reconstruction",
                desc: "RAISE LAB Study",
                href: "pages/study/VGGT4D/",
                thumb: "pages/study/VGGT4D/assets/thumbnail.png?v=20260710",
                published: true,
                date: "2026-07-10",
                tags: ["Study", "4D Reconstruction", "VGGT", "Dynamic Scene"]
            },
            {
                title: "Easi3R: Estimating Disentangled Motion from DUSt3R Without Training",
                desc: "RAISE LAB Study",
                href: "pages/study/Easi3R/",
                thumb: "pages/study/Easi3R/assets/thumbnail.png?v=20260710",
                published: true,
                date: "2026-07-01",
                tags: ["Study", "3D Reconstruction", "DUSt3R", "Dynamic Scene"]
            },
            {
                title: "SLAM-Former: Putting SLAM into One Transformer",
                desc: "RAISE LAB Study",
                href: "pages/study/SLAM-Former/",
                thumb: "pages/study/SLAM-Former/assets/thumbnail.png?v=20260710",
                published: true,
                date: "2026-06-26",
                tags: ["Study", "Visual SLAM", "Transformer", "Dense SLAM"]
            },
            {
                title: "GPT Study",
                desc: "Andrej Karpathy 유튜브 강의 정리",
                href: "pages/study/GPT-Study/",
                thumb: "pages/study/GPT-Study/assets/transformer-block.png?v=20260722",
                published: true,
                date: "2025-12-26",
                tags: ["Study", "GPT", "Transformer", "Language Model", "PyTorch"]
            },
            {
                title: "OpenCV Study",
                desc: "Take-Out 동아리 신입부원 5주차 스터디 멘토링",
                href: "pages/study/Take-Out-OpenCV/",
                thumb: "pages/study/Take-Out-OpenCV/assets/thumbnail.png?v=20260717",
                published: true,
                date: "2025-11-11",
                tags: ["Study", "OpenCV", "Image Processing", "Computer Vision"]
            },
            {
                title: "RANSAC",
                desc: "ML Active Learning",
                href: "pages/study/RANSAC/",
                thumb: "pages/study/RANSAC/assets/thumbnail.png?v=20260722",
                published: true,
                date: "2025-11-03",
                tags: ["Study", "Machine Learning", "RANSAC", "Robust Estimation"]
            }
        ],
        projects: [
            {
                title: "2D SLAM & Navigation in Gazebo",
                desc: "Gazebo custom world에서 map을 생성하고 Nav2 자율주행 안정성을 비교한 실험 기록",
                href: "pages/projects/TurtleBot3-SLAM/",
                published: true,
                date: "2025-12-11",
                tags: ["TurtleBot3", "Gazebo", "2D LiDAR", "SLAM", "Nav2"],
                thumb: "pages/projects/TurtleBot3-SLAM/assets/world-indoor.png?v=20260722"
            },
            {
                title: "LIMO 자율주행 프로젝트",
                desc: "RGB 카메라, 2D LiDAR, Depth 카메라를 활용한 트랙 주행과 장애물 회피 구현 기록",
                href: "pages/projects/LiMO/",
                published: true,
                date: "2025-08-21",
                tags: ["LIMO", "ROS2", "OpenCV", "LiDAR", "Autonomous Driving"],
                thumb: "pages/projects/LiMO/실험 정리/image 4.png"
            },
            {
                title: "ORB-SLAM2 in macOS",
                desc: "MacBook에서 ORB-SLAM2를 실행하고 평가한 기록",
                href: "pages/projects/ORB-SLAM2-macOS/",
                published: true,
                date: "2026-06-01",
                tags: ["ORB-SLAM2", "macOS", "Visual SLAM", "Pangolin", "evo"],
                thumb: "pages/projects/ORB-SLAM2-macOS/assets/demo/orb_slam2_macos_thumb.jpg"
            },
        {
            title: "ORB-SLAM2",
            desc: "오픈소스 실습",
            href: "pages/projects/ORB-SLAM2_tut/",
            published: true,
            date: "2026-05-09",
            tags: ["ORB-SLAM2", "Visual SLAM", "GitHub"],
            thumb: "pages/projects/ORB-SLAM2_tut/assets/thumb/media_6e1be0e7619d.jpg"
        },
            {
                title: "VGGT-SLAM 실습",
                desc: "오픈소스 실습 진행 (with office, custom dataset)",
                href: "pages/projects/VGGT-SLAM/",
                thumb: "pages/projects/VGGT-SLAM/assets/실습-진행/media/media_f58800e22a2b.png",
                published: true,
                date: "2026-05-09"
            },
    ]
};
