document.addEventListener('DOMContentLoaded', () => {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.addEventListener('click', () => {
            const widget = tile.getAttribute('data-widget');
            window.location.href = `${widget}.html`;
        });
    });
});