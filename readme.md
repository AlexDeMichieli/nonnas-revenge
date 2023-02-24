## Instructions

## Backend

Create a virtual environment, activate it and install dependencies:

```python
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
```

Navigate to the backend directory, create a superuser and run syncdb. This command removes possible errors caused by the database being out of sync with the models:

```python
python3 manage.py migrate
python3 manage.py createsuperuser
python3 manage.py migrate --run-syncdb
```
Start the server

```python
python3 manage.py runserver
```

# Client

Navigate to the client directory, install dependencies and start the project.

```python
cd client
yarn install
npm start
```