---
layout: single
title: "Wooseok Song"
permalink: /about/
author_profile: true
comments: false
classes:
  - about-page
---

<div class="about-profile-overview" lang="en">
  <figure class="about-profile-photo">
    <img src="{{ '/assets/images/about/wooseok-song.png' | relative_url }}" alt="Wooseok Song" loading="eager" decoding="async">
  </figure>

  <div class="about-profile-side">
    <section class="about-profile-section" aria-labelledby="about-education">
      <h2 id="about-education">Education</h2>
      <ul class="about-compact-list">
        <li><strong>Gachon University</strong><span><strong>B.S.</strong> in Artificial Intelligence, expected Feb. 2027 · GPA 4.09/4.5</span></li>
      </ul>
    </section>

    <section class="about-profile-section" aria-labelledby="about-experience">
      <h2 id="about-experience">Research Experience</h2>
      <dl class="about-timeline">
        <div>
          <dt>Apr. 2026 - Present</dt>
          <dd><strong>Undergraduate Research Intern, <a class="about-inline-link" href="https://raise-gachon.github.io/" target="_blank" rel="noopener noreferrer">RAISE Lab</a></strong><span>Learning-based dense SLAM and feed-forward 3D reconstruction.</span></dd>
        </div>
        <div>
          <dt>May 2025 - Dec. 2025</dt>
          <dd><strong>Research Intern, <a class="about-inline-link" href="https://sites.google.com/view/vip-lab" target="_blank" rel="noopener noreferrer">VIP-LAB</a></strong><span>ROS-based AgileX LIMO autonomous driving and 3D LiDAR SLAM in MORAI and CARLA.</span></dd>
        </div>
      </dl>
    </section>
  </div>
</div>

<div class="about-copy" lang="en">
  <p class="about-lead">Hello, I am Wooseok Song, a <strong>B.S.</strong> candidate in Artificial Intelligence at <strong class="about-nowrap">Gachon University</strong> and an undergraduate research intern at <a class="about-inline-link" href="https://raise-gachon.github.io/" target="_blank" rel="noopener noreferrer">RAISE Lab</a>. My research interests include <strong>learning-based dense SLAM</strong> and <strong>dynamic SLAM</strong>.</p>

  <p>I am interested in reconstructing 3D environments from monocular camera data, particularly under motion, weak texture, and repetitive structures.</p>

  <section class="about-section" aria-labelledby="about-interests">
    <h2 id="about-interests">Research Interests</h2>
    <ul class="about-plain-list">
      <li><strong>Learning-based Dense SLAM</strong><span>Joint camera pose and dense geometry estimation from sequential monocular images.</span></li>
      <li><strong>Dynamic SLAM</strong><span>Localization and mapping in scenes containing independently moving objects.</span></li>
    </ul>
  </section>

  <section class="about-section" aria-labelledby="about-work">
    <h2 id="about-work">Selected Work</h2>
    <div class="about-work-list">
      <a href="{{ '/pages/projects/OpenHouse/' | relative_url }}">
        <span class="about-work-thumb"><img src="{{ '/assets/images/about/openhouse-selected-work.gif' | relative_url }}?v=20260803c" alt="OpenHouse indoor reconstruction demo" width="414" height="360" loading="lazy" decoding="async"></span>
        <span class="about-work-copy"><strong>OpenHouse</strong><span>Built an indoor 3D reconstruction pipeline from smartphone images, compared candidate models, and tuned mesh post-processing.</span></span>
      </a>
      <a href="{{ '/pages/study/SLAM-Former-Practice/' | relative_url }}">
        <span class="about-work-thumb"><img src="{{ '/assets/images/about/slam-former-selected-work.gif' | relative_url }}" alt="SLAM-Former office reconstruction demo" width="414" height="360" loading="lazy" decoding="async"></span>
        <span class="about-work-copy"><strong>SLAM-Former Practice</strong><span>Evaluated checkpoints on EuRoC, KITTI, and indoor sequences, including long-sequence and scene-specific failures.</span></span>
      </a>
      <a href="{{ '/pages/projects/LiMO/' | relative_url }}">
        <span class="about-work-thumb"><img src="{{ '/assets/images/about/limo-selected-work.gif' | relative_url }}" alt="AgileX LIMO autonomous driving demo" width="414" height="360" loading="lazy" decoding="async"></span>
        <span class="about-work-copy"><strong>LIMO Autonomous Driving</strong><span>Implemented lane following and obstacle avoidance with cameras and 2D LiDAR, then debugged issues observed during real-vehicle runs.</span></span>
      </a>
    </div>
  </section>

</div>
