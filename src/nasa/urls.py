from django.conf import settings
from django.conf.urls import include, url
from django.contrib import admin

from nasa.core.views import IndexView, StaticTemplateView


urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', IndexView.as_view(), name='index'),
]

if settings.DEBUG:
    urlpatterns += [
        url(
            r'^%s(?P<path>.*)$' % settings.MEDIA_URL.strip('/'),
            'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}
        ),
        url(r'^test/((?P<template>[\w\-\/]+)/)?$', StaticTemplateView.as_view()),
    ]
