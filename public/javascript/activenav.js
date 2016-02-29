// Apply Listener
Array.prototype.slice.call(document.getElementsByTagName('nav')[0].getElementsByTagName('a')).forEach(function(entry) {
  entry.addEventListener("click", toggleActive);
});

// Toggle Class
function toggleActive() {
  if(this.classList.contains('active') === false) {
    document.getElementsByClassName('active')[0].className = '';
    this.className = 'active';
  }
}