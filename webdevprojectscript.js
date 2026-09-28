const toggleSidebar = document.querySelector('#toggleSidebar');
const sidebar = document.querySelector('#sidebar');

window.addEventListener('DOMContentLoaded', () => {
    if (toggleSidebar) {
        toggleSidebar.focus();
    }
});

toggleSidebar.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});