from locust import HttpUser, task, between
import time

class UploadUser(HttpUser):
    wait_time = between(2, 5)

    def on_start(self):
        self.login()

    def login(self):
        response = self.client.post("/signin", json={"email": "ryantzr@gmail.com", "password": "testing12345"})

    @task
    def upload_file(self):
        file_path = "./cypress/fixtures/5607.mp4"
        uploaded_file_name = "5607.mp4"

        self.client.get("/upload")  # Visit the upload page

        self.client.click_link("Upload")  # Click the upload button

        with open(file_path, "rb") as file:
            self.client.post("/upload", files={"file": file})

        self.client.post("/upload", json={"fileName": uploaded_file_name})  # Set the uploaded file name

        self.client.click_link("Process")  # Click the process button
        self.client.post("/process", json={"language": "English"})  # Select the language

        time.sleep(300)  # Add a time delay of 5 minutes for processing

        self.client.click_link("Select")  # Click the select button

        self.client.click_link("Close")  # Close the extraction popup

        self.client.click_link("Save")  # Click the save button
