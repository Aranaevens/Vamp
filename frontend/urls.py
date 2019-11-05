from django.conf.urls import url
from django.urls import path
from . import views

base_view = views.index

urlpatterns = [
    url(r'^$', base_view),
    url(r'^(?:.*)/?$', base_view),
]
