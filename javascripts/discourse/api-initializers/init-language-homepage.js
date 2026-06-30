import { apiInitializer } from 'discourse/lib/api';
import { setDefaultHomepage } from 'discourse/lib/utilities';
import PreloadStore from "discourse/lib/preload-store";

export default apiInitializer("1.8.0", (api) => {
  const currentUser = api.getCurrentUser();
  const lang = (I18n.locale || "en").substring(0, 2).toLowerCase();

  const entries = currentUser ? settings.logged_in_homepages : settings.anonymous_homepages;
  const match = entries.find((e) => (e.language_code || "").toLowerCase() === lang) || entries[0];
  var homepage = null;

  if (match && match.homepage) {
    homepage = match.homepage;

    if (homepage.startsWith("/")) {
      homepage = homepage.slice(1);
    }

    // https://meta.discourse.org/t/created-topic-sort/321521/14
    if (homepage.includes("?") && !homepage.endsWith("&")) {
      homepage = homepage + "&";
    }
    console.log("Setting default homepage to: " + homepage);
    setDefaultHomepage(homepage);

    // https://meta.discourse.org/t/created-topic-sort/321521/15
    PreloadStore.remove("topic_list");
  }

  api.onPageChange((url) => {
    // for anonymous users, we need to check if we are on a homepage
    // that is NOT the correct homepage for the current language,
    // and if so, redirect to the correct homepage
    if (!currentUser) {
      var router = api.container.lookup("service:router");
      const currentTag = router.currentRoute?.params?.tag_name;
      if (match && match.language_code && currentTag !== lang) {
        // check if we are on the old home page
        const oldEntry = entries.find((e) => (e.language_code || "").toLowerCase() === currentTag);
        const oldHome = oldEntry?.homepage.split("?")[0] || null;
        var urlWithoutQuery = url.split("?")[0];
        if (urlWithoutQuery.startsWith("/")) {
          urlWithoutQuery = urlWithoutQuery.slice(1);
        }
        if (oldHome == urlWithoutQuery) {
          console.log("Redirecting to correct homepage for language: " + lang);
          window.location.href = "/" + homepage;
        }
      }
    }
  });
});
