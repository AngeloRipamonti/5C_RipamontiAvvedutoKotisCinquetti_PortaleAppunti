export const generateNavigator = (parentElement, pubsub) => {
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
        document.title = selectedPage.id.replaceAll("-", " ") + " | Mind Sharing";
        document.title = document.title[0].toUpperCase() + document.title.substring(1);

        pages.forEach(p => hide(p));
        show(selectedPage);
        pubsub.publish("newHash", pageName);
    }

    window.addEventListener("popstate", render); 
    render();   
}