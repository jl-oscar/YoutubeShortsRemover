let extensionEnabled = true;
let observer = null;

function removeShortsSections() {
  if (!extensionEnabled) return;

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
  if (!extensionEnabled) return;

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

function removeReelShelves() {
  if (!extensionEnabled) return;

  const reelShelves = document.querySelectorAll("ytd-reel-shelf-renderer");
  reelShelves.forEach((reel) => reel.remove());
}

function removeAllShorts() {
  if (!extensionEnabled) return;

  removeShortsSections();
  removeShortsVideos();
  removeReelShelves();
}

function startObserver() {
  if (observer) return;

  observer = new MutationObserver(removeAllShorts);
  observer.observe(document.body, { childList: true, subtree: true });
}

function stopObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

// Load saved state and initialize
chrome.storage.local.get(['enabled'], function (result) {
  // Default to enabled if not set
  extensionEnabled = result.enabled !== false;

  if (extensionEnabled) {
    removeAllShorts();
    startObserver();
  } else {
    stopObserver();
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function (message) {
  if (message.action === 'enable') {
    extensionEnabled = true;
    removeAllShorts();
    startObserver();
  } else if (message.action === 'disable') {
    extensionEnabled = false;
    stopObserver();
  }
  return true;
});
