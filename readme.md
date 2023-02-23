-source env/bin/activate
-python3 manage.py migrate
-python3 manage.py createsuperuser
-visit localhost admin
manage.py migrate --run-syncdb


---
cd client
yarn install
