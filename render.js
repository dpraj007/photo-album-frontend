



document.getElementById('displaytext').style.display = 'none';
 
console.log("test comment !!!");

function searchPhoto() {
  console.log("Entering searchPhoto function");
  const userMessage = document.getElementById('note-textarea').value;
  console.log("User message input:", userMessage);
  const searchUrl = `https://1gd3eyc663.execute-api.us-east-1.amazonaws.com/test1/search?q=${encodeURIComponent(userMessage)}`;
  console.log("Search URL:", searchUrl);

  console.log("Fetching search results...");
  fetch(searchUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      console.log("Fetch response received:", response);
      return response.json();
    })
    .then(data => {
      console.log("Fetch response data:", data);
      const respData = data.body ? JSON.parse(data.body).results : data.results;
      console.log("Processed response data:", respData);

      if (!Array.isArray(respData) || respData.length === 0) {
        console.log("No images found, displaying message");
        const displayTextElement = document.getElementById('displaytext');
        if (displayTextElement) {
          displayTextElement.innerHTML = 'Sorry, could not find any images. Try again!';
          displayTextElement.style.display = 'block';
        }
        return;
      }

      console.log("Clearing existing images...");
      // Clear any existing images
      const imgContainer = document.getElementById('img-container');
      if (imgContainer) {
        imgContainer.innerHTML = '';
      }

      console.log("Displaying search results...");
      respData.forEach(item => {
        const img = new Image();
        const imageUrl = `https://ccphotoassignment.s3.amazonaws.com/${item.objectKey}`;
        console.log("Image URL:", imageUrl);

        img.src = imageUrl;
        img.setAttribute('class', 'banner-img');
        img.setAttribute('alt', 'Image');

        if (imgContainer) {
          imgContainer.appendChild(img);
        }
      });

      console.log("Displaying 'Images returned' message");
      const displayTextElement = document.getElementById('displaytext');
      if (displayTextElement) {
        displayTextElement.innerHTML = 'Images returned are:';
        displayTextElement.style.display = 'block';
      }
    })
    .catch(error => {
      console.error('An error occurred:', error);
      const displayTextElement = document.getElementById('displaytext');
      if (displayTextElement) {
        displayTextElement.innerHTML = 'An error occurred while searching for images. Please try again.';
        displayTextElement.style.display = 'block';
      }
    });
  console.log("Exiting searchPhoto function");
}





function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // reader.onload = () => resolve(reader.result)
    reader.onload = () => {
      let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
     //  let encoded = Buffer.from(req.body.imageBinary.replace(/^data:image\/\w+;base64,/, ""),'base64');
      if (encoded.length % 4 > 0) {
        encoded += '='.repeat(4 - (encoded.length % 4));
      }
      resolve(encoded);
    };
    reader.onerror = (error) => reject(error);
  });
 }



async function uploadPhoto() {
  console.log("Entering uploadPhoto function");

  // Get the selected file
  var tag_image = note_customtag.value.replace(/\s/g, '').split(',');
  console.log("Tag image:", tag_image);
  var file = document.getElementById('file_path').files[0];
  console.log("Selected file:", file);

  // Get file details
  var type_file_up = file.type;
  console.log("File type:", type_file_up);
  var name_f = file.name;
  console.log("File name:", name_f);

  console.log("Code Pipeline Check Here !!!!");

  // Convert file to ArrayBuffer
  var reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = function (event) {
    console.log("Reader Object:", event.target.result);
    console.log("Reader result:", reader.result);
    var file = new Uint8Array(reader.result);

    // Prepare request options
    var requestOptions = {
      method: 'PUT',
      headers: {
        "x-amz-meta-customLabels": tag_image,
        "Content-Type": type_file_up
      },
      body: file,
      redirect: 'follow'
    };

    console.log("Request options:", requestOptions);

    // Send the file to the server
    fetch(`https://1gd3eyc663.execute-api.us-east-1.amazonaws.com/test1/ccphotoassignment/${name_f}`, requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log("Server response:", result);
        alert("Photo uploaded successfully!");
      })
      .catch(error => {
        console.log('Error:', error);
      });
  };
}