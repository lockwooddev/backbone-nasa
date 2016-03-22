from django.views.generic import TemplateView


class IndexView(TemplateView):

    template_name = 'base.html'


class StaticTemplateView(TemplateView):

    def get_template_names(self):
        target = self.kwargs['template'] or 'index'
        filename = '{0}.html'.format(target)
        return filename
