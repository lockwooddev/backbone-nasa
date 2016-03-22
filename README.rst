Backbone-Nasa
=============

Backbone Nasa is a showcase project for the API's provided by Nasa. The project is using Django in combination with BackboneJS.

Setup
-----

.. code-block:: bash

    $ Create a virtualenv
    $ mkvirtualenv backbone-nasa

    $ # Clone repository
    $ git clone git@https://github.com/lockwooddev/backbone-nasa.git

    $ # Activate Environment and install
    $ source env/bin/activate
    $ make devinstall

    $ # run tests
    $ make tests


Local Development settings
--------------------------

Create a new file named ``settings.py`` in the ``src/nasa`` folder with the
following content:

.. code-block:: python

    from nasa.conf.dev_settings import *

And adapt the settings to your environment.


Create database
---------------

.. code-block:: bash

    $ createdb database_name
    $ python src/manage.py migrate


Running
-------

.. code-block:: bash

   $ python src/manage.py runserver
