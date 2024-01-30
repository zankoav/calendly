document.addEventListener("DOMContentLoaded", function (event) {
  const uri = new URL(location.href);

  function generateCalendlyLinkObject() {
    let baseLink = "https://calendly.com/eugene-vab/30min";

    let utm = {
      source: uri.searchParams.get("utm_source"),
      medium: uri.searchParams.get("utm_medium"),
      campaign: uri.searchParams.get("utm_campaign"),
      content: uri.searchParams.get("utm_content"),
    };

    if (!utm.source) {
      if (document.referrer) {
        const referrer = new URL(document.referrer);
        utm.source = referrer.hostname;
        if (utm.source) {
          utm.medium = "organic";
        }
      } else {
        utm.source = "enway.com";
        utm.medium = "direct";
      }
    }

    let data = [];

    for (const key in utm) {
      const value = utm[key];
      if (value) {
        data.push(`${key}=${value}`);
      }
    }
    
    let searchData = data.join('&');
    let result = `${baseLink}?${searchData}`;

    return result;
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

  deleteCookie("calendly_enway_link");

  let resultLink = getCookie("calendly_link_v2");

  if (!resultLink) {
    resultLink = generateCalendlyLinkObject();
    setCookie("calendly_link_v2", resultLink, {
      secure: true,
      "max-age": 60 * 60 * 24 * 30, // 1 month
    });
  }

  let utm_term = uri.pathname == '/' ? 'home-page' : uri.pathname.split('/').at(-1);
  resultLink = `${resultLink}&utm_term=${utm_term}`;

  document.querySelectorAll("a.calendly-js").forEach((el) => {
    el.setAttribute("href", resultLink);
  });
});
