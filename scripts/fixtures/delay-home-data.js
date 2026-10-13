(() => {
  if (!location.href.startsWith("http://127.0.0.1")) return;

  const originalFetch = window.fetch.bind(window);
  window.fetch = (...args) => {
    const input = args[0];
    const url = typeof input === "string" ? input : input instanceof Request ? input.url : String(input);
    if (!url.includes("/data/home-")) return originalFetch(...args);
    return new Promise((resolve) => setTimeout(resolve, 4000)).then(() => originalFetch(...args));
  };

  try {
    localStorage.setItem("theme", "light");
  } catch {
    // about:blank does not expose localStorage; the script runs again on navigation.
  }
})();
