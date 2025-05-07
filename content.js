function removeShortsSections() {
  const sections = document.querySelectorAll("ytd-rich-section-renderer");

  sections.forEach((section) => {
    const shelf = section.querySelector("ytd-rich-shelf-renderer");
    const titleSpan = shelf?.querySelector("#title");

    if (titleSpan && titleSpan.textContent.trim().toLowerCase() === "shorts") {
      section.remove();
    }
  });
}

function removeShortsVideos() {
  const videoRenderers = document.querySelectorAll(
    "ytd-grid-video-renderer, ytd-video-renderer"
  );

  videoRenderers.forEach((video) => {
    const link = video.querySelector("a#thumbnail");
    if (link && link.href.includes("/shorts/")) {
      video.remove();
    }
  });

  const richItems = document.querySelectorAll("ytd-rich-item-renderer");

  richItems.forEach((item) => {
    const shortsLink = item.querySelector('a[href*="/shorts/"]');
    if (shortsLink) {
      item.remove();
    }
  });
}

function removeAllShorts() {
  removeShortsSections();
  removeShortsVideos();
}

removeAllShorts();

const observer = new MutationObserver(removeAllShorts);
observer.observe(document.body, { childList: true, subtree: true });
