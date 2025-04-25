export function generateNavbar(parentElement, pubsub) {
  const elements = {
    "creation": {
      "logo": true,
      "right": [
          '<img src="/assets/images/favicon.ico" id="logo">',
          "<h3>Mind Sharing</h3>"
      ],
      "left": [
        "<h3>Document Creation</h3>"
      ]
    },
    "personal": {
      "logo": false,
      "right": [
        "<button class='button is-white'>User Icon</button>",
        "<h3>$Username</h3>",
      ],
      "left": [
         "<button class='button is-white'> <i class='fa fa-gear'></i> </button>",
         "<button class='button is-rounded'>+</button>"
      ]
    },
    "accounts": {
      "logo": false,
      "right": [
          "<button class='button is-white'>User Icon</button>",
          "<h3>$Username</h3>",
        ],
      "left": ["<button class='button is-rounded'>Follow</button>"]
    },
    "feed": {
      "logo": true,
      "right":  [
        '<img src="/assets/images/favicon.ico" id="logo">',
          "<h3>Mind Sharing</h3>"
        ],
        "left": [
          `<p class="control has-icons-left has-icons-right">
                <input class="input" type="text" placeholder="Search for notes..." id="$searchBar">
                <span class="icon is-left clickableIcon" id="$search-icon">
                    <i class="fas fa-search"></i>
                </span>
                <span class="icon is-right clickableIcon" id="search-cancel-icon">
                    <i class="fa-solid fa-xmark"></i>
                </span>
            </p>`,
        "<button class='button is-white'>User Icon</button>",
      ]
    },
    "entry": {
      "logo": true,
      "right": [],
      "left": ["<button class='button is-white'>Sign Up</button>"]
    },
  };

  let index = "entry";

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
    render: function() {
      console.log(index);
      const data = elements[index];
      parentElement.innerHTML = `
              <nav class="navbar is-transparent">
                  <div class="navbar-brand">
                      <div class="navbar-burger js-burger" data-target="navbarExampleTransparentExample">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                  </div>
                  <div id="navbarExampleTransparentExample" class="navbar-menu">
                      <div class="navbar-start">
                          ${data.right.map((e) => {
                              return startTemplate.replace("%content%", e);
                            })
                            .join("")}
                      </div>
                      
                      <div class="navbar-end">
                          ${data.left.map((e) => {
                              return endTemplate.replace("%content%", e);
                            })
                            .join("")}
                      </div>
                  </div>
              </nav>
          `;

          pubsub.subscribe("newHash", (page) => {
              build(page);
              this.render();
          });
    },
  };
}
