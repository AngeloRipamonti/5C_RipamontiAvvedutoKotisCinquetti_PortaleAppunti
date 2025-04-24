export function generateNavbar(parentElement, pubsub) {
  
 const elements = {
    "creation": ["Document Creation"],
    "personal": 
    [
        "<button class='button is-white'>User Icon</button>",
        "<h3>$Username</h3>",
        "<button class='button is-white'> <i class='fa fa-gear'></i> </button>",
        "<button class='button is-rounded'>+</button>"
    ],
    "accounts": 
    [
        "<button class='button is-white'>User Icon</button>",
        "<h3>$Username</h3>",
        "<button class='button is-rounded'>Follow</button>"
    ],
    "feed": 
    [
        `<p class="control has-icons-left has-icons-right">
            <input class="input" type="text" placeholder="Search for notes..." id="$searchBar">
            <span class="icon is-left clickableIcon" id="$search-icon">
                <i class="fas fa-search"></i>
            </span>
            <span class="icon is-right clickableIcon" id="search-cancel-icon">
                <i class="fa-solid fa-xmark"></i>
            </span>
        </p>`,
        "<button class='button is-white'>User Icon</button>"
    ],
    "entry": ["<button class='button is-white'>Sign Up</button>"]
 };   

 let index = "personal";
 
 const template = `
    <div class="navbar-item">
        <div class="field is-grouped">
            %content%
        </div>
    </div>
 `;

  return {
    build: (element) => {
        if(elements[element]) index = element;
    },
    render: () => {
        const data = elements[index];
        parentElement.innerHTML = `
            <nav class="navbar is-transparent">
                <div class="navbar-brand">
                    <a class="navbar-item" href="#">
                        <img src="/assets/images/favicon.ico" id="logo">
                    </a>
                    <div class="navbar-burger js-burger" data-target="navbarExampleTransparentExample">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <div id="navbarExampleTransparentExample" class="navbar-menu">
                    <div class="navbar-start">
                        <a class="navbar-item title is-3" href="">Mind Sharing</a>
                    </div>
                    
                    <div class="navbar-end">
                        ${
                            data.map(e => {
                                return template.replace("%content%", e);
                            }).join("")
                        }
                    </div>
                </div>
            </nav>
        `;
    }
  };
}
