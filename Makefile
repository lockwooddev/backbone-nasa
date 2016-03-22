.PHONY: tests coverage devinstall docs sasswatch
APP=src/
COV=nasa
OPTS=

tests:
	py.test -s -v $(APP)

coverage:
	py.test ${OPTS} --cov=$(COV) --cov-report=term-missing --cov-report=html $(APP)

devinstall:
	npm install
	pip install -e .
	pip install -e .[tests]
	pip install -r resources/requirements-develop.txt

docs:
	sphinx-apidoc --force -o docs/source/modules/ src/nasa
	$(MAKE) -C docs clean
	$(MAKE) -C docs html

sasswatch:
	sass --watch static/scss/:static/css
