# dashboards

## Requirements

* Python >= 3.7.x

## .env

Use the **/flexdash/_env** example to create a **.env** file with the correct settings.


## Databases

Create the database *flexdash* and set the username, password and port in the *.env* file.

You can also use the file [flexdash.sql](https://github.com/tiago1856/dashboards/blob/master/flexdash.sql) to create and populate the tables (no need to makemigrations and migrate) or just the tables you need.

The file [world.sql](https://github.com/tiago1856/dashboards/blob/master/world.sql) contains the world database required for some queries and components already present in *flexdash.sql*.

There are 2 databases connections set in *settings.py*:
* default|flexdash: for flexdash/django operations.
* ers|ia_ers: for the ERS database. Make sure to to set both the ERS_USER and the ERS_PASSWORD in the .env file.



## Installation

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install the necessary packages.

In the root directory:

```bash
virtualenv env
```

Followed by:

```bash
run.bat
```

Install all dependencies:

```bash
pip install -r requirements.txt
```

Create a superuser:
```bash
python manage.py createsuperuser
```

Make and apply migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

Since this is an incomplete Django project, i.e., no login page and such, if you need to authenticate,
do it as Admin. So login in [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/) before going to any place
that requires authentication.


## Execution

```bash
python manage.py runserver
```

There is only 1 application: *dashboards*.

Go to page [http://127.0.0.1:8000/dashboards/](http://127.0.0.1:8000/dashboards/)


## TODO

| Nº        | What        | Status        | 
| ------------- | -------------|:-------------:|
| 1 | components: n-graph, geos, templates, ... |  | 
| 2 | save component logic (tool btn) |  | 
| 3 | save component (edit modal) --- id vs name |  | 
| 4 | on remove comp => disable tool save btn |  | 
| 5 | component - clear signals before destruction | *DONE* | 
| 6 | multiple databases - selection | *DONE* | 
| 7 | query analysis - queries inside queries |  | 
| 8 | query analysis - multiple queries????? |  | 
| 9 | query anayslys - ast array sometimes ???? why???? --- affects comm pins???? |  | 
| 10 | copy/paste formatting options |  | 
| 11 | open dash => reload window + open dash |  | 
| 12 | options tables => whenc reating if options null => get default values from simple table | *DONE* | 
| 13 | export data / component: print / pdf / excel / csv / image |  | 
| 14 | save dash snapshoot (all current data) |  | 
| 15 | export dash: print / pdf / image |  | 
| 16 | component options: page orientation and size |  | 
| 17 |  |  | 
| 18 |  |  | 
| 19 |  |  |
| 20 |  |  |

## Bugs to solve

| Nº        | Bug        | Priority        | Solution | Status |
| ------------- | ------------- |:-------------:|:-------------:|:-------------:|
| 1 | loading component on an existing one => old component remains in comms | `HIGH` | delete old after the loading the new one | *SOLVED* |
| 2 | loading multiple identical components => appears as single comp in comms | `HIGH` | loading => new uuid | *SOLVED* |
| 3 | graph rec => editcomponentmodal::display properties => 2x same fields to select in list | `HIGH` | loading => new uuid | *SOLVED* |


