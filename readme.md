- after cloning the project from GitHub by using <git clone https://github.com/HakimAsa/mytodosbe.git> command:

1.  npm install or yarn install
2.  SET UP DB URL

    1.1. Local database

    if you have the mongo compass installed, then you set the following string in config/default.json file: <strong>"db":"mongodb://localhost:27017</strong>

    1.2. Remote database

    If you have to head over https://cloud.mongodb.com/ to sign up or login. Please follow the instructions from mongodb site. create a db named tododb(or whatever you like) and copy the string url "mongodb+srv://<db_username>:<db_password>@cluster0.lxd3q.mongodb.net/<db_name>?retryWrites=true&w=majority&appName=Cluster0".

        open your terminal (please if you're on window, download gitbash) and cd to project root; copy and paste this: export TODOSDB="mongodb+srv://<db_username>:<db_password>@cluster0.lxd3q.mongodb.net/<db_name>?retryWrites=true&w=majority&appName=Cluster0", then hit enter. Please remember to replace your own database credentials.

3.  run npm run dev or yarn dev to start the project.
