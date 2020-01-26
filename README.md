![Logo](/frontend/src/assets/Resources/login/loginpage.png)

HabitRabbit™ is a revolutionary online habit building tool, based on state-of-the-art gamification technologies, designed to help its users build new, positive habits easily and quickly. It is an Angular/Django project conducted by students of the UAS JOANNEUM as part of the Software-Engeneering Selectiv project of [Information Management](https://www.fh-joanneum.at/ima).

## Team Members
- Michael Derler
- Christian Lach
- Ardian Qerimi
- Sebastian Weiland

### FH-JOANNEUM lecturer
- DI Stefan Krausler-Baumann, BSc
- Mag. Karl Kreiner

# Requirements

* Python 3.8
* Django Server 3.0.2
* Angular CLI 8.3.23
* PyCharm 2019.3.2 as IDE recommended
* WebStorm 2019.3.2 as IDE recommended

### Django

1. Generate virtualenv

2. Activate venv

3. Install required Python packages using pip and requirements.txt  

    `pip3 install -r requirements.txt`

4. Create database

    `python3 manage.py makemigrations`
    `python3 manage.py migrate`

5. Load initial data to database using Django fixtures

    `python3 manage.py loaddata fixtures/initial_data.json`

6. Run App

      `python3 manage.py runserver`

### Angular

 1. Install all required packages using package.json

      `npm i`

 2. Run the development server

      `ng serve`

 3.  Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
