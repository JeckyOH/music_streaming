Instruction to run locally:

1. Install Node JS and PostgreSQL in your machine
2. In the root directory of this project, run '[sudo ]npm install' to install all dependencies. "sudo" is optional subject to your environment.
3. Deploy database, this step has 2 method:
    (1) Make sure the "NODE_ENV" attribute in ".env" file is "development", then run 'npm reset_db' in the root directory of this project.
        Note: Please do not run this project in development mode, because I set reCAPTCHA not work for development mode.
    (2) Manually execute "schema.sql" in "$PROJECT_ROOT/sql" directory to import schemas.
        Or you can Execute "seeds.sql" in "$PROJECT_ROOT/sql" directory to import schema and data.
4. run 'npm start' to start the server.
5. Browse "http://localhost:3000" in your browser.

Enjoy!