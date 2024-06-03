window.onload = function() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id'); // Get the id from the query string

    // Fetch the current data of the blog post
    fetch('/blogs/' + id)
    .then(response => response.json())
    .then(blog => {
        // Fill the form with the current data of the blog post
        document.getElementById('title').value = blog.title;
        document.getElementById('content').value = blog.content;

        // Display existing attachments
        var attachmentsContainer = document.getElementById('attachments-container');
        var attachments = blog.attachments.split(',');
        attachments.forEach(attachment => {
            var attachmentElement = document.createElement('img');
            attachmentElement.src = attachment;
            attachmentElement.width = 100; // Adjust as needed
            attachmentElement.height = 100; // Adjust as needed
            attachmentsContainer.appendChild(attachmentElement);
        });
        
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    // Add your functions here
    document.getElementById('home-button').addEventListener('click', goToHome);
    document.getElementById('Dashboard-button').addEventListener('click', goToDashboard);
    setInterval(updateTime, 1000); // Update time every second
    document.getElementById('menu-button').addEventListener('click', toggleMenu);
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
