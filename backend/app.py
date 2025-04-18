# prompt: I want to deploy this model in flask to create an api from this. 

from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
from tensorflow.keras.models import load_model
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load your trained model
model = load_model('captcha_model.h5', compile=False)

def output_to_solution(prediction):
    prediction = np.round(prediction).astype(int)
    solution = ''.join(map(str, prediction[0])).lstrip('0')
    return solution

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    image_file = request.files['image']
    try:
        image = Image.open(io.BytesIO(image_file.read())).convert('RGB')
        img_array = np.array(image.resize((200,50))) # Resize the image to match model input
        img_array = np.expand_dims(img_array, axis=0)
        prediction = model.predict(img_array)
        captcha_solution = output_to_solution(prediction)
        print("Result : ",captcha_solution)
        return jsonify({'prediction': captcha_solution})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')