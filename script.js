const carousels = new Map();

function toggleText(button) {
    const content = button.previousElementSibling;
    const isHidden = content.style.display !== "block";
    content.style.display = isHidden ? "block" : "none";
    button.textContent = isHidden ? "Tutup" : "Read More";
}

function toggleMenu() {
    document.getElementById("mobileMenu").classList.toggle("show");
}

function initCarousel(id, dotsId) {
    const track = document.getElementById(id);
    const viewport = track.parentElement;
    const dots = [...document.querySelectorAll(`#${dotsId} .dot`)];

    carousels.set(id, {
        index: 0,
        total: track.children.length,
        dots,
        viewport,
        startX: 0,
        dragging: false
    });

    updateCarousel(id);
    setupSwipe(id);
}

function updateCarousel(id) {
    const data = carousels.get(id);
    const track = document.getElementById(id);
    track.style.transform = `translateX(-${data.index * 100}%)`;
    data.dots.forEach((dot, i) => dot.classList.toggle("active", i === data.index));
}

function nextSlide(id) {
    const data = carousels.get(id);
    data.index = (data.index + 1) % data.total;
    updateCarousel(id);
}

function prevSlide(id) {
    const data = carousels.get(id);
    data.index = (data.index - 1 + data.total) % data.total;
    updateCarousel(id);
}

function goToSlide(id, index) {
    const data = carousels.get(id);
    data.index = index;
    updateCarousel(id);
}

function setupSwipe(id) {
    const data = carousels.get(id);

    data.viewport.addEventListener("touchstart", (e) => {
        data.startX = e.touches[0].clientX;
        data.dragging = true;
    }, { passive: true });

    data.viewport.addEventListener("touchend", (e) => {
        if (!data.dragging) return;
        const diff = data.startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) diff > 0 ? nextSlide(id) : prevSlide(id);
        data.dragging = false;
    }, { passive: true });
}

document.addEventListener("DOMContentLoaded", () => {
    initCarousel("portfolioCarousel", "portfolioDots");
    initCarousel("testimonialCarousel", "testimonialDots");
});