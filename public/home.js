window.onload = function() {
    fetchBlogs();
    updateTime();
    setInterval(updateTime, 1000);
};

function goToHome() {
    window.location.href = 'home.html';
}

function goToDashboard() {
    window.location.href = 'Dashboard.html';
}

function updateTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1; // JavaScript months are 0-based.
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    var timeString = month + '/' + day + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds;
    document.getElementById('date-time').innerHTML = timeString;
}

function toggleMenu() {
    var sidebar = document.getElementById("sidebar");
    if (sidebar.style.width === "0px" || sidebar.style.width === "") {
        sidebar.style.width = "250px"; // Width of the sidebar when opened
    } else {
        sidebar.style.width = "0px";
    }
}

function fetchBlogs() {
    fetch('/blogs', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(blogs => {
        var blogPosts = document.getElementById('blog-posts');
        blogPosts.innerHTML = ''; // Clear the blog posts

        blogs.forEach(blog => {
            var blogPost = document.createElement('div');
            blogPost.className = 'blog-post';

            var title = document.createElement('h2');
            title.textContent = blog.title;
            blogPost.appendChild(title);

            blogPosts.appendChild(blogPost);
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
