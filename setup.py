from setuptools import find_packages, setup


setup(
    name='nasa',
    version='0.1',
    author='Carlo Smouter',
    url='https://github.com/lockwooddev/backbone-nasa.git',
    packages=find_packages('src', exclude=['tests']),
    package_dir={'': 'src'},
    include_package_data=True,
    tests_require=[],
    install_requires=[],
    dependency_links=[],
    classifiers=[
        'Framework :: Django',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.4',
    ],
)
