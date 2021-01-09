# imageUploader-api
This is the API for the image uploader app.
This is an image upload project that uses multer.diskStorage().
Another branch azure-blob will contain the code necessary to perform CRUD ops  on the images in the blob and upload images to the blob service.

Make sure a mongo connection is running in the background. Later versions of mongoDB will do this for you automatically when you start your node server. So you may not have to worry about starting the mongo connection.

The frontend is at https://github.com/Toxic254/imageUploader-Angular, after following the steps below, the code will be up and running.

Navigate to the express directory
	Run: npm install
	Run: nodemon

Navigate to the angular directory
	Run: npm install
	Run: ng serve



Make note of the index.js route, you need to make sure there is a route that will handle sending images.

