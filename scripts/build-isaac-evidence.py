#!/usr/bin/env python3

import argparse
import json
import shutil
import subprocess
import unicodedata
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.parse import unquote

from bs4 import BeautifulSoup


GROUPS = {
    "001": "official-001",
    "002": "official-002",
    "003": "official-003",
    "004": "official-004",
    "005": "official-005",
    "가이드 영상": "guide",
    "강화학습 돌려보기": "reinforcement",
    "환경 구축": "limo-environment",
    "LIMO 움직이기": "limo-drive",
}

IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}
VIDEO_EXTENSIONS = {".mp4", ".webm", ".mov", ".gif"}
MAX_VIDEO_BYTES = 18 * 1024 * 1024

CAPTION_OVERRIDES = {
    "reinforcement": {
        5: "제공된 pretrained checkpoint를 play.py로 재생한 Ant policy.",
    },
    "limo-environment": {
        0: "Mapping과 localization 실험에 사용한 Hospital environment.",
        1: "Hospital scene에 배치한 AgileX LIMO asset.",
        2: "첫 번째 wheel joint의 local position에서 확인한 wheel base 기준점.",
        3: "반대편 wheel joint의 local position에서 확인한 wheel base 기준점.",
        4: "Wheel collision mesh에서 확인한 wheel radius.",
        5: "Wheel base와 radius를 반영한 Differential Controller 설정.",
        6: "JetBot용 two-wheel 설정으로는 LIMO가 움직이지 않았던 초기 결과.",
        7: "LIMO 상단의 실제 camera 위치에 맞춘 virtual camera pose.",
        8: "Camera topic을 발행하기 위해 구성한 ROS 2 Action Graph.",
        9: "Frame ID와 topic을 맞춘 Camera Helper parameter.",
        10: "Isaac Sim 공식 camera publish 예제에서 참고한 ROS 2 bridge 구성.",
        11: "RViz2에서 정상적으로 수신한 LIMO camera stream.",
    },
    "limo-drive": {
        0: "Camera와 LiDAR를 장착한 LIMO의 주행 결과.",
        1: "Mapping과 localization 실험에 사용할 LIMO USD 저장.",
    },
}


def run(command):
    subprocess.run(command, check=True)


def clean_text(value):
    return " ".join(value.split())


def meaningful_text(value):
    return any(character.isalnum() for character in value)


def nearby_context(figure):
    for node in figure.find_all_previous(["h2", "h3", "h4", "summary", "strong", "p"], limit=20):
        if node.find_parent("figure"):
            continue
        context_node = node.parent if node.name == "strong" and node.parent.name in {"p", "summary"} else node
        text = clean_text(context_node.get_text(" ", strip=True))
        if (
            not text
            or not meaningful_text(text)
            or text.startswith("attachment:")
            or len(text) > 180
        ):
            continue
        return text
    return ""


def find_media(figure, html_path):
    image = figure.find("img")
    if image and image.get("src") and not image["src"].startswith(("http:", "https:", "data:")):
        source = unquote(image["src"])
    else:
        anchor = figure.find("a", href=True)
        source = unquote(anchor["href"]) if anchor else ""

    extension = Path(source).suffix.lower()
    if extension not in IMAGE_EXTENSIONS | VIDEO_EXTENSIONS:
        return None

    path = (html_path.parent / source).resolve()
    return path if path.exists() else None


def collect(source_root):
    groups = {key: [] for key in GROUPS.values()}

    for html_path in sorted(source_root.rglob("*.html")):
        soup = BeautifulSoup(html_path.read_text(errors="ignore"), "html.parser")
        title = unicodedata.normalize("NFC", soup.title.get_text(strip=True) if soup.title else "")
        group = GROUPS.get(title)
        if not group:
            continue

        for figure in soup.find_all("figure"):
            source = find_media(figure, html_path)
            if not source:
                continue
            caption_node = figure.find("figcaption")
            caption = clean_text(caption_node.get_text(" ", strip=True)) if caption_node else ""
            caption = caption or nearby_context(figure)
            groups[group].append({"source": source, "caption": caption})

    return {key: value for key, value in groups.items() if value}


def dimensions(path):
    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=width,height",
            "-of",
            "json",
            str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    stream = json.loads(result.stdout)["streams"][0]
    return stream["width"], stream["height"]


def convert(task):
    group, index, record, output_root = task
    source = record["source"]
    extension = source.suffix.lower()
    is_video = extension in VIDEO_EXTENSIONS
    stem = f"{group}-{index:02d}"

    if extension == ".gif":
        output = output_root / f"{stem}.gif"
        if not output.exists() or output.stat().st_mtime < source.stat().st_mtime:
            shutil.copy2(source, output)
        width, height = dimensions(output)
        return {
            "type": "image",
            "src": f"assets/evidence/{output.name}",
            "width": width,
            "height": height,
            "caption": record["caption"],
        }

    if is_video:
        output = output_root / f"{stem}.mp4"
        poster = output_root / f"{stem}-poster.webp"
        if not output.exists() or output.stat().st_mtime < source.stat().st_mtime:
            run(
                [
                    "ffmpeg",
                    "-y",
                    "-loglevel",
                    "error",
                    "-i",
                    str(source),
                    "-an",
                    "-vf",
                    "scale='min(1440,iw)':-2,fps=30",
                    "-c:v",
                    "libx264",
                    "-preset",
                    "medium",
                    "-crf",
                    "29",
                    "-pix_fmt",
                    "yuv420p",
                    "-movflags",
                    "+faststart",
                    str(output),
                ]
            )
        if output.stat().st_size > MAX_VIDEO_BYTES:
            compact_output = output.with_name(f"{output.stem}-compact.mp4")
            run(
                [
                    "ffmpeg",
                    "-y",
                    "-loglevel",
                    "error",
                    "-i",
                    str(source),
                    "-an",
                    "-vf",
                    "scale='min(1280,iw)':-2,fps=24",
                    "-c:v",
                    "libx264",
                    "-preset",
                    "medium",
                    "-crf",
                    "30",
                    "-maxrate",
                    "5M",
                    "-bufsize",
                    "10M",
                    "-pix_fmt",
                    "yuv420p",
                    "-movflags",
                    "+faststart",
                    str(compact_output),
                ]
            )
            compact_output.replace(output)
        if not poster.exists() or poster.stat().st_mtime < output.stat().st_mtime:
            run(
                [
                    "ffmpeg",
                    "-y",
                    "-loglevel",
                    "error",
                    "-ss",
                    "1",
                    "-i",
                    str(output),
                    "-frames:v",
                    "1",
                    "-vf",
                    "scale='min(960,iw)':-2",
                    "-c:v",
                    "libwebp",
                    "-quality",
                    "82",
                    str(poster),
                ]
            )
        width, height = dimensions(output)
        return {
            "type": "video",
            "src": f"assets/evidence/{output.name}",
            "poster": f"assets/evidence/{poster.name}",
            "width": width,
            "height": height,
            "caption": record["caption"],
        }

    output = output_root / f"{stem}.webp"
    if not output.exists() or output.stat().st_mtime < source.stat().st_mtime:
        run(
            [
                "ffmpeg",
                "-y",
                "-loglevel",
                "error",
                "-i",
                str(source),
                "-vf",
                "scale='min(1600,iw)':-2",
                "-c:v",
                "libwebp",
                "-quality",
                "82",
                str(output),
            ]
        )
    width, height = dimensions(output)
    return {
        "type": "image",
        "src": f"assets/evidence/{output.name}",
        "width": width,
        "height": height,
        "caption": record["caption"],
    }


def write_script(page_root, groups):
    payload = json.dumps(groups, ensure_ascii=False, separators=(",", ":"))
    script = f"""(() => {{
  const archives = {payload};

  const renderItems = (grid, items, label, startIndex = 0, recordIndices = null) => {{
    items.forEach((item, index) => {{
      const recordIndex = (recordIndices?.[index] ?? (startIndex + index)) + 1;
      const figure = document.createElement("figure");
      figure.className = "media-archive-item";

      const frame = document.createElement("div");
      frame.className = "media-archive-frame";

      if (item.type === "video") {{
        const video = document.createElement("video");
        video.controls = true;
        video.playsInline = true;
        video.preload = "none";
        video.poster = item.poster;
        video.width = item.width;
        video.height = item.height;
        const source = document.createElement("source");
        source.src = item.src;
        source.type = "video/mp4";
        video.appendChild(source);
        frame.appendChild(video);
      }} else {{
        const image = document.createElement("img");
        image.src = item.src;
        image.alt = item.caption || `${{label || "실행 기록"}} ${{recordIndex}}`;
        image.loading = "lazy";
        image.decoding = "async";
        image.width = item.width;
        image.height = item.height;
        frame.appendChild(image);
      }}

      const caption = document.createElement("figcaption");
      const labelNode = document.createElement("strong");
      labelNode.textContent = `${{label || "Record"}} · ${{String(recordIndex).padStart(2, "0")}}`;
      caption.appendChild(labelNode);
      caption.append(document.createTextNode(` ${{item.caption || "실행 과정에서 저장한 결과."}}`));

      figure.append(frame, caption);
      grid.appendChild(figure);
    }});
  }};

  document.querySelectorAll("[data-media-source]").forEach((grid) => {{
    const source = grid.dataset.mediaSource;
    const start = Number(grid.dataset.mediaStart || 0);
    const end = Number(grid.dataset.mediaEnd || archives[source]?.length || 0);
    const recordIndices = grid.dataset.mediaIndices
      ?.split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isInteger(value) && value >= 0 && value < (archives[source]?.length || 0));
    const items = recordIndices?.length
      ? recordIndices.map((index) => archives[source][index])
      : (archives[source] || []).slice(start, end);
    renderItems(grid, items, grid.dataset.archiveLabel, start, recordIndices);
  }});

  document.querySelectorAll("[data-media-archive]").forEach((archive) => {{
    const items = archives[archive.dataset.mediaArchive] || [];
    const grid = archive.querySelector(".media-archive-grid");
    if (!grid) return;
    renderItems(grid, items, archive.dataset.archiveLabel);
  }});
}})();
"""
    (page_root / "evidence.js").write_text(script)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("--workers", type=int, default=4)
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parents[1]
    page_root = repo_root / "pages" / "study" / "Isaac-sim-Tutorial"
    output_root = page_root / "assets" / "evidence"
    output_root.mkdir(parents=True, exist_ok=True)

    source_groups = collect(args.source)
    for group, overrides in CAPTION_OVERRIDES.items():
        for index, caption in overrides.items():
            if index < len(source_groups.get(group, [])):
                source_groups[group][index]["caption"] = caption

    tasks = []
    for group, records in source_groups.items():
        for index, record in enumerate(records, start=1):
            tasks.append((group, index, record, output_root))

    converted = {}
    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        results = list(executor.map(convert, tasks))

    cursor = 0
    for group, records in source_groups.items():
        converted[group] = results[cursor : cursor + len(records)]
        cursor += len(records)

    write_script(page_root, converted)
    print(json.dumps({key: len(value) for key, value in converted.items()}, ensure_ascii=False))


if __name__ == "__main__":
    main()
