const currentYear = new Date().getFullYear();
document.querySelector('.cc-footer-year').textContent = currentYear;


// // Function to load content dynamically
// async function loadPage(url) {
//     const response = await fetch(url);
//     if (response.ok) {
//         const html = await response.text();
//         document.getElementById('content').innerHTML = html;
//         history.pushState({ url }, '', url); // Push new state to history
//     } else {
//         document.getElementById('content').innerHTML = '<h1>Page Not Found</h1>';
//     }
// }

// // Store the initial page state on page load
// window.addEventListener('DOMContentLoaded', () => {
//     const initialUrl = window.location.pathname;
//     history.replaceState({ url: initialUrl }, '', initialUrl);
// });

// // Handle link clicks
// document.addEventListener('click', (event) => {
//     const target = event.target.closest('a[data-target]');
//     if (target) {
//         event.preventDefault();
//         const url = target.getAttribute('data-target');
//         loadPage(url);
//     }
// });

// // Handle browser navigation (Back/Forward)
// window.addEventListener('popstate', (event) => {
//     if (event.state && event.state.url) {
//         loadPage(event.state.url);
//     } else {
//         // Handle cases where there's no state (e.g., initial page)
//         document.getElementById('content').innerHTML = '<h1>Welcome to the Home Page</h1><p>This is the initial content.</p>';
//     }
// });