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
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(blogs => {
        console.log(blogs); // Add this line

        var blogPosts = document.getElementById('blog-posts');
        blogPosts.innerHTML = ''; // Clear the blog posts

        if (blogs.length === 0) {
            // If there are no blogs, display a message
            blogPosts.innerHTML = "U haven't posted any blogs";
        } else {
            blogs.forEach(blog => {
                var blogPost = document.createElement('div');
                blogPost.className = 'blog-post';
            
                var title = document.createElement('h2');
                title.textContent = blog.title;
                blogPost.appendChild(title);
            
                var buttonContainer = document.createElement('div');
                buttonContainer.style.float = 'right';
            
                var editIcon = document.createElement('img');
                editIcon.src = 'edit'; // Replace with your edit icon file or URL
                editIcon.alt = 'Edit Icon';
                editIcon.className = 'icon';
                editIcon.onclick = function() {
                    editBlog(blog.id);
                };
                buttonContainer.appendChild(editIcon);
            
                var deleteIcon = document.createElement('img');
                deleteIcon.src = 'delete'; // Replace with your delete icon file or URL
                deleteIcon.alt = 'Delete Icon';
                deleteIcon.className = 'icon';
                deleteIcon.onclick = function() {
                    deleteBlog(blog.id);
                };
                buttonContainer.appendChild(deleteIcon);
            
                blogPost.appendChild(buttonContainer);
                blogPosts.appendChild(blogPost);
            });
            
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


function editBlog(id) {
    // Redirect to the edit page
    window.location.href = 'edit.html?id=' + id;
}

function deleteBlog(id) {
    fetch('/blogs/' + id, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.status === 200) {
            alert('Blog post deleted successfully');
            fetchBlogs(); // Refresh the blog posts
        } else {
            alert('Failed to delete blog post, please try again');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
