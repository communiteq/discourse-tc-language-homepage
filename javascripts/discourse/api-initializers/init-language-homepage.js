import { apiInitializer } from 'discourse/lib/api';
import { setDefaultHomepage } from 'discourse/lib/utilities';
import PreloadStore from "discourse/lib/preload-store";

export default apiInitializer("1.8.0", (api) => {
  const currentUser = api.getCurrentUser();
  const lang = (I18n.locale || "en").substring(0, 2).toLowerCase();

  const entries = currentUser ? settings.logged_in_homepages : settings.anonymous_homepages;
  const match = entries.find((e) => (e.language_code || "").toLowerCase() === lang) || entries[0];

  if (match && match.homepage) {
    let homepage = match.homepage;

    if (homepage.startsWith("/")) {
      homepage = homepage.slice(1);
    }

    // https://meta.discourse.org/t/created-topic-sort/321521/14
    if (homepage.includes("?") && !homepage.endsWith("&")) {
      homepage = homepage + "&";
    }
    setDefaultHomepage(homepage);
    // https://meta.discourse.org/t/created-topic-sort/321521/15
    PreloadStore.remove("topic_list");
  }
});

