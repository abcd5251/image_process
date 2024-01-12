import os
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from PIL import Image
from io import BytesIO


app = FastAPI()

app.mount("/images", StaticFiles(directory="images"), name="images")

# middleware
app.add_middleware(
    CORSMiddleware, 
    allow_credentials=True, 
    allow_origins=["*"], 
    allow_methods=["*"], 
    allow_headers=["*"]
)

def process_uploaded_image(file):
    # Open the uploaded image using Pillow
    image = Image.open(BytesIO(file.file.read()))
    
    # Save the processed image (replace this with your logic)
    output_path = f"images/processed_{file.filename}"
    image.save(output_path)


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    print("filename", file.filename)
    try:
        # Process the uploaded image
        processed_image_path = process_uploaded_image(file)

        print("filename", file.filename)
        return {"filename": file.filename, "processed_image_path": processed_image_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)