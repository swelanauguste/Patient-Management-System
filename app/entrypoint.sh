#!/bin/sh


python manage.py makemigrations --merge
python manage.py migrate
python manage.py createsuperuser --no-input || true
python manage.py seed_patient_records --count 20

exec "$@"