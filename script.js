// document.addEventListener('DOMContentLoaded', () => {
    const apiKey = "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";

    function convertToDataURL() {
        var fileInput = document.getElementById('imageInput');
      
        // Check if a file is selected
        if (fileInput.files && fileInput.files[0]) {
          var reader = new FileReader();
      
          // Read the file as a data URL
          reader.readAsDataURL(fileInput.files[0]);
      
          // Set up the onload event to process the result
          reader.onload = function(e) {
            var imageDataUrl = e.target.result;
            // Use the imageDataUrl as needed (e.g., display the image or send it to the server)
            console.log(imageDataUrl);
            recognizeText(imageDataUrl)
          };
        }
    }

    function recognizeText(imageDataURL) {
        const recognizedText = document.getElementById('recognizedText');
        Tesseract.recognize(imageDataURL, 'hun', { logger: m => console.log(m) })
            .then(result => {
                const text = result.data.text;
                console.log('Recognized text:', text);


                // Display recognized text
                recognizedText.value = text;
            })
            .catch(error => {
                console.error('Error recognizing text:', error);
            });

        
    }

    function answerButton(){
        text = recognizedText.value
        console.log(text)
        callAPI(text, apiKey)
    }

    async function callAPI(text, apiKey) {
        const headers = new Headers({
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "Model": "gpt-3.5-turbo"
        });
      
        const response = await fetch("https://api.openai.com/v1/engines/text-davinci-003/completions", {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            prompt: text,
            max_tokens: 500,
            n: 1,
            stop: "",
            temperature: 0.5,
          })
        });
      
        const data = await response.json();
      
        if (!data || !data.choices || !data.choices[0] || !data.choices[0].text) {
          throw new Error("Invalid API response");
        }
      
        const generatedText = data.choices[0].text;
      
        console.log(i + "\n"+"Kérdés: " +text + "\n" + "\n" + "Válasz: " + generatedText + "\n" + "-----------------------------------------");
      }
// });