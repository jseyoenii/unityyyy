const MODEL_URL = "https://teachablemachine.withgoogle.com/models/JQ4pY19qz/model.json"; 
let model, maxPredictions;

// 모델 로드
async function initModel() {
    model = await tmImage.load(MODEL_URL);
    maxPredictions = model.getTotalClasses();
    console.log("모델 로드 완료");
}

// 파일 업로드 이벤트
document.getElementById("imageInput").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
        const uploadedImage = document.getElementById("uploadedImage");
        uploadedImage.src = URL.createObjectURL(file);
        
        uploadedImage.onload = async () => {
            const predictions = await predictImage(uploadedImage);
            displayPredictions(predictions);
        };
    }
});

// 이미지 예측
async function predictImage(image) {
    const predictions = await model.predict(image, false);
    return predictions.sort((a, b) => b.probability - a.probability);
}

// 예측 결과 출력
function displayPredictions(predictions) {
    const labelContainer = document.getElementById("label-container");
    const resultContainer = document.getElementById("result-container");
    
    labelContainer.innerHTML = ""; // 초기화
    resultContainer.innerHTML = ""; // 초기화

    predictions.forEach(pred => {
        // 확률별로 텍스트 추가
        const labelDiv = document.createElement("div");
        labelDiv.textContent = `${pred.className}: ${(pred.probability * 100).toFixed(2)}%`;
        labelContainer.appendChild(labelDiv);
    });

    // 결과 표시
    resultContainer.textContent = `최종 결과: ${predictions[0].className}`;
}

// 초기화
initModel();

