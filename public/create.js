window.onload = function() {
    var createForm = document.getElementById('create-form');
    createForm.addEventListener('submit', createBlog);
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

function createBlog(event) {
    event.preventDefault();

    var title = document.getElementById('title').value;
    var content = document.getElementById('content').value;
    var attachments = document.getElementById('attachments').files;

    var formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    for (var i = 0; i < attachments.length; i++) {
        formData.append('attachments', attachments[i]);
    }

    fetch('/posts/create', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (response.status === 200) {
            alert('Blog post created successfully');
            window.location.href = 'Dashboard.html';
        } else {
            alert('Failed to create blog post, please try again');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}