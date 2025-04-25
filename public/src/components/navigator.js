export const generateNavigator = (parentElement) => {
    const pages = Array.from(parentElement.querySelectorAll(".page"));

    const hide = (element) => {
        element.classList.add("is-hidden");
    }
    
    const show = (element) => {
        element.classList.remove("is-hidden");
    }

    const render = () => {
        const url = new URL(document.location.href);
        const pageName = url.hash.replace("#", "");
        const selectedPage = pages.filter((page) => page.id === pageName)[0] || pages[0];
        document.title = selectedPage.id.replaceAll("-", " ") + " | WikiStudenti";
        document.title = document.title[0].toUpperCase() + document.title.substring(1);

        pages.forEach(p => hide(p));
        show(selectedPage);
    }

    window.addEventListener("popstate", render); 
    render();   
}