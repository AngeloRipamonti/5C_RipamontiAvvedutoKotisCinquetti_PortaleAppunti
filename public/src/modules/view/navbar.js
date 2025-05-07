export function generateNavbar(parentElement, pubsub) {
  const elements = {
    creation: {
      logo: true,
      right: [
        '<a href="#feed"><a href="#feed"><img src="/assets/images/favicon.ico" id="logo"></a></a>',
        "<h3>Mind Sharing</h3>",
      ],
      left: ["<h3>Document Creation</h3>"],
    },
    personal: {
      logo: false,
      right: [
        "<button class='button is-white u-icon'>User Icon</button>",
        "<h3>$Username</h3>",
      ],
      left: [
        "<button class='button is-white' id='u-settings'> <i class='fa fa-gear'></i> </button>",
        `<button type="button" class='button is-rounded' id='doc-creation'>+</button>`
      ],
    },
    accounts: {
      logo: false,
      right: [
        "<button class='button is-white' id='acc-icon'>User Icon</button>",
        "<h3>$Username</h3>",
      ],
      left: ["<button class='button is-rounded'>Follow</button>"],
    },
    feed: {
      logo: true,
      right: [
        '<a href="#feed"><img src="/assets/images/favicon.ico" id="logo"></a>',
        "<div><h3>Mind Sharing</h3></div>",
      ],
      left: [
        "<button id='goProfile' class='button is-white u-icon'>User Icon</button>",
      ],
    },
    entry: {
      logo: true,
      right: ['<a href="#feed"><img src="/assets/images/favicon.ico" id="logo"></a>'],
      left: ["<button class='button is-white' id='register'>Sign Up</button>"],
    },
  };

  let index = new URL(location.href).hash.replace("#", "") || "entry";

  const endTemplate = `
       <div class="navbar-item">
           <div class="field is-grouped">
               %content%
           </div>
       </div>
    `;

  const startTemplate = `
       <div class="navbar-item">
          %content%
       </div>
    `;

  function build(element) {
    if (elements[element]) index = element;
  }

  return {
    render: function () {
      const data = elements[index];
      parentElement.innerHTML = `
              <nav class="navbar is-transparent" role="navigation" aria-label="main navigation">
                <div class="navbar-brand">
                  <a role="button" class="navbar-burger" data-target="navbarExampleTransparentExample" aria-label="menu" aria-expanded="false">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                  </a>
                </div>
                <div id="navbarExampleTransparentExample" class="navbar-menu">
                    <div class="navbar-start">
                        ${data.right
          .map((e) => {
            return startTemplate.replace("%content%", e);
          })
          .join("")}
                    </div>
                    <div class="navbar-end">
                        ${data.left
          .map((e) => {
            return endTemplate.replace("%content%", e);
          })
          .join("")}
                    </div>
                </div>
              </nav>
          `;

      if (index === "entry") document.getElementById("register").onclick = () => pubsub.publish("sign-up");
      if (document.getElementById("goProfile")) document.getElementById("goProfile").onclick = () => location.href = "#personal";
      if(document.getElementById("doc-creation")) document.getElementById("doc-creation").onclick = () => {
        pubsub.publish("doc-creation");
        document.getElementById("md").classList.add("is-active");
      }

      pubsub.subscribe("newHash", (page) => {
        build(page);
        this.render();
      });

      const navbarBurgers = Array.prototype.slice.call(
        document.querySelectorAll(".navbar-burger"),
        0
      );
      navbarBurgers.forEach((el) => {
        el.addEventListener("click", () => {
          const target = document.getElementById(el.dataset.target);
          el.classList.toggle("is-active");
          target.classList.toggle("is-active");
        });
      });
    },
  };
}
