document.addEventListener('DOMContentLoaded', function () {
    const toggleSwitch = document.getElementById('toggleExtension');

    chrome.storage.local.get(['enabled'], function (result) {
        toggleSwitch.checked = result.enabled !== false;
    });

    toggleSwitch.addEventListener('change', function () {
        const isEnabled = toggleSwitch.checked;
        chrome.storage.local.set({ enabled: isEnabled });

        chrome.tabs.query({ url: "*://www.youtube.com/*" }, function (tabs) {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, { action: isEnabled ? 'enable' : 'disable' });
            });
        });
    });
});