import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nasa.conf.dev_settings')


try:
    import sphinx_rtd_theme
except ImportError:
    sphinx_rtd_theme = None


import django
django.setup()


extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.intersphinx',
]

templates_path = ['_templates']
source_suffix = '.rst'
master_doc = 'index'
project = 'nasa'
copyright = '2015, Carlo Smouter'
version = '0.1'
release = '0.1'
exclude_patterns = ['_build']
pygments_style = 'sphinx'
intersphinx_mapping = {'http://docs.python.org/': None}

if sphinx_rtd_theme:
    html_theme = "sphinx_rtd_theme"
    html_theme_path = [sphinx_rtd_theme.get_html_theme_path()]
else:
    html_theme = "default"

htmlhelp_basename = 'backbone-nasadoc'
