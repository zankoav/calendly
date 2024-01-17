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
      needToSaveCoockie: baseLink != calendlyLink,
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

  deleteCookie("calendly_link");

  let resultLink = getCookie("calendly_enway_link");

  if (!resultLink) {
    const linkObj = generateCalendlyLinkObject();
    if (linkObj.needToSaveCoockie) {
      setCookie("calendly_enway_link", linkObj.calendlyLink, {
        secure: true,
        "max-age": 60 * 60 * 24 * 30, // 1 month
      });
    }
    resultLink = linkObj.calendlyLink;
  }

  document.querySelectorAll("a.calendly-js").forEach((el) => {
    el.setAttribute("href", resultLink);
  });
});
