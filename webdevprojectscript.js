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

function mobile(){
    if(window.innerWidth <= 768){
        const first = document.getElementById('first');
        first.style.marginLeft='16.667dvh';
        const header = document.querySelector('.headerTitle');
        header.style.fontSize='10dvh';
        const footer = document.querySelector('.pageNumContainer');
        footer.style.fontSize='30cqh';
    }
}

mobile();
