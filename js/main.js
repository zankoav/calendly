document.addEventListener("DOMContentLoaded", function (event) {
  function generateCalendlyLinkObject() {
    let baseLink = "https://calendly.com/eugene-vab/30min";
    let calendlyLink;

    const uri = new URL(location.href);
    const searchPath = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ]
      .map((key) => {
        const value = uri.searchParams.get(key);
        return value ? `${key}=${value}` : null;
      })
      .filter(Boolean)
      .join("&");

    if (searchPath) {
      calendlyLink = `${baseLink}?${searchPath}`;
    } else {
      calendlyLink = baseLink;
    }

    return {
      base: baseLink,
      calendlyLink: calendlyLink,
      needToRefresh: baseLink != calendlyLink,
    };
  }

  function getCookie(name) {
    let matches = document.cookie.match(
      new RegExp(
        "(?:^|; )" +
          name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
          "=([^;]*)"
      )
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  function setCookie(name, value, options = {}) {
    options = {
      path: "/",
      ...options,
    };

    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }

    let updatedCookie =
      encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
      updatedCookie += "; " + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
      }
    }
    document.cookie = updatedCookie;
  }

  function deleteCookie(name) {
    setCookie(name, "", {
      "max-age": -1,
    });
  }

  const linkObj = generateCalendlyLinkObject();
  let resultLink = linkObj.base;

  if (linkObj.needToRefresh) {
    setCookie("calendly_link", linkObj.calendlyLink, {
      secure: true,
      "max-age": 60 * 60 * 24 * 14, // 2 weeks
    });
  }

  let calendlyLinkFromCookie = getCookie("calendly_link");

  if (calendlyLinkFromCookie) {
    resultLink = calendlyLinkFromCookie;
  }

  document.querySelectorAll("a.calendly-js").forEach((el) => {
    el.setAttribute("href", resultLink);
  });
});
