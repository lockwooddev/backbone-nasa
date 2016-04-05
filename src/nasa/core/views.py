import logging
import os
from datetime import date, datetime

from django.conf import settings
from django.http.response import JsonResponse
from django.views.generic import TemplateView, View
from nasapi import Nasapi, NasapiError

from .exceptions import ApiError
from .forms import AssetsForm, ImageryForm


logger = logging.getLogger('nasa')


os.environ['NASA_API_KEY'] = getattr(settings, 'NASA_API_KEY')


class IndexView(TemplateView):

    template_name = 'base.html'


class StaticTemplateView(TemplateView):

    def get_template_names(self):
        target = self.kwargs['template'] or 'index'
        filename = '{0}.html'.format(target)
        return filename


class ApiGetFormView(View):

    initial = {}
    form_class = None
    http_method_names = ['get']

    def get_form(self):
        """
        Returns an instance of the form
        """
        kwargs = {
            'initial': self.initial.copy(),
            'data': self.request.GET,
        }
        form_class = self.form_class
        return form_class(**kwargs)

    def get_context(self, form):
        return {}

    def get(self, request, *args, **kwargs):
        form = self.get_form()
        if form.is_valid():
            context = self.get_context(form)
            return self.form_valid(context)
        else:
            return self.form_invalid(form)

    def form_valid(self, context):
        return JsonResponse(context, safe=False)

    def form_invalid(self, form):
        context = {
            'errors': form.errors
        }
        return JsonResponse(context)


class AssetsView(ApiGetFormView):

    form_class = AssetsForm

    def get_context(self, form):
        cleaned_data = form.cleaned_data
        lat = cleaned_data['lat']
        lon = cleaned_data['lon']
        begin = cleaned_data['begin']
        end = cleaned_data['end']

        # Landsat 8 launch date
        begin = date(2013, 2, 11)

        logger.debug('Fetch flyovers: {0} - {1} {2}'.format(lat, lon, begin))

        try:
            flyovers = Nasapi.get_assets(lat, lon, begin, end)
        except NasapiError as exc:
            raise ApiError(500, str(exc))

        formatted = []
        for flyover in flyovers['results']:
            dt = datetime.strptime(flyover['date'].split('T')[0], '%Y-%m-%d')
            _id = flyover['id']
            formatted.append({
                'date': dt,
                'id': _id,
            })

        formatted.sort(key=lambda k: k['date'])
        [x.__setitem__('date', x['date'].strftime('%Y-%m-%d')) for x in formatted]
        return formatted


class ImageryView(ApiGetFormView):

    form_class = ImageryForm

    def get_context(self, form):
        cleaned_data = form.cleaned_data
        lat = cleaned_data['lat']
        lon = cleaned_data['lon']
        date = cleaned_data['date']
        cloud_score = cleaned_data['cloud_score']

        try:
            return Nasapi.get_imagery(lat, lon, date, cloud_score=cloud_score)
        except NasapiError as exc:
            raise ApiError(500, str(exc))
