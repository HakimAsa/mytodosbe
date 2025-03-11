- after cloning the project from GitHub by using <code>git clone https://github.com/HakimAsa/mytodosbe.git </code> command:

1.  <code>npm install</code> or <code>yarn install</code> (<strong> you may need to run this command <code>npm i -g yarn</code> to install yarn globally if you prefer to use yarn</strong>)

2.  SET UP DB URL

    ## 2.1. Local database

    if you have the mongo compass installed, then you set the following string in config/default.json file: <strong>"db":"mongodb://localhost:27017</strong>

    ## 2.2. Remote database

    If you have to head over https://cloud.mongodb.com/ to sign up or login. Please follow the instructions from mongodb site. create a db named tododb(or whatever you like) and copy the string url <code>"mongodb+srv://<db_username>:<db_password>@cluster0.lxd3q.mongodb.net/<db_name>?retryWrites=true&w=majority&appName=Cluster0"</code>.

    open your terminal (please if you're on window, download gitbash) and cd to project root; copy and paste this: <code>export TODOSDB="mongodb+srv://<db_username>:<db_password>@cluster0.lxd3q.mongodb.net/<db_name>?retryWrites=true&w=majority&appName=Cluster0"</code>, then hit enter. Please remember to replace your own database credentials.

3.  run <code>npm run dev</code> or <code>yarn dev</code> to start the project.
