export function generateNavbar(parentElement, pubsub) {
  const elements = {
    creation: {
      logo: true,
      right: [
        '<a href="#personal"><img src="/assets/images/favicon.ico" id="logo"></a>',
        "<h3>Mind Sharing</h3>",
      ],
      left: ["<h3>Document Creation</h3>"],
    },
    personal: {
      logo: false,
      right: [
        `<button class='btn is-trasparent u-icon'>$thumbnail</button>`,
        "<h3>$username</h3>",
      ],
      left: [
        "<button class='button is-white' id='u-settings'><i class='fa fa-gear'></i></button>",
        "<a href='#feed'><button class='button is-white'><i class='fa-solid fa-house'></i></button></a>",
        `<button type='button' class='button is-rounded' id='doc-creation'>+</button>`,
      ],
    },
    "search-results": {
      logo: false,
      right: [
        "<button class='btn is-trasparent' id='acc-icon'>$thumbnail</button>",
        "<h3>$username</h3>",
      ],
      left: [
        "<a href='#personal'><button class='button is-white'><i class='fa-solid fa-house'></i></button></a>",
        "<button id='follow_user' class='button is-rounded'>Follow</button>",
      ],
    },
    feed: {
      logo: true,
      right: [
        '<a href="#personal"><img src="/assets/images/favicon.ico" id="logo"></a>',
        "<div><h3>Mind Sharing</h3></div>",
      ],
      left: [
        "<button id='goProfile' class='btn is-trasparent u-icon'>$thumbnail</button>",
      ],
    },
    entry: {
      logo: true,
      right: ['<img src="/assets/images/favicon.ico" id="logo">'],
      left: ["<button class='button is-white' id='register'>Sign Up</button>"],
    },
  };

  let index = new URL(location.href).hash.replace("#", "") || "entry";

  const templates = {
    start: `<div class="navbar-item"><%content%></div>`,
    end: `<div class="navbar-item"><div class="field is-grouped"><%content%></div></div>`,
  };

  function build(newIndex) {
    if (elements[newIndex]) index = newIndex;
  }

  function replaceUserData(arr, user) {
    return arr.map(e =>
      e.replace("$thumbnail", `<img class="user-icon" src="${user.path_thumbnail}">`)
       .replace("$username", user.username)
    );
  }

  function addClickIfExists(id, handler) {
    const el = document.getElementById(id);
    if (el) el.onclick = handler;
  }

  pubsub.subscribe("navbar-follows", ({ response }) => {
    elements["search-results"].left[1] = response
      ? `<button id='unFollow_user' class='button is-rounded'><i class='fa-solid fa-check' style='color: #ffffff;'></i></button>`
      : "<button id='follow_user' class='button is-rounded'>Follow</button>";
    pubsub.publish("render-nav");
  });

  pubsub.subscribe("render-nav", () => navbar.render());
  pubsub.subscribe("newHash", page => {
    build(page);
    navbar.render();
  });

  const navbar = {
    setUserData(user) {
      for (const key in elements) {
        if (key === "feed") {
          elements[key].left = replaceUserData(elements[key].left, user);
        } else {
          elements[key].right = replaceUserData(elements[key].right, user);
        }
      }
      this.render();
    },

    render() {
      const { left, right } = elements[index];
      const startItems = right.map(e => templates.start.replace("<%content%>", e)).join("");
      const endItems = left.map(e => templates.end.replace("<%content%>", e)).join("");

      parentElement.innerHTML = `
        <nav class="navbar is-transparent" role="navigation" aria-label="main navigation">
          <div class="navbar-brand">
            <a role="button" class="navbar-burger" data-target="navbarMenu" aria-label="menu" aria-expanded="false">
              <span></span><span></span><span></span><span></span>
            </a>
          </div>
          <div id="navbarMenu" class="navbar-menu">
            <div class="navbar-start">${startItems}</div>
            <div class="navbar-end">${endItems}</div>
          </div>
        </nav>
      `;

      addClickIfExists("register", () => pubsub.publish("sign-up"));
      addClickIfExists("goProfile", () => (location.href = "#personal"));
      addClickIfExists("doc-creation", () => {
        pubsub.publish("doc-creation");
        document.getElementById("md")?.classList.add("is-active");
      });
      addClickIfExists("follow_user", () => pubsub.publish("follow_user"));
      addClickIfExists("unFollow_user", () => pubsub.publish("unFollow_user"));
      addClickIfExists("u-settings", () => pubsub.publish("user-settings"));

      document.querySelectorAll(".navbar-burger").forEach(el => {
        el.addEventListener("click", () => {
          const target = document.getElementById(el.dataset.target);
          el.classList.toggle("is-active");
          target.classList.toggle("is-active");
        });
      });
    },
  };

  return navbar;
}