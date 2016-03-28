import json
from urllib.parse import urlencode

import pytest
from django import forms
from django.core.urlresolvers import reverse
from nasapi import Nasapi, NasapiError

from nasa.core.views import ApiGetFormView


class TestForm(forms.Form):
    option = forms.CharField(max_length=10)
    filter1 = forms.IntegerField()
    filter2 = forms.FloatField()


@pytest.fixture
def test_view():
    class TestView(ApiGetFormView):
        form_class = TestForm

    return TestView


@pytest.fixture
def prefilled_view():
    class PrefilledTestView(ApiGetFormView):
        form_class = TestForm
        initial = {
            'option': 'foo',
            'filter1': 100,
            'filter2': 1.456,
        }

    return PrefilledTestView


class TestApiGetFormView(object):

    def test_get_empty_invalid(self, test_view, rf):
        request = rf.get('/')
        response = test_view.as_view()(request)
        assert response.status_code == 200

        json_response = json.loads(response.content.decode('utf-8'))
        errors = json_response['errors']
        assert len(errors) == 3
        assert 'option' in errors
        assert 'filter1' in errors
        assert 'filter2' in errors

    def test_get_invalid(self, test_view, rf):
        request = rf.get('/?option=foo&filter1=bar&filter2=1.1')
        response = test_view.as_view()(request)
        assert response.status_code == 200

        json_response = json.loads(response.content.decode('utf-8'))
        errors = json_response['errors']
        assert len(errors) == 1
        assert 'filter1' in errors

    def test_get_valid(self, test_view, rf):
        request = rf.get('/?option=foo&filter1=9&filter2=1.1')
        response = test_view.as_view()(request)
        assert response.status_code == 200

        json_response = json.loads(response.content.decode('utf-8'))
        assert 'errors' not in json_response

    def test_method_not_allowed(self, test_view, rf):
        request = rf.post('/')
        response = test_view.as_view()(request)
        assert response.status_code == 405

    def test_get_initial_empty_valid(self, prefilled_view, rf):
        request = rf.get('/?option=foo&filter1=9&filter2=1.1')
        response = prefilled_view.as_view()(request)
        assert response.status_code == 200

        json_response = json.loads(response.content.decode('utf-8'))
        assert 'errors' not in json_response


@pytest.fixture
def asset_mock(monkeypatch):

    def asset_data(*args, **kwargs):
        return {
            'count': 1,
            'results': [
                {
                    'date': '2013-06-26T10:35:24',
                    'id': 'LC8_L1T_TOA/LC81980232013177LGN01'
                }
            ]
        }

    monkeypatch.setattr(Nasapi, 'get_assets', asset_data)


class TestAssetsView(object):

    def setup(self):
        self.params = urlencode({'lat': 47.054964, 'lon': 21.932419})
        self.url = '{0}?{1}'.format(reverse('assets'), self.params)

    def test_success(self, asset_mock, client, rf):
        response = client.get(self.url)
        assert response.status_code == 200

        json_response = json.loads(response.content.decode('utf-8'))
        assert json_response == [
            {
                "date": "2013-06-26T00:00:00",
                "id": "LC8_L1T_TOA/LC81980232013177LGN01"
            }
        ]

    def test_exception(self, client, monkeypatch):
        def _raise(*args, **kwargs):
            raise NasapiError('test exception')

        monkeypatch.setattr(Nasapi, 'get_assets', _raise)

        response = client.get(self.url)
        assert response.status_code == 500

        json_response = json.loads(response.content.decode('utf-8'))
        assert json_response['message'] == 'test exception'


@pytest.fixture
def imagery_mock(monkeypatch):

    def imagery_data(*args, **kwargs):
        return {
            'date': '2013-06-26T10:35:24',
            'url': 'http://example.com/nasa.jpg',
            'id': 'LC8_L1T_TOA/LC81980232013177LGN01'
        }

    monkeypatch.setattr(Nasapi, 'get_imagery', imagery_data)


class TestImageryView(object):

    def setup(self):
        self.params = urlencode({
            'lat': 47.054964,
            'lon': 21.932419,
            'date': '2013-06-26'
        })
        self.url = '{0}?{1}'.format(reverse('imagery'), self.params)

    def test_success(self, imagery_mock, client, rf):
        response = client.get(self.url)
        assert response.status_code == 200

        json_response = json.loads(response.content.decode('utf-8'))
        assert json_response == {
            'date': '2013-06-26T10:35:24',
            'url': 'http://example.com/nasa.jpg',
            'id': 'LC8_L1T_TOA/LC81980232013177LGN01'
        }

    def test_exception(self, client, monkeypatch):
        def _raise(*args, **kwargs):
            raise NasapiError('test exception')

        monkeypatch.setattr(Nasapi, 'get_imagery', _raise)

        response = client.get(self.url)
        assert response.status_code == 500

        json_response = json.loads(response.content.decode('utf-8'))
        assert json_response['message'] == 'test exception'
