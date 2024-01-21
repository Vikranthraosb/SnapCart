
const socket = io("http://localhost:2000");

socket.on('script', (data) => {
    // Create a new script element
    const script = document.createElement('script');
    // Set the script content to the received data
    script.text = data;
    // Append the script to the document body
    document.body.appendChild(script);
});